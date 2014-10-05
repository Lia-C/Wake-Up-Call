if (Meteor.isClient){


	// Load Appointments

	Meteor.subscribe("appointments", function(e, r){
		Appointments = new Meteor.Collection("appointments");
	/*	var arr = Appointments.find().fetch();
		for (var i = 0; i < arr.length; i++){
			var p = arr[i]['time']
			$("#test").append(p);
		}
	*/	
	});
	
  Alarms = new Meteor.Collection("alarms");
  
  testAlarm = {
    phone: 1234567890,
    time: Date.now()
  }
  insertedAlarm = Alarms.insert(testAlarm)

  Meteor.call('makeAppointment', insertedAlarm)

}