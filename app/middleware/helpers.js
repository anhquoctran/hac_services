var path = require('path')
var buffer = require('buffer')
var os = require('os');
var ifaces = os.networkInterfaces();
var appDir = path.dirname(require.main.filename)
var moment = require('moment')

function genChars(length = 5) {
    var text = "";
    var possible = "abcdefghijklmnopqrstuvwxyz";

    for (var i = 0; i < length; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}

function hash(str) {
    var crypto = require('crypto'),
        text = 'hello bob',
        key = 'mysecret key'
    var hash = crypto.createHmac('sha512', key)
    hash.update(text)
    var value = hash.digest('hex')
    return value.toUpperCase();
}

function getDateTimeString(date) {
    var d = new Date(date)
    return d.getFullYear() + d.getMonth() + d.getDay() + "_" + d.getHours() + d.getMinutes() + d.getSeconds()
}

function formatDate(dateString) {
    var formatDate = moment(dateString).format('DD-MM-YYYY HH:mm:ss');
    return formatDate.toString();
}

function decode_base64(base64str, filename) {

    if (base64str === '' || base64str == undefined) return false
    var buf = Buffer.from(base64str, 'base64')

    fs.writeFile(path.join(appDir, '/images_data', makeid() + '_' + filename), base64str, 'base64', function (error) {
        if (error) {
            console.error(error);
            return false;
        } else {
            console.log('File created from base64 string!')
            return true;
        }
    })
}

function getNetworkIPAddress() {
    Object.keys(ifaces).forEach(function (ifname) {
        var alias = 0;

        ifaces[ifname].forEach(function (iface) {
            if ('IPv4' !== iface.family || iface.internal !== false) {
                return;
            }
            if (alias >= 1) {
                console.log(ifname + ':' + alias, iface.address);
            } else {
                console.log(ifname, iface.address);
            }
            ++alias;
        });
    });
}

module.exports.genChars = genChars;
module.exports.hash = hash;
module.exports.getDateTimeString = getDateTimeString;
module.exports.decode_base64 = decode_base64;
module.exports.getNetworkIPAddress = getNetworkIPAddress;
module.exports.formatDate = formatDate;