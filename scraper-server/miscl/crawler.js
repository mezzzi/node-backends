var Crawler = require('x-ray-crawler');
var cheerio = require('cheerio');
var superagent = require('superagent');
var phantom = require('x-ray-phantom');
var phantom_opts = {
    webSecurity: false,
    images: false,
    weak: false
};
var crawler = Crawler()
    .driver(phantom(phantom_opts, function (nightmare, done) {}));

// function http(ctx, fn) {
//     superagent.get(ctx.url, fn)
//   }
  
//   var crawl = Crawler(http)
//     .throttle(3, '1s')
//     .delay('1s', '10s')
//     .concurrency(2)
//     .limit(20)
  
//   crawl('https://storebot.me/top', function(err, ctx) {
//     if (err) throw err
//     console.log('status code: %s', ctx.status)
//     console.log('status body: %s', ctx.body)
//     var $ = cheerio.load(ctx.body);
//     console.log($('body').html());
//   })