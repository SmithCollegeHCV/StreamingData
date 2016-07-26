/**
* Contains functions that are used by all experiment modules. This includes recording button events and checking for anamolies.
*@module general 
*@nameSpace generalModule 
*/ 

var socket;



/**
*module representing the pageId 
*@module general
*@global
*@type string
*/
exports.pageId; 
var interactionGroup = [];
data = {};

module.exports = {
	/** Test to see if the module is loaded
	*@memberof generalModule
	*@function test
	*/
	test : function(){
		console.log("General.js can be used here");
	},
	/** releases next botton and ends timer at the end of the experiment 
	*@memberof generalModule
	*@function validate 
	*/
	validate: function () {
		experimentr.setPageType(exports.pageId);
		//console.log('exports page id' + exports.pageId)
		data.mouseAction = interactionGroup;
		// console.log(interactionGroup)
		// console.log('data on merge' + data)
		experimentr.merge(data);
		experimentr.endTimer( exports.pageId);
		experimentr.release();
	},
	/** Adds visual cues that interaction has been detected
	*@memberof generalModule
	*@function pushBorder
	*/
	pushBorder: function(){
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
	/** Sends interaction information to backend on button pressed 
	*@memberof generalModule
	*@function pressed
	*@param {string}  buttonTitle indicates what button is pressed
	*@param {string}  type indicates what type of button 
	*/
	pressed:function(buttonTitle, type){

		general.pushBorder();
		if (d3.select(".svg2")[0][0] != null){
			var linesOnDisplay = d3.selectAll("#lineCopy");
			d3.selectAll(".brush").remove();
			linesOnDisplay.remove();
			general.addCopy();
			component.addBrush();
			if(!d3.select(".submitButton").empty()){
				submitButton = d3.select(".submitButton")
				.on("mousedown", function (){
					general.feedBack("submit", "button");
					d3.select(".brush").call(brush.clear());

				})
			}else{
				catagoryButton = d3.selectAll(".catagoryButtons")
				.on("mousedown", function (){
					general.feedBack(d3.select(this).attr('name'), "button");
					d3.select(".brush").call(brush.clear());
				})
			}
		}else{
			general.feedBack(buttonTitle, type);
		}
		
		//socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, f: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:exports.pageId});
	},
	/** 
	*Checks to see if the spacebar or the enter key has been pressed
	*@memberof generalModule
	*@function checkKeyPressed
	*@param {event} e events from users
	*/
	checkKeyPressed: function(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			general.pressed(e.keyCode, "key");
			//console.log('key pressed')
		}
	},
	/** Sets the page ID in this module
	*@memberof generalModule
	*@function setPageVars
	*@param {string} pageId pageID from html id 
	*/
	setPageVars: function(pageId){ 
		exports.pageId=pageId;
		//console.log('pageId are set', exports.pageId);
	},
	/** Connects websockets to record user mouse movements
	*@memberof generalModule
	*@function connectSockets
	*/
	connectSockets: function(){
		socket = io.connect();
		socket.on('connect',function() {
			//console.log('Client has connected to the server!');
		});

		document.onmousemove = experimentr.sendMouseMovement;
	},
	/** Creates and initializes a countdown clock 
	*@memberof generalModule
	*@function countdown
	*@param {string} elementName 
	*@param {integer} minutes 
	*@param {integer} seconds
	*/
	countdown: function( elementName, minutes, seconds ){
		var element, endTime, hours, mins, msLeft;
		
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
				experimentr.showNext();
				general.pressed('next-button', "button");
	
				if(!d3.select(".submitButton").empty()){
					d3.select(".submitButton").remove();
				}
				if(!d3.selectAll(".catagoryButtons").empty()){
					d3.selectAll(".catagoryButtons").remove();
				}
				// socket.emit('disconnect');
			} else {
				time = new Date( msLeft );
				hours = time.getUTCHours();
				mins = time.getUTCMinutes();
				// console.log("Is Anomoly present : "+ general.checkForAnamoly()+", time "+(hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() ))
				element.innerHTML = (hours ? hours + ':' + twoDigits( mins ) : mins) + ':' + twoDigits( time.getUTCSeconds() );
				setTimeout( updateTimer, time.getUTCMilliseconds() + 500 );
			}
		}
		
		element = document.getElementById( elementName );
		endTime = (+new Date) + 1000 * (60*minutes + seconds) + 500;
		updateTimer();
	},
	/** Selects currently visible data and checks if an anamoly exists
	*@memberof generalModule
	*@function checkForAnamoly
	*@returns {boolean} If anamoly is present boolean is true
	*/
	checkForAnamoly: function(){
		selectedPoints = component.getSelected();
		if (d3.select(".svg2")[0][0] == null){
			lines = new general.getPoints();
		}
		allNoise= d3.select(".svg2")[0][0] == null ? lines.noise : selectedPoints;
		if(lines.anoms){
			
			
		}
		if(allNoise){
			var currentAnoms=[]
			if (allNoise.includes("T")){
				currentAnoms =  lines.anoms.filter(function(n){ return n != 0 }); 
				console.log("currently anomoly" + currentAnoms)
			}
			var areAnomsPresent = [allNoise.includes("T"), currentAnoms]
			return areAnomsPresent
		}
		
	},
	/** Clears brush component and saves all selected data
	*@memberof generalModule
	*@function feedBack
	*/
	feedBack:function(buttonTitle, type){
		var interaction = {}; 
		var isPresent = general.checkForAnamoly();
		// console.log("is Anomoly present?", isPresent);
		// console.log('pressed page id', exports.pageId);
		timePressed = experimentr.now(exports.pageId);
		timestamp = new Date().getTime();
		var postId = experimentr.postId();

		
		console.log("button title", buttonTitle)
		console.log("is it present", isPresent)
		interaction.interactionType = type;
		interaction. buttonTitle = buttonTitle;
		interaction.timePressed = timePressed;
		interaction. postId = postId; 
		interaction.timestamp = timestamp;
		interaction.AnomalyPresent = isPresent;
		interaction.pageId = exports.pageId;
		// console.log("interaction", interaction)
		// console.log("before push")
		// console.log(interactionGroup)
		interactionGroup.push(interaction);
		// console.log("after push")
		// console.log(interactionGroup)

	},

	/* Creates a copy of all the data currently displayed 
	*@memberof generalModule
	*@function getPoints
	*/
	getPoints:function(){
		try{

		var line1 = d3.select(".line1").datum().map(function(a) {return [a.value, a.noise, a.anomCode];});

		var line2 = d3.select(".line2").datum().map(function(a) {return [a.value, a.noise, a.anomCode];});

		var line3 = d3.select(".line3").datum().map(function(a) {return [a.value, a.noise, a.anomCode];});
		

		this.points1 = line1.map(function(a){return a[0]});
		this.points2 = line2.map(function(a){return a[0]});
		this.points3 = line3.map(function(a){return a[0]});
		this.noise = line1.map(function(a){return a[1]}).concat(line2.map(function(a){return a[1]}).concat(line3.map(function(a){return a[1]})));
		
		this.noise1 = line1.map(function(a){return a[1]});
		this.noise2 = line2.map(function(a){return a[1]});
		this.noise3 = line3.map(function(a){return a[1]});

		this.anoms = line1.map(function(a){return a[2]}).concat(line2.map(function(a){return a[2]})).concat(line3.map(function(a){return a[2]}));	
		}
		catch(err) {
			return 0
		}
	},

	/*Appends the copy of the active graph to the analysis graph for the user
	*@memberof generalModule
	*@fuction addCopy 
	*/
	addCopy:function(){
		lines = new general.getPoints();
		points1 = lines.points1;
		points2 = lines.points2;
		points3 = lines.points3;
		var copy1  = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y(parseFloat(d));})
		.interpolate("basis");

		var copy2 = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y2(parseFloat(d));})
		.interpolate("basis");

		var copy3 = d3.svg.line()
		.x(function(d,i){return x(i);})
		.y(function(d){ return  y3(parseFloat(d));})
		.interpolate("basis");

		var copyPath1 =svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points1)
		.attr("class","line1 copy1")
		.attr("id","lineCopy")
		.attr("d",copy1);
		var copyPath2 = svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points2)
		.attr("class","line2 copy2")
		.attr("id","lineCopy")
		.attr("d",copy2);

		var copyPath3= svg2.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(points3)
		.attr("class","line3 copy3")
		.attr("id","lineCopy")
		.attr("d",copy3);
	}
};

