const Member = require("../models/member");
const Message = require("../models/message");

const async = require("async");
const { body, validationResult } = require('express-validator');

exports.index = (req, res) => {
  Member.find({membership_status: true})
    .sort({ last_name: 1 })
    .exec(function (err, members) {
      if (err) {
        return next(err);
      }

      //Successful, so render
      res.render("members_list", {
        title: "Members",
        members,
      });
  });
};

exports.member_get = function (req, res, next) {
  async.parallel(
    {
      member(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("member_profile", {
        title: `${results.member.first_name} ${results.member.last_name}`,
        member: results.member,
        listType: 'member',
      });
    }
  );
}

exports.member_update_get = function (req, res, next) {
  async.parallel(
    {
      member(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("member_update", {
        title: `Update ${results.member.first_name} ${results.member.last_name}`,
        member: results.member,
        listType: 'member',
      });
    }
  );
}
exports.member_update_post = [
  // Validate and sanitize fields.
  body("firstName", "First name must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("lastName", "Last name must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("username", "Username must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a Member object.
    const member = new Member({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      membership_status: req.body.membershipStatus,
      is_admin: req.body.isAdmin,
      _id: req.params.id, //This is required, or a new ID will be assigned!
    });

    if (!errors.isEmpty()) {
      // There are errors. Render form again with sanitized values/error messages.

      async.parallel(
        {
          members(callback) {
            Member.find(callback);
          },
        },
        (err, results) => {
          if (err) {
            return next(err);
          }

          res.render("member_update", {
            title: `Update ${member.first_name} ${member.last_name}`,
            member,
            listType: 'member',
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Member.findOneAndUpdate({_id: req.params.id}, member, {}, (err, themember) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new member record.
      res.redirect(`/member/${req.params.id}`);
    });
  },
];

exports.member_delete_get = function (req, res, next) {
  async.parallel(
    {
      member(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.member == null) {
        // No results.
        res.redirect("/members");
      }
      // Successful, so render.
      res.render("member_delete", {
        title: `Delete ${results.member.first_name} ${results.member.last_name}`,
        member: results.member,
        listType: 'member',
      });
    }
  );
}
exports.member_delete_post = function (req, res, next) {
  async.parallel(
    {
      member(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      // Success
      // Delete object and redirect to the list of categories.

      Member.deleteOne(results.member, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to category list
        res.redirect("/members");
      });
    }
  );
}
