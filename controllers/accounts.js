const passport = require('passport');
const bcrypt = require('bcrypt');
const async = require("async");
const { body, validationResult } = require('express-validator');

const Member = require("../models/member");

exports.index = (req, res) => {
  Member.find({membership_status: false})
    .sort({ last_name: 1 })
    .exec(function (err, accounts) {
      if (err) {
        return next(err);
      }

      //Successful, so render
      res.render("members_list", {
        title: "Accounts",
        members: accounts,
      });
  });
};

exports.log_in_get = function (req, res, next) {
  async.parallel(
    {
      accounts(callback) {
        Member.find(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("log_in", {
        title: `Log In`,
        accounts: results.accounts,
      });
    }
  );
}

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log-in",
  failureFlash: true
});

exports.log_out_post = function (req, res) {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect("/");
  });
}

exports.account_get = function (req, res, next) {
  async.parallel(
    {
      account(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      res.render("member_profile", {
        title: `${results.account.first_name} ${results.account.last_name}`,
        member: results.account,
        listType: 'account',
      });
    }
  );
}

exports.account_create_get = function (req, res, next) {
    async.parallel(
      {
        accounts(callback) {
          Member.find(callback);
        },
      },
      (err, results) => {

        if (err) {
          return next(err);
        }
        res.render("account_form", {
          title: "Create Account",
          accounts: results.accounts,
        });
      }
    );
  }
exports.account_create_post = [
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
  body("username")
    .trim()
    .custom((val, {req}) => {
      return new Promise((res, rej) => {
        Member.findOne({username: req.body.username}, function(err, username) {
            if (err) {
              rej(new Error('Server Error'));
            }
            if (Boolean(username)) {
              rej(new Error(`An account for ${req.body.username} already exists.`));
            }

            res(true);
        });
      });
    }),
  body("password", "Password must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),
  body("confirmPassword", "Confirm password must not be empty.")
  .trim()
  .isLength({ min: 1 })
  .escape(),

  // Process request after validation and sanitization.
  async (req, res, next) => {
    // Extract the validation errors from a request.
    const errors = validationResult(req);

    try {
      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      // Create a Member object.
      const account = new Member({
        first_name: req.body.firstName,
        last_name: req.body.lastName,
        username: req.body.username,
        password: hashedPassword,
        membership_status: req.body.memberPassword === process.env.MEMBER_PASSWORD,
        is_admin: false
      });

      if (!errors.isEmpty()) {
        // There are errors. Render form again with sanitized values/error messages.
  
        async.parallel(
          {
            accounts(callback) {
              Member.find({membership_status: false})
                .exec(callback);
            },
          },
          (err, results) => {
            if (err) {
              return next(err);
            }
  
            res.render("account_form", {
              title: "Create Account",
              account,
              errors: errors.array(),
            });
          }
        );
        return;
      }

      // Data from form is valid. Save account.
      account.save((err) => {
        if (err) {
          return next(err);
        }
        // Successful: redirect to new category record.
        res.redirect("/");
      });
    } catch {
      res.redirect('/account/create');
    }
  },
];

exports.account_update_get = function (req, res, next) {
  async.parallel(
    {
      account(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }

      res.render("member_update", {
        title: `Update ${results.account.first_name} ${results.account.last_name}`,
        member: results.account,
        listType: 'account',
      });
    }
  );
}
exports.account_update_post = [
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
    const account = new Member({
      first_name: req.body.firstName,
      last_name: req.body.lastName,
      username: req.body.username,
      membership_status: req.body.memberPassword === process.env.MEMBER_PASSWORD,
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
            title: `Update ${account.first_name} ${account.last_name}`,
            account,
            listType: 'account',
            errors: errors.array(),
          });
        }
      );
      return;
    }

    // Data from form is valid. Update the record.
    Member.findOneAndUpdate({_id: req.params.id}, account, {}, (err, theaccount) => {
      if (err) {
        return next(err);
      }
      // Successful: redirect to new account record.
      res.redirect(`${account.url}`);
    });
  },
];

exports.account_delete_get = function (req, res, next) {
  async.parallel(
    {
      account(callback) {
        Member.findOne({_id: req.params.id})
          .exec(callback);
      },
    },
    (err, results) => {
      if (err) {
        return next(err);
      }
      if (results.account == null) {
        // No results.
        res.redirect("/accounts");
      }
      // Successful, so render.
      res.render("member_delete", {
        title: `Delete ${results.account.first_name} ${results.account.last_name}`,
        member: results.account,
        listType: 'account',
      });
    }
  );
}
exports.account_delete_post = function (req, res, next) {
  async.parallel(
    {
      account(callback) {
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
      Member.deleteOne(results.account, (err) => {
        if (err) {
          return next(err);
        }
        // Success - go to category list
        res.redirect("/accounts");
      });
    }
  );
}
