# WHATSAPP API

It is inspired base on https://github.com/pedroslopez/whatsapp-web.js

# RUN THE SCRIPT

1. npm install.
2. The server will start on port 3030 (http://127.0.0.1:3030).
3. access to /generate (GET REQUEST) to generate QR code for Whatsapp API.
4. Copy the imageUrl response and scan it with your Whatsapp app.
5. After you got the "Client is Ready!" response in the console, you can now send message or send media message to other Whatsapp User.

# SEND MESSAGE

Make a POST REQUEST to /sendMessage with JSON body, number and message.<br />

Example :<br />

```json
{ "number": "6285267671232", "message": "Hello world" }
```

<br />

If you want to send to multiple number (add coma "," in number), here is the example :<br />

```json
{ "number": "6285267671232, 6287812123434, 6282132321212", "message": "Hello world" }
```


Please note that the phone number format is an international format without + sign.

# SEND MEDIA MESSAGE

Make a POST REQUEST to /sendMedia with form-data (Form Data) body, file, message and number.<br />
 
file : file to upload<br/>
number : number to send<br/>
message : caption for file<br/><br/>


Example : <br />

file : media.pdf<br />
number : 6285267671232, 628231212444, 625234345656<br />
message: this is the test caption<br/><br/>


<br />
Please note that the phone number format is an international format without + sign.


