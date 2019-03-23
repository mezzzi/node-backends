const common = require('./controller.shared');
const fs = require('fs');
const stripInnerSpace = function (text) {
    let result = '';
    text.split('\r\n').forEach(function (subText) {
        result += subText.trim();
    });
    return result;
};
const x = require('x-ray-scraper');
x.setFilters({
    trim: function (value) {
        return typeof value === 'string' ? value.trim() : value
    },
    at: function (value) {
        if (typeof value !== 'string' || value.indexOf('@') === -1) {
            return '';
        }
        value = value.trim();
        const leftParenthesisIndex = value.indexOf('@');
        const rightParenthesisIndex = value.indexOf('<br>');
        value = value.substring(leftParenthesisIndex, rightParenthesisIndex);
        return stripInnerSpace(value);
    },
    desc: function (value) {
        if (typeof value !== 'string' || value.indexOf('@') === -1) {
            return '';
        }
        value = value.trim();
        const leftParenthesisIndex = value.indexOf('<br>');
        const rightParenthesisIndex = value.indexOf('<div');
        value = value.substring(leftParenthesisIndex + 4, rightParenthesisIndex);
        return stripInnerSpace(value);
    }
});


const randomScope = 'li.product';
const randomSchema = [{
    name: 'a a | trim',
    short_name: 'a.woocommerce-loop-product__link@html | at',
    description: 'a.woocommerce-loop-product__link@html | desc',
    avatar: 'a img@src | trim',
    subscribers: 'span.productTransitions'
}];
const randomHtml = fs.readFileSync(`${common.htmlFolder}/new.html`);
const randomUrl = "https://telegram-store.com/catalog/product-category/bots-en/bo-services-en/";

const AllController = {
    getRandoms: function () {

        const result = [];
        x(randomUrl, randomScope, randomSchema)
            .paginate('a.page-numbers@href')
            .limit(5)
            .write('bot_games_1_6.json')

    }
}

    AllController.getRandoms();