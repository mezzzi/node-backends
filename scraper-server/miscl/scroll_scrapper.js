var Xray = require('x-ray');
var phantom = require('x-ray-phantom');
var fs = require('fs');
var phantom_opts = {
    webSecurity: false,
    images: false,
    weak: false
};

var x = Xray().driver(phantom(phantom_opts, function (nightmare, done) {
    // let result = done
    //     .useragent("Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36")
    //     .goto(nightmare.request.req.url)
    //     .scrollTo(4000, 0)
    //     .wait()
    //     .evaluate(function () {
    //         return window.document.body.scrollHeight;
    //     })
    // console.log('result is: ' + result);
    
}));



x('https://tgram.io/', '.card-block', [{
    name: 'h3.h6 a[href*="group"]',
    img_url: '.media a img@src',
    short_name: '.media-body > :first-child span ',
    language: '.media-body > :nth-child(2) span > :first-child',
    member_count: '.media-body > :nth-child(2) span > :nth-child(2)',
    category: '.media-body > :nth-child(3) span a',
    description: '.card-block > :nth-child(3) span',
    join: '.card-block > :last-child a@href'
}]).write('result.json');