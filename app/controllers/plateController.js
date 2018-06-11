var validator = require('validator')
var sequelize = require('sequelize');
var _ = require('lodash')
var moment = require('moment')

var helpers = require('../middleware/helpers')

var db = require('../../database')
var Plate = require('../models/platetbl')(db, sequelize)

const {
    check,
    validationResult
} = require('express-validator/check')

var socket = require('../config/socket')

function addImage(req, res) {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
        return res.status(400).json({
            message: "ERROR_VALIDATION",
            details: errors.mapped(),
            success: false,
            status: 400
        })
    }

    var body = req.body
    var camera_id = body.camera_id
    var frametime = body.frametime
    var encoded_plate_image = body.encoded_plate_image
    var encoded_vehicle_image = body.encoded_vehicle_image
    var location = body.location
    var vehicle_plate = body.vehicle_plate

    var name = `cam_${body.camera_id}_${helpers.getDateTimeString(body.frametime)}_${body.vehicle_plate}`

    var item = {
        camera_id: body.camera_id,
        name: name,
        frametime: body.frametime,
        encoded_plate_image: body.encoded_plate_image,
        encoded_vehicle_image: body.encoded_vehicle_image,
        location: body.location,
        vehicle_plate: body.vehicle_plate,
    }

    Plate.build({
            camera_id: camera_id,
            frametime: frametime,
            encoded_vehicle_image: encoded_vehicle_image,
            encoded_plate_image: encoded_plate_image,
            vehicle_plate: vehicle_plate,
            location: location
        })
        .save()
        .then(result => {
            socket.io.emit('plate', item)
            return res.json({
                message: "SAVE_OK",
                success: true,
                status: 200
            })
        })
        .catch(err => {
            console.error(err);
            return res.status(500).send({
                message: "SAVE_FAILED",
                success: false,
                status: 500
            })
        })
}

function getImage(req, res) {
    res.json({
        data: "none"
    })
}

function monitor(req, res) {
    db.sync()
        .then(() => {
            Plate.findAll({
                    order: [
                        ['frametime', 'desc']
                    ],
                    limit: 15
                })
                .then(list => {
                    res.render('plate/monitor', {
                        title: "Giảm sát hệ thống nhận diện biển số",
                        user: req.user,
                        list: list
                    })
                })
                .catch(error => {
                    res.render('errors/error', {
                        title: "Lỗi",
                        code: '500',
                        message: 'Truy vấn không hợp lệ'
                    })
                })

        })
        .catch(e => {
            res.render('errors/error', {
                title: "Lỗi",
                code: '500',
                message: 'Không thể kết nối Cơ sở dữ liệu'
            })
        })

}

function getPlatesIndex(req, res) {

    res.render('plate/plates', {
        title: 'Danh sách biển số',
        user: req.user,
    })
}

function fetch(req, res) {
    var per_page = req.body.length ? req.body.length : 20
    var page = req.body.draw ? req.body.draw : 1
    var search = req.body.search ? req.body.search : ''
    var options = {}
    
    if(per_page == -1) {
        options = {
            order: [
                ['frametime', 'desc']
            ],
            where: search || search != '' ? {
                vehicle_plate: {
                    $like: '%' +  search + '%'
                }
            } : null
        }
    } else {
        options = {
            order: [
                ['frametime', 'desc']
            ],
            offset: (page - 1) * per_page,
            limit: per_page,
            where: search || search != '' ? {
                vehicle_plate: {
                    $like: '%' +  search + '%'
                }
            } : null
        }
    }

    db.sync()
        .then(() => {
            Plate.count({
                col: 'id',
                distinct: true
            })
            .then(count => {
                Plate.findAll(options)
                .then(result => {

                    _.map(result, function(x) {
                        x.frametime = helpers.formatDate(new Date(x.frametime).toISOString());
                        x.encoded_vehicle_image = '<img class="img-responsive" width="80" heigh="80" src="data:image/jpeg;base64,' + x.encoded_vehicle_image + '" alt="vehicle">';
                        x.encoded_plate_image = '<img class="img-responsive" width="128" heigh="72" src="data:image/jpeg;base64,' + x.encoded_plate_image + '" alt="plate">'
                        return x;
                    })

                    res.json({
                        data: result,
                        draw: page,
                        recordsFiltered: count,
                        recordsTotal: count
                    })
                })
                .catch(err => {
                    console.error(err);
                    res.json( {
                        code: '500',
                        message: 'Truy vấn không hợp lệ',
                        data: [],
                        draw: 0,
                        recordsFiltered: 0,
                        recordsTotal: 0
                    })
                })
            })
            .catch(er => {
                console.error(er);
                res.json({
                    code: '500',
                    message: 'Truy vấn không hợp lệ',
                    data: [],
                    draw: 0,
                    recordsFiltered: 0,
                    recordsTotal: 0
                })
            })
            
        })
        .catch(err => {
            res.json({
                code: '500',
                data: [],
                message: 'Không thể kết nối Cơ sở dữ liệu',
                draw: 0,
                recordsFiltered: 0,
                recordsTotal: 0
            })
        })
}

function filter(req, res) {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            errors: errors.array()
        });
    }

    db.sync()
        .then(() => {
            var dateFrom = new Date(req.body.dateFrom);
            var dateTo = new Date(req.body.dateTo);
            Plate.findAll({ 
                    attributes: ['id', 'camare_id', 'frametime', 'encoded_vehicle_image', 'encoded_plate_image', 'vehicle_plate'] ,
                    where: {
                        frametime: {
                            $between: [dateFrom, dateTo]
                        }
                    },
                    limit: 100
                })
                .then(data => {
                    _.map(data, function(x) {
                        x.frametime = new Date(x.frametime).toISOString();
                        x.encoded_vehicle_image = '<img class="img-responsive" width="80" heigh="80" src="data:image/jpeg;base64,' + x.encoded_vehicle_image + '" alt="vehicle">';
                        x.encoded_plate_image = '<img class="img-responsive" width="128" heigh="72" src="data:image/jpeg;base64,' + x.encoded_plate_image + '" alt="plate">'
                        return x;
                    })

                    res.json({
                        data: data
                    })
                })
                .catch(err => {
                    res.json({
                        code: '500',
                        message: 'Truy vấn không hợp lệ'
                    })
                })
        })
        .catch(error => {
            res.render('errors/error', {
                title: "Lỗi",
                code: '500',
                message: 'Không thể kết nối Cơ sở dữ liệu'
            })
        })
}

module.exports.addImage = addImage;
module.exports.getImage = getImage;
module.exports.monitor = monitor;
module.exports.getPlatesIndex = getPlatesIndex;
module.exports.filter = filter;
module.exports.fetch = fetch;