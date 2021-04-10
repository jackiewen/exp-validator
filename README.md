# Exp Validtor
## _Validator for Express_

[![Build Status](https://travis-ci.org/joemccann/dillinger.svg?branch=master)](https://github.com/jackiewen/exp-validator.git)

Exp-Validtor is a wrapper for validator package to use like a Express middleware.

## Features

- Cover all validator rules.
- Easy to use like a Express middleware.
- Easy to custom rules.
- Easy to custom messages and attributes.


## Installation


Install package with npm.

```sh
npm i @vqq/exp-validator
```

Or yarn

```sh
yarn add @vqq/exp-validator
```

## Usage

Require package to main server.
```sh
const expValidator = require('@vqq/exp-validator');
```
Set up locale for validator
```sh
expValidator.locale.readMessages();
```
You can set locale code or set path to your language file by json format.
```sh
expValidator.locale.setLocale('jp').readMessages();
expValidator.locale.setLocale('jp').setPath('path/:locale/filename.json').readMessages();
```
Set your own custom rules by setCustomRules
```sh
expValidator.setCustomRules({
    isTest: function(str, param1, param2) { return str === param1 && param2.check === 'check param 2'; }
});
```
Finally, Use your Exp-Validator like a middleware.
```sh
const app = express();
app.post('/create', expValidator.validate({
    email: [
        'nullable',
        'isEmail',
        {isByteLength: [{min:15, max: 50 }]}
    ],
    test: [
        {isTest: ['check param 1', {check: 'check param 2'}]}
    ]
})
,function (req, res) {
    // Your code here
});
```
### Some options you can change.
Change options by passing a object after rules.
data option
```sh
expValidator.validate({
    email: [
        'isEmail'
    ],
}, {data: {
    email: 'your_email@your.domain'
}});
```
method option (COOKIE, HEADER)
```sh
expValidator.validate({
    email: [
        'isEmail'
    ],
}, {method: 'COOKIE'});
```
messages and attributes options
```sh
expValidator.validate({
    email: [
        'isEmail'
    ],
    test: [
        {isTest: ['check param 1', {check: 'check param 2'}]}
    ]
}, {
    messages: {
        'isEmail': 'The :attribute must be a valid email address.',
        'test.isTest': 'The :attribute must be equal "%(params[0])s" and param 2 must be equal "%(params[1].check)s".',
    },
    attributes: {
        'email': 'Email',
        'test': 'Test Param'
    }
});
```
If you want to response all error messages for every rule. you can set checkFirst option to false.
```sh
expValidator.validate({
    email: [
        'nullable',
        'isEmail',
        {isByteLength: [{min:15, max: 50 }]}
    ]
}, {checkFirst: false})
```
nullable rule is special rule. It won't check other rules if your field is empty.
### Advanced usage
You can use validator by your own way. Like this: 
```sh
const express = require('express');
const expValidator = require('@vqq/exp-validator');

const app = express();
// expValidator.locale.readMessages();
expValidator.setCustomRules({
    isTest: function(str, param1, param2) { return str === param1 && param2.check === 'check param 2'; }
});
expValidator.validator.setMessages({
    'isEmail': 'The :attribute must be a valid email address.',
    'test.isTest': 'The :attribute must be equal "%(params[0])s" and param 2 must be equal "%(params[1].check)s".',
}).setAttributes({
    'email': 'Email',
    'test': 'Test Param'
});

app.post('/create', function (req, res) {
    const result = expValidator.validator.setData({
        email: 'youremail@domain',
        test: 'check param 2'
    }).setRules({
         email: [
            'isEmail'
        ],
        test: [
            {isTest: ['check param 1', {check: 'check param 2'}]}
        ]
    }).validate();
    if (result) {
        return res.status(422).send(result);
    }
    // Your code here
    return res.status(200).send('success');
});
```
