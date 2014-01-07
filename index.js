var Message =require('./lib/message.js');

var builder = function(apiKey, interceptor) {
  var buildMessage = function(templateName, interceptor) {
    var message = new Message(apiKey, templateName);
    if(buildMessage.interceptor) {
      message.intercept(buildMessage.interceptor);
    }
    if(buildMessage.skip) {
      message.skip();
    }
    return message;
  };
  buildMessage.interceptor = interceptor;
  buildMessage.skip = false;
  return buildMessage;
};

builder.Message = Message;

module.exports = builder;
