(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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
				// console.log("currently anomoly" + currentAnoms)
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


},{}],2:[function(require,module,exports){
/**

*@nameSpace ComponentsModule
*/

/**
*These functions set up the diffrent visual components that apply across conditions
*@module conditionComponents
*/


n = 80;
var domain1 = -2.5;
var domain2 = 2.5;
var margin = {top:20, right:20, bottom:20, left:20},
width = 600 - margin.left - margin.right,
height = 500 - margin.top - margin.bottom;


x = d3.scale.linear()
.domain([0,n-1])
.range([0,width]);

y = d3.scale.linear()
.domain([domain1, domain2])
.range([height/3, 0]);

y2 = d3.scale.linear()
.domain([domain1, domain2])
.range([height*2/3, height/3]);

y3 = d3.scale.linear()
.domain([domain1, domain2])
.range([height, height*2/3]);

var selectedPoints=[];


module.exports = {
	/** Creates the buttons for detecting an anamoly and also the axis and container for graphs
	*@memberof ComponentsModule
	*@function createGraphViewer
	*/ 
	createGraphViewer:function(className){
		general.test();

		if(className.substring(0,2)=="d1"){
			component.addAnomalyButton(className);
		}

		var svgContainer = d3.select("#"+className).append("svg")
		.attr("width", 1500)
		.attr("height", 500);

		var xAxis=d3.svg.axis().scale(x).orient("bottom");

		svg1 = svgContainer.append("g")
		.attr("class","svg1")
		.attr("transform", "translate(" +40+ "," + 20 + ")");

		svg1.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0," + y(0)+")")
		.call(xAxis);

		svg1.append("defs").append("clipPath")
		.attr("id","clip")
		.append("rect")
		.attr("width",width)
		.attr("height",height+500);

		svg1.append("defs").append("clipPath")
		.attr("id","clip2")
		.append("rect")
		.attr("transform","translate(0,0)")
		.attr("width",width)
		.attr("height",height+500);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y2(0) + ")")
		.call(xAxis);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + y3(0) + ")")
		.call(xAxis);

		var borderPath = svg1.append("rect")
		.attr("class","border")
		.attr("x",0)
		.attr("y",0)
		.attr("width",width)
		.attr("height",height)
		.style("stroke","#A4A4A4")
		.style("fill","none")
		.style("stroke-width",3)
		.attr("rx",20)
		.attr("ry",20);
	},
	/** Adds the button for condition one based on className
	*@memberof ComponentsModule
	*@function addAnomalyButton
	*@param {string} className
	*/
	addAnomalyButton:function(className){
		d3.select("#"+className)
		.append('div')
		.attr('id', 'test-buttons')
		.append("button")
		.text('Anomaly Detected')
		.attr('id', 'button1')
		.attr('name','researchButton')
		.on('click',function(){
			general.pressed(d3.select(this).attr('id') , "button");
			// console.log(' research button pressed'+ d3.select(this).attr('id'));
		});
	},
	/** Imports data files and adds lines to the graph container 
	*@memberof ComponentsModule
	*@function addGraph
	*/
	addGraph:function(className, dataPath1, dataPath2, dataPath3, duration){
		var q = d3.queue();
		q.defer(d3.tsv, dataPath1)
		q.defer(d3.tsv, dataPath2)
		q.defer(d3.tsv, dataPath3)
		.await(setUp); 

		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,n);
			var disData2 = data2.slice(0,n);
			var disData3 = data3.slice(0,n);
			
			data1.splice(0,n);
			data2.splice(0,n);
			data3.splice(0,n);

			var line1  = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y(parseFloat(d.value));})
			.interpolate("basis");

			var line2 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y2(parseFloat(d.value));})
			.interpolate("basis");

			var line3 = d3.svg.line()
			.x(function(d,i){return x(i);})
			.y(function(d){ return  y3(parseFloat(d.value));})
			.interpolate("basis");

			var path1 =svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("d",line1);

			var path2 = svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("d",line2);

			var path3= svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData3)
			.attr("class","line3")
			.attr("d",line3);

			tick();

			function tick(){

				disData1.push(data1.slice(0,1)[0]);
				data1.splice(0,1);

				if((!d3.select('#countdown').empty()) && d3.select('#countdown').html() == "countdown's over!"){
					data1=[];
				}

				if(data1.length>=1){
					path1
					.attr("d",line1)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData1.shift();

					disData2.push(data2.slice(0,1)[0]);
					data2.splice(0,1);
					path2
					.attr("d",line2)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					disData2.shift();

					disData3.push(data3.slice(0,1)[0]);;
					data3.splice(0,1);
					path3
					.attr("d",line3)
					.attr("transform",null)
					.transition()
					.duration(duration)
					.ease("linear")
					.attr("transform", "translate(" + x(-1) + ",0)")
					.each("end",tick);
					disData3.shift();
				}else{
					general.validate();

				}

			};
		};
	},
