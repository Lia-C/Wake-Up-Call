if (Meteor.isClient){


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

  		Meteor.call('makeAppointment', insertedAlarm)


		}
	})

	
  Alarms = new Meteor.Collection("alarms");



}