var dbname = require('./db');
var mongoose = require('mongoose');
var express = require('express');
var async = require('async');

var app = express();
var apirouter = express.Router();

mongoose.connect('mongodb://localhost/' + dbname);

var models = require('./model'),
  Gift = models.Gift,
  User = models.User,
  Winner = models.Winner;

function GiftError(msg) {
  var error = new Error(msg);
  error.msg = msg;
  return error;
}

var shakeQueue = async.queue(function(callback) {
  async.waterfall([
    function(callback) {
      Gift.find({}, function(e, gifts) {
        if (e) return callback(e);

        var result = 0;
        var pos = Math.random();

        console.log(pos);

        for (var i = 0; i < gifts.length; i++) {
          var gift = gifts[i];
          if (gift.amount === 0) {
            continue;
          }

          result += gifts[i].percent;
          if (result > pos) {
            console.log("you got a gift:");
            return callback(null, gifts[i]);
          }
        }

        callback(null, null);
      });
    }
  ], function(e, gift) {
    if (e) {
      return callback(e);
    }

    Winner.create({
      gift: gift.id,
      date: new Date()
    }, function(e, winner) {
      if (e) {
        return callback(e);
      }

      gift.amount = Math.max(gift.amount - 1, 0);
      if (gift.amount === 0) gift.percent = 0;

      gift.save(function(e) {
        if (e) {
          return callback(e);
        }

        callback(null, {
          gift: gift,
          winner: winner
        });
      });
    });
  });
}, 1);

app.post('/api/lottery', function(req, res) {
  shakeQueue.push({}, function(e, data) {
    if (e) {
      return res.json({
        code: 1001
      });
    } else {
      return res.json({
        code: 0,
        gift: data.gift ? data.gift.gtype : null,
        winner: data.winner._id
      });
    }
  });
});

var port = 9876;
app.listen(port, function() {
  console.log("listening on:" + port);
});