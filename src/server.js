const express = require('express');
const expValidator = require('../index');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser')
const app = express();

expValidator.locale.readMessages();

expValidator.setCustomRules({
    isTest: function(str, param1, param2) { return str === param1 && param2.check === 'check'; },
});

// const data = {
//     email: "hơllo",
//     birthday: '01/01/20151',
//     test_string: 'foo',
//     test_custom: 'abc',
//     check_hello: 'hello1',
//     check_hello1: 'hello2',
// }

// const rules = {
//     email: ['isEmail'],
//     birthday: [{isDate: ['MM/DD/YYYY']}],
//     test_string: [{matches: ['Foo', 'i']}],
//     test_custom: ['isBoolean'],
//     test_custom1: ['isBoolean'],
//     check_hello: ['isHello'],
//     check_hello1: ['isHello1']
// }

// const messages = {
//     "email.isEmail": "Field :attribute must be email",
//     "isDate": "Field :attribute must be date have format %1$s"
// }

// const attributes = {
//     email: 'Email',
//     test_string: 'Test String'
// }

app.use(bodyParser.json());
app.use(cookieParser())

app.use(expValidator.validate({
    email: [
        'isEmail',
        {isByteLength: [{min:5, max: 10 }]},
        {isTest: ['check', {check: 'check11'}]},
        {isIn: [['a', 'b', 'c']]}
    ]
}));

app.get('/', function (req, res) {
    res.send('hello world');
});

app.listen(3333, () => {
    console.log('Listening 3333');
});