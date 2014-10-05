from twilio.rest import TwilioRestClient 
import sys
import requests
import json
import time

# put your own credentials here 
ACCOUNT_SID = "ACd5ecb70137dd7aebf72e3b85a95f3fef" 
AUTH_TOKEN = "b16805e25063ef10f93ae2c5f1835977" 
 
client = TwilioRestClient(ACCOUNT_SID, AUTH_TOKEN) 

#phoneNumbers = ["+16462840850","+19175823858"]
phoneNumbers = [sys.argv[1], sys.argv[2]]

for phoneNumberToCall in phoneNumbers:
	time.sleep(1)
	call = client.calls.create(
		to=phoneNumberToCall, 
		from_="+16468673942", 
		url="https://www.dropbox.com/s/1eoa97kbtqo9tut/twilio-response.xml?dl=1",  
		method="GET",  
		fallback_method="GET",  
		status_callback_method="GET",    
		record="false"
	) 
	 
	print call.sid
	r = requests.post("https://api.twilio.com/2010-04-01/Accounts/"+ACCOUNT_SID+"/Calls/")