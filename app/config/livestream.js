var rtsp = require('rtsp-ffmpeg');
var sequelize = require('sequelize');
var db = require('../../database');
var device = require('../models/devicetbl')(db, sequelize);
var _ = require('lodash');
var url = require('url');

module.exports = function (socket) {
    socket.on('connection', function (client) {
        client.on('cmd', (data) => {
            if (data) {
                var cond = data.message == "need_stream"
                if (data.message == "need_stream") {
                    db.sync()
                        .then(() => {
                            device.findAll({
                                    where: {
                                        'device_type': {
                                            $or: [3, 4]
                                        },
                                        'is_deleted': 0
                                    }
                                })
                                .then(cameras => {
                                    if (cameras) {
                                        var ips = _.map(cameras, 'ip_address')

                                        var urls = []

                                        ips.forEach((key, index) => {
                                            url = 'rtsp://' + key + ':554/av0_0';
                                            urls.push(url);
                                        })

                                        urls.map(function (uri, i) {
                                            var stream = rtsp.FFMpeg({
                                                input: uri,
                                                resolution: '1280x720',
                                                quality: 3
                                            });
                                            stream.on('start', function () {
                                                console.log('stream ' + i + ' started');
                                            });
                                            stream.on('stop', function () {
                                                console.log('stream ' + i + ' stopped');
                                            });
                                            return stream;
                                        })

                                        urls.forEach(function (camStream, i) {
                                            var ns = client.of('/live' + i);
                                            ns.on('connection', function (wsocket) {
                                                console.log('Connected to stream ' + i);
                                                var pipeStream = function (data) {
                                                    wsocket.emit('data', data);
                                                };
                                                camStream.on('data', pipeStream);

                                                wsocket.on('disconnect', function () {
                                                    console.log('disconnected from /cam' + i);
                                                    camStream.removeListener('data', pipeStream);
                                                });
                                            })
                                        })
                                    }
                                })
                        })
                        .catch(error => {
                            client.emit('error', {
                                message: 'Error occurred while getting video url',
                                code: 500
                            })
                        })
                }
            }
        });
    });
}