/** Creates the view for selected data for the view to analyze
*@memberof ComponentsModule
*@function createCopyViewer
*@param {string} className indicates what id to attach to 
*/
createCopyViewer:function(className){

	brush = d3.svg.brush()
		.x(x)
		.on("brushend",component.brushed);

	var xAxis=d3.svg.axis().scale(x).orient("bottom");
	
	var svgContainer = d3.select("svg")
	
	svg2 = svgContainer.append("g")
	.attr("class","svg2")
	.attr("transform", "translate(" +650+ "," + 20 + ")");
	
	svg2.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + y(0)+")")
	.call(xAxis);

	svg2.append("defs").append("clipPath")
	.attr("id","clip")
	.append("rect")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("defs").append("clipPath")
	.attr("id","clip2")
	.append("rect")
	.attr("transform","translate(0,0)")
	.attr("width",width)
	.attr("height",height+500);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y2(0) + ")")
	.call(xAxis);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + y3(0) + ")")
	.call(xAxis);

	var borderPath = svg2.append("rect")
	.attr("class","border")
	.attr("x",0)
	.attr("y",0)
	.attr("width",width)
	.attr("height",height)
	.style("stroke","#A4A4A4")
	.style("fill","none")
	.style("stroke-width",3)
	.attr("rx",20)
	.attr("ry",20);
	

},

addSubmitButton : function(className){
	var submitButton = d3.select("#"+className)
	.append("button")
	.text('submit')
	.attr('class', 'submitButton')
	.attr('name','researchButton');
}, 

addCatagoryButtons: function(className){

	var mainContainer =	 d3.select('#'+className)
	.append("div")
	.attr('id', "catagoryButtonContainer");

	var stretchButton = mainContainer
		.append('button')
		.text('Stretched Anomaly')
		.attr("class", "catagoryButtons")
		.attr('name', 'stretch');

	var compressedButton = mainContainer
		.append('button')
		.text('Compressed Anomaly')
		.attr('class', 'catagoryButtons')
		.attr('name', 'compress');

	var spikeButton  = mainContainer
		.append('button')
		.text('Spike Anomaly')
		.attr('class', 'catagoryButtons')
		.attr('name', 'spike');
},
/** creates brush component for user graph analysis
*@memberof ComponentsModule
*@function addBrush
*/
addBrush:function(){
	// console.log("add Brush called")
	svg2.append("g")
	.attr("class","brush")
	.call(brush)
	.selectAll("rect")
	.attr("height",height);
},

/*Creates an array of data selected by brush component
*@memberof ComponentsModule
*@function brushed
*/
brushed:function(){
	var extent = brush.extent();
	var min = Math.round(extent[0]);
	var max = Math.round(extent[1]);
	// console.log("min"+ min+ "max" + max);
	if (d3.select(".copy3")[0][0] != null){
		selectedPoints = lines.noise1.slice(min,max).concat(lines.noise2.slice(min,max)).concat(lines.noise3.slice(min,max));
		// console.log('in create components: selected Points = ',selectedPoints);
	}
},

