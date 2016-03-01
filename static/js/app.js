
var vm = new Vue({
  el: 'body',
  data: {
    anotherReady: false,
    itemLoaded: false,
    currentItem: {}
  },
  ready: function () {
    this.getItem();
  },
  methods: {
    getItem: function (event) {
      this.anotherReady = false;
      this.itemLoaded = false;

      this.$http.get('/deal.json').then(function (response) {
        console.log('Deal request succeeded.');
        console.log(response);

        var currentItem = {};
        currentItem.title          = response.data.ItemAttributes.Title;
        currentItem.imageUrl       = (response.data.LargeImage.URL || false);
        currentItem.url            = response.data.DetailPageURL;
        currentItem.lowestPrice    = response.data.OfferSummary.LowestNewPrice.FormattedPrice;
        currentItem.lowestPriceRaw = response.data.OfferSummary.LowestNewPrice.Amount;
        currentItem.description    = (response.data.EditorialReviews.EditorialReview.Content || false);
        currentItem.discount       = ((response.data.ItemAttributes.ListPrice.Amount -
                                       response.data.OfferSummary.LowestNewPrice.Amount) / 100)
                                      .toFixed(2);
        this.currentItem = currentItem;
        this.itemLoaded = true;

        setTimeout(function () {
          console.log('Ready to get another.');
          vm.anotherReady = true;
        }, 3000);
      }, function (response) {
        console.log('Deal request failed. Try again!');
        this.getItem();
      });
    }
  }
});
