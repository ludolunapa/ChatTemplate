
/*
TODO: 
Agregar que pueda diferenciar entre otros y el propio mono
Agregar que puedan ponerse apodos o sino ponga la IP o algo


var express = require('express');
var app = express();
var http = require('http');
var path = require('path');
var port = process.env.PORT || 3000;
var server= http.createServer(app).listen(port);

var io = require('socket.io').listen(server);

app.get('/', function(req, res){
    res.sendFile(__dirname + '/index.html');

});

io.on('connection', function(socket) {
    console.log("someone connected");

    var chatLog = {log: [{usr: "someuser", msg: "somemsg"}]};
    var stringLog = JSON.stringify(chatLog);
    console.log(stringLog);
    socket.emit('cargaLog', stringLog); // THIS is the naughty emmit 
});




*/



var TAFFY = require('taffy');
var Jimp = require("jimp");
var express=require('express');
var app = express();
var http = require('http');
var path=require('path');




var port = process.env.PORT || 3000;
var server= http.createServer(app).listen(port);

var io = require('socket.io').listen(server);

var log=TAFFY({"usr":"SERVER",
                  "msg":"Servidor Inicializado",
                  "time":displayTime(),
                  "img":"/upload/server.jpg"
              });
var users=TAFFY()  /* {"usr":usr,"socketID":socketID}*/

// para soportar peticiones POST con este middleware
var bodyParser = require('body-parser')
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({ extended: false }));


//******** MIDDLEWARES PARA SUBIR ARCHIVOS ******************
var multer  = require('multer')

var upload = multer({
  dest: path.join(__dirname, '/public/upload/temp')
});


var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'/public/upload/temp')
  },
  filename: function (req, file, cb) {
      cb(null, generarFileID()+Date.now() + '.' + file.mimetype.split('/')[1]);
  }
});
var upload = multer({ storage: storage });


/*
const fileUpload = require('express-fileupload');
app.use(fileUpload());
//var formidable= require('formidable');
/*
const formidable = require('express-formidable');
app.use(formidable({
  encoding: 'utf-8',
  uploadDir: '/',
  multiples: false, // req.files to be arrays of files 
}));
/* 
*/
// **********************************************************
//app.use(express.json());       // to support JSON-encoded bodies
//app.use(express.urlencoded()); // to support URL-encoded bodies

var fs = require('fs'); //para archivos
app.post('/registro', upload.single('filetoupload'),function(req,res){
    //res.writeHead(200);
    //console.log(req.body);


    /*
    var form= new formidable.IncomingForm();
    form.parse(req);
    /*
    form.on('fileBegin',function(name,file){
        file.path=__dirname+'/uploads/'+file.name;
    });

    form.on('file', function (name, file){
        console.log('Uploaded ' + file.name);
    });

    form.on('progress', function (bytesReceived, bytesExpected) {
        console.log('PROGRESS');
        console.log(bytesReceived);
        console.log(bytesExpected);
    });
    /*
    form.parse(req,function(err,fields,files){
      var oldpath = files.filetoupload.path;
      var newpath='/'+files.filetoupload.name;
      console.log('PATH  '+oldpath);
      fs.rename(oldpath,newpath,function(err){
          if(err) throw err;
          res.write('File uploaded and moved');
          res.end();
      });

    });*/



    
    console.dir(req.file.filename);//nombre del archivo
    //console.log(req.file);//datos generales del archivo
    //console.log("NOMBRE: "+req.body.nickname);//campo "nickname" de la forma
    var idGenerado=generarID();
    
    users.insert({"usr":req.body.nickname,"ID":idGenerado, "img":req.file.filename});
    
    //res.redirect(200,'/chat');
    //return res.end('<img src="/upload/temp/'+req.file.filename+'" alt="Usr_img" heigth="40" width="40">');

        Jimp.read(__dirname+"/public/upload/temp/"+req.file.filename, function (err, lenna) {
    if (err) throw err;
    lenna.resize(40, 40)            // resize
         .quality(60)                 // set JPEG quality
         //.greyscale()                 // set greyscale
         .write(__dirname+"/public/upload/temp/"+req.file.filename); // save
    });

    //res.sendFile(__dirname + '/index.html');
    res.sendFile(__dirname + '/newChat.html');
     
});

app.get('/', function(req, res){
  
  res.sendFile(__dirname + '/ingresar.html');
});

