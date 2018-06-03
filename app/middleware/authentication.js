function isLoggedIn(req, res, next) {
 
    if (req.isAuthenticated())
     
        return next();
    
    if(req.accepts('html'))
        res.redirect('/login');
    else {
        res.status(401).send({
            message: "Unauthorized. Please login again"
        })
    }
}

function issueToken(user, done) {
    var token = helpers.genChars(64);
    saveRememberMeToken(token, user.id, function(err) {
        if (err) { return done(err); }
        return done(null, token);
    });
}

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

module.exports.isLoggedIn = isLoggedIn;
module.exports.saveRememberMeToken = saveRememberMeToken;
module.exports.consumeRememberMeToken = consumeRememberMeToken;
module.exports.issueToken = issueToken;