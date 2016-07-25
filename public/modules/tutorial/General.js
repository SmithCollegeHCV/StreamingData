		step = 0;
		var n = 10;
		var tduration = 200000;

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

		var svg = d3.select(".content")
		.append("svg:svg")
		.attr("id", "container")
		.attr("width",720)
		.attr("height",450)
		.append("g");
		
		d3.select(".content").attr("align","center");

function checkKeyPressed(key) { 

			if ((key == "right") && (step < 7)) {
				step += 1;
				update(step);
			}
			else if ((key == "left") && (step  > 0)){
				step -= 1;
				update(step);
				d3.select()
			}  
		}
function validate() {

			experimentr.endTimer('demo');
			experimentr.release();

		}
function update(i){


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

			if (i == 0) {
				d3.select("#back-button").style("visibility", "hidden");
				d3.select("#forward-button").style("visibility", "visible");
			} else if (i == 7) {
				d3.select("#back-button").style("visibility", "visible");
				d3.select("#forward-button").style("visibility", "hidden");
			} else {
				d3.select("#back-button").style("visibility", "visible");
				d3.select("#forward-button").style("visibility", "visible");
			}

			console.log(i);
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
			
			case 6: 
				console.log(pageID);
				switch(pageID){
				case 'tutorial1':
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
				break;
				case 'tutorial2':
				console.log("sdhfskdhkf");
				svg.append("image")
					.attr("xlink:href", "modules/tutorial/TwoViewer.png")
					.attr("width", 720)
					.attr("height", 400)
					.attr("x",0)
					.attr("y",0);
				svg.append("text")
					.text("Moving lines will be displayed")
					.attr("x",360)
					.attr("y",390);
				svg.append("text")
					.text("on the left part")
					.attr("x",360)
					.attr("y",430);
				break;}
			break;
			case 7: 

				d3.select("#container").attr("height", 150);



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
				
				break;
			
				
			
	}


		function type(d){
			d.index = d.index;
			d.value = d.value;
			return d;
		}
}