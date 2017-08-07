  var person = prompt("Introduce tu nombre o seudonimo", "anon"); //THIS IS THE WORKING CODE

      if(person === null || person===""){
        alert("Necesitas un nombre para participar");
      }
      else{
        $(function () {
          var socket = io();
          socket.emit('ia iege',person);
          socket.on('usrConectado',function(usr){
            var html='<li class="left clearfix"><span class="chat-img1 pull-left"><img src="/upload/server.jpg" alt="User Avatar" class="img-circle"></span><div class="chat-body1 clearfix"> <p>Se conectó '+usr+'.</p><div class="chat_time pull-right"></div></div></li>';
            $('#chatList').append(html);
            window.scrollTo(0, document.body.scrollHeight);

            var audio = new Audio('/res/sounds/sms-alert-3-daniel_simon.mp3');
            audio.play();

          });

          socket.on('se nos fue', function(usrDes,time){
            var html='<li class="left clearfix"><span class="chat-img1 pull-left"><img src="/upload/server.jpg" alt="User Avatar" class="img-circle"></span><div class="chat-body1 clearfix"> <p>'+usrDes+' se ha desconectado.</p><div class="chat_time pull-right">'+time+'</div></div></li>';
            $('#chatList').append(html);
            window.scrollTo(0, document.body.scrollHeight);
          });

          socket.on('tu clave',function(socketid){
              sessionStorage.usrID=socketid;
          });

          /*        
          $('form').submit(function(){
            var mensaje=$('#m').val();
            var json='{"usr":"'+person+'","msg":"'+mensaje+'"}';
            socket.emit('chat message', json);
            $('#m').val('');
            return false;
          });
          */
          function enviarMSG(){
            var mensaje=$('#m').val();
            var json='{"usr":"'+person+'","msg":"'+mensaje+'"}';
            socket.emit('chat message', json);
            $('#m').val('');
            return false;            
          }
          $('#m').keypress(function(key){
            var k=key.originalEvent.key;
            if(k==='Enter'){
              enviarMSG();
              $('#m').val('');
      
            }
          });


          socket.on('chat message', function(msg){

            var obj=JSON.parse(msg);
           //console.log(obj);
            //var html='<li><img src="'+obj.img+'" alt="Usr_img" heigth="40" width="40">'+(obj.usr+" dice: "+obj.msg+"     ("+obj.time+")")+'</li>';
            var html=' <li class="left clearfix"> <span class="chat-img1 pull-left"> <img src="'+obj.img+'" alt="User Avatar" class="img-circle"> </span> <div class="chat-body1 clearfix"> <p>'+obj.usr+' dice: '+obj.msg+'</p> <div class="chat_time pull-right">'+obj.time+'</div> </div> </li>';
            $('#chatList').append(html);
            window.scrollTo(0, document.body.scrollHeight);

            var audio = new Audio('/res/sounds/sms-alert-1-daniel_simon.mp3');
            audio.play();

          });
          socket.on('cargaLog', function(log){
            console.log(log);
            var oldLog=JSON.parse(log);
            cargaLog(oldLog);
          });

            var weyes=new Array();
            var msg=null;
            socket.on('este wey esta escribiendo', function(nom){

               alertify.set('notifier','position', 'top-right');
              if(msg===null){
                msg=alertify.message(nom+' esta escribiendo.',1.2, function(){
                  msg=null;
                });
              }
          });

          window.addEventListener("beforeunload", function (e) {
            var confirmationMessage = "\o/";
            socket.emit('me voy',sessionStorage.usrID);
            e.returnValue = confirmationMessage;     // Gecko, Trident, Chrome 34+
            return confirmationMessage;              // Gecko, WebKit, Chrome <34
          });

          $('#m').keypress(function(key) {
            if(key.originalEvent.key!=="Enter"){
              socket.emit('estoy escribiendo',sessionStorage.usrID);

            }
          });

          }); // function principal

        function cargaLog(newLog){
            //newLog is an object
            newLog.log.forEach(function(iter){
            //console.log(iter);
            var msg=iter.usr.toUpperCase()+' dijo: '+iter.msg+'      ('+iter.time+')';
            //var html='<li><img src="'+iter.img+'" alt="Usr_img" heigth="40" width="40">'+(msg)+'</li>';
            var html=' <li class="left clearfix"> <span class="chat-img1 pull-left"> <img src="'+iter.img+'" alt="User Avatar" class="img-circle"> </span> <div class="chat-body1 clearfix"> <p>'+iter.usr+' dice: '+iter.msg+'</p> <div class="chat_time pull-right">'+iter.time+'</div> </div> </li>';

            $('#chatList').append(html);
            window.scrollTo(0, document.body.scrollHeight);
            });
        }
      }//else