var socket = io();

var navHeight = $("nav").outerHeight(true);
var windowHeight = $(".wrapper").outerHeight(true);
var height = windowHeight - navHeight;

$(document).ready(function () {
    // socket.emit('cmd', {
    //     message: 'start_live'
    // })
    formatDate();
    $("#right-col").css('height', height)
    $("#plate-data-col").css('height', height - $('.card-header').outerHeight(true))
})

$(window).resize(function () {
    $("#right-col").css('height', height)
    $("#plate-data-col").css('height', height - $('.card-header').outerHeight(true))
})

$(document).resize(function () {
    $("#right-col").css('height', height)
    $("#plate-data-col").css('height', height - $('.card-header').outerHeight(true))
})

socket.on('connect', function() {
    console.log("Server now connected");
})

socket.on('disconnect', function() {
    console.log('Server now disconnected')
})

socket.on('plate', function (plate) {
    var row = '';
    var maxRow = $("#table-list-plate").data('maxrow');

    var totalRows = $("#table-list-plate tr").length;

    if (totalRows >= maxRow) {
        var diff = totalRows - maxRow;
        diff += 3;
        for (var i = 1; i <= diff; i++) {
            $('#table-list-plate tr:last').remove();
        }
    }

    row += '<tr><td><div class="row"><div class="col-md-3"><img class="img-responsive" src="data:image/jpeg;base64,' + plate.encoded_plate_image + '" width="80" height="80" alt="plate"></div><div class="col-md-9"><p class="data">Mã camera: ' + plate.camera_id + '</p><p class="data">Biển số: ' + plate.vehicle_plate + '</p><p class="data">Thời gian: ' + convertDate(plate.frametime) + '</p><p class="data">Vị trí: ' + plate.location + '</p></div></div></td></tr>'
    //$('#table-list-plate > tbody > tr:first').hide().before(row).slideDown('slow');
    $(row).hide().insertBefore('#table-list-plate > tbody > tr:first').fadeIn('slow');
})

socket.on('live1', function (data) {
    console.log(data);
    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam1")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live2', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam2")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live3', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam3")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live4', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam4")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live5', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam5")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live6', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam6")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live7', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam7")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})

socket.on('live8', function (data) {

    var bytes = new Uint8Array(data);
    var blob = new Blob([bytes], {
        type: 'application/octet-binary'
    });
    var url = URL.createObjectURL(blob);
    var img = new Image;

    var ctx = $("#cam8")[0].getContext('2d')

    img.onload = function () {
        URL.revokeObjectURL(url);
        ctx.drawImage(img, 0, 0);
        img.src = url;
    };
})