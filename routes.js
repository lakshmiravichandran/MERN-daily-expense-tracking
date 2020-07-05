// Route handlers
const express = require("express");
const router = express.Router();
const passport = require("passport");
const mongoose = require("mongoose");
var nodemailer = require("nodemailer");
const { check, validationResult } = require("express-validator");

// Soundarya - data models
// import data models
const User = require("./models/user");
const Expense = require("./models/expense");
const Admin = require("./models/admin");
var passwordValidator = require("password-validator");

// Make user information available to templates
router.use(function (req, res,next) {
  res.locals.currentUser = req.user;
  res.locals.errors = req.flash("error");
  res.locals.infos = req.flash("info");
  next();
});

// Sayantani - EMAIL alerts
//EMAIL configurations
var transporter = nodemailer.createTransport({
  host: "smtp-mail.outlook.com", // hostname
  secureConnection: false, // TLS requires secureConnection to be false
  port: 587, // port for secure SMTP
  tls: {
      ciphers: "SSLv3"
  },
  //service:'outlook',
  auth: {
      user: process.env.OUTLOOK_USERNAME,
      pass: process.env.OUTLOOK_PASSWORD
  }
});

//ADMIN routes
// Route to admin login
router.get("/loginadmin", function (req, res) {
  res.render("login_admin", { title: "Admin login" });
});

// Soundarya - Admin Backend
// Admin login
router.post(
  "/login_admin",
  passport.authenticate("adminlogin", {
      successRedirect: "/admin",
      failureRedirect: "/loginadmin",
      failureFlash: true
  })
);

// Route to logout admin
router.get("/logoutadmin", function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("/loginadmin");
  res.clearCookie("hello-express");
});

// Route to admin panel
router.get("/admin", function (req, res) {
  User.find({}, function (err, user_list) {
      // console.log(user_list);
      res.render("index_admin", { users: user_list, title: "Admin", message: "Hi, Admin" });
  });
});

// Sayantani - Promotion email alerts
//Admin send promotion email to users
router.get("/sendpromo", function (req, res) {
  User.find({}, function (err, user) {
      var myRecipients = [];
      for (var i = 0; i < user.length; i++) {
          myRecipients.push(user[i].email);
      }

      // define promotion contents here
      var mailOptions = {
          from: process.env.OUTLOOK_USERNAME,
          to: myRecipients,
          subject: "Monthly Bills Promotion ",
          text: "This is a Promotion Email from the admin"
      };

      transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
              return console.log(error);
          }
          // console.log("Promo message sent to : " + info.response);
      });
      res.render("index_admin", { users: user, title: "Admin", message: "Promotions sent to all users" });
      // res.redirect("/admin");
  });
});

// Soundarya - Admin signup
// Add admin account
// Only for Postman
router.post("/addadmin",
  function (req, res, next) {
      var username = req.body.username;
      var password = req.body.password;
      Admin.findOne({ username: username }, function (err, admin) {
          //User.findOne({ username: username},function (err, user) {
          if (err) {
              // console.log("error");
              return next(err);
          }
          if (admin) {
              req.flash("error", "User already exists");
              return res.redirect("/signup");
          }
          var newAdmin = new Admin({
              username: username,
              password: password,

          });
          // console.log(username);
          // console.log(password);
          newAdmin.save(next);
      });
  },
  passport.authenticate("adminlogin", {
      successRedirect: "/",
      failureRedirect: "signup",
      failureFlash: true
  })
);


//end of ADMIN routes


//USER routes

// Soundarya - Password Validation
// Password restriction schema
var schema = new passwordValidator();
// Add properties to it
schema
  .is().min(8) // Minimum length 8
  .is().max(100) // Maximum length 100
  .has().uppercase() // Must have uppercase letters
  .has().lowercase() // Must have lowercase letters
  .has().digits() // Must have digits
  .has().not().spaces() // Should not have spaces
  .is().not().oneOf(["Passw0rd", "Password123"]);

// Route to homepage
router.get("/", function (req, res) {
  // RETREIVE all users
  User.find({}, function (err, user_list) {
    //res.json(user_list);
    res.render("index", { users: user_list, title: "Home" });
  });
});

// Route to signup page
router.get("/signup", function (req, res) {
  res.render("signup", { title: "Sign up" });
});



