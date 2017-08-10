module.exports = function WindowMessaging() {
   this.name = 'WindowMessaging';
   this.eventType = ''; // Define the data
   this.metaData = {
        messagingProtocol: 'eventEmitter',
        src: {
            windowName: util.window.getName(), // window name
            moduleName: null,//'StatusPanel'
        },
        dest: {
            name: null, //  window name : 'V2'
            channel : null, //'channelName' namespace.channel.V2
        }
    };
    this.info = {};  // Actual Message
}