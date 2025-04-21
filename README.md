## READ ME FILE

Development approach:

I started by reading through the example code and reading up on socket.io;
Then I started with the join and leaving messages, this went very smoothly as it just involved me adding an emit at the start of the client file and upon user disconnect, I decided to change the nick to system as to differentiate from normal messages;
Then I implemented the 'is typing' function, this was a bit ore complicated, but eventually decided to add an event to a new html element for when its interacted with it'll display a message depending on if you or someone else is typing, then I added a reset after a few seconds;   


Challenges:

I encountered some difficulties developing the client-server communication;
Namely, I struggled a bit with using socket.io as I had not used it before and was thus unfamiliar with how it works;
Another (Probably very avoidable) issue I encountered was whilst writing the 'is typing' client.js code I wrote the wrong emit broadcast name resulting in a few hours of stress.
Otherwise I didn't encounter many issues. 

Technical Details:

Of the chat application the two parts that wern't previously written in the example code were the Typing indicator and the activity notifications