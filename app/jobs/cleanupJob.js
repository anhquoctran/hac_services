var db = require('../../database')
var sequelize = require('sequelize')
var Plate = require('../models/platetbl')(db, sequelize)
var CronJob = require('cron').CronJob
var moment = require('moment')

var job = new CronJob('00 00 08 * * 1-7', cleanupPlate, null, false, 'Asia/Ho_Chi_Minh')

function cleanupPlate() {
    db.sync()
    .then(() => {
        Plate.destroy({ where: { frametime: { $lte: moment().subtract(7, 'days').toDate() }}})
    })
    .catch(error => {
        console.error(error)
    })
}

module.exports = job;