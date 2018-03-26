var mongoose = require("mongoose");


var historySchema = new mongoose.Schema( {
    username: String,
    emailUser: String,
    name: String,
    value: String,
    buydate: {
        type: Date,
        default: Date.now
    },
    remainbalance: Number
});

var buyHistory = mongoose.model("history", historySchema);

module.exports = buyHistory;