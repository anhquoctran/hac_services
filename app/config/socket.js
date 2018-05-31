var socketio = require('socket.io');
var io = socketio();

var socket = {};
socket.io = io;

module.exports = socket;