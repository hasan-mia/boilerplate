const Pusher = require("pusher");

const pusher = new Pusher({
    appId: "puser_appId",
    key: "puser_key",
    secret: "pusher_secret",
    cluster: "ap4",
    useTLS: true
});

// trigger message
function sendMessage(channel, event, data){
    pusher.trigger(channel, event, {
        message: data
    });
}

module.exports = {
    sendMessage,
}