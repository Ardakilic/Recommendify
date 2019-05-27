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
const resultContainer = $('#result-textarea');

const handleSuccess = (data) => {
    const { songs } = data; // const songs = data.songs;

    $('#result-textarea').val($.map(songs, link => 'spotify:track:' + link).join('\n'));
    $('#result-container').fadeIn('fast', () => {
        $('#result-textarea').focus();
        $('#result-textarea').select();
    });
};

const handleError = () => {
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
