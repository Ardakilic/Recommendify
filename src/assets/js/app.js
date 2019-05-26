/* eslint-disable prefer-template */
/* eslint-disable no-undef */

/**
 * Recommendify
 *
 * Created by Arda Kılıçdağı <https://arda.pw>
 * Cured by Samet Aydemir and Coşku Demirhan
 */

const searchForm = $('#searchform');
const result = $('.search-result');

const handleSuccess = (data) => {
  const { songs } = data; // const songs = data.songs;
  $('#result-textarea').val($.map(songs, link => 'spotify:track:' + link).join('\n'));
  $('#result-container').fadeIn('fast');
};

const hideContainers = () => {
  $('div[rel="alert"], div[rel="container"]').hide();
};

searchForm.submit((e) => {
  e.preventDefault();
  hideContainers();
  $.ajax({
    type: 'POST',
    url: '/get-playlist',
    dataType: 'json',
    data: searchForm.serialize(),
    success: handleSuccess,
    error: () => {
      $('#error-message').html('<p>Error fetching your data. This may be due wrong username or api connection error.</p><p>Please refresh the page and try again</p>').show();
      $('#message-container').fadeIn('fast');
    },
  });
});

result.click(() => {
  result.select();
});

// Enable the popover tooltips:
$('[data-toggle="popover"]').popover();
