var sequelize = require('sequelize')
var db = require('../../database')

var user = require('../models/usertbl')(db, sequelize)

function getLogin(req, res) {
    if(req.isAuthenticated()) {
        res.redirect('/latest')
    }
    else {
        res.render('login', {
            title: "Đăng nhập",
            error: req.flash('error')
        })
    }
}

function logout(req, res) {
    req.session.destroy(function (err) {
        res.redirect('/login');
    });
}

function showProfile(req, res) {
    var username = req.params.username;

    db.sync()
    .then(() => {
        user.findAll({ where: { account: username }})
        .then(v => {
            if(!v) {
                return res.render('errors/error', {
                    code: 404,
                    message: "Tài khoản không tồn tại"
                });
            } else {
                res.render('profile', {
                    title: "Trang cá nhân",
                    user: req.user
                })
            }
        })
        .catch(e => {
            return res.render('errors/error', {
                code: 500,
                message: "Truy vấn máy chủ thất bại"
            });
        })
    })
    .catch(err => {
        return res.render('errors/error', {
            code: 500,
            message: "Truy vấn máy chủ thất bại"
        });
    })
    
}

function updateProfile(req, res) {  
    
}

module.exports.getLogin = getLogin;
module.exports.logout = logout;
module.exports.showProfile = showProfile;
module.exports.updateProfile = updateProfile;