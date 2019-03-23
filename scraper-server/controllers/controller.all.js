const common = require('./controller.shared');
const fs = require('fs');
const request = require('request');

// bot scraping specs
const botScope = '.botitem';
const botSchema = [{
    name: '.info h3 a | trim',
    avatar: '.ava@style | url',
    subscriberCount: '.rate | url',
    category: '.cat',
    description: '.description | trim',
    joinLink: '.bot-footer a@href'
}];
const botHtml = fs.readFileSync(`${common.htmlFolder}/bots.html`);
const botUrl = 'http://storebot.me/';
const botJsonFileName = `${common.jsonFolder}/bots.json`;

// group scraping specs
const groupScope = 'div[id^="group-card"]';
const groupSchema = [{
    name: 'h3.h6 a[href*="group"] | trim',
    avatar: '.media a img@src',
    shortName: '.media-body > :first-child span ',
    language: '.media-body > :nth-child(2) span > :first-child | trim',
    memberCount: '.media-body > :nth-child(2) span > :nth-child(2) | trim',
    category: '.media-body > :nth-child(3) span a',
    description: '.card-block > :nth-child(3) span',
    join: '.card-block > :last-child a@href'
}];
const groupHtml = fs.readFileSync(`${common.htmlFolder}/groups.html`);
const groupUrl = 'https://tgram.io/';
const groupJsonFileName = `${common.jsonFolder}/groups.json`;

// channel scraping specs
const channelScope = '.botitem';
const channelSchema = [{
    name: '.info h3 a | trim',
    avatar: '.ava@style | url',
    memberCount: '.rate | url',
    category: '.cat',
    description: '.description | trim',
    join: '.bot-footer a@href'
}];
const channelHtml = fs.readFileSync(`${common.htmlFolder}/channels.html`);
const channelUrl = 'https://tchannels.me/';
const channelJsonFileName = `${common.jsonFolder}/channels.json`;

// random scraping specs
const randomScope = 'li.product';
const randomSchema = [{
    name: 'a a | inner_trim',
    short_name: 'a.woocommerce-loop-product__link@html | nick_channel',
    // description: 'a.woocommerce-loop-product__link@html | desc', // applies for bots
    description: common.xray('a.ajax_add_to_cart@href', 'p#productDescription | trim'), // applies for channels
    // joinLink: common.xray('a.ajax_add_to_cart@href', 'a.stickerpack-address__link'), // applies for stickers
    avatar: 'a img@src | trim',
    subscribers: 'span.productTransitions', // for stickers
    // subscribers: 'span.numberOfSubscribers', // for channels

}];
const randomHtml = fs.readFileSync(`${common.htmlFolder}/new_channels.html`);

// page scraping specs
const pageScope = 'body';
const pageSchema = [{
    text: '.text | page_inner_trim',
}];

// audio scraping specs
const audioScope = 'li';
const audioSchema = [{
    mp3Link: 'a[href$=".mp3"]@href | trim',
    fileName: 'strong | trim',
}];

