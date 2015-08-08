$(document).ready(function(){
        var msg = $("#msg");
        var log = $("#log");
		var urlExist = false;
        var timestamp = 0;

        $("#name").focus();

        // handling user log in 
        $("#login").click(function() {
            // access user name
            var name = $("#name").val();
            // verify whether user name is empty
            if (!name) {
                alert("Please enter a name!");
                return false;
            };

            //write your code here
            //check whether the username contain illegal characters `~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？   
			var username = new RegExp('^[0-9a-zA-Z]+$');
			
            if (!username.test(name)){
            	alert("Invalid user name! \n Please do not use the following characters \n `~!@#$^&*()=|{}':;',\\[\\].<>/?~@#");
				return false;
			}


            // send request to login.php, write the user name into the cookie
            $.ajax({
                url: 'login.php',
                type: 'POST',
                dataType: 'json',
                data: {name: name},
                success: function() {
                    $(".login").hide();
                }
            })

            return false;
            // complete login process
        });

        
        // send chat message to add_message.php
        $("#form").submit(function() {
            // if no new message, then dont send
            if (!msg.val()) {
                return false;
            }


            // if there's new mesage, send it to add_message.php 
            $.ajax({
                url: 'add_message.php',
                type: 'POST',
                dataType: 'json',
                data: {message: msg.val()},
            })
            
            // Then reset the variable msg to empty string
            msg.val("");

            return false
            
        });

		//logout function
		$("#logout").click(function(){
			$(".login").show();
			var node = document.getElementById("log");
			while (node.hasChildNodes()) {
				node.removeChild(node.lastChild);
			}
		});
		
        // keep excuting function updateMsg(), constantly check whether the content in server.php changed
        window.setInterval(function () {
            updateMsg();
        }, 300);

         // update the chatting area. Requst the server.php to fetch the chat log,then add to the chatting area
        function updateMsg() {
            $.post('server.php', {datasize: '1024'}, function(xml) {
                addMessages(xml);
            });
        };



        // passing information to chatting area for displaying. 
        function addMessages(xml) {
           
            var json = eval('('+xml+')');

            // chat log is an array. traversal this array.
            $.each(json, function(i, v) {
                
                // time stamp of each chat log
                tt = parseInt(v.time);

                // only add the current message to the chatting area 
                   if (tt > timestamp) {
                    console.log(v.message);
					v.message = toURL(v.message);
					if(urlExist)
						appendLog($("<div/>").append('[' + v.username + ']' + v.message));
					else
						appendLog($("<div/>").text('[' + v.username + ']' + v.message));
                    timestamp = tt
					urlExist = false;
                };
            });
        };
		
		function toURL(input) {
			//URLs starting with http://, https://, or ftp://
			var pattern1 = /(\b(https?|ftp):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/gim;
			var newURL = input.replace(pattern1, '<a href="$1" target="_blank">$1</a>');
			urlExist = true;
			return newURL;
		}

        // translate text of each log to html element in the chatting area. Display the text of message in the chatting area
        function appendLog(msg) {
            var d = log[0]
            var doScroll = d.scrollTop == d.scrollHeight - d.clientHeight;
            msg.appendTo(log)
            if (doScroll) {
                d.scrollTop = d.scrollHeight - d.clientHeight;
            }
        }

		
		var startRecord = document.getElementById("startRecrodBut1");
        var stopRecord  = document.getElementById("stopRecBut1");
        var countdownElement = document.getElementById("countdown");
        var playBackRecord = document.getElementById("playback");
        var discardRecordng  = document.getElementById("clearrecording");
        var uploadrecording  = document.getElementById("uploadrecord");
        var progressNumber  = document.getElementById("progressNumber");



         var virec = new VIRecorder.initVIRecorder(
                {   
                    recorvideodsize : 0.4, // recorded video dimentions are 0.4 times smaller than the original
                    webpquality     : 0.7, // chrome and opera support webp imags, this is about the aulity of a frame
                    framerate       : 15,  // recording frame rate 
                } ,
                function(){
                    //success callback. this will fire if browsers supports 
                },
                function(err){
                    //onerror callback, this will fire if browser does not support
                    console.log(err.code +" , "+err.name);
                }
         );


         startRecord.addEventListener("click" , function(){
                virec.startCapture(); // this will start recording video and the audio 
                startCountDown(null);
         });

         stopRecord.addEventListener("click" , function(){
            /*
            stops the recording and after recording is finalized oncaptureFinish call back 
            will occur
            */
                virec.stopCapture(oncaptureFinish); 
         });

         playBackRecord.addEventListener("click" , function(){
            /*
            Clientside playback,
            */
                virec.play();
         });

         discardRecordng.addEventListener("click" , function(){
            /*
            Clears the current recorded video + audio allowing 
            another recording to happen
            */
                virec.clearRecording();
         });

         uploadrecording.addEventListener("click" , function(){
            /*
            Uploading the content to the server, here I have sliced the blobs into chunk size 
            of 1048576 bits so that uploading time will reduce.
            Gmail uses this same technique when we attach some files to a mail, it slize the file 
            in the client side and then uploads chunk by chunk
            */
                var uploadoptions = {
                        blobchunksize : 1048576,
                        requestUrl : "php/fileupload.php",
                        requestParametername : "filename", 
                        audioname : "audio.wav"
                };
                virec.uploadData( uploadoptions , function(totalchunks, currentchunk){
                    /*
                    This function will callback during, each successfull upload of a blob
                    so you can use this to show a progress bar or something
                    */
                    progressNumber.innerHTML = ((currentchunk/totalchunks)*100);
                    console.log(currentchunk +" OF " +totalchunks);
                });
         });


    //------------------------------- few functions that demo, how to play with the api --------------------------

    var countdowntime = 15;
    var functioncalltime = 0;

    function oncaptureFinish(audioblob, videoblob){

                var audiobase64 = window.URL.createObjectURL(audioblob);
                var videobase64 = window.URL.createObjectURL(videoblob);
                document.getElementById('audiored').src = audiobase64;
                document.getElementById('recordedvideo').src = videobase64; 
                document.getElementById('status').innerHTML = "video="+Math.ceil(videoblob.size / (1024))+"KB, Audio="+Math.ceil(audioblob.size / (1024))+"   Total= "+ (Math.ceil(videoblob.size / (1024))+ Math.ceil(audioblob.size / (1024))) + "KB";
    }

    function setCountDownTime(time){
         countdownElement.innerHTML = time;
        if(time == 0){
            return -1;
        }else{
            return 1;
        }
    }


    function startCountDown(interval){
        if(interval == null){
            functioncalltime = countdowntime; 
            setCountDownTime(--functioncalltime); 
            var intervalcount = setInterval( function(){ startCountDown(intervalcount);  }, 1000 );
        }else{
           var val = setCountDownTime(--functioncalltime); 
           if(val == -1){
               clearInterval(interval);
               virec.stopCapture(oncaptureFinish);
           }
        }
    }




    });

    