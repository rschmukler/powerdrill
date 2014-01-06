var Message =require('./lib/message.js');

var builder = function(apiKey, interceptor) {
  var buildMessage = function(templateName, interceptor) {
    var message = new Message(apiKey, templateName);
    if(buildMessage.interceptor) {
      message.intercept(buildMessage.interceptor);
    }
    return message;
  };
  buildMessage.interceptor = interceptor;
  return buildMessage;
};

builder.Message = Message;

module.exports = builder;
