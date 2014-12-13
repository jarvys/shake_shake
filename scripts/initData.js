var mongoose = require("mongoose");
var dbname = require("../db");
var async = require("async");
var model = require("../model");

var Gift = model.Gift;

mongoose.connect('mongodb://localhost/'+dbname);

async.each(
    [
        {
            gname: '免费车票',
            gtype: '001',
            percent: 0.5,
            amount: 10
        },
        {
            gname: '演唱会门票',
            gtype: '002',
            percent: 0.5,
            amount: 10
        }
    ],
    function(gift, callback){
        Gift.create(gift, callback);
    },
    function(err){
        if(err) return "";
        console.log("done");
        return mongoose.connection.close();
    }
);
