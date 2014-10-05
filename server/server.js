if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    //init
    Alarms = new Meteor.Collection("alarms");
    Appointments = new Meteor.Collection("appointments")
    Alarms.remove({});
    Appointments.remove({});

    var alarmArray = [
    	{
    		phone: "6462840850",
    		time: new Date(2014, 9, 5, 12, 0),
    		appointed: false
    	}
    ]

    for(var i = 0; i < alarmArray.length; i++){
    	Alarms.insert(alarmArray[i]);
    }

    newAlarm = {
    		phone: "4135471337",
    		time: new Date(2014, 9, 5, 12, 0),
    		appointed: false
    	}
    newAlarmId = Alarms.insert(newAlarm);

    makeAppointment(Alarms.find({_id: newAlarmId}).fetch()[0])


    //console.log("Alarms:", Alarms.find({}).fetch())
    //console.log("Appointments:",Appointments.find({}).fetch())

  	
  	Alarms.allow({
  		insert: function(userId, alarm){
  			/*if (alarm){
  				console.log(alarm);
  				Alarms.insert({phone:alarm['phone'], time:alarm['time'], appointed:false});
  				console.log(Alarms.find().fetch())
  				return true
  			}*/
  			alarm['appointed'] = false
  			return true
  			//return false
  		}
  	})


	Meteor.methods({

		makeAppointment: function(alarm){ makeAppointment(alarm)}
	})

  });

  function makeAppointment(newAlarm){
  	oldAlarm = Alarms.find({_id: {$ne: newAlarm['_id']}, time: newAlarm['time'], appointed: false}).fetch()[0];
  	if (oldAlarm){
    	newAlarm['appointed'] = true;

    	appointment = {
    		phones: [ newAlarm['phone'], oldAlarm['phone'] ],
    		alarm_ids: [newAlarm['_id'], oldAlarm['_id'] ],
    		time: newAlarm['time']
    	}

    	// Don't know why it only sets one of the documents when found via {$in : [id1,id2]}
    	Alarms.update({_id: oldAlarm['_id'] }, {$set: {appointed: true}})
    	Alarms.update({_id: newAlarm['_id'] }, {$set: {appointed: true}})

    	Appointments.insert(appointment)
    	timeDiff = ( appointment['time'] - Date.now() )
    	console.log(timeDiff)

    	Meteor.setTimeout(function(){makeCall(appointment)}, timeDiff)
    	console.log("Appointment made!")
  	}
  	else{
  		console.log("No other alarm to be paired with :'( ")
    	timeDiff = ( newAlarm['time'] - Date.now() )
    	Meteor.setTimeout(function(){makeCatCall(newAlarm)}, timeDiff - 1000)
  	}
  	console.log(Appointments.find({}).fetch())
  }

  function makeCall(appointment){

  	console.log("Fake Call!", appointment)

  	Alarms.remove({_id: {$in: appointment['alarm_ids'] }})
  	Appointments.remove({_id: appointment['_id']})
  }
  function makeCall(alarm){
  	if (!alarm['appointed']){
  		console.log("Fake Cat Call!", alarm)

  		Alarms.remove({_id: alarm['_id']})
  	}
  	else{
  		console.log("Cat replaced by human!")
  		Alarms.remove({_id: alarm['_id']})
  	}
  }



}

//// Need to do:
// Call at correct time
// Then remove from alarm + appointment