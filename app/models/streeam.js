var fs = require('fs');
var ffcommand = require('fluent-ffmpeg');

module.exports = function (url) {
    
    var command = ffcommand();
    command.setFfmpegPath('../../ffmpeg/bin/ffmpeg.exe');
    command.setFfprobePath('../../ffmpeg/bin/ffprobe.exe');
    command.input(url)
        .inputFormat('mp4')
        .inputFps(25)
        .videoCodec('libx264')
        .withOptions("nobuffer")
        .native();

    return command;
}