const fs = require('fs');
const path = require('path');

class Locale {
    instance = null;
    locale = 'en';
    messages = {};
    custom = {};
    attributes = {};
    localeEvent = null;
    path = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new Locale();
        }
        return this.instance;
    }

    getMessages(key = null) {
        if (key) {
            const arrKey = key.split('.', 2);
            if (arrKey.length == 1) {
                if (this.messages) {
                    return this.messages[key] || '';
                }
            }
            if (this.custom && this.custom[arrKey[0]] && this.custom[arrKey[0]][arrKey[1]]) {
                return this.custom[arrKey[0]][arrKey[1]];
            }
            return '';
        }
        return this.messages;
    }

    getAttributes(key = null) {
        if (key) {
            if (this.attributes) {
                return this.attributes[key] || key;
            }
            return key;
        }
        return this.attributes;
    }

    setEvent(event) {
        this.localeEvent = event;
        return this;
    }

    setLocale(locale) {
        this.locale = locale;
        return this;
    }

    setPath(path) {
        this.path = path;
        return this;
    }

    readMessages() {
        let localePath = path.resolve(__dirname + '/../locales/' + this.locale + '/validate.json');
        try {
            let tmpPath = path.resolve(path.dirname(require.main.filename) + '/locales/' + this.locale + '/validate.json');
            if (fs.existsSync(tmpPath)) {
                localePath = tmpPath;
            }
        } catch(e) {}
        if (this.path) {
            localePath = this.path.replace(':locale', this.locale);
        }
        // console.log(localePath)
        fs.readFile(localePath, 'utf8' , (err, content) => {
            if (err) {
                console.error(err);
                if (this.localeEvent) {
                    this.localeEvent.emit('getMessagesError', err);
                }
                return;
            }
            const data = JSON.parse(content);
            if (data && data.messages) {
                this.messages = data.messages;
            }
            if (data && data.custom) {
                this.custom = data.custom;
            }
            if (data && data.attributes) {
                this.attributes = data.attributes;
            }
            if (this.localeEvent) {
                this.localeEvent.emit('getMessagesDone', data);
            }
        });
        return this;
    }
}

module.exports = Locale.getInstance();