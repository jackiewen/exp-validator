const ExpValidator = require('./lib/exp-validator');
const Locale = require('./lib/locale');

const expValidator = new ExpValidator();

module.exports = {
    validate: (rules, options = {}) => {
        return function (req, res, next) {
            let data = {};
            if (options.data) {
                data = options.data;
                console.log('DATA', data);
            } else if (options.method == 'COOKIE') {
                data = req.cookies;
                console.log('COOKIE', data);
            } else if (options.method == 'HEADER') {
                data = req.headers;
                console.log('HEADER', data);
            } else if (req.method == 'POST') {
                data = req.body;
                console.log('POST', data);
            } else if (req.method == 'GET') {
                data = req.query;
                console.log('GET', data);
            }
            const resValidator = expValidator
                .setData(data)
                .setRules(rules)
                .setLocale(Locale);
            if (options.messages) {
                resValidator.setMessages(options.messages)
            }
            if (options.attributes) {
                resValidator.setAttributes(options.attributes)
            }
            result = resValidator.validate();
            if (result) {
                return res.status(422).send(result);
            }
            next();
        }
    },
    locale: Locale,
    setCustomRules: (rules) => { expValidator.setCustomRules(rules) }
}