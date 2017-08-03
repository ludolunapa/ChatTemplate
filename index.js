var jimp = require('jimp'); //manipulador de imagenes
var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);


app.get('/', function(req, res){
  res.sendFile(__dirname + '/testJimp.html');

});

      io.on('connection', function(socket){
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
  });



});

http.listen(3000, function(){
  console.log('listening on *:3000');
});


/*
http.createServer(function (req, res) {



    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
      jimp.read("./otter.jpg", function (err, otter) {
      if (err) throw err;
      otter.resize(256, 256)              // resize
           .autocrop(10,true)             //autocrop
           //.crop( 0, 0, 100, 100)       //crop( x, y, w, h );
           //.quality(60)                 // set JPEG quality
           //.greyscale()                 // set greyscale
           .write("otter-small-bw.jpg");  // save
  });
    console.log("ASDA");
}).listen(4567);

*/