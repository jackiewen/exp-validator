const validator = require('validator');
const _ = require('lodash');
const sprintf = require('sprintf-js').sprintf;

class ExpValidator {
    data = null;
    rules = null;
    messages = null;
    attributes = null;
    locale = null;

    setData(data) {
        this.data = data;
        return this;
    }

    setRules(rules) {
        this.rules = rules;
        return this;
    }

    setMessages(messages) {
        this.messages = messages;
        return this;
    }

    setAttributes(attributes) {
        this.attributes = attributes;
        return this;
    }

    setLocale(locale) {
        this.locale = locale;
        return this;
    }

    parseRules(rules) {
        let parsedRules = {};
        for (const field in rules) {
            parsedRules[field] = rules[field].map(rule => _.isString(rule) ? {[rule]: []} : rule);
        }
        return parsedRules;
    }

    setCustomRules(rules) {
        if (rules) {
            for (const ruleName in rules) {
                validator[ruleName] = rules[ruleName];
            }
        }
        
        return this;
    }
    
    generateMessage(parsedRules, messages = {}, attributes = {}) {
        let messageNotExist = [];
        let ruleMessage = {};
        let attrName = {};
        let attrNotExist = [];
        for (const field in parsedRules) {
            parsedRules[field].map(rule => {
                const ruleName = Object.keys(rule)[0];
                const tmpKey = field + '.' + ruleName;
                if (messages && messages[tmpKey]) {
                    ruleMessage[field] = {...ruleMessage[field], [ruleName]: messages[tmpKey]};
                } else if (messages && messages[ruleName]) {
                    ruleMessage[field] = {...ruleMessage[field], [ruleName]: messages[ruleName]};
                } else if (this.locale && this.locale.getMessages(tmpKey)) {
                    ruleMessage[field] = {...ruleMessage[field], [ruleName]: this.locale.getMessages(tmpKey)};
                } else if (this.locale && this.locale.getMessages(ruleName)) {
                    ruleMessage[field] = {...ruleMessage[field], [ruleName]: this.locale.getMessages(ruleName)};
                } else {
                    messageNotExist.push({[field]: ruleName});
                }
            });
            if (attributes && attributes[field]) {
                attrName[field] = attributes[field];
            } else if (this.locale.getAttributes(field)) {
                attrName[field] = this.locale.getAttributes(field);
            } else {
                attrNotExist.push(field);
            }
        }

        return {
            messages: ruleMessage,
            attributes: attrName
        }
    }

    parseMessage(message, attribute = '', params = []) {
        return sprintf(message.replace(':attribute', attribute), {params: params})
    }
    
    validate(checkFirst = true) {
        const parsedRules = this.parseRules(this.rules);
        const genMessages = this.generateMessage(parsedRules, this.messages, this.attributes);
        const messages = genMessages['messages'];
        const attributes = genMessages['attributes'];
        let result = {};
        for (const field in parsedRules) {
            const dataField = this.data[field] || '';
            if (parsedRules[field].find(r => Object.keys(r)[0] == 'nullable') && !dataField) {
                continue;
            }
            for (const index in parsedRules[field]) {
                const rule = parsedRules[field][index];
                const ruleName = Object.keys(rule)[0];
                if (ruleName != 'nullable' && !validator[ruleName](dataField, ...rule[ruleName])) {
                    if (messages[field] && messages[field][ruleName]) {
                        result[field] = {...result[field], [ruleName]: this.parseMessage(messages[field][ruleName], attributes[field], rule[ruleName])};
                    } else {
                        result[field] = {...result[field], [ruleName]: ''};
                    }
                    if (checkFirst) {
                        break;
                    }
                }
            }
        }
        return result;
    }
}

module.exports = ExpValidator;