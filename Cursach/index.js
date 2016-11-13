/**
 * Created by ASA on 12.11.2016.
 */

var server = require("./server");
var router = require("./router");

server.start(router.route);