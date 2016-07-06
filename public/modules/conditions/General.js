 
var socket;
exports.pageId; 
var data = {};
 

module.exports = {
	test : function(){
		console.log("General.js can be used here");
	},
	validate: function () {
		experimentr.endTimer(exports.pageId);
		experimentr.release();
	},pushBorder: function(){
		d3.select(".border")
		.transition()
		.duration(500)
		.attr("rx",70)
		.attr("ry",70)
		.transition()
		.duration(500)
		.attr("rx",20)
		.attr("ry",20);
	},
	pressed:function(buttonTitle, type){
		general.pushBorder();
		var isPresent = general.checkForAnamoly();
		console.log(exports.pageId);
		timePressed = experimentr.now(exports.pageId);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();
		

		data["interactionType"] = type;
		data["buttonTitle"] = buttonTitle;
		data["timePressed"] = timePressed;
		data["postId"] = postId; 
		data["timestamp"] = timestamp;
		data["AnomalyPresent"] = isPresent;
		data["pageId"] = exports.pageId;
		experimentr.addData(data);
		console.log(data);
		
		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
			console.log('key pressed')
		}
	},

	setPageVars: function(pageId){ 
		exports.pageId=pageId;
		console.log('pageId are set', exports.pageId);
	},
	connectSockets: function(){
		socket = io.connect();
		socket.on('connect',function() {
			console.log('Client has connected to the server!');
		});

		document.onmousemove = experimentr.sendMouseMovement;
	},
	countdown: function( elementName, minutes, seconds ){
		var element, endTime, hours, mins, msLeft, time;
		
		function twoDigits( n )
		{
			return (n <= 9 ? "0" + n : n);
		}
		
		function updateTimer()
		{
			msLeft = endTime - (+new Date);
			if ( msLeft < 1000 ) {
				element.innerHTML = "countdown's over!";
				Mousetrap.reset();
				// document.onmousemove = experimentr.stopMouseMovementRec;
				general.pressed('next-button', "button");
				// socket.emit('disconnect');
			} else {
				time = new Date( msLeft );
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
				setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
			}
		}
		
		element = document.getElementById( elementName );
		endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
		updateTimer();
	},
	checkForAnamoly: function(){
		allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
		allNoise= allPoints.map(function(a) {return a.noise;});
		console.log('noise function',allNoise);
		return allNoise.includes("T");
	}
	
};
