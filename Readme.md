# Powerdrill
[![Build Status](https://api.travis-ci.org/rschmukler/powerdrill.png)](http://travis-ci.org/rschmukler/powerdrill)
[![Coverage Status](https://coveralls.io/repos/rschmukler/powerdrill/badge.png)](https://coveralls.io/r/rschmukler/powerdrill)

Mandrill with power!

## Notice: No longer maintained

Due to Mandrill's
[new pricing](http://blog.mandrill.com/important-changes-to-mandrill.html)
, I will no longer be maintaining this module. If people
want to submit PRs I will likely merge them in, but I will not be actively
working on this as I have moved on to greener pastures.


## Why?

[Mandrill](http://mandrill.com) is an awesome email service. Powerdrill makes it
easy to use mandrill and its templates.

The advantages of Mandrill + Powerdrill:

- Easily use mandrill templates, with support for global, and per user variables
- Send an email to thousands of recipients with just one html post request
- Mandrill's open and click reporting, as well as GA integration
- Easy API for Mandrill's metadata (both per user, and per email);
- Easy API for Mandrill's tagging, making it easy to A/B test campaigns
- Easy to register an interceptor for testing purposes

## Installation / Usage Example

```
npm install powerdrill
```

Sending an email with the `registration` template:

```js
var email = require('powerdrill')('myApiKey');

var message = email('registration'); // sets the template

message
.subject('Thanks for registering')
.to('ryan@slingingcode.com')
.send();
```

Or with pure html:

```js
var email = require('powerdrill')('myApiKey');

var message = email();

message
.subject('Thanks for registering')
.to('ryan@slingingcode.com')
.html('<h1>Hello world</h1>')
.send();
```

A little more complex:

```js
var Message = require('powerdrill').Message;

var message = new Message();

message.apiKey('12345')
.subject('Hello world!')
.template('complex-template')
.to('Ryan Schmukler <ryan@slingingcode.com>', {someVariableOnMandrill: true}, {someUserMetaData: user.id()})
.to('John Doe <john-doe@example.com>')
.tag('complex')
.tag('new-style')
.send(function(err, resp) {
  console.log(resp);
});
```

## Complete Documentation

### Getting a Builder

Powerdrill exports a function which helps build messages with an API Key
defined. It returns a `Message`. This helps avoid having to continually type out your api key.

```js
var email = require('powerdrill')('myApiKey');

var message = email('some-template')
message.subject('Hello world!');
message.to('ryan@slingingcode.com');
message.send();

```

is equivalent to:

```js
var Message = require('powerdrill').Message;

var message = new Message('myApiKey', 'some-template');
// or
var message = new Message();
message.apiKey('myApiKey');
message.template('some-template');
```

The purpose of the builder is it allows syntax like:

```js
email('some-template')
.subject('Hello world!')
.to('ryan@slingingcode.com')
.send();
```

### Default intercept

Similarly a builder can set an interceptor (see below) for messages. This can be
useful for development environments.

```js
var email = require('powerdrill')('myApiKey', 'ryan@slingingcode.com');
//or
var email = require('powerdrill')('myApiKey');
email.interceptor = 'ryan@slingingcode.com';

var message = email('some-template');
message.to('someguy@gmail.com');
message.send() // will send to ryan@slingingcode.com
```

### Default skip

A builder can set skip to a default value (useful for testing)

```js
var email = require('powerdrill')('myApiKey');
if(process.env.NODE_ENV == 'testing') {
  email.skip = true;
}

var message = email('some-template');
message.to('someguy@gmail.com');
message.send(); // Wont actually hit the api
```


### Working with Messages

All of `Message`'s configuration methods are chainable, making for highly
readable syntax.

#### Constructor(apiKey, template-name)

Returns a new powerdrill instance with specified `apiKey` and `template`. Use of
`new` keyword is optional.

```js
var Message = require('powerdrill').Message;
var messageOne = new Message('123', 'some-template');
var messageTwo = Message('123', 'another-template');
```

#### message.apiKey(key)

Sets the apiKey to `key`. Ret

```js
message.apiKey('123');
```

#### message.header(key, value)

Sets the header property `key` to `value`.

If `value` is `undefined`, it clears the header of `key` property.

```js
message.header('Reply-To', 'someperson@somewhere.com');
```

#### message.template(template)

Sets the template to `template`. This should match the `template-slug` you are
using in Mandrill's templates.

```js
message.template('simple-template');
```

#### message.templateContent(name, content)

Adds to the `template_content` array for dynamic sections.

```js
message.template('my-template')
  .templateContent('header', '<h1>Hello world</h1>')
  .templateContent('body', '<p>You are so cool</p>')
  .templateContent('footer', '<p>Sincerely,<br/>Our Team</p>')
```

#### message.html(html)

Switches to `html` mode. The email will be sent with the html, instead of a
template.

```js
message.html('<h1>Hello world, from Powerdrill</h1>');
```

#### message.text(text)

Switches to `text` mode. The email will be sent with the text, instead of a
template.

```js
message.text('Hello World');
```

Additionally, for a multipart message with HTML and plain text, you can add both parts manually.

```js
message.html('<h1>Hello world</h1>');
message.text('Hello world');
```

#### message.subject(subject)

Sets the subject field of the message

```js
message.subject('Hello world!');
```

#### message.from(address)

Populates the `from_name` and `from_email` fields. `address` can be in the
following formats:

```js
message.from('ryan@slingingcode.com');
// or
message.from('Ryan Schmukler <ryan@slingingcode.com>');
```

#### message.to(address, recipientVariables, recipientMetadata)

Adds a recipient. Call multiple times to add multiple recipients.
`recipientVariables` and `recipientMetadata` are optional.
See below for other ways to add.

simple:
```js
message.to('ryan@slingingcode.com');
```

complex:
```js
message.to('Ryan Schmukler <ryan@slingingcode.com>', {name: 'Ryan'}, {uid: 123});
```

#### message.bcc(address, recipientVariables, recipientMetadata)

Adds a recipient that will be BCC'd. `recipientVariables` and `recipientMetadata`
are optional. See below for other ways to add.

```js
message.bcc('ryan@slingingcode.com');
```

#### message.cc(address, recipientVariables, recipientMetadata)

Adds a recipient that will be CC'd. `recipientVariables` and `recipientMetadata`
are optional. See below for other ways to add.

```js
message.cc('ryan@slingingcode.com');
```

#### message.globalBcc(address)

Add an email that will be BCC'd for all emails send via the message.

```js
message.globalBcc('admin@myorganization.com');
```


```js
message.cc('ryan@slingingcode.com');
```


### message.trackClicks(val)

Whether or not to track clicks.

```js
message.trackClicks(true);
```

### message.trackOpens(val)

Whether or not to track opens.

```js
message.trackOpens(true);
```

### message.send(done)

Sends the message as configured. Typically the last command called. Calls
`done(err, resp)` where `resp` is the body returned from the mandrill API.

### message.skip(val)

Skips actually sending the message. Useful for testing so that you're not
blasted with emails.

`val` is optional, but setting it to false will mark it back to not important (default).

```js
message.skip() // sets message to skip
message.skip(false) // Restores it to actually sending
```

### message.intercept(email)

Intercepts emails being sent and sends them to `email` instead. Useful for
testing that things are working correctly. Will prepend the target address into
the subject line.

```js
message.to('bob@gmail.com', {name: 'Bob'});
message.to('steve@gmail.com', {name: 'Steve'});
message.intercept('ryan@slingingcode.com');
message.send();
// Ryan@slingingcode.com will get two emails, each with the specific variables
// for bob and steve
```

### message.tag(tagName)

Adds a tag to the message. `tagName` can be an `Array` of tags or a `String` for
one tag.

```js
message.tag(['cool', 'fun']);
message.tag('easy');
```

### message.important(val)

Sets the message as important, prioritizing it in mandrill's queue.

`val` is optional, but setting it to false will mark it back to not important (default).

```js
message.important() // sets message to important
message.important(true) // also sets message to important
message.important(false) // sets message back to not-important
```

### message.autoText(val)

Tells mandrill to automatically generate the text for the email template at hand.

`val` is optional, but setting it to false will mark it back to not important (default).

```js
message.autoText() // enabled autoText
message.autoText(true) // also enables
message.autoText(false) // disables autoText
```

### message.preserveRecipients(val)

Whether you want all recipients to be able to see who else you are sending to.
True by default.

`val` is optional, but setting it to false will mark it back to not important (default).

```js
message.preserveRecipients() // enabled preserveRecipients
message.preserveRecipients(true) // also enables
message.preserveRecipients(false) // disables preserveRecipients
```

### message.globalMergeVar(key, value)

Aliased to `message.globalMergeVars`.

Adds a global merge variable, for use on all emails.

Works with a `key, value` syntax or a `object` syntax.

```js
message.globalMergeVar('someVar', 'someValue');
// or
message.globalMergeVar({someVar: someValue});
```

### message.mergeVar(recipient, object)

Aliased to `message.mergeVars`.

Adds a variable for a specific recipient for use in mandrill's templates. Must specify as an email address, as
per mandrill's API. See `message#to` for a shortcut.

Takes an object of variables.

```js
message.mergeVar('ryan@slingingcode.com', {name: 'Ryan'});
```

### message.metadata(key, value)

Adds metadata for mandrill's use.

Works with a `key, value` syntax or a `object` syntax.

```js
message.metadata('someVar', 'someValue');
// or
message.metadata({someVar: someValue});
```

### message.userMetadata(recipient, data)

Aliased to `message.recipientMetadata`.

Adds a variable for a specific recipient for use in mandrill's recipient metadata.
See `message#to` for a shortcut.

Takes an object of variables.

```js
message.userMetadata('ryan@slingingcode.com', {uid: '123456'});
```

### message.requestData()

Mostly internal method. Returns data passsed in to the mandrill API. Useful for
debugging.

### message.subaccount(subaccount)

Sets the subaccount field of the message

```js
message.subaccount('MyMandrillSubaccount');
```

### message.attach(mime_type, file_name, base64_encoded_file_body)

Adds an attachment to include in the email. The body should be a base64 encoded string.

```js
var fs = require('fs');
var file = fs.readFileSync('test.pdf');
message.attach('application/pdf', 'test.pdf', file.toString('base64'));
```

### message.image(mime_type, image_name, base64_encoded_image_body)

Adds an image to include in-line in the email. The body should be a base64 encoded string.

```js
var fs = require('fs');
var image = fs.readFileSync('test.png');
message.image('image/png', 'test.png', image.toString('base64'));
```

## Planned features

These are some ideas that I have to extend the library. Please open issues to
suggest new features, or to let me know that you'd like a feature on this list:

- More Options (`trackClicks`, `trackOpens` etc)
