$("#btnFilter").click(function(e) {
    e.preventDefault();

    var dateFrom = $("#dateFrom").val();
    var dateTo = $("#dateTo").val();

    if(!dateFrom || !dateTo) {
        alert('Vui lòng chọn thời gian');
        return;
    }

    var data = {
        dateFrom: dateFrom,
        dateTo: dateTo
    }

    $.ajax({
        type: 'post',
        url: '/plates/filter',
        contentType: 'application/json',
        accept: 'application/json',
        dataType: 'json',
        data: data,
        success: function(data) {

        },
        failure: function(err) {
            console.error(err);
        }
    })
})