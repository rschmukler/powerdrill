# Powerdrill

Making mandrill, powerful.

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

Basic usage:

```js
var Powerdrill = require('powerdrill');

var message = new Powerdrill();

message.apiKey('12345')
.subject('Hello world!')
.template('sample-template')
.to('ryan@slingingcode.com')
.send();
```

A little more complex:

```js
var Powerdrill = require('powerdrill');

var message = new Powerdrill();

message.apiKey('12345')
.subject('Hello world!')
.template('complex-template')
.to('Ryan Schmukler <ryan@slingingcode.com>', {someVariableOnMandrill: true}, {someUserMetaData: user.id()})
.to('John Doe <john-doe@example.com>')
.tag('complex')
.tag('new-style')
.send(function(resp) {
  console.log(resp);
});
```

## Complete Documentation

All of powerdrill's configuration methods are chainable, making for highly
readable syntax.

#### Constructor(apiKey, template-name)

Returns a new powerdrill instance with specified `apiKey` and `template`. Use of
`new` keyword is optional.

```js
var messageOne = new Powerdrill('123', 'some-template');
var messageTwo = Powerdrill('123', 'another-template');
```

#### message.apiKey(key)

Sets the apiKey to `key`. Ret

```js
message.apiKey('123');
```

#### message.template(template)

Sets the template to `template`. This should match the `template-slug` you are
using in Mandrill's templates.

```js
message.template('simple-template');
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
`recipientVariables` and `recipientMetadata` are both optional. See below for
other ways to add.

simple:
```js
message.to('ryan@slingingcode.com');
```

complex:
```js
message.to('Ryan Schmukler <ryan@slingingcode.com>', {name: 'Ryan'}, {uid: 123})
```

### message.send(done)

Sends the message as configured. Typically the last command called. Calls
`done(resp)` where `resp` is the body returned from the mandrill API.

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

## Planned features

These are some ideas that I have to extend the library. Please open issues to
suggest new features, or to let me know that you'd like a feature on this list:

- Support for HTML/text emails (without templates on mandrill)
- More Options (`trackClicks`, `trackOpens` etc)
