/* jshint bitwise:false */

var clone = require('clone'),
    request = require('superagent');

var API_ENDPOINT = 'https://mandrillapp.com/api/1.0';

function Powerdrill(apiKey, template) {
  if(!(this instanceof Powerdrill)) return new Powerdrill(apiKey, template);
  this._to = [];
  this._from = {};
  this._tags = [];
  this._skip = false;
  this._globalMergeVars = [];
  this._mergeVars = [];
  this._userMetadata = [];
  this._metadata = {};
  this._apiKey = apiKey;
  this._template = template;
  this._templateContent = [];
  this._subaccount = null;
}

module.exports = Powerdrill;

Powerdrill.prototype.subaccount = function(subaccount) {
  this._subaccount = subaccount;
  return this;
};

Powerdrill.prototype.apiKey = function(key) {
  this._apiKey = key;
  return this;
};

Powerdrill.prototype.template = function(template) {
  this._template = template;
  return this;
};

Powerdrill.prototype.subject = function(subject) {
  this._subject = subject;
  return this;
};

Powerdrill.prototype.from = function(from) {
  this._from = parseEmail(from);
  return this;
};

Powerdrill.prototype.intercept = function(address) {
  this._intercept = parseEmail(address);
  return this;
};

Powerdrill.prototype.skip = function(skip) {
  this._skip = skip === false ? false : true;
  return this;
};

Powerdrill.prototype.important = function(important) {
  this._important = important === false ? false : true;
  return this;
};

Powerdrill.prototype.autoText = function(autoText) {
  this._autoText = autoText === false ? false : true;
  return this;
};

Powerdrill.prototype.preserveRecipients = function(preserve) {
  this._preserveRecipients = preserve === false ? false : true;
  return this;
};

Powerdrill.prototype.globalMergeVars = function(key, value) {
  addObjectOrKeyValueToArray(this._globalMergeVars, key, value);
  return this;
};

Powerdrill.prototype.globalMergeVar = Powerdrill.prototype.globalMergeVars;

Powerdrill.prototype.mergeVar = function(rcpt, obj) {
  addOrMergeForRcpt(this._mergeVars, 'vars', rcpt, obj, true);
};

Powerdrill.prototype.mergeVars = Powerdrill.prototype.mergeVar;

Powerdrill.prototype.userMetadata = function(rcpt, obj) {
  addOrMergeForRcpt(this._userMetadata, 'values', rcpt, obj);
};

Powerdrill.prototype.recipientMetadata = Powerdrill.prototype.userMetadata;

Powerdrill.prototype.metadata = function(key, value) {
  if(typeof key == 'object') {
    merge(this._metadata, key);
  } else {
    this._metadata[key] = value;
  }
  return this;
};

Powerdrill.prototype.to = function(address, mergeVars, metaData) {
  var email = parseEmail(address);
  email.type = 'to';
  this._to.push(email);
  if(mergeVars) this.mergeVar(email.email, mergeVars);
  if(metaData) this.userMetadata(email.email, metaData);
  return this;
};


Powerdrill.prototype.tag = Powerdrill.prototype.tags = function(tag) {
  var tags = this._tags;

  if(typeof tag == 'string') {
    addTag(tag);
  } else {
    tag.forEach(addTag);
  }

  function addTag(tag) {
    tags.push(tag);
  }
  return this;
};

Powerdrill.prototype.requestData = function() {
  var data = {
    key: this._apiKey,
    template_name: this._template,
    template_content: this._templateContent,
    message: {
      subaccount: this._subaccount,
      subject: this._subject,
      from_email: this._from.email,
      from_name: this._from.name,
      to: this._to,
      important: this._important,
      auto_text: this._autoText,
      preserve_recipients: this._preserveRecipients,
      global_merge_vars: this._globalMergeVars,
      merge_vars: this._mergeVars,
      tags: this._tags,
      metadata: this._metadata,
      recipient_metadata: this._userMetadata
    }
  };
  return clone(data);
};

Powerdrill.prototype.send = function(done) {
  if(this._skip) return done();

  var data = this.requestData(),
      done = done || function() { };

  if(this._intercept) {
    sendInterceptedEmails.call(this, done);
  } else {
    sendTemplate(data, done);
  }

  return this;
};

function parseEmail(email) {
  var address, name, match;

  if(match = email.match(/<.*>/)) {
    address = match[0].replace(/<|>/g, '').trim();
    name = email.match(/.*</)[0].slice(0, -1).trim();
  } else {
    address = email;
  }

  if(!name && !email) {
    return undefined;
  }

  return {
    email: address,
    name: name
  };
}

function merge(target, source) {
  target = target || {};
  for(var key in source) {
    if(source.hasOwnProperty(key)) target[key] = source[key];
  }
  return target;
}

function addObjectOrKeyValueToArray(array, key, value) {
  array = array || [];
  if(typeof key == 'object') {
    for(var k in key) {
      if(key.hasOwnProperty(k)) {
        array.push({name: k, content: key[k]});
      }
    }
  } else {
    array.push({name: key, content: value});
  }
  return array;
}

function addOrMergeForRcpt(target, as, rcpt, vars, asArray) {
  var allEmails = target.map(function(v) { return v.rcpt; });
  var index = allEmails.indexOf(rcpt);
  if(!(~index)) {
    var newObject = {};
    newObject.rcpt = rcpt;
    newObject[as] = asArray ? [] : {};
    target.push(newObject);
    index = target.length - 1;
  }
  target[index][as] = asArray ? addObjectOrKeyValueToArray(target[index][as], vars)
  : merge(target[index][as], vars);
}

function sendTemplate(data, done) {
  request
  .post(API_ENDPOINT + '/messages/send-template.json')
  .send(data)
  .end(function(res) {
    var error = res.ok ? null : new Error(res.body.message);
    done(error, res.body);
  });
}

function sendInterceptedEmails(done) {
  var to = this._to,
      pending = to.length,
      self = this;

  to.forEach(function(rec) {
    var modifiedData = self.requestData();

    modifiedData.message.subject = '[' + rec.email + ']' + modifiedData.message.subject;
    modifiedData.message.to = [{
      name: self._intercept.name,
      email: self._intercept.email,
      type: 'to'
    }];

    var mergeVars = modifiedData.message.merge_vars,
        mergeRcpts = mergeVars.map(function(v) { return v.rcpt; }),
        addressIndex = mergeRcpts.indexOf(rec.email);

   modifiedData.message.merge_vars = [
     {
       rcpt: self._intercept.email,
       vars: mergeVars[addressIndex].vars
     }
   ];

    sendTemplate(modifiedData, next);
  });

  var canceled;
  function next(err) {
    if(err && !canceled) {
      canceled = true;
      return done(err);
    }
    if(!(--pending) && !canceled) done();
  }
}
