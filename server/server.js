if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    Alarms = new Meteor.Collection("alarms");
    Appointments = new Meteor.Collection("appointments")
    Alarms.remove({});
    Appointments.remove({});

    var alarmArray = [
    	{
    		phone: "6462840850",
    		time: new Date(2014, 10, 5, 15),
    		appointed: false
    	}
    ]

    for(var i = 0; i < alarmArray.length; i++){
    	Alarms.insert(alarmArray[i]);
    }

    newAlarm = {
    		phone: "4135471337",
    		time: new Date(2014, 10, 5, 15),
    		appointed: false
    	}

    timeToFind = newAlarm['time'];
    foundAlarms = Alarms.find({time: timeToFind, appointed: false}).fetch()
    if (foundAlarms) {
    	newAlarm['appointed'] = true;

    	firstFound = foundAlarms[0]

    	appointment = {
    		phones: [ newAlarm['phone'], firstFound['phone'] ],
    		time: timeToFind
    	}

    	Alarms.update({_id: firstFound['_id']}, {appointed: true})

    	Appointments.insert(appointment)
    }


    console.log("Should be none", Alarms.find({appointed: false}).fetch())
    console.log("Appointments:",Appointments.find({}).fetch())


    Meteor.publish("appointments", function(){
    	return Appointments.find({})
    })

  });
}