const AllController = {
    getAll: function (sucessCB, failureCB) {

        const result = [];
        new Promise((success, failure) => {
            common.xray(botHtml, botScope, botSchema)
                .then(function (bots) {
                    if (bots) {
                        result.push(bots);
                        success();
                    } else {
                        failure({
                            success: false,
                            message: 'Could not find bots'
                        })
                    }
                })
        }).then(() => {
            return new Promise((success, failure) => {
                common.xray(groupHtml, groupScope, groupSchema)
                    .then(function (groups) {
                        if (groups) {
                            result.push(groups);
                            success();
                        } else {
                            failure({
                                success: false,
                                message: 'Could not find groups'
                            })
                        }
                    })
            });
        }).then(() => {
            return new Promise((success, failure) => {
                common.xray(channelHtml, channelScope, channelSchema)
                    .then(function (channels) {
                        if (channels) {
                            result.push(channels);
                            sucessCB({
                                success: true,
                                message: 'Successfully fetched',
                                data: result
                            });
                        } else {
                            failure({
                                success: false,
                                message: 'Could not find channels',
                                data: null
                            })
                        }
                    })
            });
        }).catch((error) => {
            failureCB(error);
        })


            .catch(function (err) {
                failureCB(JSON.stringify(err));
            });
    },
    getRandoms: function (sucessCB, failureCB) {

        const result = [];
        let baseUrl = "https://telegram-store.com/catalog/product-category/channels-en/ch-self-development-en/";
        // let baseUrl = "https://telegram-store.com/catalog/product-category/stickers-en/st-uncategorized-en/";
        let randomUrl = '';
        let i = 1;
        let run = () => {
            randomUrl = `${baseUrl}${
                i === 1 ? '' : 'page/' + i + '/'}`;
            common.xray(randomUrl, randomScope, randomSchema)
                .then(randoms => {
                    if (randoms) {
                        console.log(randomUrl);
                        randoms.forEach(random => {
                            result.push(random);
                        });
                        fs.writeFile('channel_self_development.json', JSON.stringify(result), () => {
                            console.log('written to file');
                        });

                        if (i >= 10) {
                            console.log('DONE');
                            sucessCB({
                                data: result,
                                success: true
                            })
                        } else {
                            i++;
                            run();
                        }
                    } else {
                        console.log('could not find randoms');
                        failureCB({
                            success: false,
                            message: 'Could not find randoms'
                        })
                    }
                })
                .catch(error => {
                    console.log("ERROR ENCOUNTERED RERUNNING");
                    run();
                });

        };

        run();
    },
    getOne: function (sucessCB, failureCB) {

        const result = [];
        let baseUrl = "telegram-store.com/catalog/product-category/stickers-en/st-animals-en/page/2/";
        common.xray(baseUrl, randomScope, randomSchema)
            .then(randoms => {
                if (randoms) {
                    result.push(randoms);
                    sucessCB({
                        data: result,
                        success: true
                    })
                } else {
                    failureCB({
                        success: false,
                        message: 'Could not find randoms'
                    })
                }
            })
            .catch(error => {
                console.log(error);
            });
    },
    getPages: function (sucessCB, failureCB) {

        let result = '';
        let baseUrl = "";
        let pageUrl = '';
        let i = 1;
        let run = () => {
            pageUrl = `https://bookfrom.net/dean-koontz/page,${i},862-velocity.html`;
            console.log(pageUrl);
            common.xray(pageUrl, pageScope, pageSchema)
                .then(pages => {
                    if (pages) {
                        result += pages[0].text;
                        fs.appendFileSync('pages.txt', '\n----------------------------------------\n');
                        fs.appendFileSync('pages.txt', pages[0].text);
                        if (i >= 50) {
                            sucessCB(result)
                        } else {
                            i++;
                            run();
                        }
                    } else {
                        failureCB({
                            success: false,
                            message: 'Could not find PAGES'
                        })
                    }
                })
                .catch(error => {
                    console.log('ERROR ENCOUNTERED, RERUNNING');
                    run();
                });

        };

        run();
    },
    getAudios: function (sucessCB, failureCB) {

        let audioUrl = '';
        const links = [];
        let run = () => {
            audioUrl = `http://www.openculture.com/freeaudiobooks`;
            console.log(audioUrl);
            common.xray(audioUrl, audioScope, audioSchema)
                .then(matches => {
                    if (matches) {
                        matches.forEach(match => {
                            if (!!match.mp3Link) {
                                console.log(JSON.stringify(match));
                                links.push(match.mp3Link);
                                request
                                    .get(match.mp3Link)
                                    .on('error', function (err) {
                                        console.log('error downloading mp3');
                                        // console.log(err);
                                    })
                                    .pipe(fs.createWriteStream(match.fileName));
                            }
                        })
                    } else {
                        failureCB({
                            success: false,
                            message: 'Could not find AUDIOS'
                        })
                    }
                })
                .catch(error => {
                    console.log('ERROR ENCOUNTERED, RERUNNING');
                    // console.log(error);
                    run();
                });

        };

        run();
    }

};

module.exports = {
    AllController: AllController
};

