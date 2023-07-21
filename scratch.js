.chat-container {
display: flex;
align-items: center;
flex-direction: column;
justify-content: center;
min-height: 100vh; /* Adjust this as needed */
color: rgb(61, 61, 61);
}

.input-container {
display: flex;
gap: 10px; /* Provides space between the elements */
margin-left: auto;
margin-right: auto;
margin-top: 1em;
padding-bottom: 1em;
}

.input-container input {
flex-grow: 1; /* Allows the input to take up remaining space */
}

.message-list {
padding: 0; /* Remove padding */
width: fit-content; /* Shrink wrap content */
}

.message-list li {
display: flex;
justify-content: center;
align-items: flex-start;
margin-bottom: 0.7em; /* Provide space between messages */
}

.message-role {
margin-right: 20px; /* Provide space between role and content */
width: 100px; /* Set this to a suitable value for your needs */
text-align: left; /* Aligns text to the right */
}

.message-wrapper {
font-size: 16px;
display: flex;
align-items: left;
transition: transform 0.2s ease-in-out;
box-shadow: rgba(0, 0, 0, 0.1) 0px 5px 15px;
padding-left: 20px;
padding-top: 25px;
padding-bottom: 10px;
border-radius: 20px;
}

.message-content {
color: rgb(110, 110, 110);
justify-content: space-between;
text-align: left; /* Aligns text to the right */
width: 400px;
margin-top: 0.3em;
margin-left: 0.5em;
margin-bottom: 0.3em;
word-wrap: break-word;
}

.action-wrapper {
min-width: 30px; /* Set this to a suitable value for your needs */
min-height: 30px;
text-align: right; /* Aligns button to the right */
}

.message-actions {
opacity: 1;
transition: opacity 0.2s ease-in-out;
transition: transform 0.1s ease-in-out;
background: none; /* Removes the default button background */
border: none; /* Removes the default button border */
cursor: pointer; /* Changes the cursor to a hand when hovering over the button */
color: darkgray; /* Changes the color of the button */
font-size: 20px; /* Changes the size of the button */
padding-right: 0px; /* Removes the default button padding */
margin-left: 0px; /* Adds a bit of space between the message and the button */
display: flex; /* Makes sure the button contents are centered */
align-items: center; /* Vertically center the content */
justify-content: center; /* Horizontally center the content */
position: relative;
}

/* li:hover .message-actions {
opacity: 1; /* Show the button on hover 
} */

.role {
color: rgb(110, 110, 110);
font-weight: 600; /* Make text bolder */
margin-left: 15px;
padding-left: 5px;
padding-right: 5px;
margin-left: 7px;
border-radius: 8px;
}

.role:hover {
cursor: pointer;
background-color: whitesmoke;
}

.role-dropdown-menu {
cursor: pointer;
position: absolute; /* Positions the dropdown relative to the nearest positioned ancestor */
display: flex;
flex-direction: row; /* Aligns the items vertically */
background-color: #fff; /* Changes the background color to white */
padding: 3px; /* Adds a little space around the items */
border: 1px solid #ffffff; /* Adds a light gray border */
border-radius: 0.7em; /* Rounds the corners */
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Adds a slight shadow for depth */
z-index: 1000; /* Ensures the dropdown appears on top of other elements */
margin-top: 5px;
margin-left: 0px;
}

.role-dropdown-menu button {
font-weight: 500;
color: grey;
border-radius: 0.7em; /* Rounds the corners */
background-color: #f6f6f6; /* Changes the background color when hovered */
border: none; /* Removes the default button border */
cursor: pointer; /* Changes the cursor to a hand when hovering over the button */
text-align: left; /* Aligns the text to the left */
padding: 0.5em; /* Adds some space around the text */
margin-left: 0.3em;
margin-right: 0.3em;
margin-bottom: 0.2em;
margin-top: 0.2em;
transition: transform 0.1s ease-in-out;
}

.role-box{
display: flex;
}

.role-dropdown-menu button:hover {
transform: scale(1.15); /* Added hover effect */
}

.role-dropdown-menu button:active {
transform: scale(0.9);
}

.message-wrapper:hover {
transform: scale(1.025); /* Added hover effect */
}

.message-actions:hover {
transform: scale(1.1); /* Added hover effect */
background-color: whitesmoke;
padding-left: 5px;
padding-right: 5px;
border-radius: 5px;
color: grey;
}

.message-actions:active {
transform: scale(0.8);
}

.message-text {
font-family: 'Inter', sans-serif;
transition: transform 0.1s ease-in-out;
cursor: text;
margin-left: -1em;
padding-left: 1em;
padding-bottom: -8em;
padding-right: 1em;
padding-top: 1em;
margin-top: -1em;
margin-right: 1em;
border-radius: 0.5em;
color: rgb(110, 110, 110);
}

