const express = require("express");
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io')(server);

function emitter (io, name, toEmit){
	io.on("connection", function (socket){
		socket.emit(name, toEmit);
		// console.log("Emitter is emitting " + toEmit);
	});
};

module.exports = emitter;