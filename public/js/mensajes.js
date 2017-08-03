  var person = prompt("Introduce tu nombre o seudonimo", "anon"); //THIS IS THE WORKING CODE

      if(person === null || person===""){
        alert("Necesitas un nombre para participar");
      }
      else{
        $(function () {
          var socket = io();
          socket.emit('ia iege',person);
          socket.on('usrConectado',function(usr){
            var html='<li><h5>'+(usr)+' se ha conectado</h5></li>';
            $('#messages').append(html);
            window.scrollTo(0, document.body.scrollHeight);

            var audio = new Audio('/res/sounds/sms-alert-3-daniel_simon.mp3');
            audio.play();

          });

          socket.on('se nos fue', function(usrDes,time){
            var html='<li><h5>'+(usrDes)+' se ha desconectado ('+time+')</h5></li>';
            $('#messages').append(html);
            window.scrollTo(0, document.body.scrollHeight);
          });

          socket.on('tu clave',function(socketid){
              sessionStorage.usrID=socketid;
          });

        
          $('form').submit(function(){
            var mensaje=$('#m').val();
            var json='{"usr":"'+person+'","msg":"'+mensaje+'"}';
            socket.emit('chat message', json);
            $('#m').val('');
            return false;
          });


          socket.on('chat message', function(msg){

            var obj=JSON.parse(msg);
           //console.log(obj);
            var html='<li><img src="'+obj.img+'" alt="Usr_img" heigth="40" width="40">'+(obj.usr+" dice: "+obj.msg+"     ("+obj.time+")")+'</li>';
            $('#messages').append(html);
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
              /*
              if(weyes.indexOf(nom)>-1){ }
              else{
                weyes.push(nom);
                var html='<li><h3>'+(nom)+' esta escribiendo...</h3></li>';

                $('#info').append(html);
                window.scrollTo(0, document.body.scrollHeight);
                setTimeout(function(){ 
                var index = weyes.indexOf(nom);
                if (index > -1) {
                   weyes.splice(index, 1);
                }   
               // console.log(weyes); 
                $("#info li:last").remove();
               //document.getElementById("info").removeChild(index);
  
                },1000);


              }//else
          */
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
                 var html='<li><img src="'+iter.img+'" alt="Usr_img" heigth="40" width="40">'+(msg)+'</li>';
            $('#messages').append(html);
            window.scrollTo(0, document.body.scrollHeight);
            });
        }
      }//else