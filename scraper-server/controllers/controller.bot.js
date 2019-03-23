const common = require('./controller.shared');
const fs = require('fs');

// bot scraping specs
const botScope = '.botitem';
const botSchema = [{
  name: '.info h3 a | trim',
  avatar: '.ava@style | url',
  subscriberCount: '.rate | url | strip_comma',
  category: '.cat',
  description: '.description | trim',
  joinLink: '.bot-footer a@href'
}];
const botHtml = fs.readFileSync(`${common.htmlFolder}/bots.html`);
const botUrl = 'https://storebot.me/';
const botJsonFileName = `${common.jsonFolder}/bots.json`;

const BotController = {
    getAllBots: function(type, category, sucessCB, failureCB) {
        const categoryUrl = `${botUrl}${type}/${category === 'all' ? '' : category}`;
        const categoryJsonFileName = `${common.jsonFolder}/bots/bot_${type}_${category}.json`;
    
        common.xray(botHtml, botScope, botSchema)
          .then(function(bots) {
              sucessCB(bots);
          })
          .catch(function(err){
              failureCB(JSON.stringify(err));
          });
    }
} 

module.exports = {
    BotController: BotController
};