
var components =  require('../conditions/conditionComponents')

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
.attr("width",720)
.attr("height",450)
.append("g");

d3.select(".content").attr("align","center");

var introPages = 6;
var exitPages = 2;
var tutorial1Pages = 0;
var tutorial2Pages = 1;
var tutorial3Pages = 3;
var tutorialPages = 0;

var pageId = null;
var step = 0;
setPageID();


 initTutorial = function(){
	Mousetrap.bind('left', function(e, n) { checkKeyPressed(n); });
	Mousetrap.bind('right',function(e, n) { checkKeyPressed(n); });
	experimentr.hideNext();
}()

function setPageID(){
	this.pageId = d3.select("#module").selectAll("div")[0][0].getAttribute('id')

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
		} else if (step == introPages+ exitPages + tutorialPages - 1) {
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
}


function keepInBounds(step){
	if (step < 0){
		step = 0;
	}

	if (step > introPages + tutorialPages + exitPages){
		step = introPages + tutorialPages + exitPages; 
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

	// console.log('introPages + tutorialPages' , introPages + tutorialPages)
	// console.log('introPages', introPages)
	// console.log('introPages + tutorialPages + exitPages',introPages + tutorialPages + exitPages)
	
	if(step >= 0 && step <= introPages - 1){
		introduction(step)
		console.log('introduction')
	}else if(step > introPages - 1 && step <= introPages + tutorialPages){

		if(pageId == 'tutorial1'){
			tutorial1(step-introPages)
			console.log('tutorial1')
		}else if(pageId == 'tutorial2'){
			console.log('tutorial2')
			tutorial2(step-introPages)
		}else{
			tutorial3(step-introPages)
			console.log('tutorial3')
		}
		//the tutorial 
	}else if(step > introPages + tutorialPages && step <= introPages + tutorialPages + exitPages){
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
				if(data1.length>=1){
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
				}else{
					validate();
				}

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
		console.log('tutorial1 step ',i )
	switch(i){
		case 0: 
			svg.append("image")
			.attr("xlink:href", "modules/tutorial/TwoViewer.png")
			.attr("width", 720)
			.attr("height", 400)
			.attr("x",0)
			.attr("y",0);

			svg.append("text")
			.text("You must focus on a section of the chart using the Enter Button and it will disply on the left pane")
			.attr("x",360)
			.attr("y",390);

			svg.append("text")
			.text("After choosing a section you should highlight the anomoly with your mouse")
			.attr("x",360)
			.attr("y",430);
		break;
		case 1: 
			createTwoPaneExample()
			
	}
}

function createTwoPaneExample(className){

		var svgContainer = d3.select("svg#container")

		components.createGraphViewer();
		components.addGraph(svgContainer,'../data/file0.tsv','../data/file1.tsv','../data/file2.tsv',100)
		components.createCopyViewer(svgContainer)
		components.addSubmitButton(svgContainer)
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
	d3.select("#container").attr("height", 450);
	experimentr.hideNext();
}

