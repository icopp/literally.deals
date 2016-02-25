"""Deals that really exist."""

import json
import os
import logging
import random

import bottlenose
import xmltodict
from flask import Flask, render_template

logging.basicConfig(level=logging.INFO)

AWS_ACCESS_KEY_ID = os.environ.get('AWS_ACCESS_KEY_ID')
AWS_SECRET_ACCESS_KEY = os.environ.get('AWS_SECRET_ACCESS_KEY')
AWS_ASSOCIATE_TAG = os.environ.get('AWS_ASSOCIATE_TAG')
SECRET_KEY = os.environ.get('SECRET_KEY')
GOOGLE_ANALYTICS_ID = os.environ.get('GOOGLE_ANALYTICS_ID')

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

    random_word = random.choice(WORDS)
    random_search_index = random.choice(SEARCH_INDEXES)
    logging.info('Searching Amazon for "%s" in SearchIndex "%s".',
                 random_word, random_search_index['name'])

    try:
        result = amazon.ItemSearch(
            Keywords=random_word,
            MinPercentageOff=5,
            SearchIndex=random_search_index['name'],
            Sort=random_search_index['sort'],
            ResponseGroup='Images,ItemAttributes,EditorialReview,OfferSummary'
        )
    except Exception:
        logging.error('Attempting to search Amazon failed.')
        return get_random_amazon_result()

    result = xmltodict.parse(result)

    try:
        if result['ItemSearchResponse']['Items']['Request']['Errors']['Error']['Code'] == "AWS.ECommerceService.NoExactMatches":
            return get_random_amazon_result()
    except KeyError:
        # There's no error code, which is to say, it was successful.
        try:
            return random.choice(result['ItemSearchResponse']['Items']['Item'])
        except KeyError:
            return get_random_amazon_result()

@app.route('/deal.json')
def random_deal() -> str:
    """Return JSON for a random Amazon deal."""

    random_amazon_result = get_random_amazon_result()
    logging.info(random_amazon_result)

    return json.dumps(random_amazon_result)

@app.route('/')
def index() -> str:
    return render_template('index.html',
                           google_analytics_id=GOOGLE_ANALYTICS_ID)

@app.errorhandler(404)
def page_not_found(error) -> str:
    """Custom 404 page."""
    return render_template('404.html',
                           google_analytics_id=GOOGLE_ANALYTICS_ID)

if __name__ == '__main__':
    app.run()
