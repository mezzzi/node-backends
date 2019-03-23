let fs = require('fs');
const result = JSON.parse(fs.readFileSync('./json/all-new.json', {encoding: 'utf-8'}));
const bots = JSON.parse(fs.readFileSync('./json/collectives/bots_new.json', {encoding: 'utf-8'}));
const channels = JSON.parse(fs.readFileSync('./json/collectives/channels_new.json', {encoding: 'utf-8'}));
const stickers = JSON.parse(fs.readFileSync('./json/collectives/stickers_new.json', {encoding: 'utf-8'}));

result.all.bags = bots;
result.all.chopsticks = channels;
result.all.stickers = stickers;
delete result.all.Stickers;
fs.writeFileSync('all_latest.json', JSON.stringify(result));