app.get('/dev', function(req, res){
  res.sendFile(__dirname + '/newChat.html');
});

app.use(express.static(__dirname + '/public'));

app.get('/chat', function(req, res){
  //res.sendFile(__dirname + '/index.html');
  res.sendFile(__dirname + '/newChat.html');
});

/* RECORDAR SIEMPRE:     IO = A TODOS SOCKET = a quien lo disparo
*/
io.on('connection', function(socket){
  //console.log("someone connected");


  //console.log(socket.id);
  var chatLog={log:[]};
  log().each(function (iter){
    //console.log(msg);
    chatLog.log.push({"usr":iter.usr,"msg":iter.msg,"time":iter.time,"img":iter.img});
  });

   socket.on('ia iege', function(person){
    io.emit('usrConectado',person);
    var query=users({"usr":person}).first();
    

    if(query===false){
          log.insert({"usr":"SERVER",
                  "msg":person.toUpperCase()+' se conectó',
                  "time":displayTime(),
                  "img":"/upload/server.jpg"
              });
    var idGenerado=socket.id+((Math.floor(Math.random()*10000)));
    users.insert({"usr":person,"ID":idGenerado, "img":"../default.png"});//dirección relativa ya que default esta una carpeta mas alto
    //console.log(person+" tiene: "+idGenerado);
    socket.emit('tu clave',idGenerado);
        }
    else{
          log.insert({"usr":"SERVER",
                  "msg":person.toUpperCase()+' se conectó',
                  "time":displayTime(),
                  "img":"upload/temp/"+query.img
              });
      //console.log('registrado');
      socket.emit('tu clave',query.ID);

    }
   });

  var stringLog=JSON.stringify(chatLog);
  //console.log(stringLog);
  socket.emit('cargaLog', stringLog); //socket porque se lo envia al cliente conectado io se lo enviaria a todos


  socket.on('chat message', function(msg){
    var mensaje=JSON.parse(msg);
    var query=users({"usr":mensaje.usr}).first();
    if(query===false){
    var insert={"usr":mensaje.usr.toUpperCase(),
                  "msg":mensaje.msg,
                  "time":displayTime(),
                  "img":"/upload/default.png"
              };
    log.insert(insert);
    io.emit('chat message', JSON.stringify(insert)); //io porque se lo envia a todos
      }
    else{
      console.log('ONEGAI');
            var insert={"usr":query.usr,
                  "msg":mensaje.msg,
                  "time":displayTime(),
                  "img": "upload/temp/"+query.img
              };
    console.log(query);
    log.insert(insert);
    io.emit('chat message', JSON.stringify(insert)); //io porque se lo envia a todos
    }
  });


  socket.on('me voy',function(usrID){
      
      var nom=users({ID:usrID}).first().usr;
      if(nom===undefined){nom="UKNOWN";}
      io.emit('se nos fue',nom,displayTime());

            //console.log("se fue"+socket.id);
      log.insert({"usr":"SERVER",
                  "msg":nom+" salió",
                  "time":displayTime(),
                  "img":"/upload/server.jpg"
              });
  });

  socket.on('estoy escribiendo',function(usrID){

     var nom=users({ID:usrID}).first().usr;
     if(nom===undefined){nom="UKNOWN";}
    io.emit('este wey esta escribiendo', nom )
  });

  socket.on('disconnect', function(socket2){
      

    //io.emit('se nos fue',usrDes);
  });
});

console.log("listening in port: "+port);


function displayTime() {
    var str = "";

    var currentTime = new Date()
    var hours = currentTime.getHours()
    var minutes = currentTime.getMinutes()
    var seconds = currentTime.getSeconds()

    if (minutes < 10) {
        minutes = "0" + minutes
    }
    if (seconds < 10) {
        seconds = "0" + seconds
    }
    str += hours + ":" + minutes + ":" + seconds + " ";
    if(hours > 11){
        str += "PM"
    } else {
        str += "AM"
    }
    return str;
}

function generarID() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4());
}

function generarFileID(){
      var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4());
}


/*
http.createServer(function (req, res) {



    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('Hello World!');
    	Jimp.read("/otter.jpg", function (err, otter) {
	    if (err) throw err;
	    otter.resize(256, 256)            // resize
	         .quality(60)                 // set JPEG quality
	         .greyscale()                 // set greyscale
	         .write("otter-small-bw.jpg"); // save
	});
    console.log("ASDA");
}).listen(4567);

*/