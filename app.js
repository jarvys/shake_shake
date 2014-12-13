var dbname = require('./db');
var mongoose = require('mongoose');
var express = require('express');
var async = require('async');

var app = express();
var apirouter = express.Router();

mongoose.connect('mongodb://localhost/'+dbname);

var models = require('./model'),
    Gift = models.Gift,
    User = models.User,
    Winner = models.Winner;

function GiftError(msg){
    var error = new Error(msg);
    error.msg = msg;
    return error;
}

var shakeQueue = async.queue(function(callback){
    async.waterfall([ 
          function(callback){
                Gift.find({},function(e,gifts){
                    if(e) return callback(e);
                    
                    var result = 0;
                    var pos = Math.random();

                    console.log(pos);
               
                    for(var i = 0; i < gifts.length; i++){
                        result+= gifts[i].percent;
                        if(pos<result && result > 0){
                            callback(null, gifts[i]);
                            console.log("you got a gift:");
                            i=gifts.length;
                        }
                    }
                });
             }
          ],function(e,gift){
                if(e){
                  callback(e); 
                }else {
                   Winner.create({
                        gift: gift.id,
                        date: new Date()
                   },function(e){
                            gift.amount = Math.max(gift.amount - 1,0);
                            if(gift.amount === 0 ) gift.percent = 0;

                            gift.save(function(e){
                               console.log(gift);
                            });
                        });    
                }
         });
}, 1);

app.get('/',function(req,res){
   shakeQueue.push({},
   function(e){
       console.log(e);
   });
});

var port = 9876;
app.listen(port , function(){
    console.log("listening on:"+port);
});

