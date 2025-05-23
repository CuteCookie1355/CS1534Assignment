//required for front end communication between client and server

const socket = io();

const inboxPeople = document.querySelector(".inbox__people");

let userName = '';
let id;
const newUserConnected = function (data) {
    
    //give the user a random unique id
    id = Math.floor(Math.random() * 1000000);
    userName = prompt("Please enter your name", "Username").replace(/\s/g, "");
    if (userName == null || userName == "") {
      console.log("User canceled name prompt");
      userName = 'user-' + id
    } 
    console.log(userName + " joined chat");   
    

    //emit an event with the user id
    socket.emit("new user", userName);
    //call
    addToUsersBox(userName);


      //Join MSG
    const joinMsg = userName + " has joined" ;

    socket.emit("chat message", {
      message: joinMsg,
      nick: "System",
    });

  //Join MSG
};

const addToUsersBox = function (userName) {
    //This if statement checks whether an element of the user-userlist
    //exists and then inverts the result of the expression in the condition
    //to true, while also casting from an object to boolean
    if (!!document.querySelector(`.${userName}-userlist`)) {
        return;
    
    }
    
    //setup the divs for displaying the connected users
    //id is set to a string including the username
    const userBox = `
    <div class="chat_id ${userName}-userlist">
      <h5>${userName}</h5>
    </div>
  `;
    //set the inboxPeople div with the value of userbox
    inboxPeople.innerHTML += userBox;
};

//call 
newUserConnected();

//when a new user event is detected
socket.on("new user", function (data) {



  data.map(function (user) {
          return addToUsersBox(user);
      });
});

//when a user leaves
socket.on("user disconnected", function (userName) {
  document.querySelector(`.${userName}-userlist`).remove();
  console.log("User leaving")


  const disconnectMsg = userName + " has left" ;

  socket.emit("chat message", {
    message: disconnectMsg,
    nick: "System",
  });

  
});


const inputField = document.querySelector(".message_form__input");
const messageForm = document.querySelector(".message_form");
const messageBox = document.querySelector(".messages__history");
const typingPrompt = document.querySelector(".typing_prompt");

// ~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

//toggles the typing prompt on
const dispTypingPrompt = (user) => {

  const amTyping = "You are typing...";
  const otherTyping = user +" is typing..."

  if (user == userName) {
    typingPrompt.innerHTML = amTyping;

  }else {
    typingPrompt.innerHTML = otherTyping;
  }

//toggles the typing prompt off
}
const dispNotTypingPrompt = () => {
  typingPrompt.innerHTML = ""

}

//initialises ityping, resets after 2 secs
let istyping = 0;

//when the input box is changed
inputField.oninput = function(istyping){
  //brodcasts to server
  socket.emit("is typing");
  if (istyping = 0) {
    //false to true
    istyping = 1;

  } else {
    setTimeout(function() {
      //brodcasts to server
      socket.emit("stopped typing");
      //true to false
      istyping = 0
    }, 2000);
  }

  
};
// when recieves brodcast from server
socket.on("not typing", function(data) {
  dispNotTypingPrompt();
});

//when recieves  brodcast from server
socket.on("typing", function(data) {
  dispTypingPrompt(data);
});



const addNewMessage = ({ user, message }) => {
  const time = new Date();
  const formattedTime = time.toLocaleString("en-US", { hour: "numeric", minute: "numeric" });

  const receivedMsg = `
  <div class="incoming__message">
    <div class="received__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="message__author">${user}</span>
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  const myMsg = `
  <div class="outgoing__message">
    <div class="sent__message">
      <p>${message}</p>
      <div class="message__info">
        <span class="time_date">${formattedTime}</span>
      </div>
    </div>
  </div>`;

  //is the message sent or received
  messageBox.innerHTML += user === userName ? myMsg : receivedMsg;
};

messageForm.addEventListener("submit", (e) => {

  //doesnt refresh after each msg send
  e.preventDefault();
  if (!inputField.value) {
    return;
  }

  socket.emit("chat message", {
    message: inputField.value,
    nick: userName,
  });
    //clears msg box after sending
  inputField.value = "";
});

socket.on("chat message", function (data) {
  addNewMessage({ user: data.nick, message: data.message });
});
