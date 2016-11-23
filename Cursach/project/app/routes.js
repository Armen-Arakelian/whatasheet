var Article = require('../app/models/article');
var User = require('../app/models/user');
module.exports = function(app, passport) {


    app.get('/limitedAccess', isLoggedIn, function(req, res) {
        res.render("limitedAccess");
    });
    app.get('/deleteUser', isAdmin, isLoggedIn, function(req, res) {
        res.render("deleteUser");
    });

    app.get('/deleteArticle', isAdmin, isLoggedIn, function(req, res) {
        res.render("deleteArticle");
    });

    app.get('/createArticle', isLoggedIn, function(req, res) {
        res.render("createArticle");
    });

    app.get('/notLoggedIn', function(req, res) {
        res.render("notLoggedIn");
    });

    app.get('/articles', function(req, res) {
        return Article.find(function (err, articles) {
            if (!err) {
                return res.send(articles);
            } else {
                res.statusCode = 500;
                //log.error('Internal error(%d): %s',res.statusCode,err.message);
                return res.send({ error: 'Server error' });
            }
        });
    });

    app.post('/createArticle', function(req, res) {
        var article = new Article({
            title: req.body.title,
            text: req.body.text
        });

        article.save(function (err) {
            if (!err) {
                //log.info("article created");
                return res.send({ status: 'OK', article:article });
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
                //log.error('Internal error(%d): %s',res.statusCode,err.message);
            }
        });
    });

    app.get('/', function(req, res) {
        res.render('index.ejs');
    });


    app.get('/login', function(req, res) {


        res.render('login.ejs', { message: req.flash('loginMessage') });
    });
    app.get('/admin', isLoggedIn, isAdmin, function(req, res) {
        res.render('admin.ejs');
    });

    app.post('/login', passport.authenticate('local-login', {
        successRedirect : '/profile',
        failureRedirect : '/login',
        failureFlash : true
    }));


    app.get('/signup', function(req, res) {


        res.render('signup.ejs', { message: req.flash('signupMessage') });
    });


    app.post('/signup', passport.authenticate('local-signup', {
        successRedirect : '/profile',
        failureRedirect : '/signup',
        failureFlash : true
    }));

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile.ejs', {
            user : req.user
        });
    });


    app.get('/logout', function(req, res) {
        req.logout();
        res.redirect('/');
    });
    app.post('/deleteUser', isLoggedIn, isAdmin, function (req, res) {
        if(User.find({'local.email': req.body.email})) {
            User.remove({'local.email': req.body.email}, function (err) {
                if (!err) {
                    console.log("deleted");
                    res.redirect("/");
                }
                else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
            });
        }
        else{
        }
    })

    app.post('/deleteArticle', isLoggedIn, isAdmin, function (req, res) {
        if(Article.find({'title': req.body.title})) {
            Article.remove({'title': req.body.title}, function (err) {
                if (!err) {
                    console.log("deleted");
                    res.redirect("/");
                }
                else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
            });
        }
        else{
        }
    })
};

function isLoggedIn(req, res, next, redirect) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/' + redirect);
}

var isAdmin = function (req, res, next) {
    var currentUserId = req.user ? req.user.id : false;
    if(!currentUserId){
        res.redirect('/');
    }
    User.findById(currentUserId,function (err, user) {
        if(!user || user.local.role !== "admin"){
            res.redirect('/limitedAccess');
        }else{
            next();
        }
    })
}