/** a getter method for the selected points from brush for the General module
*@memberof ComponentsModule
*@function getSelected
*@returns {string|Array} all selected points of brush component
*/
getSelected: function(){
	return selectedPoints;
}
}
},{}],3:[function(require,module,exports){

general =  require('../conditions/general')
component = require('../conditions/conditionComponents')

step = 0;
var n = 10;
var tduration = 200000;
var tduration2 = 100;

var tx = d3.scale.linear()
.domain([0,40])
.range([0,350]);

var tx2 = d3.scale.linear()
.domain([0,10])
.range([0,350]);			
var ty = d3.scale.linear()
.domain([-0.6,0.6])
.range([200,0]);

var ty1 = d3.scale.linear()
.domain([-2.5, 2.5])
.range([150, 50]);

var ty2 = d3.scale.linear()
.domain([-2.5, 2.5])
.range([250, 150]);

var ty3 = d3.scale.linear()
.domain([-2.5, 2.5])
.range([350, 250]);

var tmargin = {top:20, right:20, bottom:20, left:20},
 twidth = 600 - tmargin.left - tmargin.right,
 theight = 500 - tmargin.top - tmargin.bottom;

var svg = d3.select(".content")
.append("svg:svg")
.attr("id", "container")
.attr("width",1500)
.attr("height",500)
.append("g");

d3.select(".content").attr("align","center");

var introPages = 6;
var exitPages = 1;
var tutorial1Pages = 0;
var tutorial2Pages = 2;
var tutorial3Pages = 2;
var tutorialPages = 0;

var pageId = null;
var step = -1;



 initTutorial = function(){
	Mousetrap.bind('left', function(e, n) { checkKeyPressed(n); });
	Mousetrap.bind('right',function(e, n) { checkKeyPressed(n); });
	Mousetrap.bind('enter', function(e,n){  addCopy(); });
	experimentr.hideNext();
	setPageID();
}()

function setPageID(){
	this.pageId = d3.select("#module").selectAll("div")[0][0].getAttribute('id')
	console.log('PAGE ID',this.pageId);

	if(pageId == "tutorial1"){
		tutorialPages = tutorial1Pages;
	}else if(pageId == "tutorial2"){
		tutorialPages = tutorial2Pages;
	}else{
		tutorialPages = tutorial3Pages;
	}
	
}

function setArrowDirection(step){
	if (step == 0) {
			d3.select("#back-button").style("visibility", "hidden");
			d3.select("#forward-button").style("visibility", "visible");
		} else if (step == introPages+ exitPages + tutorialPages-1) {
			d3.select("#back-button").style("visibility", "visible");
			d3.select("#forward-button").style("visibility", "hidden");
		} else {
			d3.select("#back-button").style("visibility", "visible");
			d3.select("#forward-button").style("visibility", "visible");
		}
}

function removePrevious(){
	svg.selectAll(".line")
	.remove();
	svg.selectAll("text")
	.remove();
	svg.selectAll("#line")
	.remove();
	svg.selectAll("image")
	.remove();
	d3.selectAll("g.svg2")
	.remove();
	d3.selectAll("g.svg1")
	.remove();

	d3.selectAll("button")
	.remove();


	d3.select("svg#container")
	.attr("width", 750);
}


function keepInBounds(step){
	if (step < 0){
		step = 0;
	}

	if (step > introPages + tutorialPages + exitPages-1){
		step = introPages + tutorialPages + exitPages-1; 
	}
	return step
}

function checkKeyPressed(key) {
	if (key == "right") {
		step += 1;
	}
	else if (key == "left"){
		step -= 1;
	}

	step =  keepInBounds(step)
	removePrevious()
	setArrowDirection(step)
	console.log('step', step)

	console.log('introPages + tutorialPages' , introPages + tutorialPages)
	console.log('introPages', introPages)
	console.log('introPages + tutorialPages + exitPages',introPages + tutorialPages + exitPages)
	
	if(step >= 0 && step <= introPages - 1){
		introduction(step)
		console.log('introduction')
	}else if(step > introPages - 1 && step <introPages + tutorialPages){

		if(this.pageId == 'tutorial1'){
			tutorial1(step-introPages)
			console.log('tutorial1')
		}else if(this.pageId == 'tutorial2'){
			console.log('tutorial2')
			tutorial2(step-introPages)
		}else{
			tutorial3(step-introPages)
			console.log('tutorial3')
		}
		//the tutorial 
	}else if(step >= introPages + tutorialPages && step <= introPages + tutorialPages + exitPages-1){
		//the exit 
		exit(step - introPages - tutorialPages)
	}else{
		//see if I missed something. 
		console.log("this is whate")
	}
}

function validate() {
	experimentr.endTimer('demo');
	experimentr.release();
}

function addCopy(){

		var linesOnDisplay = d3.selectAll("#lineCopy");
		linesOnDisplay.remove();


		lines = new general.getPoints();
		points1 = lines.points1;
		points2 = lines.points2;
		points3 = lines.points3;
		var copy1  = d3.svg.line()
		.x(function(d,i){return tx(i);})
		.y(function(d){ return  ty1(parseFloat(d));})
		.interpolate("basis");

		var copy2 = d3.svg.line()
		.x(function(d,i){return tx(i);})
		.y(function(d){ return  ty2(parseFloat(d));})
		.interpolate("basis");

		var copy3 = d3.svg.line()
		.x(function(d,i){return tx(i);})
		.y(function(d){ return  ty3(parseFloat(d));})
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

function introduction(i){
	console.log(i)
	switch(i){

	case 0||1:

		var fileName = "data/file"+i+".tsv";
		var modelName = "data"+i;
		
		
		d3.tsv(fileName, type, function(error,data){

			var line = d3.svg.line()
			.x(function(d,i){return tx2(d.index);})
			.y(function(d,i){return ty(d.value);})
			.interpolate("cardinal");

			var path = svg.append("g")
			.append("path")
			.datum(data)
			.attr("class","line")
			.attr("d",line)
			.transition()
			.duration(tduration)
			.ease("linear")
			.attr("transform","translate("+tx(-1999)+",0)");
		});	

		var stringList = ["This is a normal pattern.", "This is also a normal pattern."];

		svg.append("text")
		.text(stringList[i])
		.attr("x",360)
		.attr("y",250);
		break;
		
		case 2: 

		var q = d3.queue();
		q.defer(d3.tsv, "data/slow1.tsv")
		q.defer(d3.tsv, "data/slow2.tsv")
		q.defer(d3.tsv, "data/slow3.tsv")
		.await(setUp); 


		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,80);
			var disData2 = data2.slice(0,80);
			var disData3 = data3.slice(0,80);


			var line1  = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty1(parseFloat(d.value));})
			.interpolate("basis");

			var line2 = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty2(parseFloat(d.value));})
			.interpolate("basis");

			var line3 = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty3(parseFloat(d.value));})
			.interpolate("basis");

			var path1 =svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("id","line")
			.attr("d",line1);

			var path2 = svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("id","line")
			.attr("d",line2);

			var path3= svg.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData3)
			.attr("class","line3")
			.attr("id","line")
			.attr("d",line3);

			svg.append("text")
			.text("During the experiment, you will be asked to monitor")
			.attr("x",360)
			.attr("y",370);

			svg.append("text")
			.text("3 lines simultaneously.")
			.attr("x",360)
			.attr("y",400)
			.style("font-weight", "bold");


			tick();

			function tick(){


				disData1.push(data1.slice(0,1)[0]);
				data1.splice(0,1);
				
					path1
					.attr("d",line1)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					disData1.shift();

					disData2.push(data2.slice(0,1)[0]);
					data2.splice(0,1);
					path2
					.attr("d",line2)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					disData2.shift();

					disData3.push(data3.slice(0,1)[0]);;
					data3.splice(0,1);
					path3
					.attr("d",line3)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					.each("end",tick);
					disData3.shift();
				

			};




		};

		break;
		
		case 3:

			svg.append("image")
			.attr("xlink:href", "modules/tutorial/anomaly.png")
			.attr("width", 720)
			.attr("height", 400)			
			.attr("x",0)
			.attr("y",0);

			svg.append("text")
			.text("There might be some values that look odd.")
			.attr("x",360)
			.attr("y",370);

			svg.append("text")
			.text("This is an ANOMALY.")
			.attr("x",360)
			.attr("y",400);

		break;

		case 4:

			svg.append("image")
			.attr("xlink:href", "modules/tutorial/compress.png")
			.attr("width", 720)
			.attr("height", 400)
			.attr("x",0)
			.attr("y",0);

			svg.append("text")
			.text("Sometimes the pattern might stretch or compress.")
			.attr("x",360)
			.attr("y",370);

			svg.append("text")
			.text("This is ALSO an ANOMALY.")
			.attr("x",360)
			.attr("y",400);

		break;

		case 5:

			svg.append("image")
			.attr("xlink:href", "modules/tutorial/several.png")
			.attr("width", 720)
			.attr("height", 400)
			.attr("x",0)
			.attr("y",0);

			svg.append("text")
			.text("Anomalies may appear")
			.attr("x",260)
			.attr("y",370);
			
			svg.append("text")
			.text("in multiple lines")
			.attr("x",475)
			.attr("y",370)
			.style("font-weight", "bold");

			svg.append("text")
			.text("at the same time.")
			.attr("x",360)
			.attr("y",400);

		break;
	function type(d){
			d.index = d.index;
			d.value = d.value;
			return d;
		}
}
}

