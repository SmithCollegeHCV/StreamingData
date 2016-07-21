
/**
*Difficulty One Module. Creates the Difficulty one template. 
*@module d1 
*@requires general
*@requires conditionComponents
*/

general = require("../General");
component = require("../conditionComponents");

init = function(){
	console.log('d1.js loaded');
	//general.connectSockets();
	

	window.addEventListener("keydown", general.checkKeyPressed, false);
	var currentPage = d3.select("#module").selectAll("div")[0][1].getAttribute("id");
	var slice = currentPage.slice(-1);
	console.log("slice", slice);

	if(slice == 1){
		d3.json("modules/conditions/d1/spd1/d1Vars1.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}else if(slice == 2){
		d3.json("modules/conditions/d1/spd2/d1Vars2.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})

 	}else{
 		d3.json("modules/conditions/d1/spd0/d1Vars0.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}

	startCondition= function(className, path1, path2, path3, duration){
		console.log('classname in start condition', className);
		experimentr.startTimer(className);
		general.setPageVars(className);
		component.createGraphViewer(className);
    	component.addGraph(className, path1, path2, path3,duration);
	};

	general.countdown( "countdown", 5, 0 );

	
}();

