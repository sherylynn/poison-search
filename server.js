/**
 * Created by lynn on 14-2-22.
 */
var express=require('express')
  , ex_pouch=require('express-pouchdb')
  , corser  = require('corser')
  , PouchDB=ex_pouch.Pouch
  , app =express()
  , corserRequestListener = corser.create({
      methods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
      supportsCredentials: true
  });
//用express-pouchdb会有跨域问题!!!fuck!!!!
//用pouchdb-server不会有
//查明pouchdb-server中采用了corser作跨域处理

var fs =require('fs');
var iconv = require('iconv-lite');


var port=process.env.PORT||18080;

app.use(express.static(__dirname));

app.configure(function () {
  app.use(express.logger('tiny'));
  app.use(function (req, res, next) {
    corserRequestListener(req, res, function () {
      if (req.method == 'OPTIONS') {
        // End CORS preflight request.
        res.writeHead(204);
        return res.end();
      }
      next();
    });
  });
  app.use('/db', ex_pouch);
});

var io=require('socket.io').listen(app.listen(port));
io.sockets.on('connection',function(socket){
  socket.emit('connected')
});

//var db=new PouchDB('test');//创建一次后就不再创建

console.log('成功建立端口'+port);