function exit(i){
			svg.append("text")
			.style("font-weight", "bold")
			.text("This completes the tutorial.")
			.attr("x",360)
			.attr("y",50);

			svg.append("text")
			.text("When you are ready to begin the experiment,")
			.attr("x",360)
			.attr("y",80);

			svg.append("text")
			.text('please click the button "Next" below.')
			.attr("x",360)
			.attr("y",110);

			experimentr.showNext();
			experimentr.release();	
}


function tutorial1(i){
	svg.append("text")
	.text("Whenever you see an ANOMALY")
	.attr("x",360)
	.attr("y",50);

	svg.append("text")
	.text("(shrinking, stretching or odd-looking value),")
	.attr("x",360)
	.attr("y",80);

	svg.append("text")
	.text("press the ENTER key, SPACEBAR, or click the \"Report Anomaly\" button.")
	.attr("x",360)
	.attr("y",110);

	svg.append('text')
	.text('In addition to the base rate for this HIT,')
	.attr("x",360)
	.attr("y",170);

	svg.append('text')
	.text("you will receive a bonus of $0.10")
	.attr("x",360)
	.attr("y",200);
	
	svg.append('text')
	.text("for accurately identifying each anomaly.")
	.attr("x",360)
	.attr("y",230);

	svg.append("text")
	.text("If you correctly identify all anomalies with no errors,")
	.attr("x",360)
	.attr("y",290);

	svg.append("text")
	.text("you will receive an additional bonus of $0.25.")
	.attr("x",360)
	.attr("y",320);	
}

