/**
 * Recommendify
 *
 * Created by Arda Kılıçdağı <https://arda.pw>
*/

const searchForm = $('#searchform');

const result = $('.search-result');

const resultContainer = $('#result-textarea');

// Initiate a modal function to toggle progressing info
const processingModal = (() => {
  const pleaseWaitDiv = $('<div class="modal fade" id="processingModal" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenterTitle" aria-hidden="true" data-backdrop="static" data-keyboard="false"><div class="modal-dialog modal-dialog-centered" role="document"><div class="modal-content"><div class="modal-header"><h5 class="modal-title" id="exampleModalCenterTitle">Processing Your Request, Please Wait...</h5></div><div class="modal-body"><div class="progress"><div class="progress-bar progress-bar-striped progress-bar-animated" role="progressbar" aria-valuenow="100" aria-valuemin="0" aria-valuemax="100" style="width:100%"></div></div></div></div></div></div>');

  return {
    show: () => pleaseWaitDiv.modal(),
    hide: () => pleaseWaitDiv.modal('hide'),
  };
})();

const handleSuccess = (data) => {
  processingModal.hide();
  const { songs } = data; // const songs = data.songs;

  $('#result-textarea').val($.map(songs, (link) => `spotify:track:${link}`).join('\n'));

  $('#result-container').fadeIn('fast', () => {
    $('#result-textarea').focus();

    $('#result-textarea').select();
  });
};

const handleError = () => {
  processingModal.hide();

  $('#error-message').html('<p>Error fetching your data. This may be due wrong username or api connection error.</p><p>Please refresh the page and try again</p>').show();

  $('#message-container').fadeIn('fast');
};

const hideContainers = () => {
  $('div[rel="alert"], div[rel="container"]').hide();
};

// Events
searchForm.submit((e) => {
  e.preventDefault();
  hideContainers();
  processingModal.show();

  $.ajax({
    type: 'POST',
    url: '/get-playlist',
    dataType: 'json',
    data: searchForm.serialize(),
    success: handleSuccess,
    error: handleError,
  });
});

result.on('click', () => {
  result.select();
});

resultContainer.on('select focus', () => document.execCommand('copy'));

// Enable the popover tooltips:

$('[data-toggle="popover"]').popover();
