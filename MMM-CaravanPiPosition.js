/* ---------------------------------------------------------------------
 * Magic Mirror
 * Module: MMM-CaravanPiGasWeight
 *
 * CaravanPi Module
 * see https://github.com/spitzlbergerj/CaravanPi for more Information 
 *     about the DIY project 
 *
 * By Josef Spitzlberger http://spitzlberger.de
 * MIT Licensed.
 */

Module.register("MMM-CaravanPiGasWeight",{

defaults:{
	valueDir: "/home/pi/CaravanPi/values",
	updateInterval: 100000, // milliseconds
	tempUnit: " °C",
	humUnit: " %",
	pressUnit: " hPa",
	tempPrecision: 2,
	humPrecision: 2,
	pressPrecision: 2,
	showDate: true,
	sensors: [
		{
			name: "Innenraum",
			file: "BME280-96-118",
		},
		{
			name: "Außenbereich",
			file: "BME280-96-119",
		},
	],
	localeStr: 'de-DE',
	style: "lines",
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
		this.valueList[i]["temperature"] = "0";
		this.valueList[i]["pressure"] = "0";
		this.valueList[i]["humidity"] = "0";
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
	return ["MMM-CaravanPiClimate.css"];
},


getDom: function(){
	var table = document.createElement("table");
	table.border = 0;
	
	if (this.config.style == "boxes") {
		var boxRow = document.createElement("tr");
		boxRow.className = 'sensorBoxRow';
		boxRow.vAlign = 'top';
	}

	var i = 0;
	while (i<this.config.sensors.length) {
		var temperatureStr = this.prepareAttribute("TEMPERATURE", this.valueList[i]["temperature"], this.config.tempPrecision, this.config.tempUnit);
		var pressureStr = this.prepareAttribute("PRESSURE", this.valueList[i]["pressure"], this.config.pressPrecision, this.config.pressUnit);
		var humidityStr = this.prepareAttribute("HUMIDITY", this.valueList[i]["humidity"], this.config.humPrecision, this.config.humUnit);

		if (this.config.style == "lines") {
			var row = document.createElement("tr");
			row.className = 'sensorContainer';
			row.vAlign = 'top';
			
			var rowSensor = document.createElement("td");
			rowSensor.className = 'sensorName';
			rowSensor.width = '120px';
			rowSensor.appendChild(document.createTextNode(this.valueList[i]["name"]));
			
			var rowTemperature = document.createElement("td");
			rowTemperature.className = 'sensorTemp';
			rowTemperature.width = '60px';
			rowTemperature.appendChild(document.createTextNode(temperatureStr));
			
			var rowPressure = document.createElement("td");
			rowPressure.className = 'sensorPress';
			rowPressure.width = '60px';
			rowPressure.appendChild(document.createTextNode(pressureStr));
			
			var rowHumidity = document.createElement("td");
			rowHumidity.className = 'sensorHum';
			rowHumidity.width = '60px';
			rowHumidity.appendChild(document.createTextNode(humidityStr));
			
			var rowDate = document.createElement("td");
			rowDate.className = 'sensorDate';
			rowDate.width = '60px';
			rowDate.appendChild(document.createTextNode(this.valueList[i]["datetime"]));
			
			// Building of the table row
			row.appendChild(rowSensor);
			row.appendChild(rowTemperature);
			row.appendChild(rowPressure);
			row.appendChild(rowHumidity);
			
			if(this.config.showDate === true) {
				row.appendChild(rowDate);
			}
			
			table.appendChild(row);
		}
		else if (this.config.style == "boxes") {
			var boxRowElement = document.createElement("td");
			
			var tableInner = document.createElement("table");
			tableInner.border= '1px';
			tableInner.margin = '2px';
	
			var row1 = document.createElement("tr");
			row1.className = 'sensorContainer';
			row1.align = 'center';
			row1.vAlign = 'top';
			row1.border_bottom = "1px";
			row1.margin_bottom = "5px";
			
			var rowSensor = document.createElement("td");
			rowSensor.className = 'sensorName';
			rowSensor.appendChild(document.createTextNode(this.valueList[i]["name"]));
			
			row1.appendChild(rowSensor);
			
			var row2 = document.createElement("tr");
			row2.className = 'sensorContainer';
			row2.align = 'center';
			row2.vAlign = 'top';
			
			var rowTemperature = document.createElement("td");
			rowTemperature.className = 'sensorTemp';
			rowTemperature.appendChild(document.createTextNode(temperatureStr));
			
			row2.appendChild(rowTemperature);
			
			var row3 = document.createElement("tr");
			row3.className = 'sensorContainer';
			row3.align = 'center';
			row3.vAlign = 'top';
			
			var rowPressure = document.createElement("td");
			rowPressure.className = 'sensorPress';
			rowPressure.appendChild(document.createTextNode(pressureStr));
			
			row3.appendChild(rowPressure);
			
			var row4 = document.createElement("tr");
			row4.className = 'sensorContainer';
			row4.align = 'center';
			row4.vAlign = 'top';
			
			var rowHumidity = document.createElement("td");
			rowHumidity.className = 'sensorHum';
			rowHumidity.appendChild(document.createTextNode(humidityStr));
			
			row4.appendChild(rowHumidity);
			
			var row5 = document.createElement("tr");
			row5.className = 'sensorContainer';
			row5.align = 'center';
			row5.vAlign = 'top';
			
			var rowDate = document.createElement("td");
			rowDate.className = 'sensorDate';
			rowDate.appendChild(document.createTextNode(this.valueList[i]["datetime"]));
			
			row5.appendChild(rowDate);
			
			// Building of the table rows
			tableInner.appendChild(row1);
			tableInner.appendChild(row2);
			tableInner.appendChild(row3);
			tableInner.appendChild(row4);
			
			if(this.config.showDate === true) {
				tableInner.appendChild(row5);
			}
			boxRowElement.appendChild(tableInner)
			boxRow.appendChild(boxRowElement);
		}
		i+=1;
	}
	
	if (this.config.style == "boxes") {
		table.appendChild(boxRow);
	}

	var wrapper = document.createElement("div")
	wrapper.className = "MMM-CaravanPiClimate";
	
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
	switch(attributeName){
		case "TEMPERATURE":
		case "PRESSURE":
		case "HUMIDITY":
			preparedAttributeValue = Number(parseFloat(strValue)).toLocaleString(this.config.localeStr, {minimumFractionDigits: precision, maximumFractionDigits: precision}) + unit;
			break;
	}
	return preparedAttributeValue;
}, 

})