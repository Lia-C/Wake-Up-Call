<?php
	// Include the Twilio PHP library
	require 'Services/Twilio.php';

	// Twilio REST API version
	$version = "2010-04-01";

	// Set our Account SID and AuthToken
	$sid = 'ACd5ecb70137dd7aebf72e3b85a95f3fef';
	$token = 'b16805e25063ef10f93ae2c5f1835977';
	
	// A phone number you have previously validated with Twilio
	$phonenumber = '9175823858';
	
	// Instantiate a new Twilio Rest Client
	$client = new Services_Twilio($sid, $token, $version);

	try {
		// Initiate a new outbound call
		$call = $client->account->calls->create(
			$phonenumber, // The number of the phone initiating the call
			'6462840850', // The number of the phone receiving call
			'http://demo.twilio.com/welcome/voice/' // The URL Twilio will request when the call is answered
		);
		echo 'Started call: ' . $call->sid;
	} catch (Exception $e) {
		echo 'Error: ' . $e->getMessage();
	}
