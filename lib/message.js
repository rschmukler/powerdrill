/* jshint bitwise:false */

var clone = require('clone'),
    request = require('superagent');

var API_ENDPOINT = 'https://mandrillapp.com/api/1.0';

function Powerdrill(apiKey, template) {
  if (!(this instanceof Powerdrill)) return new Powerdrill(apiKey, template);
  this._to = [];
  this._from = {};
  this._tags = [];
  this._headers = {};
  this._skip = false;
  this._html = false;
  this._text = false;
  this._bcc = false;
  this._globalMergeVars = [];
  this._mergeVars = [];
  this._userMetadata = [];
  this._metadata = {};
  this._apiKey = apiKey;
  this._template = template;
  this._templateContent = [];
  this._subaccount = null;
  this._attachments = [];
  this._images = [];
  this._presentEmails = [];
}

module.exports = Powerdrill;

Powerdrill.prototype.image = function(type, name, content){
  this._images.push({
    type: type,
    name: name,
    content: content
  });
  return this;
};

Powerdrill.prototype.attach = function(type, name, content) {
  this._attachments.push({
    type: type,
    name: name,
    content: content
  });
  return this;
};

Powerdrill.prototype.globalBcc = function(email) {
  this._bcc = email;
  return this;
};

Powerdrill.prototype.subaccount = function(subaccount) {
  this._subaccount = subaccount;
  return this;
};

Powerdrill.prototype.apiKey = function(key) {
  this._apiKey = key;
  return this;
};

Powerdrill.prototype.header = function(key, val) {
  if (val === undefined && this._headers[key] !== undefined) {
    delete this._headers[key];
  } else if (val !== undefined) {
    this._headers[key] = val;
  }
  return this;
};

Powerdrill.prototype.template = function(template) {
  this._template = template;
  this._html = false;
  this._text = false;
  return this;
};

Powerdrill.prototype.templateContent = function(name, content) {
  this._templateContent.push({name: name, content: content});
  return this;
};

Powerdrill.prototype.trackClicks = function(val) {
  if (val !== false) val = true;
  this._trackClicks = val;
  return this;
};

Powerdrill.prototype.trackOpens = function(val) {
  if (val !== false) val = true;
  this._trackOpens = val;
  return this;
};

Powerdrill.prototype.html = function(html) {
  this._html = html;
  this._template = false;
  return this;
};

Powerdrill.prototype.text = function(text) {
  this._text = text;
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
  if (typeof key == 'object') {
    merge(this._metadata, key);
  } else {
    this._metadata[key] = value;
  }
  return this;
};

Powerdrill.prototype.to = function(address, mergeVars, metaData) {
  addEmail.call(this, address, mergeVars, metaData, 'to');
  return this;
};

Powerdrill.prototype.bcc = function(address, mergeVars, metaData) {
  addEmail.call(this, address, mergeVars, metaData, 'bcc');
  return this;
};

Powerdrill.prototype.cc = function(address, mergeVars, metaData) {
  addEmail.call(this, address, mergeVars, metaData, 'cc');
  return this;
};

function addEmail(address, mergeVars, metaData, type) {
  var email = parseEmail(address);
  email.type = type;
  this._to.push(email);
  if (this._presentEmails.indexOf(email.email) != -1) {
    console.warn("Powerdrill: Attempting to add the same email twice. Using data from first instance");
    return this;
  }
  this._presentEmails.push(email.email);
  if (mergeVars) this.mergeVar(email.email, mergeVars);
  if (metaData) this.userMetadata(email.email, metaData);
}


Powerdrill.prototype.tag = Powerdrill.prototype.tags = function(tag) {
  var tags = this._tags;

  if (typeof tag == 'string') {
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
    message: {
      subaccount: this._subaccount,
      subject: this._subject,
      bcc_address: this._bcc ? this._bcc : undefined,
      from_email: this._from.email,
      from_name: this._from.name,
      headers: this._headers,
      to: this._to,
      important: this._important,
      auto_text: this._autoText,
      preserve_recipients: this._preserveRecipients,
      global_merge_vars: this._globalMergeVars,
      merge_vars: this._mergeVars,
      tags: this._tags,
      metadata: this._metadata,
      attachments: this._attachments,
      images: this._images,
      recipient_metadata: this._userMetadata,
      track_clicks: this._trackClicks,
      track_opens: this._trackOpens
    }
  };

  if (this._html || this._text) {
    data.message.html = this._html;
    data.message.text = this._text;
  } else {
    data.template_name = this._template;
    data.template_content = this._templateContent;
  }

  return clone(data);
};

Powerdrill.prototype.send = function(done) {
  if (this._skip) return done();

  var data = this.requestData();

  done = done || function() { };

  if (this._intercept) {
    sendInterceptedEmails.call(this, done);
  } else if (this._html || this._text) {
    sendHtml(data, done);
  } else {
    sendTemplate(data, done);
  }

  return this;
};

function parseEmail(email) {
  var address, name, match;

  if (match = email.match(/<.*>/)) {
    address = match[0].replace(/<|>/g, '').trim();
    name = email.match(/.*</)[0].slice(0, -1).trim();
  } else {
    address = email;
  }

  if (!name && !email) {
    return undefined;
  }

  return {
    email: address,
    name: name
  };
}

function merge(target, source) {
  target = target || {};
  for (var key in source) {
    if (source.hasOwnProperty(key)) target[key] = source[key];
  }
  return target;
}

function addObjectOrKeyValueToArray(array, key, value) {
  array = array || [];
  if (typeof key == 'object') {
    for (var k in key) {
      if (key.hasOwnProperty(k)) {
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
  if (!(~index)) {
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
    var err = apiErrorFor(res);
    done(err, res.body);
  });
}

function sendHtml(data, done) {
  request
  .post(API_ENDPOINT + '/messages/send.json')
  .send(data)
  .end(function(res) {
    var err = apiErrorFor(res);
    done(err, res.body);
  });
}

function apiErrorFor(res) {
  var err = null;
  if (!res.ok) { err = new Error(res.body.message); }

  else if (Array.isArray(res.body)) {
    for (var i = 0; i < res.body.length; ++i) {
      err = errForEntry(res.body[i]);
      if (err) return err;
    }
  } else {
    return errForEntry(res.body);
  }

  function errForEntry(body) {
    if (body && (body.status == 'rejected' || body.status == 'invalid')) {
      err = new Error(body.reject_reason || 'Invalid API Request');
      return err;
    }
  }
}

function sendInterceptedEmails(done) {
  var to = this._to,
      pending = to.length,
      self = this;

  to.forEach(function(rec) {
    var modifiedData = self.requestData();

    modifiedData.message.subject = '[' + rec.email + '] ' + modifiedData.message.subject;
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
       vars: mergeVars[addressIndex] ? mergeVars[addressIndex].vars : []
     }
   ];

   if (self._html || self._text) {
     sendHtml(modifiedData, next);
   } else {
     sendTemplate(modifiedData, next);
   }
  });

  var canceled;
  function next(err) {
    if (err && !canceled) {
      canceled = true;
      return done(err);
    }
    if (!(--pending) && !canceled) done();
  }
}
