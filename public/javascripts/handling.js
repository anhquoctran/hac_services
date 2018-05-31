$("#upload").click(function () {
    var files = $("#vrs")[0].files

    if (files.length === 1) {

        if (files[0].size >= 104857600) {

            alert('Kích thước tệp quá lớn! Vui lòng chọn tệp có kích thước dưới 100MB!')
            return;
        }

        $(this).attr('disabled', 'disabled')

        var form = $('#formUpload')[0];

        var data = new FormData(form);


        $.ajax({
            type: "POST",
            url: "/upload",
            data: data,
            processData: false,
            enctype: "multipart/form-data",
            contentType: false,
            cache: false,
            timeout: 600000,
            success: onUploadSuccess,
            error: onUploadFailed
        });

    } else {
        alert("Vui lòng chọn tệp trước khi thực hiện việc tải lên!")
        return;
    }

    function onUploadSuccess(response) {
        $("#uuid").html(response.data.uid)
        $("#latest").empty();
        $("#latest").html(response.data.latest === 1 ? 'có' : 'không')
        $("#name").html(response.data.filename)
        $("#version").empty();
        $("#version").html(response.data.version)

        $("#url").attr('href', response.data.url)
        $("#url").addClass('btn btn-outline-primary')
        $("#url").attr('role', 'button')
        $("#url").html('Tải xuống')


        $("#upload").hide()
        $("#inputFileGroup").hide()

        $('#alert').attr('class', 'alert alert-success')
        $('#alert').html(response.message)
        $("#alert").fadeTo(5000, 1500).fadeOut(500, function () {
            $(this).fadeOut(500);
        });
    }

    function onUploadFailed(err) {
        console.error(err.responseText.message)
        $("#upload").removeAttr('disabled')
        $('#alert').attr('class', 'alert alert-danger')
        $('#alert').html(err.responseText)
        $("#alert").fadeTo(5000, 1500).fadeOut(500, function () {
            $(this).fadeOut(500);
        });
    }
})

jQuery.extend(jQuery.validator.messages, {
    required: "Trường này không được bỏ trống",
    email: "Vui lòng nhập địa chỉ email",
    url: "Vui lòng nhập đúng URL",
    date: "Vui lòng nhập ngày hợp lệ",
    number: "Vui lòng nhập số",
    digits: "Vui lòng nhập chữ số",
    equalTo: "Vui lòng nhập lại cùng một giá trị.",
    maxlength: jQuery.validator.format("Vui lòng nhập không quá {0} ký tự"),
    minlength: jQuery.validator.format("Vui lòng nhập ít nhất {0} ký tự"),
    rangelength: jQuery.validator.format("Vui lòng nhập một giá trị trong khoảng từ {0} đến {1} ký tự"),
    range: jQuery.validator.format("Please enter a value between {0} and {1}."),
    max: jQuery.validator.format("Please enter a value less than or equal to {0}."),
    min: jQuery.validator.format("Please enter a value greater than or equal to {0}.")
});

$('#formLogin').validate();
$('#formUpload').validate();

$(document).on('change', ':file', function () {
    var input = $(this),
        numFiles = input.get(0).files ? input.get(0).files.length : 1,
        label = input.val().replace(/\\/g, '/').replace(/.*\//, '');
    input.trigger('fileselect', [numFiles, label]);
    var size = bytesToSize(input[0].files[0].size)
    $("#size").val(size)

    function bytesToSize(bytes) {
        var sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
        if (bytes == 0) return 'n/a';
        var i = parseInt(Math.floor(Math.log(bytes) / Math.log(1024)));
        if (i == 0) return bytes + ' ' + sizes[i];
        return (bytes / Math.pow(1024, i)).toFixed(1) + ' ' + sizes[i];
    };
});
$("#btn-browse").click(function () {
    $("#vrs").trigger("click");
})

$(document).ready(function () {
    $("#alert").hide()
    $(':file').on('fileselect', function (event, numFiles, label) {
        var input = $(this).parents('.input-group').find(':text'), log = numFiles > 1 ? numFiles + ' files selected' : label;
        if (input.length) {
            input.val(log);
        } else {
            if (log) alert(log);
        }
    });
});

