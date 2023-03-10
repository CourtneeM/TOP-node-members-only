const Message = require("../models/message");
const Member = require("../models/member");

const async = require("async");
const { body, validationResult } = require('express-validator');
const message = require("../models/message");
const member = require("../models/member");

exports.index = (req, res) => {
  Message.find({})
    .sort({ title: 1 })
    .populate('author')
    .exec(function (err, messages) {
      if (err) {
        return next(err);
      }

      //Successful, so render
      res.render("index", { title: "Member Messages", messages: messages });
  });
};

exports.message_create_get = function (req, res, next) {
  async.parallel(
    {
      messages(callback) {
        Message.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("message_form", {
        title: "Create Message",
        messages: results.messages,
      });
    }
  );
}
exports.message_create_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("text", "Message text must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    if (!res.locals.currentUser) res.redirect("/");

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Message object.
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: res.locals.currentUser._id
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel(
        {
          messages(callback) {
            Message.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("message_form", {
            title: "Create Message",
            message,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Save category.
    message.save((err) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to home page.
      res.redirect(`/`);
    });
  },
];

exports.message_edit_get = function (req, res, next) {
  async.parallel(
    {
      message(callback) {
        Message.findOne({_id: req.params.id})
          .populate('author')
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      if (res.locals.currentUser && (results.message.author.username === res.locals.currentUser.username)) {
        res.render("message_form", {
          title: "Edit Message",
          message: results.message,
        });
      } else {
        res.redirect("/");
      }
    }
  );
}
exports.message_edit_post = [
  // Validate and sanitize fields.
  body("title", "Title must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("text", "Message text must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    if (!res.locals.currentUser) res.redirect("/");

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Message object.
    const message = new Message({
      title: req.body.title,
      text: req.body.text,
      author: res.locals.currentUser._id,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel(
        {
          messages(callback) {
            Message.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("message_form", {
            title: "Edit Message",
            message,
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Message.findOneAndUpdate({_id: req.params.id}, message, {}, (err, themessage) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new category record.
      res.redirect("/");
    });
  },
];

exports.message_delete_get = function (req, res, next) {
  async.parallel(
    {
      message(callback) {
        Message.findOne({_id: req.params.id})
        .populate('author')
        .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.message == null) {
        // No results.
        res.redirect("/");
      }

      if (res.locals.currentUser && (results.message.author.username === res.locals.currentUser.username)) {
        // Successful, so render.
        res.render("message_delete", {
          title: `Delete Message`,
          message: results.message,
        });
      } else {
        res.redirect("/");
      }
    }
  );
}
exports.message_delete_post = function (req, res, next) {
  if (!res.locals.currentUser) res.redirect("/");

  async.parallel(
    {
      message(callback) {
        Message.findOne({_id: req.params.id}).exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      
      // Success
      // Delete object and redirect to the list of categories.
      Message.deleteOne(results.message, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to category list
        res.redirect("/");
      });
    }
  );
}
