var helpers = require('../middleware/helpers')
var sha512 = require('js-sha512').sha512
var authMidd = require('../middleware/authentication')

module.exports = function (passport, user) {
    var User = user;
    var LocalStrategy = require('passport-local').Strategy;
    var RememberMeStrategy = require('passport-remember-me').Strategy;

    var generateHash = function (password) {
        return sha512(password);
    };

    passport.serializeUser(function (user, done) {
        done(null, user.id);
    });


    // used to deserialize the user
    passport.deserializeUser(function (id, done) {
        User.findById(id).then(function (user) {
            if (user) {
                done(null, user.get());
            } else {
                done(user.errors, null);
            }
        });
    });

    var tokens = {}

    function consumeRememberMeToken(token, fn) {
        var uid = tokens[token];
        delete tokens[token];
        return fn(null, uid);
    }

    function saveRememberMeToken(token, uid, fn) {
        tokens[token] = uid;
        return fn();
    }

    passport.use(new RememberMeStrategy(
        function(token, done) {
            authMidd.consumeRememberMeToken(token, function(err, uid) {
            if (err) { return done(err); }
            if (!uid) { return done(null, false); }
            
            User.findById(uid)
            .then(u => {
                if (!u) { return done(null, false); }
                return done(null, u);
            })
            .catch(err => {
                return done(err);
            });
          });
        },
        authMidd.issueToken
    ));


    passport.use('local-signin', new LocalStrategy({
            usernameField: 'username',
            passwordField: 'password',
            passReqToCallback: true
        },
        function (req, username, password, done) {
            var isValidPassword = function (userpass, p) {
                return generateHash(userpass).toLocaleUpperCase() === p.toLocaleUpperCase();
            }

            if (!username || !password) {
                req.flash('error', 'Tên đăng nhập hoặc mật khẩu không đúng')
                return done(null, false, {
                    message: 'Tên đăng nhập hoặc mật khẩu không đúng'
                });
            }

            User.findOne({
                    where: {
                        account: username
                    }
                })
                .then(user => {
                    if (!user) {
                        req.flash('error', 'Tài khoản không tồn tại')
                        return done(null, false, {
                            message: "Tài khoản không tồn tại"
                        })
                    }

                    if (!isValidPassword(password, user.password)) {
                        req.flash('error', 'Mật khẩu không đúng')
                        return done(null, false, {
                            message: 'Mật khẩu không đúng'
                        });
                    }

                    if (user.id_role !== 6) {
                        req.flash('error', `Tài khoản ${user.account} không được phép đăng nhập ở đây`)
                        return done(null, false, {
                            message: `Tài khoản ${user.account} không được phép đăng nhập ở đây`
                        });
                    }

                    var userinfo = user.get();

                    return done(null, userinfo);
                })
                .catch(error => {
                    console.log("Error: " + error);
                    return done(null, false, {
                        message: 'Xảy ra lỗi trong khi đăng nhập'
                    });
                })
        }))
}