// Soundarya - Route to User signup and validation checks
router.post("/signup", function (req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var email = req.body.email;
  var limit = req.body.limit;

  // check validation of password
  if (!schema.validate(password)) {
    req.flash(
      "error",
      "Password should be combinated by at least one uppercase ,one lower case, and one digit, with minimum of 8 characters, should not have spaces and should not have 'Passw0rd', 'Password123'"
    );
    return res.redirect("/signup");
  }
  // check pwd confirmation
  if (password !== req.body.password_cfm) {
    req.flash("error", "Confirm password does not match password");
    return res.redirect("/signup");
  }
  // check if existing user or email
  User.findOne({ $or: [{ username: username }, { email: email }] }, function (
    err,
    user
  ) {
    if (err) {
      return next(err);
    }
    if (user) {
      req.flash("error", "User/Email already exists");
      return res.redirect("/signup");
    }
    var newUser = new User({
      username: username,
      password: password,
      email: email,
      limit: limit
    });
    // console.log(username);
    newUser.save(next);
  });
},
  passport.authenticate("login", {
    successRedirect: "/",
    failureRedirect: "signup",
    failureFlash: true
  })
);

// Soundarya - Route to login page
router.get("/login", function (req, res) {
  res.render("login", { title: "Login" });
});

router.post(
  "/login",
  passport.authenticate("login", {
    successRedirect: "/manage",
    failureRedirect: "/login",
    failureFlash: true
  })
);

// Soundarya - Route to logout
router.get("/logout", checkAuthentication, function (req, res) {
  req.logout();
  req.session.destroy();
  res.redirect("/");
  res.clearCookie("hello-express");
});


// Lakshmi - Statistics backend

// Route to manage expenses page
router.get("/manage", checkAuthentication, function (req, res) {
  // Statistics using aggregate query 
  Expense.aggregate([
    {
      $match: {
        User: req.user._id
      }
    },
    {
      $project: {
        month: { $month: "$created" },
        year: { $year: "$created" },
        Category: 1,
        Amount: 1
      }
    },
    {
      $group: {
        _id: { month: "$month", year: "$year", category: "$Category" },
        total: { $sum: "$Amount" }
      }
    }
  ])
    //.then(expenses => res.json(expenses));
    .then(expenses => {
      res.render("manage_expenses", { expenses, title: "My Expense" });
    });

  /*Expense.find({ User: req.user })
  .then(expenses => { res.render("statistics", { expenses, title:'Expense Report Charts' }) }) // temp
  .catch(next);*/

  // res.render("manage_expenses", { title: 'My Expense' });
});

// Soundarya - Route to post expense
router.post("/postexpense", checkAuthentication, function (req, res, next) {
  var amount = req.body.amount;
  var category = req.body.category;
  var note = req.body.note;
  var user = req.user;

  if (user == null) {
    // res.status(400).send('Sign up please!');
    req.flash("error", "Please login.");
    res.redirect("/login");
  }

  var newexpense = new Expense({
    Amount: amount,
    Category: category,
    User: user,
    Note: note
  });
  // console.log(amount);

  newexpense.save(next);
  
  // Sayantani - Budget limit exceed email alert

  var totExpense = 0;

  Expense.find({ User: req.user }, function (err, expense) {
    if (expense) {
      // console.log(expense);
      for (var i = 0; i < expense.length; i++) {
        var exp = expense[i];
        var eachAmount = exp.Amount;
        totExpense = totExpense + eachAmount;
      }

      //res.json(expense);
      //console.log(totExpense);
      if (req.user.limit < totExpense) {
        //console.log("if is working");
        var mailOptions = {
          from: process.env.OUTLOOK_USERNAME,
          to: user.email,
          subject: "EXPENDITURE ALERT ",
          text: "You have crossed your expenditure limit"
        };

        transporter.sendMail(mailOptions, function (error, info) {
          if (error) {
            return console.log("Email error", error);
          }
          console.log("Message sent: " + info.response);
        });
      }
    }
  });

  Expense.find({ User: req.user })
    .then(expenses => {console.log("found user expenses", expenses); res.render("add_expense_result", {newexpense,expenses,title: "View Expense"});
    }) // temp
    .catch(next);

  //res.render("view_expenses", { newexpense})
});

// Soundarya - edit user limit
router.post("/editlimit", checkAuthentication, function (req, res, next) {
  var username = req.user.username;
  var limit = req.body.limit;

  User.findOne({ username: username }, function (err, user) {
    if (err) {
      return next(err);
    }
    user.limit = limit;
    user.save();
    req.flash("info", "User limit has been updated to: ", limit);
    // res.render("manage_expenses", {title: 'My Expense'});
    res.redirect("/manage");
  });
});

// Lakshmi - get monthly view
router.get("/monthlyview", checkAuthentication, function (req, res) {
  res.render("manage_expenses");
});

// Lakshmi - Route to post monthly view
router.post("/postmonthlyview", checkAuthentication, function (req, res, next) {
  var date = req.body.date;
  var user = req.user;

  if (user == null) {
    // res.status(400).send('Sign up please!');
    req.flash("error", "Please login");
    res.redirect("/login");
  }

  Expense.find({ User: req.user })
    //.then(expenses => res.json(expenses));
    .then(expenses => {
      res.render("monthly_views_display", {
        date,
        expenses,
        title: "Monthly Expense View"
      });
    });
  //.catch(next);
});

