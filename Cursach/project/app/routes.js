var Idea = require('../app/models/idea');
var User = require('../app/models/user');
module.exports = function(app, passport) {


    app.get('/limitedAccess', isLoggedIn, function(req, res) {
        res.render("limitedAccess");
    });
    app.get('/users', function(req, res) {
        User.find({}, function(err, docs){
            res.render('users', {
                users : docs
            })
        })
    });
    app.get('/deleteUser', isAdmin, isLoggedIn, function(req, res) {
        res.render("deleteUser");
    });

    app.get('/deleteIdea', isAdmin, isLoggedIn, function(req, res) {
        res.render("deleteIdea");
    });

    app.get('/createIdea', isLoggedIn, function(req, res) {
        res.render("createIdea");
    });

    app.get('/notLoggedIn', function(req, res) {
        res.render("notLoggedIn");
    });

    app.post('/createIdea', function(req, res) {
        var image = req.files.picture;
        var picture64string = image.data.toString('base64');
        var idea = new Idea({
            title: req.body.title,
            text: req.body.text,
            picture : picture64string

        });
        idea.picture.data = picture64string;
        idea.picture.contentType = 'jpg';
        idea.save(function (err) {
            if (!err) {
                res.redirect("/ideas");
                return res.send({ status: 'OK', idea:idea });
            } else {
                console.log(err);
                if(err.name == 'ValidationError') {
                    res.statusCode = 400;
                    res.send({ error: 'Validation error' });
                } else {
                    res.statusCode = 500;
                    res.send({ error: 'Server error' });
                }
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

    app.get('/ideas', function(req, res) {
        Idea.find({}, function(err, docs){
            res.render('ideas', {
                ideas : docs
            })
        })
    });

    app.get('/profile', isLoggedIn, function(req, res) {
        res.render('profile', {
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

    app.post('/deleteIdea', isLoggedIn, isAdmin, function (req, res) {
        if(Idea.find({'title': req.body.title})) {
            Idea.remove({'title': req.body.title}, function (err) {
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

        app.post("/idea/:id", function (req, res) {
            Idea.findById(req.params.id, function (err, idea) {

                if (err)
                    res.send(err);
                console.log(req.body.comment);
                idea.comments.push({comment:req.body.comment})
                res.redirect("/ideas")
                idea.save(function (err) {
                    if (err)
                        res.send(err);
                });

            });
        })

    app.get('/idea/:id',  function(req, res) {
        Idea.findOne({_id: req.params.id}, function (err, docs) {
            res.render('idea', {
                idea: docs
            })
        })
    })
};

function isLoggedIn(req, res, next) {

    if (req.isAuthenticated())
        return next();

    res.redirect('/notLoggedIn');
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