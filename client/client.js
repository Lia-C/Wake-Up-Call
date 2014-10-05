if (Meteor.isClient){

	Template.script.rendered = function(){

	$("#divMain").show();
	$("#divScript").hide();
	}
	// Load Appointments
	Template.mainForm.events({

		'click #submitAlarm': function(ev){
			ev.preventDefault()
			console.log("Event:",ev)

			var timenow = new Date;

			var phoneNumber = $('.phoneNumber')[0].value
			var hour = $('.hour')[0].value
			var minute = $('.minute')[0].value
			var curHour = timenow.getHours();
			var curMinute = timenow.getMinutes();
			var curDate = timenow.getDate();

			var alarmTime = new Date;

			alarmTime.setHours(hour)
			alarmTime.setMinutes(minute)
			alarmTime.setSeconds(0)
			alarmTime.setMilliseconds(0)

			//if alarmTime has passed, increment day (set to tomorrow)
			if ( (hour == curHour && minute <= curMinute) || hour < curHour ){
				alarmTime.setDate(curDate + 1)
			}

			console.log(alarmTime)

			var newAlarm = {
				phone: phoneNumber,
				time: alarmTime,
				appointed: false
			}
			//console.log(newAlarm)
  		var insertedAlarmId = Alarms.insert(newAlarm)
  		//console.log(insertedAlarm)
  		var insertedAlarm = Alarms.find({_id: insertedAlarmId}).fetch()[0]

  		Meteor.call('makeAppointment', insertedAlarm, function(e, ret){
  			if(e){
  				alert("Error: "+ e)
  			}
  			else{
  				alert("Alarm Created!")
  			}
  		})


		},

		'click #seeTest': function(ev){

			//Meteor.call('testCall')

			Meteor.call('getScript', $('.phoneNumber')[0].value, function(err, script){
				if (err){
					alert("No appointment found for number!")
				}
				else{
					lineArr = script.split("\n")
					lineArr.forEach(function(line){
						$("#divScript").append("<br /><br/>"+line)
					})
					$("#divScript").append('<br/><br/><input type="button" id="finishBtn" value="Finished" >')
					$("#divMain").hide(300,function(){$("#divScript").show(300);});
				}
			})


		}

	})

	Template.script.events({

		'click #finishBtn': function(ev){
			$("#divScript").empty();
			$("#divScript").hide(300, function(){$("#divMain").show(200);});
		}
	})

	
  Alarms = new Meteor.Collection("alarms");



}