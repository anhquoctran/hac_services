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