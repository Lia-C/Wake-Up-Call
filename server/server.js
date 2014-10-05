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
    	linesA: "Hello!\nI'm good.\nGood Bye Forever!",
    	linesB: "Sup, how are you.\nUnfortunately.\nKthx."
    }

    Scripts.insert(testScript);

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

    makeRealCall(Appointments.find({}).fetch()[0])


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
<<<<<<< HEAD

		makeAppointment: function(alarm){ makeAppointment(alarm)},
		testCall: function(){doTwilio(["+19175823858","+16462840850"])},
		getScript: function(phone){
			return Phones.find({phone: phone}).fetch()[0]['script']
		}
	})

=======
    callPython: function() {
        var fut = new Future();
        exec('pythonScriptCommand with parameters', function (error, stdout, stderr) {

          // if you want to write to Mongo in this callback
          // you need to get yourself a Fiber
          new Fiber(function() {
            ...
            fut.return('Python was here');
          }).run();

        });
        return fut.wait();
      }

      
		makeAppointment: function(alarm){ makeAppointment(alarm)}
	})
    //doTwilio(["+16462840850","+19175823858"])
>>>>>>> abdaed841c92ff395f2ec0da6e012852120cee57
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

  //phoneNumbers is a tuple, with each element in the form: "+10123456789"
  function doTwilio(phoneNumbers){
    var ACCOUNT_SID = "ACd5ecb70137dd7aebf72e3b85a95f3fef"
    var AUTH_TOKEN = "b16805e25063ef10f93ae2c5f1835977"\
    twilio = Twilio(ACCOUNT_SID, AUTH_TOKEN);
    phoneNumbers.forEach(function(phoneNumber){
      twilio.makeCall({
        to:phoneNumber, // Any number Twilio can call
        from: "+16468673942", // A number you bought from Twilio and can use for outbound communication
        url: "https://www.dropbox.com/s/1eoa97kbtqo9tut/twilio-response.xml?dl=1" // A URL that produces an XML document (TwiML) which contains instructions for the call
      }, function(err, responseData) {
        //executed when the call has been initiated.
        console.log(responseData.from, responseData.body, err); 
      });
    })
    
  }

  function makeCall(appointment){

  	console.log("Fake Call!", appointment)


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
<<<<<<< HEAD
  function makeCatCall(alarm){
=======

  function makeCall(alarm){
>>>>>>> abdaed841c92ff395f2ec0da6e012852120cee57
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