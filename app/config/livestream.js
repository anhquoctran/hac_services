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
                if (data.message == "start_live") {
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
                                        delete urls

                                        var tempArr = [
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0",
                                            "rtsp://192.168.10.5:554/av0_0"
                                        ]

                                        var streams = [];

                                        tempArr.map(function (uri, i) {
                                            var stream = new rtsp.FFMpeg({
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
                                            streams.push(stream);
                                        })

                                        streams.forEach(function (stream, i) {

                                            console.log('Connected to stream ' + i);
                                            var pipeStream = function (data) {
                                                var id = i + 1
                                                client.emit('live' + id, data);
                                                console.log(data);
                                            };

                                            stream.on('data', pipeStream);

                                            client.on('disconnect', function () {
                                                console.log('disconnected from /cam' + i);
                                                stream.removeListener('data', pipeStream);
                                            });
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