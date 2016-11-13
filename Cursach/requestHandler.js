/**
 * Created by ASA on 13.11.2016.
 */

function start() {
    console.log("Request handler 'start' was called.");
}

function upload() {
    console.log("Request handler 'upload' was called.");
}

exports.start = start;
exports.upload = upload;