// //get dates and category for search
// router.get("/search", function (req, res) {
//   res.render("search");
// });

// Lakshmi - Route to search and return expenses
router.post("/postsearchview", checkAuthentication, function (req, res, next) {
  var start_date = req.body.startDate;
  var end_date = req.body.endDate;
  var category = req.body.category;
  var user = req.user;

  if (user == null) {
    // res.status(400).send('Sign up please!');
    req.flash("error", "Please login");
    res.redirect("/login");
  }

  if (category == "ALL") {
    Expense.find({
      User: req.user
    })
      //.then(expenses => res.json(expenses, start_date, end_date));
      .then(expenses => { res.render("search_view_display", { expenses, start_date, end_date, title: 'Search Result' }) })
    //.catch(next);
  }
  else {
    Expense.find({
      User: req.user,
      //created: { $gt: start_date, $lte: end_date },
      Category: category
    })
      //.then(expenses => res.json(expenses, start_date, end_date));
      .then(expenses => { res.render("search_view_display", { expenses, start_date, end_date, title: 'Search Result' }) })
    //.catch(next);
  }
});


// Soundarya - authentication middleware
function checkAuthentication(req, res, next) {
  if (req.isAuthenticated()) {
    next();
  } else {
    req.flash("info", "You must be logged in to see this page");
    res.redirect("/login");
  }
};

// Export
module.exports = router;




// Initial Code - for reference

// Profile page

// router.get("/users/:username", function (req, res, next) {
//   User.findOne({ username: req.params.username }, function (err, user) {
//     if (err) { return next(err); }
//     if (!user) { return next(404); }
//     res.render("profile", { user: user });
//   });
// });

// Route to profile page
// router.get("/edit", checkAuthentication, function (req, res) {
//   res.render("edit");
// });

// Edit user limit
// router.post("/edit", checkAuthentication, function (req, res, next) {
//   req.user.displayName = req.body.displayname;
//   req.user.bio = req.body.bio;
//   req.user.save(function (err) {
//     if (err) {
//       next(err);
//       return;
//     }
//     req.flash("info", "Profile Updated!");
//     res.redirect("/edit");
//   });
// });

//Route to statistics
//router.get("/statistics", function (req, res) {//Expense.aggregate([
//  {
//  $match: {
//     User: req.user._id
//    User : req.user
//  }
// },
//  {
//   $project: {
//    month: { $month: "$created" },
//    year: { $year: "$created" },
//    Category: 1,
//    Amount: 1
//  }
//  },
//   {
//   $group: {
//     _id: { month: "$month", year: "$year", category: "$Category" },
//    total: { $sum: "$Amount" }
//   }
//   }
//  ])
//.then(expenses => res.json(expenses));
//  .then(expenses => { res.render("statistics", { expenses, title: 'Expense Report Charts' }) });

/*Expense.find({ User: req.user })
.then(expenses => { res.render("statistics", { expenses, title:'Expense Report Charts' }) }) // temp
.catch(next);*/
//});

// Get limit edit form
// router.get("/editlimit", function (req, res) {
//   res.render("edit_limit");
// });


// validation to check if username or email already occurs
// validation to check if password and confirm password is same.
// validation to check if password is Password should be combination of one uppercase , one lower case, one digit and minimum 8 characters
// Route to signup
// router.post("/signup", check("password_cfm").custom((value, { req, res }) => {

//   if (value !== req.body.password) {
//     req.flash("error", "Confirm password does not match password");
//     return res.redirect("/signup");
//   }
//   // success
//   return true;
// }), function (req, res, next) {
//     var username = req.body.username;
//     var password = req.body.password;
//     var email = req.body.email;
//     var limit = req.body.limit;
//     if (!schema.validate(password)) {
//       req.flash(
//         "error",
//         "Password should be combinated by at least one uppercase ,one lower case, and one digit, with minimum of 8 characters, should not have spaces and should not have 'Passw0rd', 'Password123'"
//       );
//       return res.redirect("/signup");
//     }

//     User.findOne({ $or: [{ username: username }, { email: email }] }, function (
//       err,
//       user
//     ) {
//       //User.findOne({ username: username},function (err, user) {
//       if (err) {
//         return next(err);
//       }
//       if (user) {
//         req.flash("error", "User/Email already exists");
//         return res.redirect("/signup");
//       }
//       var newUser = new User({
//         username: username,
//         password: password,
//         email: email,
//         limit: limit
//       });
//       // console.log(username);
//       newUser.save(next);
//     });
//   },
//   passport.authenticate("login", {
//     successRedirect: "/",
//     failureRedirect: "signup",
//     failureFlash: true
//   })
// );