const Xray = require('../../../../AppData/Local/Microsoft/TypeScript/2.9/node_modules/@types/x-ray');
const xray = Xray({
  filters: {
    trim: function (value) {
      return typeof value === 'string' ? value.trim() : value
    },
    reverse: function (value) {
      return typeof value === 'string' ? value.split('').reverse().join('') : value
    },
    slice: function (value, start, end) {
      return typeof value === 'string' ? value.slice(start, end) : value
    },
    url: function (value) {
      // style="background-image: url(url_addr.jpg)"
      if (typeof value !== 'string') {
        return '';
      }
      if (value.indexOf('(') === -1) {
        return '';
      }
      const leftParenthesisIndex = value.indexOf('(');
      const rightParenthesisIndex = value.indexOf(')');
      return typeof value === 'string' ? value.substring(leftParenthesisIndex + 1, rightParenthesisIndex) : value
    }
  }
});
const fs = require('fs');

const jsonFolder = './json';
const htmlFolder = './html';

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
const groupHtml = fs.readFileSync(`${htmlFolder}/groups.html`);
const groupUrl = 'https://tgram.io/';
const groupJsonFileName = `${jsonFolder}/groups.json`;

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
const channelHtml = fs.readFileSync(`${htmlFolder}/channels.html`);
const channelUrl = 'https://tchannels.me/';
const channelJsonFileName = `${jsonFolder}/channels.json`;

// bot scraping specs
const botScope = '.botitem';
const botSchema = [{
  name: '.info h3 a | trim',
  avatar: '.ava@style | url',
  subscriberCount: '.rate | url',
  category: '.cat',
  description: '.description | trim',
  join: '.bot-footer a@href'
}];
const botHtml = fs.readFileSync(`${htmlFolder}/bots.html`);
const botUrl = 'https://storebot.me/';
const botJsonFileName = `${jsonFolder}/bots.json`;
const botCategories = [
  'all',
  'games',
  'news',
  'entertainment',
  'adult',
  'social',
  'education',
  'broadcast',
  'utilities',
  'photo_and_video'
];

// run scrapers
// xray(groupHtml, groupScope, groupSchema)
//   .write(groupJsonFileName);
// xray(channelHtml, channelScope, channelSchema)
//   .write(channelJsonFileName);
// xray(botHtml, botScope, botSchema)
//   .write(botJsonFileName);

const types = ['top', 'recent'];
botCategories.forEach(category => {
  types.forEach(type => {
    const categoryUrl = `${botUrl}${type}/${category === 'all' ? '' : category}`;
    const categoryJsonFileName = `./json/bots/bot_${type}_${category}`;
    xray(categoryUrl, botScope, botSchema)
      .write(categoryJsonFileName);
  });

});