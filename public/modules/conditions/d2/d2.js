general = require("../General");
component = require("../conditionComponents");

/**
*Difficulty Two Module. Creates the Difficulty two template. Loads vars based on html id and starts the condition
*@module d2
*@requires general
*@requires conditionComponents
*/
init = function(){
	console.log('d2.js loaded');
	
	window.addEventListener("keydown", general.checkKeyPressed, false);
	var currentPage = d3.select("#module").selectAll("div")[0][1].getAttribute("id");
	var slice = currentPage.slice(-1);
	console.log("slice", slice);

	if(slice == 1){
		d3.json("modules/conditions/d2/spd1/d2Vars1.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}else if(slice == 2){
		d3.json("modules/conditions/d2/spd2/d2Vars2.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})

 	}else{
 		d3.json("modules/conditions/d2/spd0/d2Vars0.json", function(error, data){
			startCondition(data.vars.className, data.vars.dataPath1, data.vars.dataPath2, data.vars.dataPath3, data.vars.duration);
		})
	}

	startCondition= function(className, path1, path2, path3, duration){
		console.log('classname in start condition', className);
		experimentr.startTimer(className);
		experimentr.hideNext();
		general.setPageVars(className);
		component.createGraphViewer(className);
		component.createCopyViewer(className);
		component.addSubmitButton(className);
    	component.addGraph(className, path1, path2, path3,duration);
	};

	general.countdown( "countdown", 5, 0);
	
}();

