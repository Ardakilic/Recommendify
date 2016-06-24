$('#searchform').submit(function (e) {
    e.preventDefault()
    hide_containers()
    $.getJSON('https://crossorigin.me/http://www.last.fm/player/station/user/' + $('input[name="username"]').val() + '/recommended?ajax=1')
            .done(process)
            .fail(function () {
                $('#error-message').html('<p>Error fetching your data. This may be due wrong username or api connection error.</p><p>Please refresh the page and try again</p>').show()
                $('#message-container').fadeIn('fast')
            })
});

var process = function (data) {
    var links = []
    for (i = 0; i < data.playlist.length; i++) {
        var hasSpotify = false;
        for (j = 0; j < data.playlist[i].playlinks.length; j++) {
            if (data.playlist[i].playlinks[j].affiliate == 'spotify') {
                links.push(data.playlist[i].playlinks[j].id)
                hasSpotify = true;
                break;
            }
        }
        if (!hasSpotify) {
            continue
        }
    }

    $('#result-link').attr('href', 'spotify:trackset:Playlist:' + links.join(','))
    $('#result-textarea').val($.map(links, function (link, index) {
        return 'spotify:track:' + link
    }).join('\n'))
    $('#result-container').fadeIn('fast')
}

var hide_containers = function () {
    $('div[rel="alert"], div[rel="container"]').hide()
}
