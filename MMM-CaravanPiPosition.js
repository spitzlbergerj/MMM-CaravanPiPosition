/* ---------------------------------------------------------------------
 * Magic Mirror
 * Module: MMM-CaravanPiPosition
 *
 * CaravanPi Module
 * see https://github.com/spitzlbergerj/CaravanPi for more Information 
 *     about the DIY project 
 *
 * By Josef Spitzlberger http://spitzlberger.de
 * MIT Licensed.
 */

Module.register("MMM-CaravanPiPosition",{

defaults:{
	valueDir: "/home/pi/CaravanPi/values",
	updateInterval: 1000000, // milliseconds
	diffUnit: " cm",
	diffPrecision: 1,
	showDate: true,
	sensors: [
		{
			name: "Tabbert",
			file: "position",
		},
	],
	localeStr: 'de-DE',
},

valueList:[],

start: function (){
	Log.log('Starting module: ' + this.name);
	
	this.valueList = new Array();
	var i = 0;
	Log.log('sensors: ', this.config.sensors.length, this.config.sensors);
	while(i<this.config.sensors.length){
		this.valueList[i] = new Object();
		this.valueList[i]["name"] = this.config.sensors[i]["name"];
		this.valueList[i]["file"] = this.config.sensors[i]["file"];
		this.valueList[i]["datetime"] = this.translate('LOADING');
		this.valueList[i]["hl"] = "0";
		this.valueList[i]["hr"] = "0";
		this.valueList[i]["zl"] = "0";
		this.valueList[i]["zr"] = "0";
		this.valueList[i]["vl"] = "0";
		this.valueList[i]["vr"] = "0";
		this.valueList[i]["vo"] = "0";
		i+=1;
	}
	Log.log('valueList: ', this.valueList);
	this.sendSocketNotification(
		'CONFIG',
		{
			config: this.config,
			valueList: this.valueList,
		});
},

// Get translations
getTranslations: function() {
	return {
		en: "translations/en.json",
		de: "translations/de.json"
	}
},

// Get the Module CSS
getStyles: function() {
	return ["MMM-CaravanPiPosition.css"];
},


getDom: function(){

	var i = 0;
	
	var hlStr = this.prepareAttribute("HL", this.valueList[i]["hl"]/10, this.config.diffPrecision, this.config.diffUnit);
	var hrStr = this.prepareAttribute("HR", this.valueList[i]["hr"]/10, this.config.diffPrecision, this.config.diffUnit);
	var zlStr = this.prepareAttribute("ZL", this.valueList[i]["zl"]/10, this.config.diffPrecision, this.config.diffUnit);
	var zrStr = this.prepareAttribute("ZR", this.valueList[i]["zr"]/10, this.config.diffPrecision, this.config.diffUnit);
	var vlStr = this.prepareAttribute("VL", this.valueList[i]["vl"]/10, this.config.diffPrecision, this.config.diffUnit);
	var vrStr = this.prepareAttribute("VR", this.valueList[i]["vr"]/10, this.config.diffPrecision, this.config.diffUnit);
	var voStr = this.prepareAttribute("VO", this.valueList[i]["vo"]/10, this.config.diffPrecision, this.config.diffUnit);
	
	var table = document.createElement("table");
	table.className = 'MMMCPIPosition';
	table.border= '0px';
	table.margin = '2px';

	var row1 = document.createElement("tr");
	row1.className = 'leftside';
	row1.align = 'center';
	row1.vAlign = 'top';
	row1.border = "0px";
	row1.margin_bottom = "5px";
	
	var rowElement = document.createElement("td");
	rowElement.className = 'back';
	rowElement.appendChild(document.createTextNode(hlStr));
	row1.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middleback';
	row1.appendChild(rowElement);

	rowElement = document.createElement("td");
	rowElement.className = 'middle';
	rowElement.appendChild(document.createTextNode(zlStr));
	row1.appendChild(rowElement);

	rowElement = document.createElement("td");
	rowElement.className = 'middlefront';
	row1.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'front';
	rowElement.appendChild(document.createTextNode(vlStr));
	row1.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'drawbar';
	row1.appendChild(rowElement);
	
	
	var row2 = document.createElement("tr");
	row2.className = 'middleleft';
	row2.align = 'center';
	row2.vAlign = 'top';
	
	rowElement = document.createElement("td");
	rowElement.className = 'back';
	row2.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middleback';
	row2.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middle';
	row2.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middlefront';
	row2.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'front';
	row2.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'drawbar';
	row2.appendChild(rowElement);

	var row3 = document.createElement("tr");
	row3.className = 'middlecenter';
	row3.align = 'center';
	row3.vAlign = 'top';
	
	rowElement = document.createElement("td");
	rowElement.className = 'back';
	row3.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middleback';
	row3.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middle';
	row3.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middlefront';
	row3.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'front';
	row3.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'drawbar';
	rowElement.appendChild(document.createTextNode(voStr));
	row3.appendChild(rowElement);

	var row4 = document.createElement("tr");
	row4.className = 'middleright';
	row4.align = 'center';
	row4.vAlign = 'top';
	
	rowElement = document.createElement("td");
	rowElement.className = 'back';
	row4.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middleback';
	row4.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middle';
	row4.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middlefront';
	row4.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'front';
	row4.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'drawbar';
	row4.appendChild(rowElement);

	var row5 = document.createElement("tr");
	row5.className = 'rightside';
	row5.align = 'center';
	row5.vAlign = 'top';
	
	var rowElement = document.createElement("td");
	rowElement.className = 'back';
	rowElement.appendChild(document.createTextNode(hrStr));
	row5.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'middleback';
	row5.appendChild(rowElement);

	rowElement = document.createElement("td");
	rowElement.className = 'middle';
	rowElement.appendChild(document.createTextNode(zrStr));
	row5.appendChild(rowElement);

	rowElement = document.createElement("td");
	rowElement.className = 'middlefront';
	rowElement.width = '20px';
	row5.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'front';
	rowElement.appendChild(document.createTextNode(vrStr));
	row5.appendChild(rowElement);
	
	rowElement = document.createElement("td");
	rowElement.className = 'drawbar';
	row5.appendChild(rowElement);
		
	// Building of the table rows
	table.appendChild(row1);
	table.appendChild(row2);
	table.appendChild(row3);
	table.appendChild(row4);
	table.appendChild(row5);

	var wrapper = document.createElement("div")
	wrapper.className = "MMM-CaravanPiPosition";
	
	wrapper.innerHTML = table.outerHTML;
	return wrapper
},

/*
notificationReceived: function(notification, payload, sender){
	switch(notification) {
		case "DOM_OBJECTS_CREATED":
			var timer = setInterval(()=>{
				var countElm = document.getElementById("COUNT")
				this.sendSocketNotification("DO_YOUR_JOB", this.count)
				this.count++
			}, 1000)
			break
	}
},

*/

socketNotificationReceived: function(notification, payload){
	Log.log('MMM-Systemvalues: socketNotificationReceived ' + notification + payload);
	switch(notification) {
		case "VALUES":
			this.valueList = payload;
			Log.log('valueList in socketNotificationReceived: ', this.valueList);
			this.updateDom();
			break
	}
},

/**
 * Prepare the output of the given attribute. Reads the attributeName from the
 * settingsArray and do further processing on it, i.e. to display the value with the
 * unit (temperature, valve state) or anything else.
 * Can be used in the future to prepare any other attributes for output.
 */
prepareAttribute: function(attributeName, strValue, precision, unit){
	var preparedAttributeValue = "";
	var floatValue;
	switch(attributeName){
		case "HL":
		case "HR":
		case "ZL":
		case "ZR":
		case "VL":
		case "VR":
		case "VO":
			floatValue = Number(parseFloat(strValue));
			preparedAttributeValue = floatValue.toLocaleString(this.config.localeStr, {minimumFractionDigits: precision, maximumFractionDigits: precision}) + unit;

			// value < 0 means too low
			if (floatValue < 0) 
			{
				preparedAttributeValue = "▲ "+preparedAttributeValue
			}
			else if (floatValue > 0) 
			{
				preparedAttributeValue = "▼ "+preparedAttributeValue 
			}
			else 
			{
				preparedAttributeValue = "⇔ "+preparedAttributeValue
				
			}

			break;
	}
	return preparedAttributeValue;
}, 

})