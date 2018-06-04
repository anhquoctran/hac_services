var socket = io();
var navHeight = $("nav").outerHeight(true);
var windowHeight = $(".wrapper").outerHeight(true);
var height = windowHeight - navHeight;

$(document).ready(function () {
    socket.emit('cmd', {
        message: "start_live"
    })

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

var datatable = $('#plate-table').DataTable({
    language: {
        sProcessing: "Đang xử lý...",
        sLengthMenu: "Hiển thị&nbsp; _MENU_ &nbsp;mục",
        sZeroRecords: "Không có dữ liệu",
        sInfo: "Đang xem _START_ đến _END_ trong tổng số _TOTAL_ mục",
        sInfoEmpty: "Đang xem 0 đến 0 trong tổng số 0 mục",
        sInfoFiltered: "(được lọc từ _MAX_ mục)",
        sInfoPostFix: "",
        sSearch: "Tìm kiếm:",
        sUrl: "",
        oPaginate: {
            sFirst: "Đầu",
            sPrevious: "Trước",
            sNext: "Tiếp",
            sLast: "Cuối"
        }
    },
    columns: [{
            data: 'id'
        },
        {
            data: 'camera_id'
        },
        {
            data: 'frametime'
        },
        {
            data: 'encoded_vehicle_image'
        },
        {
            data: 'encoded_plate_image'
        },
        {
            data: 'vehicle_plate'
        },
    ],
    lengthMenu: [
        [10, 25, 50, 100, -1],
        [10, 25, 50, 100, "Tất cả"]
    ]
});

$("#formSearchPlate").validate();


$("#btnFilter").click(function (e) {
    e.preventDefault();

    var dateFrom = $("#fromDate").val();
    var dateTo = $("#toDate").val();

    if (!dateFrom || !dateTo) {
        alert('Vui lòng chọn thời gian');
        return;
    }

    var data = {
        dateFrom: dateFrom,
        dateTo: dateTo
    }
    //$("#plate-table").find("tr:gt(0)").remove();

    $.ajax({
        type: 'post',
        url: '/plates/filter',
        contentType: 'application/json',
        accept: 'application/json',
        dataType: 'json',
        data: JSON.stringify(data),
        success: (data) => {
            if (!data || data !== []) {
                datatable.clear();
                datatable.rows.add(data.data);
                datatable.draw();
                // var body = '';
                // $.each(data.data, (index, item) => {
                //     body += '<tr><td><span>' + (index+1) + '</span></td><td><span>' + item.camera_id + '</span></td><td><span>' + item.frametime + '</span></td><td><img class="img-responsive" src="data:image/jpeg;base64,' + item.encoded_vehicle_image + '" alt="vehicle"></td><td><img class="img-responsive" src="data:image/jpeg;base64,' + item.encoded_plate_image + '" alt="plate"></td><td><span>' + item.vehicle_plate + '</span></td></tr>';

                // })

                // $('#content-result').html(body);
            }
        },
        failure: (err) => {
            console.error(err);
        }
    })

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
    $('#table-list-plate > tbody > tr:first').hide().before(row).slideDown('slow');
})

socket.on('live1', function (data) {

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