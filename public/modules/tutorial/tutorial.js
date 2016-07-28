
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
	setPageID();
	Mousetrap.bind('left', function(e, n) { checkKeyPressed(n); });
	Mousetrap.bind('right',function(e, n) { checkKeyPressed(n); });

	if(this.pageId =="tutorial2" || this.pageId =="tutorial3"){
		Mousetrap.bind('enter', function(e,n){  addCopy(); });
	}

	experimentr.hideNext();

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
	.attr('name', function(d){ return 'name' == "researchButton"; })
	.remove()


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
	if(!d3.select("g.svg2").empty()){
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

	validate();
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
		d3.select("div#tutorial2")
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
	
}

function tutorial3(i){
	switch(i){
		case 0:
		break;
		case 1:
		var mainContainer =	 d3.select('div#tutorial3')
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
		createTwoPaneExample();
		break;
	}

}