.message-text:hover {
background-color: rgb(250, 250, 250);
}

.input-container button {
/* font-family: var(--font-mono); */
transition: transform 0.1s ease-in-out;
background-color: rgb(219, 219, 219);
border: none; /* Removes the default button border */
cursor: pointer; /* Changes the cursor to a hand when hovering over the button */
outline: none; /* Removes the focus outline */
padding: 1; /* Removes the default button padding */
display: flex; /* Makes sure the button contents are centered */
align-items: center; /* Vertically center the content */
justify-content: center; /* Horizontally center the content */
height: 30px;
width: 40px;
border-radius: 8px;
}

.input-container button:hover {
color: gray;
}

.input-button:hover {
transform: scale(1.07); /* Added hover effect */
box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); /* Adds a slight shadow for depth */
}

.input-button:active {
transform: scale(0.9);
}

.input-button {
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Adds a slight shadow for depth */
font-size: 16px;
width: 50px;
color: darkgray;
}

.input-box:hover, .input-box:focus {
width: 250px;
}

.input-box {
width: 200px; /* Set an initial width */
transition: width 0.3s ease-in-out;
font-family: 'Inter', sans-serif;
box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Adds a slight shadow for depth */
color: gray;
font-size: 16px;
background-color: rgb(219, 219, 219);
border: none;
outline: none;
padding-left: 10px;
padding-right: 10px;
padding-top: 5px;
padding-bottom: 5px;
resize: none;
overflow: hidden;
line-height: 20px;
height: 20px;
border-radius: 8px;
}

.edit-box {
width: 100%;
font-family: 'Inter', sans-serif;
color: rgb(110, 110, 110);
font-size: 16px;
background-color: whitesmoke;
border: none;
outline: none;
padding-left: 1em;
padding-right: -1em;
padding-top: 0.5em;
padding-bottom: 0.8em;
margin-top: -1em;
margin-bottom: 0.1em;
margin-left: -1em;
margin-right: 1em;
resize: both;

border-radius: 0.5em;
overflow: hidden;
}

.role-icon {
font-size: 10px;
}

.dropdown-menu {
/* position: absolute; */
display: flex;
flex-direction: row;
/* background-color: #fff; */
padding: 5px;
padding-left: 0px;
/* border: 1px solid #ffffff; */
border-radius: 5px;
/* box-shadow: 0 0 10px rgba(0, 0, 0, 0.15); */
z-index: 1000;
right: 1;
/* margin-top: -55px; */
/* margin-left: 40px; */
}

.dropdown-menu button {
text-align: center;
color: rgb(199, 199, 199);
background: none; /* Removes the default button background */
border: none; /* Removes the default button border */
cursor: pointer; /* Changes the cursor to a hand when hovering over the button */
text-align: left; /* Aligns the text to the left */
padding: 0.5em; /* Adds some space around the text */
transition: transform 0.1s ease-in-out;
}

.dropdown-menu button:hover {
color: grey;
text-align: center;
border-radius: 0.5em; /* Rounds the corners */
background-color: #f6f6f6; /* Changes the background color when hovered */
}

.dropdown-menu button:active {
transform: scale(0.9);
}

.title {
opacity: 10%;
font-size: 25px; 
font-weight: 650;
position: absolute;
top: 50%;
left: 47%;
text-align: center;
justify-content: center;
user-select: none;
}

.message-hidden {
opacity: 25%;
}

.markdown-container h1,
.markdown-container h2,
.markdown-container h3,
.markdown-container h4,
.markdown-container h5,
.markdown-container h6,
.markdown-container pre {
margin-top: 0px;
padding-top: 0px;
margin-bottom: 5px;
}

.markdown-container p {
margin-block-start: 0em;
margin-block-end: 1em;
}

.markdown-container li {
justify-content: left;
}

ul, ol {
list-style: none;
padding: 0;
margin: 0;
}

.placeholder-markdown {
opacity: 20%;
}

/* Apply to the specific container */
.markdown-container {
overflow: auto;
}

/* This applies to the entire document */
* {
scrollbar-width: thin;
scrollbar-color: rgba(187, 187, 187, 0.7) transparent;
}

/* This is for Chrome, Safari and Opera */
*::-webkit-scrollbar {
width: 12px;
}

*::-webkit-scrollbar-track {
background: transparent; 
}

*::-webkit-scrollbar-thumb {
background-color: rgb(224, 224, 224); 
border-radius: 10px;
border: transparent;
}

*::-webkit-scrollbar-thumb:hover {
background-color: rgb(201, 201, 201); 

}

/* TypingIndicator.css */

.typing-indicator {
font-size: 24px;
color: gray;
}

.flex-container {
display: flex;
flex-direction: column;
height: 100%;
justify-content: flex-end;
}