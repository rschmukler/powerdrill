/* jshint newcap:false, bitwise:false */

var expect = require('expect.js'),
    request = require('superagent'),
    Message = require('../').Message;

describe('Builder', function() {
  var builder, message;
  before(function() {
    builder = require('../')('builderApiKey');
    message = builder('some-template');
  });

  it('returns a message', function() {
    expect(message).to.be.a(Message);
  });
  it('sets the api key', function() {
    expect(message).to.have.property('_apiKey', 'builderApiKey');
  });
  it('sets the template name', function() {
    expect(message).to.have.property('_template', 'some-template');
  });
});

describe('Message', function() {
  var message;
  beforeEach(function() {
    message = new Message('key', 'template');
    expect(message).to.be.a(Message);
  });

  describe('constructor', function() {
    it("creates an instance", function() {
      expect(message).to.be.a(Message);
    });

    it("works without new", function() {
      message = Message();
      expect(message).to.be.a(Message);
    });

    it("sets 'to' to an empty array", function() {
      expect(message._to).to.be.a(Array);
      expect(message._to).to.have.length(0);
    });

    it("sets 'globalMergeVars' to an empty array", function() {
      expect(message._globalMergeVars).to.be.a(Array);
      expect(message._globalMergeVars).to.have.length(0);
    });

    it("sets 'mergeVars' to an empty array", function() {
      expect(message._mergeVars).to.be.a(Array);
      expect(message._mergeVars).to.have.length(0);
    });

    it("sets 'userMetadata' to an empty array", function() {
      expect(message._userMetadata).to.be.a(Array);
      expect(message._userMetadata).to.have.length(0);
    });

    it("sets 'tags' to an empty array", function() {
      expect(message._tags).to.be.a(Array);
      expect(message._tags).to.have.length(0);
    });

    it("sets 'metadata' to an empty object", function() {
      expect(message._metadata).to.be.a(Object);
      expect(Object.keys(message._metadata)).to.have.length(0);
    });

    it("sets the apiKey", function() {
      expect(message._apiKey).to.be('key');
    });

    it("sets the template name", function() {
      expect(message._template).to.be('template');
    });
  });

  describe("#apiKey", function() {
    it("sets the apiKey", function() {
      message.apiKey('123');
      expect(message._apiKey).to.be('123');
    });
    it("returns the message", function() {
      expect(message.apiKey('123')).to.be(message);
    });
  });

  describe('#template', function() {
    it("sets the template name", function() {
      message.template('a');
      expect(message._template).to.be('a');
    });
    it("returns the message", function() {
      expect(message.template('123')).to.be(message);
    });
  });

  describe('#subject', function() {
    it("sets the subject", function() {
      message.subject('a');
      expect(message._subject).to.be('a');
    });
    it("returns the message", function() {
      expect(message.subject('123')).to.be(message);
    });
  });

  describe('#from', function() {
    it("sets the from address", function() {
      message.from('test@gmail.com');
      expect(message._from.email).to.be('test@gmail.com');
    });

    it("sets the from name", function() {
      message.from('Test team <test@gmail.com>');
      expect(message._from.email).to.be('test@gmail.com');
      expect(message._from.name).to.be('Test team');
    });

    it('returns the message', function() {
      expect(message.from('abc')).to.be(message);
    });
  });

  describe('#important', function() {
    it("sets important to true by default", function() {
      message.important();
      expect(message._important).to.be(true);
    });

    it("sets important to false", function() {
      message.important(false);
      expect(message._important).to.be(false);
    });

    it("returns the message", function() {
      expect(message.important()).to.be(message);
    });
  });

  describe('#autoText', function() {
    it("sets autoText to true by default", function() {
      message.autoText();
      expect(message._autoText).to.be(true);
    });

    it("sets autoText to false", function() {
      message.autoText(false);
      expect(message._autoText).to.be(false);
    });

    it("returns the message", function() {
      expect(message.autoText()).to.be(message);
    });
  });

  describe('#preserveRecipients', function() {
    it("sets preserveRecipients to true by default", function() {
      message.preserveRecipients();
      expect(message._preserveRecipients).to.be(true);
    });

    it("sets preserveRecipients to false", function() {
      message.preserveRecipients(false);
      expect(message._preserveRecipients).to.be(false);
    });

    it("returns the message", function() {
      expect(message.preserveRecipients()).to.be(message);
    });
  });

  describe('#globalMergeVars', function() {
    it('aliases to globalMergeVar', function() {
      expect(message.globalMergeVar).to.be(message.globalMergeVars);
    });

    it('takes key value input', function() {
      message.globalMergeVars('someField', 'someValue');
      expect(message._globalMergeVars).to.have.length(1);
      expect(message._globalMergeVars[0]).property('name', 'someField');
      expect(message._globalMergeVars[0]).property('content', 'someValue');
    });

    it('takes object input', function() {
      message.globalMergeVars({someField: 'someValue'});
      expect(message._globalMergeVars[0]).property('name', 'someField');
      expect(message._globalMergeVars[0]).property('content', 'someValue');
    });

    it("returns the message", function() {
      expect(message.globalMergeVars()).to.be(message);
    });
  });

  describe('#mergeVar', function() {
    it('aliases to mergeVars', function() {
      expect(message.mergeVar).to.be(message.mergeVars);
    });

    it("creates a merge var for a new email address", function() {
      message.mergeVar('test@gmail.com', { cool: true });
      var mergeRecord = message._mergeVars[0];
      expect(mergeRecord).to.be.ok();
      expect(mergeRecord).to.have.property('rcpt', 'test@gmail.com');
      expect(mergeRecord).to.have.property('vars');
      expect(mergeRecord.vars).to.be.an(Array);
      expect(mergeRecord.vars[0]).to.have.property('name', 'cool');
      expect(mergeRecord.vars[0]).to.have.property('content', true);
    });

    it("adds var for existing mail records", function() {
      message.mergeVar('test@gmail.com', { cool: true });
      message.mergeVar('test@gmail.com', { alsoCool: true });
      expect(message._mergeVars).to.have.length(1);
      var mergeRecord = message._mergeVars[0];
      expect(mergeRecord).to.have.property('rcpt', 'test@gmail.com');
      expect(mergeRecord).to.have.property('vars');
      expect(mergeRecord.vars[0]).to.have.property('name', 'cool');
      expect(mergeRecord.vars[1]).to.have.property('name', 'alsoCool');
    });

    it("returns the message", function() {
      expect(message.globalMergeVars()).to.be(message);
    });
  });

  describe('#userMetadata', function() {
    it('aliases to recipientMetadata', function() {
      expect(message.userMetadata).to.be(message.recipientMetadata);
    });

    it("creates a metadata for a new email address", function() {
      message.userMetadata('test@gmail.com', { id: 123 });
      var mergeRecord = message._userMetadata[0];
      expect(mergeRecord).to.be.ok();
      expect(mergeRecord).to.have.property('rcpt', 'test@gmail.com');
      expect(mergeRecord).to.have.property('values');
      expect(mergeRecord.values).to.have.property('id', 123);
    });

    it("adds var for existing mail records", function() {
      message.userMetadata('test@gmail.com', { cool: true });
      message.userMetadata('test@gmail.com', { alsoCool: true });
      expect(message._userMetadata).to.have.length(1);
      var mergeRecord = message._userMetadata[0];
      expect(mergeRecord).to.have.property('rcpt', 'test@gmail.com');
      expect(mergeRecord).to.have.property('values');
      expect(mergeRecord.values).to.have.property('cool', true);
      expect(mergeRecord.values).to.have.property('alsoCool', true);
    });

    it("returns the message", function() {
      expect(message.globalMergeVars()).to.be(message);
    });
  });

  describe('#intercept', function() {
    it("sets the interceptor email account", function() {
      message.intercept('ryan@slingingcode.com');
      expect(message._intercept.email).to.be('ryan@slingingcode.com');
    });
    it("returns the message", function() {
      expect(message.intercept('ryan@slingingcode.com')).to.be(message);
    });
  });

  describe('#metadata', function() {
    it('takes key value input', function() {
      message.metadata('someField', 'someValue');
      expect(message._metadata).to.have.property('someField', 'someValue');
    });
    it('takes object input', function() {
      message.metadata({somethingElse: 'wee', somethingOther: 'alsoWee'});
      expect(message._metadata).to.have.property('somethingElse', 'wee');
      expect(message._metadata).to.have.property('somethingOther', 'alsoWee');
    });
    it('returns the message', function() {
      expect(message.metadata()).to.be(message);
    });
  });

  describe('#to', function() {
    it('adds the recipient', function() {
      message.to('John Doe <john@gmail.com>');
      expect(message._to[0]).to.have.property('name', 'John Doe');
      expect(message._to[0]).to.have.property('email', 'john@gmail.com');
    });

    it('adds merge vars', function() {
      message.to('John Doe <john@gmail.com>', {cool: false});
      var mergeRecord = message._mergeVars[0];
      expect(mergeRecord).to.have.property('rcpt', 'john@gmail.com');
    });

    it('adds user-specific metadata', function() {
      message.to('John Doe <john@gmail.com>', {cool: false}, {userId: 123});
      var mergeRecord = message._userMetadata[0];
      expect(mergeRecord).to.have.property('rcpt', 'john@gmail.com');
    });

    it('returns the message', function() {
      expect(message.to('John Doe <john@gmail.com>')).to.be(message);
    });
  });

  describe('#tags', function() {
    it('aliases to tag', function() {
      expect(message.tag).to.be(message.tags);
    });

    it('adds a string', function() {
      message.tag('test');
      expect(~message._tags.indexOf('test')).to.be.ok();
    });

    it('adds an array', function() {
      message.tag(['testing', 'alsoGood']);
      expect(~message._tags.indexOf('testing')).to.be.ok();
      expect(~message._tags.indexOf('alsoGood')).to.be.ok();
    });

    it('returns the message', function() {
      expect(message.tag('registration')).to.be(message);
    });
  });

  describe('#requestData', function() {
    var request, message;
    beforeEach(function() {
      message = new Message();

      message
      .apiKey('123')
      .subject('Something')
      .from('Ryan Schmukler <ryan@slingingcode.com>')
      .template('test-template')
      .to('Some guy <someone@google.com>')
      .to('Jon Dude <john@google.com>', {cool: true})
      .to('Data User <user@test.com>', {}, {uid: 123});

      request = message.requestData();
    });

    it('includes the key', function() {
      expect(request.key).to.be.ok();
      expect(request.key).to.be(message._apiKey);
    });

    it('includes the template_name', function() {
      expect(request.template_name).to.be.ok();
      expect(request.template_name).to.be(message._template);
    });

    it('includes the template_content', function() {
      expect(request.template_content).to.be.an(Array);
    });

    it('includes the subject', function() {
      expect(request.message.subject).to.be.ok();
      expect(request.message.subject).to.be(message._subject);
    });

    it('includes the from_email', function() {
      expect(request.message.from_email).to.be.ok();
      expect(request.message.from_email).to.be(message._from.email);
    });

    it('includes the from_name', function() {
      expect(request.message.from_name).to.be.ok();
      expect(request.message.from_name).to.be(message._from.name);
    });

    it('includes to', function() {
      expect(request.message.to).to.have.length(3);
      expect(request.message.to[0]).to.have.property('email');
      expect(request.message.to[0]).to.have.property('name');
      expect(request.message.to[0]).to.have.property('type');
    });

    it('includes important', function() {
      message.important();
      request = message.requestData();
      expect(request.message.important).to.be(true);
    });

    it('includes auto_text', function() {
      message.autoText();
      request = message.requestData();
      expect(request.message.auto_text).to.be(true);
    });

    it('includes perserve_recipients', function() {
      message.preserveRecipients();
      request = message.requestData();
      expect(request.message.preserve_recipients).to.be(true);
    });

    it('includes global_merge_vars', function() {
      message.globalMergeVars({name: 'Bob'});
      request = message.requestData();
      expect(request.message.global_merge_vars).to.be.ok();
      expect(request.message.global_merge_vars).to.have.length(1);

      expect(request.message.global_merge_vars[0])
      .to.have.property('name', 'name');

      expect(request.message.global_merge_vars[0])
      .to.have.property('content', 'Bob');
    });

    it('includes merge_vars', function() {
      expect(request.message.merge_vars).to.have.length(2);

      expect(request.message.merge_vars[0])
      .to.have.property('rcpt', 'john@google.com');

      expect(request.message.merge_vars[0].vars[0])
      .to.have.property('name', 'cool');

      expect(request.message.merge_vars[0].vars[0])
      .to.have.property('content', true);
    });

    it('includes tags', function() {
      message.tags('somethingAwesome');
      request = message.requestData();
      expect(request.message.tags[0]).to.be('somethingAwesome');
      expect(request.message.tags).to.be.an(Array);
    });

    it('includes metadata', function() {
      message.metadata('website', 'www.example.com');
      request = message.requestData();
      expect(request.message.metadata).to.have.property('website', 'www.example.com');
    });

    it('includes recipient_metadata', function() {
      var recipientMetadata = request.message.recipient_metadata;
      expect(recipientMetadata).to.be.an(Array);
      expect(recipientMetadata[0]).to.have.property('rcpt', 'user@test.com');
      expect(recipientMetadata[0]).to.have.property('values');
      expect(recipientMetadata[0].values).to.have.property('uid', 123);
    });
  });

  describe('#send', function() {
    var oldPost = request.post;

    it('sends the email', function(done) {
      request.post = function(url) {
        expect(url).to.be('https://mandrillapp.com/api/1.0/messages/send-template.json');
        var apiMock = { };
        apiMock.send = function(data) {
          return this;
        };
        apiMock.end = function(cb) {
          request.post = oldPost;
          cb({ok: true});
        };
        return apiMock;
      };
      message = new Message('123', 'registration');
      message.send(done);
    });

    describe('with interceptor', function() {
      var apiMock;
      before(function() {
        apiMock = {
          send: function() { return this; },
          end: function(cb) { cb({ok: true}); return this; }
        };
        request.post = function() {
          return apiMock;
        };
      });

      after(function() {
        request.post = oldPost;
      });

      it('sends all emails to the interceptor', function(done) {
        var message = new Message();
        message.subject('Some subject');
        message.to('Bob <bob@gmail.com>', {name: 'Bob'});
        message.to('Tom <tom@gmail.com>', {name: 'Tom'});
        message.intercept('ryan@slingingcode.com');

        var callCount = 0;

        apiMock.send = function(data) {
          callCount++;
          expect(data.message.to).to.have.length(1);
          expect(data.message.to[0].email).to.be('ryan@slingingcode.com');
          expect(data.message.subject).to.match(/Some subject/);
          expect(data.message.merge_vars).to.have.length(1);
          if(callCount == 1) {
            expect(data.message.subject).to.match(/bob@gmail.com/);
            expect(data.message.merge_vars[0]).to.have.property('rcpt', 'ryan@slingingcode.com');
            expect(data.message.merge_vars[0].vars[0]).to.have.property('name', 'name');
            expect(data.message.merge_vars[0].vars[0]).to.have.property('content', 'Bob');
          } else {
            expect(data.message.subject).to.match(/tom@gmail.com/);
            expect(data.message.merge_vars[0]).to.have.property('rcpt', 'ryan@slingingcode.com');
            expect(data.message.merge_vars[0].vars[0]).to.have.property('name', 'name');
            expect(data.message.merge_vars[0].vars[0]).to.have.property('content', 'Tom');
          }
          return apiMock;
        };
        message.send(function() {
          expect(callCount).to.be(2);
          done();
        });
      });
    });
  });
});
