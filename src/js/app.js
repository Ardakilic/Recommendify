/* eslint-disable no-undef */

/**
 * Recommendify
 *
 * Created by Arda Kılıçdağı <https://arda.pw>
 * Cured by Samet Aydemir and Coşku Demirhan
 */

const searchForm = $('#searchform');
const input = $('input[name="username"]');
const result = $('.search-result');
const select = $('select[name="method"]');

const endpoints = {
  recommendation: 'http://www.last.fm/player/station/user/[INPUT]/recommended?ajax=1',
  mix: 'http://www.last.fm/player/station/user/[INPUT]/mix?ajax=1',
  library: 'http://www.last.fm/player/station/user/[INPUT]/library?ajax=1',
  artist: 'http://www.last.fm/player/station/music/[INPUT]?ajax=1',
  tag: 'http://www.last.fm/player/station/tag/[INPUT]?ajax=1',
};

const process = (data) => {
  // TODO this data will be fetched from backend
  const links = data.playlist.map(pl => pl.playlinks.filter(sng => sng.affiliate === 'spotify').map(sng => sng.id));

  $('#result-iframe').attr('src', `https://embed.spotify.com/?uri=spotify:trackset:Recommendify:${links.join(',')}`).load();
  $('#result-link-trackset').attr('href', `spotify:trackset:Recommendify:${links.join(',')}`);
  $('#result-link-openplayer').attr('href', `https://open.spotify.com/trackset/Recommendify/${links.join(',')}`);
  $('#result-textarea').val($.map(links, link => `spotify:track:${link}`).join('\n'));
  $('#result-container').fadeIn('fast');
};

const hideContainers = () => {
  $('div[rel="alert"], div[rel="container"]').hide();
};

searchForm.submit((e) => {
  e.preventDefault();
  hideContainers();
  $.getJSON(endpoints[select.val()].replace('[INPUT]', encodeURIComponent(input.val())))
    .done(process)
    .fail(() => {
      $('#error-message').html('<p>Error fetching your data. This may be due wrong username or api connection error.</p><p>Please refresh the page and try again</p>').show();
      $('#message-container').fadeIn('fast');
    });
});

let timer;
input.on('keyup', () => {
  clearTimeout(timer);
  timer = setTimeout(() => {
    if (input.val().length > 2) {
      searchForm.submit();
    }
  }, 500);
});


input.on('keydown', () => {
  clearTimeout(timer);
});

result.click(() => {
  result.select();
});
