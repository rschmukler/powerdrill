var Message =require('./lib/message.js');

var builder = function(apiKey) {
  return function buildMessage(templateName) {
    return new Message(apiKey, templateName);
  };
};

builder.Message = Message;

module.exports = builder;
