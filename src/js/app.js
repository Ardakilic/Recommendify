/**
 * Recommendify
 *
 * Created by Arda Kılıçdağı <https://arda.pw>
 * Cured by Samet Aydemir and Coşku Demirhan
 */

var searchForm = $('#searchform')
var input = $('input[name="username"]')
var result = $('.search-result')
var select = $('select[name="method"]')

const corsProxy = 'https://crossorigin.me/' //'http://cors.io/?u=' as alternative
const endpoints = {
    recommendation: 'http://www.last.fm/player/station/user/[INPUT]/recommended?ajax=1',
    mix: 'http://www.last.fm/player/station/user/[INPUT]/mix?ajax=1',
    library: 'http://www.last.fm/player/station/user/[INPUT]/library?ajax=1',
    artist: 'http://www.last.fm/player/station/music/[INPUT]?ajax=1',
    tag: 'http://www.last.fm/player/station/tag/[INPUT]?ajax=1'
}

searchForm.submit(function (e) {
    e.preventDefault()
    hideContainers()
    $.getJSON(corsProxy + endpoints[select.val()].replace('[INPUT]', encodeURIComponent(input.val())))
        .done(process)
        .fail(function () {
            $('#error-message').html('<p>Error fetching your data. This may be due wrong username or api connection error.</p><p>Please refresh the page and try again</p>').show()
            $('#message-container').fadeIn('fast')
        })
})

var timer
input.on('keyup', function () {
    clearTimeout(timer)
    timer = setTimeout(function () {
        if (input.val().length > 2)
            searchForm.submit()
    }, 500)
})


input.on('keydown', function () {
    clearTimeout(timer)
})

result.click(function () {
    result.select()
})

var process = function (data) {
    var links = []
    for (var i = 0; i < data.playlist.length; i++) {
        var hasSpotify = false
        for (var j = 0; j < data.playlist[i].playlinks.length; j++) {
            if (data.playlist[i].playlinks[j].affiliate == 'spotify') {
                links.push(data.playlist[i].playlinks[j].id)
                hasSpotify = true
                break
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

var hideContainers = function () {
    $('div[rel="alert"], div[rel="container"]').hide()
}