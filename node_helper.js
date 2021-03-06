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
var express = require('express');
var expressApp = express();

var myIntervalId;
var myUpdateIntervalLong;
var myUpdateIntervalShort;

//globale Variable, weil diese ansonsten in fillValueList unbekannt
valueListNHCaravanPiPosition = [];


module.exports = NodeHelper.create({
	
	start: function() {
		//console.error('Starting node helper: ' + this.name);
		var self = this;
		
		// Updateinterval ändern über Aufruf http://127.0.0.1:8080/MMM-CaravanPiPosition/changeUpdateInterval
		this.expressApp.get('/' + this.name + '/changeUpdateInterval', function (req, res) {
			self.changeUpdateInterval();
			res.send('Change UpdateInterval from '+ myUpdateInterval);
		});
		
		// Kalibrierung anzeigen über Aufruf http://127.0.0.1:8080/MMM-CaravanPiPosition/setCalibration
		this.expressApp.get('/' + this.name + '/setCalibration', function (req, res) {
			valueListNHCaravanPiPosition[0]["cal"] = "1";
			self.sendSocketNotification('VALUES', valueListNHCaravanPiPosition);
			res.send('set Calibration hhhhhhh');
		});
		
		// Kalibrierung löschen über Aufruf http://127.0.0.1:8080/MMM-CaravanPiPosition/unsetCalibration
		this.expressApp.get('/' + this.name + '/unsetCalibration', function (req, res) {
			valueListNHCaravanPiPosition[0]["cal"] = "0";
			self.sendSocketNotification('VALUES', valueListNHCaravanPiPosition);
			res.send('unset Calibration');
		});

	},
	
	socketNotificationReceived: function(notification, payload) {
		var self = this;
		// console.error('node_helper MMM-CaravanPiPosition: ' + notification);
		
		switch(notification) {
			case "CONFIG":
				this.config = payload.config;
				valueListNHCaravanPiPosition = payload.valueList;
				myUpdateIntervalLong = this.config.updateIntervalLong;
				myUpdateIntervalShort = this.config.updateIntervalShort;
				myUpdateInterval = myUpdateIntervalLong;
				// first call
				self.getValues(valueListNHCaravanPiPosition);
				// interval call
				myIntervalId = setInterval(function() {
					self.getValues(valueListNHCaravanPiPosition);
				}, myUpdateInterval);
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
			// console.error('node_helper MMM-CaravanPiPosition - cmd', cmd);
			exec(cmd,"",this.fillValueList);

			i+=1;
		}

		self.sendSocketNotification('VALUES', valueListNHCaravanPiPosition);
	},
	
	fillValueList: function (err, stdout, stderr) {
		var i = 0;
		
		if (err) {
			console.error('node_helper MMM-CaravanPiPosition - fillValueList - Fehler:', err, stderr);
			return;
		}
		var resSplit = stdout.split(' ');
		var sensorID = "position";
		
		
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
				valueListNHCaravanPiPosition[i]["cal"] = "08888989898989";
				// console.error('node_helper MMM-CaravanPiPosition - valueList:', valueListNHCaravanPiPosition[i]);
			}
			i+=1;
		}
		return;
	},
	
	changeUpdateInterval: function() {
		var self = this;
		console.error('node_helper MMM-CaravanPiPosition changeUpdateInterval - actual: ', myUpdateInterval);
		clearInterval(myIntervalId);
		if (myUpdateInterval == myUpdateIntervalLong) {
			myUpdateInterval = myUpdateIntervalShort;
		}
		else {
			myUpdateInterval = myUpdateIntervalLong;
		}
		myIntervalId = setInterval(function() {
			self.getValues(valueListNHCaravanPiPosition);
		}, myUpdateInterval);
	},

	getDateTime: function(){
		var currentDateTime = new Date();
		var datetimestr = currentDateTime.toLocaleString()
		return (datetimestr);
	}, 


})
