"""Deals that really exist."""

import json
import os
import logging
import random

import bottlenose
import redis
import xmltodict
from flask import Flask, render_template

logging.basicConfig(level=logging.INFO)

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_ASSOCIATE_TAG = os.environ.get('AWS_ASSOCIATE_TAG')
SECRET_KEY = os.environ.get('SECRET_KEY')
GOOGLE_ANALYTICS_ID = os.environ.get('GOOGLE_ANALYTICS_ID')
REDIS = redis.from_url(os.environ.get('REDIS_URL'))

with open('vendor/words/Words/en.txt') as f:
    WORDS = f.read().splitlines()

# pylint: disable=C0326
SEARCH_INDEXES = [
    {'name': 'UnboxVideo',         'sort': 'salesrank'},
    {'name': 'Appliances',         'sort': 'reviewrank'},
    {'name': 'MobileApps',         'sort': 'reviewrank'},
    {'name': 'ArtsAndCrafts',      'sort': 'reviewrank'},
    {'name': 'Automotive',         'sort': 'salesrank'},
    {'name': 'Baby',               'sort': 'salesrank'},
    {'name': 'Beauty',             'sort': 'salesrank'},
    {'name': 'Books',              'sort': 'reviewrank'},
    {'name': 'Music',              'sort': 'salesrank'},
    {'name': 'Wireless',           'sort': 'reviewrank'},
    {'name': 'Fashion',            'sort': 'reviewrank'},
    {'name': 'FashionBaby',        'sort': 'reviewrank'},
    {'name': 'FashionBoys',        'sort': 'reviewrank'},
    {'name': 'FashionGirls',       'sort': 'reviewrank'},
    {'name': 'FashionMen',         'sort': 'reviewrank'},
    {'name': 'FashionWomen',       'sort': 'reviewrank'},
    {'name': 'Collectibles',       'sort': 'reviewrank'},
    {'name': 'PCHardware',         'sort': 'salesrank'},
    {'name': 'MP3Downloads',       'sort': 'salesrank'},
    {'name': 'Electronics',        'sort': 'reviewrank'},
    {'name': 'Grocery',            'sort': 'salesrank'},
    {'name': 'HealthPersonalCare', 'sort': 'salesrank'},
    {'name': 'HomeGarden',         'sort': 'salesrank'},
    {'name': 'Industrial',         'sort': 'salesrank'},
    {'name': 'KindleStore',        'sort': 'reviewrank'},
    {'name': 'Luggage',            'sort': 'reviewrank'},
    {'name': 'Magazines',          'sort': 'reviewrank'},
    {'name': 'Movies',             'sort': 'reviewrank'},
    {'name': 'MusicalInstruments', 'sort': 'salesrank'},
    {'name': 'OfficeProducts',     'sort': 'reviewrank'},
    {'name': 'LawnAndGarden',      'sort': 'reviewrank'},
    {'name': 'PetSupplies',        'sort': 'reviewrank'},
    {'name': 'Pantry',             'sort': 'reviewrank'},
    {'name': 'Software',           'sort': 'salesrank'},
    {'name': 'SportingGoods',      'sort': 'reviewrank_authority'},
    {'name': 'Tools',              'sort': 'salesrank'},
    {'name': 'Toys',               'sort': 'salesrank'},
    {'name': 'VideoGames',         'sort': 'salesrank'},
    {'name': 'Wine',               'sort': 'reviewrank'}
]
# pylint: enable=C0326

app = Flask(__name__, static_url_path='')
app.config['SECRET_KEY'] = SECRET_KEY

amazon = bottlenose.Amazon(AWS_ACCESS_KEY_ID,
                           AWS_SECRET_ACCESS_KEY,
                           AWS_ASSOCIATE_TAG)

def get_random_amazon_result() -> str:
    """Get a random product result from Amazon."""

    cached_result = REDIS.get('current_random_product')
    if cached_result != None:
        return cached_result

    while True:
        random_word = random.choice(WORDS)
        random_search_index = random.choice(SEARCH_INDEXES)
        logging.info('Searching Amazon for "%s" in SearchIndex "%s".',
                     random_word, random_search_index['name'])

        try:
            result = xmltodict.parse(amazon.ItemSearch(
                Keywords=random_word,
                MinPercentageOff=5,
                SearchIndex=random_search_index['name'],
                Sort=random_search_index['sort'],
                ResponseGroup='Images,ItemAttributes,EditorialReview,OfferSummary'
            ))
        except Exception:
            logging.error('Attempting to search Amazon failed.')
            continue

        try:
            result_error = result['ItemSearchResponse']['Items']['Request']['Errors']['Error']['Code']
            if result_error:
                logging.info('Search for "%s" in SearchIndex "%s" returned an error: %s',
                             random_word, random_search_index['name'], result_error)
                continue
        except KeyError:
            logging.info('Search for "%s" in SearchIndex "%s" was successful.',
                         random_word, random_search_index['name'])

        try:
            specific_result = random.choice(result['ItemSearchResponse']['Items']['Item'])
        except KeyError:
            logging.error('Search for "%s" in SearchIndex "%s" found no items.',
                          random_word, random_search_index['name'])
            continue

        # Make sure that we actually have a deal
        try:
            specific_result_discount = (int(specific_result['ItemAttributes']['ListPrice']['Amount']) -
                                        int(specific_result['OfferSummary']['LowestNewPrice']['Amount']))
            if specific_result_discount <= 0:
                logging.info('Item "%s" had a list price less than lowest.',
                             specific_result['ASIN'])
                continue
        except KeyError:
            logging.info('Item "%s" had no lowest or list price.',
                         specific_result['ASIN'])
            continue

        # Good result! Cache for 3 seconds and return it.
        logging.info('Returning valid item "%s" with discount of $%.2f.',
                     specific_result['ASIN'], specific_result_discount/100)

        specific_result_json = json.dumps(specific_result)
        REDIS.setex('current_random_product', specific_result_json, 3)
        return specific_result_json

@app.route('/deal.json')
def random_deal() -> str:
    """Return JSON for a random Amazon deal."""
    return get_random_amazon_result()

@app.route('/')
def index() -> str:
    """Render the homepage."""
    return render_template('index.html', google_analytics_id=GOOGLE_ANALYTICS_ID)

@app.errorhandler(404)
def page_not_found(error) -> str:
    """Custom 404 page."""
    return render_template('404.html', google_analytics_id=GOOGLE_ANALYTICS_ID)

if __name__ == '__main__':
    app.run()
