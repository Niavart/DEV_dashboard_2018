let Parser = require('rss-parser');
let parser = new Parser();



const rss_feed = function (link, limit) {
    return new Promise(function (resolve, reject) {
        parser.parseURL(link, function (err, feed) {
            if (err)
                reject(err)
            else {
                var toSend = []
                feed.items.slice(0, limit).forEach(element => {
                    toSend.push({
                        content: element.content,
                        link: element.link
                    })
                });
                resolve(toSend)
            }
        })
    })
}

module.exports = {
    rss_feed
}