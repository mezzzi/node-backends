const Xray = require('x-ray');

const stripInnerSpace = function(text) {
    let result = '';
    text.split('\r\n').forEach(function(subText) {
        result += subText.trim() + ' ';
    });
    let out = '';
    result.split('\n').forEach(function(subText) {
        out += subText.trim() + ' ';
    });
    return out.trim() || result.trim();
};

const xray = Xray({
    filters: {
        trim: function (value) {
            return typeof value === 'string' ? value.trim() : value
        },
        inner_trim: function (value) {
            return typeof value === 'string' ? stripInnerSpace(value) : value
        },
        page_inner_trim: function (value) {
            return typeof value === 'string' ? value.replace(/(\s)+/i, ' ') : value
        },
        url: function (value) {
            // style="background-image: url(url_addr.jpg)"
            if (typeof value !== 'string' || value.indexOf('(') === -1) {
                return '';
            }
            const leftParenthesisIndex = value.indexOf('(');
            const rightParenthesisIndex = value.indexOf(')');
            return value.substring(leftParenthesisIndex + 1, rightParenthesisIndex)
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
        },
        nick_channel: function (value) {
            if (typeof value !== 'string' || value.indexOf('@') === -1) {
                return '';
            }
            value = value.trim();
            const leftParenthesisIndex = value.lastIndexOf('@');
            const rightParenthesisIndex = value.indexOf('<div');
            value = value.substring(leftParenthesisIndex, rightParenthesisIndex);
            return stripInnerSpace(value);
        },
        strip_comma: function (value) {
            // style="background-image: url(url_addr.jpg)"
            if (typeof value !== 'string' || value.indexOf('(') === -1) {
                return '';
            }
            while(value.indexOf(',') !== -1) {
                value = value.replace(',', '');
            }
            return value;
        }        
    }
});

const jsonFolder = './json';
const htmlFolder = './html';

const Category = [
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

module.exports = {
    htmlFolder: htmlFolder,
    jsonFoldr: jsonFolder,
    xray: xray,
    Category: Category
}