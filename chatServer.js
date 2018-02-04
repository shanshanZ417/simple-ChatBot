/*
chatServer.js
Author: David Goedicke (da.goedicke@gmail.com)
Closley based on work from Nikolas Martelaro (nmartelaro@gmail.com) as well as Captain Anonymous (https://codepen.io/anon/pen/PEVYXz) who forked of an original work by Ian Tairea (https://codepen.io/mrtairea/pen/yJapwv)
*/

var express = require('express'); // web server application
var app = express(); // webapp
var http = require('http').Server(app); // connects http library to server
var io = require('socket.io')(http); // connect websocket library to server
var serverPort = 8000;
var dict = {
    penName: "Dan Brown",
    firstName: "Shanshan",
    secondName: "Jersy",
    job: "drinker",
    firstBody: "finger",
    secondBody: "lips",
    place: "the Empire State Building",
    firstAdj: "cute",
    secondAdj: "annoying",
    verb: "Singing",
    objects: "puppies",
    quotes: "Love is a touch and yet not a touch",
    exclamation: "Kewl",
};


//---------------------- WEBAPP SERVER SETUP ---------------------------------//
// use express to create the simple webapp
app.use(express.static('public')); // find pages in public directory

// start the server and say what port it is on
http.listen(serverPort, function() {
  console.log('listening on *:%s', serverPort);
});
//----------------------------------------------------------------------------//


//---------------------- WEBSOCKET COMMUNICATION -----------------------------//
// this is the websocket event handler and say if someone connects
// as long as someone is connected, listen for messages
io.on('connect', function(socket) {
  console.log('a new user connected');
  var questionNum = 0; // keep count of question, used for IF condition.
  socket.on('loaded', function(){// we wait until the client has loaded and contacted us that it is ready to go.

  socket.emit('answer',"Hey there, I am Misaki. Give me some words, I will generate a great random story."); //We start with the introduction;
  setTimeout(timedQuestion, 2500, socket,"What is your pen name?"); // Wait a moment and respond with a question.
0
});
  socket.on('message', (data)=>{ // If we get a new message from the client we process it;
        console.log(data);
        questionNum= bot(data,socket,questionNum);	// run the bot function with the new message
      });
  socket.on('disconnect', function() { // This function  gets called when the browser window gets closed
    console.log('user disconnected');
  });
});
//--------------------------CHAT BOT FUNCTION-------------------------------//
function bot(data,socket,questionNum) {
  var input = data; // This is generally really terrible from a security point of view ToDo avoid code injection
  var answer;
  var question;
  var waitTime;

/// These are the main statments that make up the conversation.
  if (questionNum == 0) {
  dict.penName= input;
  answer= 'Hello ' + input + ' :-)';// output response
  waitTime =2000;
  question = 'What is the name of your protagonist?';			    	// load next question
  }
  else if (questionNum == 1) {
  dict.firstName = input;
  answer = 'Great name!';
  waitTime =2000;
  question = 'What is the name of the secondary character?';			    	// load next question
  }
  else if (questionNum == 2) {
  dict.secondName = input;
  answer = 'Not bad lol';
  //answer= ' Cool! I have never been to ' + input+'.';
  waitTime =2000;
  question = 'Give me a body part please :)';			    	// load next question
  }
  else if (questionNum == 3) {
  dict.firstBody = input;
  answer= 'Ok, kewl.';
  waitTime = 2000;
  question = 'Give me another body part!';			    	// load next question
  }
  else if (questionNum == 4) {
  dict.secondBody = input;
  answer= 'Wow, things get interesting.';
  waitTime = 2000;
  question = 'How about a name of a place?';            // load next question
  }
  else if (questionNum == 5) {
  dict.place= input;
  answer= 'Be patient, there are just a few question left.';
  waitTime = 2000;
  question = 'Please give me adjective.';            // load next question
  }
  else if (questionNum == 6) {
  dict.firstAdj = input;
  answer= 'That\'s a good one';
  waitTime = 2000;
  question = 'Another adjective, please.';            // load next question
  }
  else if (questionNum == 7) {
  dict.secondAdj = input;
  answer= '';
  waitTime = 2000;
  question = 'Give me a verb with -ing in the end :)';            // load next question
  }
  else if (questionNum == 8) {
  dict.verb = input;
  answer= 'Three more questions!';
  waitTime = 2000;
  question = 'A plural objects';            // load next question
  }
  else if (questionNum == 9) {
  dict.objects = input;
  answer= '';
  waitTime = 2000;
  question = 'A quotes in your deepest memory.';            // load next question
  }
  else if (questionNum == 10) {
  dict.quotes = input;
  answer= 'Okay, okay. Final one!';
  waitTime = 2000;
  question = 'A exclamation you like?';            // load next question
  }
  else if (questionNum == 11) {
  dict.exclamation = input;
  answer= 'Kidding lol. This is the real final one!';
  waitTime = 2000;
  question = 'A job title please?';            // load next question
  }
  else {
    dict.job = input;
    answer = 'Here is REAL MAGIC.' + '\n'
    + dict.firstName + ' had a complex feeling towards ' + dict.secondName + 
    ', a ' + dict.job + ' with ' + dict.firstAdj + ' ' + dict.firstBody + 
    ' and ' + dict.secondAdj + ' ' + dict.secondBody + '. ' +
    dict.verb + ' at ' + dict.place + ', ' + dict.firstName + ' said" ' +
    dict.exclamation + ', All I need is just ' + dict.objects + '". "' + dict.quotes +
    '", ' + dict.secondName + " replied." + '\n' +
    'THE END.' + '\n' + 'BY ' + dict.penName;
    waitTime = 2000;
    question = '';
  }


/// We take the changed data and distribute it across the required objects.
  socket.emit('answer',answer);
  setTimeout(timedQuestion, waitTime,socket,question);
  return (questionNum+1);
}

function timedQuestion(socket,question) {
  if(question!=''){
  socket.emit('question',question);
}
  else{
    //console.log('No Question send!');
  }

}
//----------------------------------------------------------------------------//
