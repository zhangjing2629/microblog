var express = require('express');
var router = express.Router();
var crypto = require('crypto');
var app = express();
var User = require('../module/user');
var Post = require('../module/post');

/* GET home page. */
router.get('/', function(req, res, next) {
    Post.get(null, function(err, posts) {
          if (err) {
          	posts = [];
          }
          res.render('index', {
          	title: 'microblog',
          	posts: posts,
          	user : req.session.user,
              success : req.flash('success').toString(),
              error : req.flash('error').toString()
          });
    });
});



router.get('/blog', function(req, res) {
    Post.get(null, function(err, posts) {
        if (err) {
            posts = [];
        }
        res.render('index', {
            title: 'Blog Main Page',
            posts: posts,
            user : req.session.user,
                success : req.flash('success').toString(),
                error : req.flash('error').toString()
        });
    });
    res.render('index', { title: 'MainPage' });

});

router.post('/post', checkLogin);
router.post('/post', function(req, res) {
    var currentUser = req.session.user;
    var post = new Post(currentUser.name, req.body.post);
    post.save(function(err) {
        if (err) {
            req.flash('error', err);
            return res.redirect('/');
        }
        req.flash('success', 'Release Success');
        res.redirect('/');
    });
});


router.get('/u/:user', function(req, res) {
    User.get(req.params.user, function(err, user) {
        if (!user) {
            req.flash('error', 'User not exist');
            return res.redirect('/blog');
        }
        Post.get(user.name, function(err, posts) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/blog');
            }
            res.render('user', {
                title: user.name,
                posts: posts,
            });
        });
    });
});


router.get('/reg', function(req, res, next) {
    res.render('reg', {title: 'User Register'});
});

router.post('/reg', checkNotLogin);
router.post('/reg', function(req, res, next) {
    if (req.body.passwordrepeat != req.body.password) {
        req.flash('error', 'Two of password unequal');
        return res.redirect('/reg');
    }

    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');
    var newUser = new User ({
        name: req.body.username,
        password: password,
    });

    User.get(newUser.name, function(err, user) {
        if (user)
            err = 'Username already exists.';
        if (err) {
            req.flash('error', err.toString());
            return res.redirect('/reg');
        }
        //if not exist, add new user
        newUser.save(function(err) {
            if (err) {
                req.flash('error', err);
                return res.redirect('/reg');
            }
            req.session.user = newUser;
            req.flash('success', 'Reigster Success');
            res.redirect('/');
        });
    });
});


router.get("/login", checkNotLogin);
router.get('/login', function(req, res, next) {
    res.render('login', {title: 'Login'});
});

router.post('/login', checkNotLogin);
router.post('/login', function(req, res, next) {
    var md5 = crypto.createHash('md5');
    var password = md5.update(req.body.password).digest('base64');

    User.get(req.body.username, function(err, user) {
      if (!user) {
          req.flash('error', 'user not exist');
          return res.redirect('/login');
      }

      if (user.password != password) {
           req.flash('error', 'username or password error');
           return res.redirect('/login');
      }
      req.session.user = user;
      req.flash('success', req.session.user.name + 'Login Success');
      res.redirect('/');
    });
});


router.get('/logout', checkLogin);
router.get('/logout', function(req, res, next) {
    req.session.user = null;
    req.flash('success', 'Quit Sucess');
    return res.redirect('/');
});


function checkNotLogin(req, res, next) {
  if (req.session.user) {
    req.flash('error', 'User already login');
    return res.redirect('/');
  }
  next();
}
function checkLogin(req, res, next) {
  if (!req.session.user) {
    req.flash('error', 'User not login');
    return res.redirect('/login');
  }
  next();
}

module.exports = router;
