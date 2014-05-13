/**
 * Created by lynn on 14-2-22.
 */
var express=require('express');
var ex_pouch=require('express-pouchdb');
var PouchDB=ex_pouch.Pouch;
var fs =require('fs');
var iconv = require('iconv-lite');

var app=express();
var port=process.env.PORT||18080;

app.use(express.static(__dirname+'/static'));

app.configure(function () {
    app.use(express.logger('tiny'));
    app.use('/db', ex_pouch);
});

var io=require('socket.io').listen(app.listen(port));
io.sockets.on('connection',function(socket){
  socket.emit('connected')
});

var db=new PouchDB('test');

console.log('成功建立端口'+port);

