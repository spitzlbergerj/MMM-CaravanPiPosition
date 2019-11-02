/* ---------------------------------------------------------------------
 * Magic Mirror
 * Module: MMM-CaravanPiPosition
 *
 * CaravanPi Module
 * see https://github.com/spitzlbergerj/CaravanPi for more Information 
 *		 about the DIY project 
 *
 * By Josef Spitzlberger	http://spitzlberger.de
 * MIT Licensed.
 */

const NodeHelper = require("node_helper")
var async = require('async');
var exec = require('child_process').exec;

//globale Variable, weil diese ansonsten in fillValueList unbekannt
valueListNHCaravanPiPosition = [];

module.exports = NodeHelper.create({
	
	start: function() {
		//console.error('Starting node helper: ' + this.name);
	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		console.error('node_helper: ' + notification);
		
		switch(notification) {
			case "CONFIG":
				this.config = payload.config;
				valueListNHCaravanPiPosition = payload.valueList;
				// first call
				self.getValues(valueListNHCaravanPiPosition);
				// interval call
				setInterval(function() {
					self.getValues(valueListNHCaravanPiPosition);
				}, this.config.updateInterval);
				break
		}
	},
	
	getValues: function(valueList) {
		var self = this;
		var cmdPart = "tail -1 " + self.config.valueDir + "/";
		var cmd = "";
		var i = 0;
		
		while (i<valueList.length) {
			cmd = cmdPart + valueList[i]["file"]
			console.error('node_helper - cmd', cmd);
			exec(cmd,"",this.fillValueList);

			i+=1;
		}

		console.error('node_helper - getValues - valueList after', valueListNHCaravanPiPosition[0]);
		self.sendSocketNotification('VALUES', valueListNHCaravanPiPosition);
	},
	
	fillValueList: function (err, stdout, stderr) {
		var i = 0;
		
		if (err) {
			console.error('node_helper - fillValueList - Fehler:', err, stderr);
			return;
		}
		var resSplit = stdout.split(' ');
		var sensorID = "position";
		
		console.error('node_helper - fillValueList ', stdout, sensorID);
		console.error('node_helper - fillValueList ', stdout, sensorID);
		
		while (i<valueListNHCaravanPiPosition.length) {
			if (sensorID === valueListNHCaravanPiPosition[i]["file"]) {
				valueListNHCaravanPiPosition[i]["datetime"] = resSplit[0].substring(6,8)+"."+resSplit[0].substring(4,6)+"."+resSplit[0].substring(0,4)+" "+resSplit[0].substring(8,10)+":"+resSplit[0].substring(10,12);
				valueListNHCaravanPiPosition[i]["hl"] = resSplit[12];
				valueListNHCaravanPiPosition[i]["hr"] = resSplit[13];
				valueListNHCaravanPiPosition[i]["zl"] = resSplit[14];
				valueListNHCaravanPiPosition[i]["zr"] = resSplit[15];
				valueListNHCaravanPiPosition[i]["vl"] = resSplit[16];
				valueListNHCaravanPiPosition[i]["vr"] = resSplit[17];
				valueListNHCaravanPiPosition[i]["vo"] = resSplit[18];
			}
			i+=1;
		}
		return;
	},

})