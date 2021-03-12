"use strict";

var router = require('express').Router();

var _require = require('../../models'),
    User = _require.User,
    Post = _require.Post,
    Comment = _require.Comment,
    Vote = _require.Vote; // get all users


router.get('/', function (req, res) {
  User.findAll({
    attributes: {
      exclude: ['password']
    }
  }).then(function (dbUserData) {
    return res.json(dbUserData);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json(err);
  });
});
router.get('/:id', function (req, res) {
  User.findOne({
    attributes: {
      exclude: ['password']
    },
    where: {
      id: req.params.id
    },
    include: [{
      model: Post,
      attributes: ['id', 'title', 'post_url', 'created_at']
    }, {
      model: Comment,
      attributes: ['id', 'comment_text', 'created_at'],
      include: {
        model: Post,
        attributes: ['title']
      }
    }, {
      model: Post,
      attributes: ['title'],
      through: Vote,
      as: 'voted_posts'
    }]
  }).then(function (dbUserData) {
    if (!dbUserData) {
      res.status(404).json({
        message: 'No user found with this id'
      });
      return;
    }

    res.json(dbUserData);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json(err);
  });
});
router.post('/', function (req, res) {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  User.create({
    username: req.body.username,
    email: req.body.email,
    password: req.body.password
  }).then(function (dbUserData) {
    req.session.save(function () {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json(dbUserData);
    });
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json(err);
  });
});
router.post('/login', function (req, res) {
  // expects {email: 'lernantino@gmail.com', password: 'password1234'}
  User.findOne({
    where: {
      email: req.body.email
    }
  }).then(function (dbUserData) {
    if (!dbUserData) {
      res.status(400).json({
        message: 'No user with that email address!'
      });
      return;
    }

    var validPassword = dbUserData.checkPassword(req.body.password);

    if (!validPassword) {
      res.status(400).json({
        message: 'Incorrect password!'
      });
      return;
    }

    req.session.save(function () {
      req.session.user_id = dbUserData.id;
      req.session.username = dbUserData.username;
      req.session.loggedIn = true;
      res.json({
        user: dbUserData,
        message: 'You are now logged in!'
      });
    });
  });
});
router.post('/logout', function (req, res) {
  if (req.session.loggedIn) {
    req.session.destroy(function () {
      res.status(204).end();
    });
  } else {
    res.status(404).end();
  }
});
router.put('/:id', function (req, res) {
  // expects {username: 'Lernantino', email: 'lernantino@gmail.com', password: 'password1234'}
  // pass in req.body instead to only update what's passed through
  User.update(req.body, {
    individualHooks: true,
    where: {
      id: req.params.id
    }
  }).then(function (dbUserData) {
    if (!dbUserData) {
      res.status(404).json({
        message: 'No user found with this id'
      });
      return;
    }

    res.json(dbUserData);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json(err);
  });
});
router["delete"]('/:id', function (req, res) {
  User.destroy({
    where: {
      id: req.params.id
    }
  }).then(function (dbUserData) {
    if (!dbUserData) {
      res.status(404).json({
        message: 'No user found with this id'
      });
      return;
    }

    res.json(dbUserData);
  })["catch"](function (err) {
    console.log(err);
    res.status(500).json(err);
  });
});
module.exports = router;