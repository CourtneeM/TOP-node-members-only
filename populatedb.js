#! /usr/bin/env node

console.log('This script populates some test categories and items to your database. Specified database as argument - e.g.: populatedb mongodb+srv://cooluser:coolpassword@cluster0.a9azn.mongodb.net/inventory_application?retryWrites=true');

// Get arguments passed on command line
const userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
const async = require('async');
const Member = require('./models/member');
const Message = require('./models/message');

const mongoose = require('mongoose');
const mongoDB = userArgs[0];
mongoose.connect(mongoDB, {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

const members = []
const messages = []

function memberCreate(first_name, last_name, username, password, membership_status, is_admin, cb) {
  const member = new Member({ first_name, last_name, username, password, membership_status, is_admin });

  member.save(function (err) {
    if (err) {
      console.log('ERROR CREATING MEMBER: ' + member);
      cb(err, null);
      return;
    }

    console.log('New Member:' + member);
    members.push(member);
    cb(null, member);
  });
}

function messageCreate(title, text, author, cb) {
  const message = new Message({ title, text, author });
  console.log(message);

  message.save(function (err) {
    if (err) {
      console.log('ERROR CREATING MESSAGE: ' + message);
      cb(err, null);
      return;
    }

    console.log('New Message:' + message);
    messages.push(message);
    cb(null, message);
  });
}

function createMembers(cb) {
    async.series([
      function(callback) {
        memberCreate('Rhys', 'Delmonte', 'rhysdelmonte@gmail.com', 'password', true, true, callback);
      },
      function(callback) {
        memberCreate('Becca', 'Jones', 'beccajones@gmail.com', 'password', true, false, callback);
      },
      function(callback) {
        memberCreate('Lilly', 'Vancouver', 'lillyvancouver@gmail.com', 'password', false, false, callback);
      },
      function(callback) {
        memberCreate('Joe', 'Stonewall', 'joestonewall@gmail.com', 'password', true, false, callback);
      },
      function(callback) {
        memberCreate('Mac', 'Stonewall', 'macstonewall@gmail.com', 'password', true, false, callback);
      },
    ],
    // optional callback
  cb);
}

function createMessages(cb) {
  async.parallel([
    function(callback) {
      messageCreate('title 1', 'text 1', members[0], callback);
    },
    function(callback) {
      messageCreate('title 2', 'text 2', members[1], callback);
    },
    function(callback) {
      messageCreate('title 3', 'text 3', members[3], callback);
    },
    function(callback) {
      messageCreate('title 4', 'text 4', members[3], callback);
    },
    function(callback) {
      messageCreate('title 5', 'text 5', members[1], callback);
    },
    function(callback) {
      messageCreate('title 6', 'text 6', members[4], callback);
    },
    function(callback) {
      messageCreate('title 7', 'text 7', members[4], callback);
    },
    function(callback) {
      messageCreate('title 8', 'text 8', members[0], callback);
    },
    function(callback) {
      messageCreate('title 9', 'text 9', members[1], callback);
    }
  ],
  // optional callback
  cb);
}

async.series(
  [
    createMembers,
    createMessages,
  ],

  // Optional callback
  function(err, results) {
    if (err) {
      console.log('FINAL ERR: '+ err);
    }

    console.log(members);

    // All done, disconnect from database
    mongoose.connection.close();
  }
);