function tutorial2(i){
	
		console.log('tutorial2 step ', i )
	switch(i){
		case 0: 
		d3.select("svg#container")
		.attr("width", 1000);
			svg.append("image")
			.attr("xlink:href", "modules/tutorial/TwoViewer.png")
			.attr("width", 720)
			.attr("height", 400)
			.attr("x",200)
			.attr("y",0);

			svg.append("text")
			.text("You must focus on a section of the chart using the Enter Button ")
			.attr("x",550)
			.attr("y",400);

			svg.append("text")
			.text("and it will disply on the left pane")
			.attr("x",550)
			.attr("y",440);

			svg.append("text")
			.text("After choosing a section you should highlight the anomoly with your mouse")
			.attr("x",550)
			.attr("y",480);
		break;
		case 1: 
			createTwoPaneExample("tutorial2")
		break;		
	}
}

function createTwoPaneExample(className){
	d3.select("svg#container")
	.attr("width", 1500);
	


	var svgContainer = d3.select("svg#container");

		var xAxis=d3.svg.axis().scale(x).orient("bottom");

		svg1 = svgContainer.append("g")
		.attr("class","svg1")
		.attr("transform", "translate(" +50+ "," + 20 + ")");

		svg1.append("g")
		.attr("class","x axis")
		.attr("transform","translate(0," + ty1(0)+")")
		.call(xAxis);

		svg1.append("defs").append("clipPath")
		.attr("id","clip")
		.append("rect")
		.attr("width",twidth)
		.attr("height",theight+500);

		svg1.append("defs").append("clipPath")
		.attr("id","clip2")
		.append("rect")
		.attr("transform","translate(0,0)")
		.attr("width",twidth)
		.attr("height",theight+500);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + ty2(0) + ")")
		.call(xAxis);

		svg1.append("g")
		.attr("class", "x axis")
		.attr("transform", "translate(0," + ty3(0) + ")")
		.call(xAxis);

		var borderPath = svg1.append("rect")
		.attr("class","border")
		.attr("x",0)
		.attr("y",0)
		.attr("width",twidth)
		.attr("height",theight-75)
		.style("stroke","#A4A4A4")
		.style("fill","none")
		.style("stroke-width",3)
		.attr("rx",20)
		.attr("ry",20);


		
	svg2 = svgContainer.append("g")
	.attr("class","svg2")
	.attr("transform", "translate(" +650+ "," + 20 + ")");
	
	svg2.append("g")
	.attr("class","x axis")
	.attr("transform","translate(0," + ty(0)+")")
	.call(xAxis);

	svg2.append("defs").append("clipPath")
	.attr("id","clip")
	.append("rect")
	.attr("width",twidth)
	.attr("height",theight+500);

	svg2.append("defs").append("clipPath")
	.attr("id","clip2")
	.append("rect")
	.attr("transform","translate(0,0)")
	.attr("width",twidth)
	.attr("height",theight+500);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + ty2(0) + ")")
	.call(xAxis);

	svg2.append("g")
	.attr("class", "x axis")
	.attr("transform", "translate(0," + ty3(0) + ")")
	.call(xAxis);

	var borderPath = svg2.append("rect")
	.attr("class","border")
	.attr("x",0)
	.attr("y",0)
	.attr("width",twidth)
	.attr("height",theight-75)
	.style("stroke","#A4A4A4")
	.style("fill","none")
	.style("stroke-width",3)
	.attr("rx",20)
	.attr("ry",20);
	
	brush = d3.svg.brush()
		.x(x)
		.on("brushend",brushed);

	svg2.append("g")
	.attr("class","brush")
	.call(brush)
	.selectAll("rect")
	.attr("height",theight-75);


	function brushed () {
		var extent = brush.extent();
		var min = Math.round(extent[0]);
		var max = Math.round(extent[1]);
	}

	
	var q = d3.queue();
		q.defer(d3.tsv, "data/slow1.tsv")
		q.defer(d3.tsv, "data/slow2.tsv")
		q.defer(d3.tsv, "data/slow3.tsv")
		.await(setUp); 


		function setUp(error, data1, data2, data3){
			if (error) throw error;


			var disData1 = data1.slice(0,80);
			var disData2 = data2.slice(0,80);
			var disData3 = data3.slice(0,80);


			var line1  = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty1(parseFloat(d.value));})
			.interpolate("basis");

			var line2 = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty2(parseFloat(d.value));})
			.interpolate("basis");

			var line3 = d3.svg.line()
			.x(function(d,i){return tx(i);})
			.y(function(d){ return  ty3(parseFloat(d.value));})
			.interpolate("basis");

			var path1 =svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData1)
			.attr("class","line1")
			.attr("id","line")
			.attr("d",line1);

			var path2 = svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData2)
			.attr("class","line2")
			.attr("id","line")
			.attr("d",line2);

			var path3= svg1.append("g")
			.attr("clip-path","url(#clip)")
			.append("path")
			.datum(disData3)
			.attr("class","line3")
			.attr("id","line")
			.attr("d",line3);


			tick();

			function tick(){


				disData1.push(data1.slice(0,1)[0]);
				data1.splice(0,1);
				
					path1
					.attr("d",line1)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					disData1.shift();

					disData2.push(data2.slice(0,1)[0]);
					data2.splice(0,1);
					path2
					.attr("d",line2)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					disData2.shift();

					disData3.push(data3.slice(0,1)[0]);;
					data3.splice(0,1);
					path3
					.attr("d",line3)
					.attr("transform",null)
					.transition()
					.duration(100)
					.ease("linear")
					.attr("transform", "translate(" + tx(-1) + ",0)")
					.each("end",tick);
					disData3.shift();
				

			};

		};

	d3.select("div#"+className)
	.append("button")
	.text('submit')
	.attr('class', 'submitButton')
	.attr('name','researchButton')
	.on("click", function(){
		d3.selectAll(".brush").remove();


		svg2.append("g")
		.attr("class","brush")
		.call(brush)
		.selectAll("rect")
		.attr("height",theight-75);

		d3.select(".brush").call(brush.clear());
	});

	
}

function tutorial3(i){

}

function setup(){
	svg.selectAll(".line")
	.remove();
	svg.selectAll("text")
	.remove();
	svg.selectAll("#line")
	.remove();
	svg.selectAll("image")
	.remove();
	d3.select("svg#container").attr("height", 450);
	experimentr.hideNext();

}


},{"../conditions/conditionComponents":2,"../conditions/general":1}]},{},[3]);
