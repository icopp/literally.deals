
function updateDeal() {
  $('.deal').hide();
  $('.spinner').show();
  $.getJSON('/deal.json', function(data) {
    $('.deal-name').text(data.ItemAttributes.Title);
    $('.deal-image').attr('src', decodeURIComponent(data.LargeImage.URL));
    $('.deal-link').attr('href', decodeURIComponent(data.DetailPageURL));

    try {
      $('.deal-price').text('Buy for ' + data.OfferSummary.LowestNewPrice.FormattedPrice);
    } catch (ex) {
      $('.deal-price').text('Buy Now');
    }

    try {
      $('.deal-description').html(data.EditorialReviews.EditorialReview.Content);
      $('.deal-description').show();
    } catch (ex) {
      $('.deal-description').hide();
    }

    try {
      var calculatedDiscount = ((data.ItemAttributes.ListPrice.Amount -
                                 data.OfferSummary.LowestNewPrice.Amount) / 100)
                                 .toFixed(2);
      $('.deal-discount').text('Save $' + calculatedDiscount + '!');
      $('.deal-discount').show();
    } catch (ex) {
      $('.deal-discount').hide();
    }

    $('.spinner').hide();
    $('.deal').show();
  });
}

$(function() {
  updateDeal();
});

$('.another-deal').on('click', function() {
  updateDeal();
});
