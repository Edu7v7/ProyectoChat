
var mongoose = require('mongoose');
var {Schema} = mongoose;

var chatSchema = new Schema({
    nick: String,
    msg: String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('chat', chatSchema);