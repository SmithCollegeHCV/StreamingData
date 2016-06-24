
init = function(){
	console.log('d1.js loaded');
	
	(function(){
		var socket = io.connect();
		socket.on('connect',function() {
      	console.log('Client has connected to the server!');
    	});
    	document.onmousemove = experimentr.sendMouseMovement(io);
		experimentr.startTimer('websocketTest')
		
	})();

	d3.select('body').selectAll('button').on('click',function(){
		pressed(d3.select(this).attr('id') , "button");
		console.log('button pressed');
		if (d3.select(this).attr('name') !== 'researchButton'){
				//stops  recording and transmitting mouse events
				document.onmousemove = experimentr.stopMouseMovementRec;
				socket.emit('disconnect');
				experimentr.next();
			};
		});


	window.addEventListener("keydown", checkKeyPressed, false);


	function checkKeyPressed(e) {
		if (e.keyCode == "13" || e.keyCode == "32") {
			pressed(e.keyCode, "key");
			console.log('key pressed')
		}
	}

	var pageId = 'd1Spd1';
	function pressed(buttonTitle, type){
		var isPresent = checkForAnamoly();
		console.log('is anomolyPresent' + isPresent); 

		var timePressed = experimentr.now('websocketTest');
		timestamp = new Date().getTime();
		// console.log('mouse pressed. Socket emit ')
		var postId = experimentr.postId();
		console.log('post id in experiment', postId);
		console.log('this is postID', postId);
		socket.emit('mouseClick',{interactionType: type, buttonTitle: buttonTitle, timePressed: timePressed, postId: postId, timestamp:timestamp, AnomalyPresent: isPresent, pageId:pageId});
	};

	var n = 80;
	var domain1 = -1.5;
	var domain2 = 1.5;
	var margin = {top:20, right:20, bottom:20, left:20},
	width = 600 - margin.left - margin.right,
	height = 500 - margin.top - margin.bottom;
	

	var x = d3.scale.linear()
	.domain([0,n-1])
	.range([0,width]);
	var y = d3.scale.linear()
	.domain([domain1, domain2])
	.range([height/3, 0]);

	var y2 = d3.scale.linear()
	.domain([domain1, domain2])
	.range([height*2/3, height/3]);

	var y3 = d3.scale.linear()
	.domain([domain1, domain2])
	.range([height, height*2/3]);
//The moving line part   

d3.select("#"+className)
	.append('div')
	.attr('id', 'test-buttons')
	.append("button")
		.text('Anomaly Detected')
		.attr('id', 'button1')
		.attr('name','researchButton');
	


var svgContainer = d3.select("#"+className).append("svg")
.attr("width", 1500)
.attr("height", 500);



var xAxis=d3.svg.axis().scale(x).orient("bottom");

var svg	= svgContainer.append("g")
.attr("transform", "translate(" +40+ "," + 20 + ")");
svg.append("g")
.attr("class","x axis")
.attr("transform","translate(0," + y(0)+")")
.call(xAxis);

svg.append("defs").append("clipPath")
.attr("id","clip")
.append("rect")
.attr("width",width)
.attr("height",height+500);

svg.append("defs").append("clipPath")
.attr("id","clip2")
.append("rect")
.attr("transform","translate(0,0)")
.attr("width",width)
.attr("height",height+500);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + y2(0) + ")")
.call(xAxis);

svg.append("g")
.attr("class", "x axis")
.attr("transform", "translate(0," + y3(0) + ")")
.call(xAxis);



var q = d3.queue();
q.defer(d3.tsv, "data/slow1.tsv")
q.defer(d3.tsv, "data/slow2.tsv")
q.defer(d3.tsv, "data/slow3.tsv")
.await(setUp); 


function setUp(error, data1, data2, data3){
	if (error) throw error;


	var disData1 = data1.slice(0,n);
	var disData2 = data2.slice(0,n);
	var disData3 = data3.slice(0,n);


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

	var path1 =svg.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(disData1)
		.attr("class","line1")
		.attr("d",line1);

	var path2 = svg.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(disData2)
		.attr("class","line2")
		.attr("d",line2);

	var path3= svg.append("g")
		.attr("clip-path","url(#clip)")
		.append("path")
		.datum(disData3)
		.attr("class","line3")
		.attr("d",line3);


	tick();

	function tick(){


		disData1.push(data1.slice(0,1)[0]);
		data1.splice(0,1);
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
		validate();
	}
	
	};
};


function checkForAnamoly(){
	allPoints = d3.select(".line3").datum().concat(d3.select(".line2").datum()).concat(d3.select(".line1").datum());
	allNoise= allPoints.map(function(a) {return a.noise;});
	console.log(allNoise);
	return allNoise.includes("T");

};

function type(d){
	d.index = +d.index;
	d.value = +d.value;
	return d;
};

function validate() {
	experimentr.endTimer('demo');
	experimentr.release();
};

}();

