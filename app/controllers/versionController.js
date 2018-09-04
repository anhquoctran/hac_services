var sequelize = require('sequelize')
var db = require('../../database');
var Version = require('../models/versiontbl')(db, sequelize);
var uuidv4 = require('uuid/v4')
var fs = require('fs')
var path = require('path')
var uuidValidator = require('uuid-validate')

var appDir = path.dirname(require.main.filename)

function uploadVersion(req, res) {
    res.render('upload', {
        title: "Tải lên phiên bản",
        data: null,
        user: req.user
    })
}

function upload(req, res) {
    var uuid = uuidv4().toLocaleUpperCase();
    fs.writeFileSync(path.join(appDir, 'log.json'), req.toString());

    if (!req.file) {
        return res.status(400).send({
            message: "Tệp tải lên không hợp lệ"
        })
    }

    var url = '/dl/' + uuid;
    db.sync()
        .then(() => {
            Version.findAll({
                    where: {
                        is_deleted: 0,
                        latest: 1
                    }
                })
                .then(list => {
                    if (list) {

                        list.forEach(function (item) {
                            item.updateAttributes({
                                where: {
                                    is_deleted: 0,
                                    latest: 0
                                }
                            })
                        })

                        Version.build({
                                version: req.body.major + '.' + req.body.minor + '.' + req.body.build + '.' + req.body.revision,
                                latest: req.body.latest,
                                uid: uuid,
                                filename: req.file.filename,
                                url: url,
                                size: req.body.size
                            })
                            .save()
                            .then(v => {
                                res.json({
                                    message: "Tải lên thành công!",
                                    success: true,
                                    data: {
                                        version: v.version,
                                        latest: v.latest,
                                        uid: v.uid,
                                        filename: v.filename,
                                        url: v.url
                                    }
                                })
                            })
                            .catch(error => {
                                res.status(500).send({
                                    message: "Tải lên thất bại!",
                                    success: false,
                                    data: null
                                })
                            })
                    }
                })
                .catch(error => {
                    console.log(error)
                    res.status(500).send({
                        message: "Tải lên thất bại!",
                        success: false,
                        data: null
                    })
                })
        })
        .catch(err => {
            console.log(err)
        })
}

function checkUpdate(req, res) {
    db.sync()
        .then(() => {
            Version.findOne({
                    where: {
                        latest: 1
                    }
                })
                .then(v => {
                    if (v) {
                        return res.json({
                            message: "found",
                            data: {
                                size: v.size,
                                version: v.version,
                                url_download: v.url,
                                latest: true
                            }

                        })
                    } else {
                        return res.json({
                            message: "not found",
                            data: null
                        })
                    }
                })
                .catch(err => {
                    console.log(err);
                    return res.status(500).send({
                        message: err
                    })

                })
        })
        .catch(() => {
            return res.status(500).send({
                message: 'Lỗi truy vấn cơ sở dữ liệu'
            })
        })
}

function download(req, res) {
    var uuid = req.params.uuid;
    if (uuidValidator(uuid)) {
        db.sync()
            .then(() => {
                Version.findOne({
                        where: {
                            uid: uuid
                        }
                    })
                    .then(v => {
                        var fullpath = path.join(appDir, '/public/version', v.filename)
                        return res.download(fullpath);
                    })
            })
            .catch(() => {
                res.sendStatus(500)
            })
    } else {
        res.sendStatus(400)
    }
}

function getArchive(req, res) {
    db.sync()
        .then(() => {
            Version.findAll({
                    where: {
                        latest: 0
                    },
                    limit: 20,
                    offset: 0
                })
                .then(result => {
                    res.render('archive', {
                        title: "Danh sách các phiên bản củ hơn",
                        data: result,
                        user: req.user
                    })
                })
                .catch(err => {
                    return res.status(500).send({
                        message: err
                    })
                })
        })
        .catch(err => {
            return res.status(500).send({
                message: "connect failed"
            })
        })
}

function latest(req, res) {
    db.sync()
        .then(() => {
            Version.findOne({
                    where: {
                        latest: 1
                    }
                })
                .then(v => {
                    res.render('current', {
                        title: "Phiên bản hiện tại",
                        data: v,
                        user: req.user
                    })
                })
                .catch(err => {
                    console.error(err);
                    res.render('errors/error', {
                        title: "Lỗi",
                        message: "Lỗi truy vấn máy chủ",
                        code: 500
                    })
                })
        })
        .catch(err => {
            console.error(err);
        })
}

module.exports.uploadVersion = uploadVersion;
module.exports.upload = upload;
module.exports.checkUpdate = checkUpdate;
module.exports.download = download;
module.exports.getArchive = getArchive;
module.exports.latest = latest;