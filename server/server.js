if (Meteor.isServer) {
  Meteor.startup(function () {
    // code to run on server at startup

    //init
    Alarms = new Meteor.Collection("alarms");
    Appointments = new Meteor.Collection("appointments")
    Phones = new Meteor.Collection("phones")
    Scripts = new Meteor.Collection("scripts")

    Alarms.remove({});
    Appointments.remove({});
    Phones.remove({});
    Scripts.remove({});

    var testScript = {
    	linesA: "I haven't got a brain... only straw.\nI don't know... But some people without brains do an awful lot of talking... don't they?",
      linesB: "How can you talk if you haven't got a brain?\nYes, I guess you're right."
    }

    Scripts.insert(testScript);

    var alarmArray = [
    	{
    		phone: "",
    		time: new Date(2014, 9, 5, 12, 0),
    		appointed: false
    	}
    ]

    for(var i = 0; i < alarmArray.length; i++){
    	Alarms.insert(alarmArray[i]);
    }

    newAlarm = {
    		phone: "",
    		time: new Date(2014, 9, 5, 12, 0),
    		appointed: false
    	}
    newAlarmId = Alarms.insert(newAlarm);

    makeAppointment(Alarms.find({_id: newAlarmId}).fetch()[0])

    apt = Appointments.find({}).fetch()[0]
    // Testing
    phoneAndScriptArr = [{
  			phone: apt['phones'][0],
  			script: Scripts.find({}).fetch()[0]['linesA']
  		},
  		{
  			phone: apt['phones'][1],
  			script: Scripts.find({}).fetch()[0]['linesB']
  		}
  	]

  	Phones.insert(phoneAndScriptArr[0])
  	Phones.insert(phoneAndScriptArr[1])


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

  var exec = Npm.require('child_process').exec;
	var Fiber = Npm.require('fibers');
	var Future = Npm.require('fibers/future');

	Meteor.methods({

		makeAppointment: function(alarm){ makeAppointment(alarm)},
		testCall: function(){doTwilio(["+19175823858","+16462840850"])},
		getScript: function(phone){
			return Phones.find({phone: phone}).fetch()[0]['script']
		},

    callPython: function(phone1, phone2) {
        var fut = new Future();
        exec('python ~/Desktop/Wake-Up-Call/twiliostuff/twilio-call-out.py '+phone1+' '+phone2, function (error, stdout, stderr) {
          // if you want to write to Mongo in this callback
          // you need to get yourself a Fiber
          new Fiber(function() {
            
            fut.return('Python was here');
          }).run();

        });
        return fut.wait();
      },

      catCallPython: function(phone) {
        var fut = new Future();
        exec('python ~/Desktop/Wake-Up-Call/twiliostuff/twilio-cat.py '+phone, function (error, stdout, stderr) {
          // if you want to write to Mongo in this callback
          // you need to get yourself a Fiber
          new Fiber(function() {
            
            fut.return('PythonCat was here');
          }).run();

        });
        return fut.wait();

      }
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

  	
		Meteor.call('callPython',"+16462840850","+19175823858", function(a,b){console.log(a,b)})


  	phoneAndScriptArr = [{
  			phone: appointment['phones'][0],
  			script: Scripts.find({}).fetch()[0]['linesA']
  		},
  		{
  			phone: appointment['phones'][1],
  			script: Scripts.find({}).fetch()[0]['linesB']
  		}
  	]

  	Phones.insert(phoneAndScriptArr[0])
  	Phones.insert(phoneAndScriptArr[1])
  	Alarms.remove({_id: {$in: appointment['alarm_ids'] }})
  	Appointments.remove({_id: appointment['_id']})
  }

  function makeCatCall(alarm){
    alarm = Alarms.find({_id: alarm['_id']}).fetch()[0];
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