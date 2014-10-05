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
    newAlarmId = Alarms.insert(newAlarm);

    makeAppointment(Alarms.find({_id: newAlarmId}).fetch()[0])


    console.log("Alarms:", Alarms.find({}).fetch())
    console.log("Appointments:",Appointments.find({}).fetch())


    Meteor.publish("appointments", function(){
    	return []
    })
  	
  	Alarms.allow({
  		insert: function(userId, alarm){
  			/*if (alarm){
  				console.log(alarm);
  				Alarms.insert({phone:alarm['phone'], time:alarm['time'], appointed:false});
  				console.log(Alarms.find().fetch())
  				return true
  			}*/
  			alarm['appointed'] = false
  			console.log(Alarms.find({}).fetch())
  			return true
  			//return false
  		}
  	})


	Meteor.methods({

		makeAppointment: function(alarm){ makeAppointment(alarm)}
	})

  });

  function makeAppointment(newAlarm){
  	oldAlarm = Alarms.find({time: newAlarm['time'], appointed: false}).fetch()[0];
  	if (oldAlarm){
    	newAlarm['appointed'] = true;

    	appointment = {
    		phones: [ newAlarm['phone'], oldAlarm['phone'] ],
    		time: newAlarm['time']
    	}

    	// Don't know why it only sets one of the documents when found via {$in : [id1,id2]}
    	Alarms.update({_id: oldAlarm['_id'] }, {$set: {appointed: true}})
    	Alarms.update({_id: newAlarm['_id'] }, {$set: {appointed: true}})

    	Appointments.insert(appointment)

  	}
  	else{
  		console.log("No other alarm to be paired with :'( ")
  	}
  }



}

