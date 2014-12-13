var async = require("async");
var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var GiftSchema = Schema({
    gtype: {
        type: Number,
        unique: true
    },
    gname: String,
    percent: Number,
    amount: Number
});

var Gift = mongoose.model('Gift', GiftSchema);

var UserSchema = Schema({
    date: Date
});

var User = mongoose.model('User', UserSchema);

var WinnerSchema = Schema({
    phone: {
        type: String,
        unique: true
    },
    gift: {
        type: Schema.Types.ObjectId,
        ref: 'Gift'
    },
    date: Date
    
});

var Winner = mongoose.model('Winner', WinnerSchema);

module.exports ={
    User: User,
    Gift: Gift,
    Winner: Winner
};
