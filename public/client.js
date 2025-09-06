// Determine WebSocket protocol and construct URL
const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const wsURL = `${wsProtocol}//${window.location.host}`;
let socket = null;

// Get DOM elements
const messagesContainer = document.getElementById('messages');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');
const roomDisplay = document.getElementById('room-display');
const changeRoomBtn = document.getElementById('change-room-btn');
const statusDisplay = document.getElementById('status-display');
const profile1 = document.getElementById("profile-1");
const profile2 = document.getElementById("profile-2");
const profile3 = document.getElementById("profile-3");
const addname = document.getElementById("addname");
const privateRoomBtn = document.getElementById("private-room");

// Modal elements for join / change room
const roomModal = document.getElementById('room-modal');
const roomInput = document.getElementById('room-input');
const joinRoomBtn = document.getElementById('join-room-btn');

let currentRoom = null;
let myId = null;

//modal elements for change name 
const namemodal = document.getElementById(`name-modal`);
const entermodal = document.getElementById(`enter`);
const closemodal = document.getElementById(`close`);
const name1 = document.getElementById(`name1`);
const name2 = document.getElementById(`name2`);
const name3 = document.getElementById(`name3`);
let profile1N = document.getElementById("prof1-name");
let profile2N = document.getElementById("prof2-name");
let profile3N = document.getElementById("prof3-name");

// making model of names appear so that you can chnage the profiles names as you want 

addname.onclick = () => {
    showNameModal();
    entermodal.onclick = ()=>{
        profile1N.textContent = name1.value;
        profile2N.textContent = name2.value;
        profile3N.textContent = name3.value;
        hideNameModal();
}
}

closemodal.onclick = ()=>{
    hideNameModal();
}

// making profile buttons so you can store around 3 frnds then private room
    profile1.onclick = () =>{
    const roomId = "1";
    if (roomId) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'join_room', roomId: roomId }));
            
            // Update client-side state
            currentRoom = roomId;
            roomDisplay.textContent = `Room: ${currentRoom}`;
            messagesContainer.innerHTML = '';
            addSystemMessage(`You joined Room: ${currentRoom}`);
            
            // Enable UI elements and hide modal
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
            hideRoomModal();
        } else {
            console.error("WebSocket is not open. Cannot join room.");
        }
    } else {
        alert("Please enter a room name.");
    }
    }

    profile2.onclick = () =>{
    const roomId = "2";
    if (roomId) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'join_room', roomId: roomId }));
            
            // Update client-side state
            currentRoom = roomId;
            roomDisplay.textContent = `Room: ${currentRoom}`;
            messagesContainer.innerHTML = '';
            addSystemMessage(`You joined Room: ${currentRoom}`);
            
            // Enable UI elements and hide modal
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
            hideRoomModal();
        } else {
            console.error("WebSocket is not open. Cannot join room.");
        }
    } else {
        alert("Please enter a room name.");
    }
    }
    profile3.onclick = () =>{
    const roomId = "3";
    if (roomId) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'join_room', roomId: roomId }));
            
            // Update client-side state
            currentRoom = roomId;
            roomDisplay.textContent = `Room: ${currentRoom}`;
            messagesContainer.innerHTML = '';
            addSystemMessage(`You joined Room: ${currentRoom}`);
            
            // Enable UI elements and hide modal
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
            hideRoomModal();
        } else {
            console.error("WebSocket is not open. Cannot join room.");
        }
    } else {
        alert("Please enter a room name.");
    }
    }
    privateRoomBtn.onclick = () => {
        roomModal.style.display = 'flex';
    roomInput.focus();
    }

// --- WebSocket Connection Management ---
function connectWebSocket() {
    if (socket && socket.readyState === WebSocket.OPEN) {
        return;
    }

    socket = new WebSocket(wsURL);

    // Event listeners
    
    socket.addEventListener('open', () => {
        console.log("Connected to server. Waiting for ID.");
        statusDisplay.textContent = 'Status: Connected';
        // Show the modal to prompt for a room ID
        showRoomModal();
    });

    socket.addEventListener('message', event => {
        try {
            const data = JSON.parse(event.data);
            switch (data.type) {
                case 'assign_id':
                    myId = data.id;
                    console.log(`Assigned ID: ${myId}`);
                    // Hide the modal now that the user can join
                    break;
                case 'message':
                    addMessage(data);
                    break;
            }
        } catch (e) {
            console.error('Error parsing message from server:', e);
        }
    });

    socket.addEventListener('close', (event) => {
        console.warn(`Connection closed. Reason: ${event.reason || 'Unknown'}`);
        statusDisplay.textContent = 'Status: Disconnected. Reconnecting...';
        // Attempt to reconnect after a short delay
        setTimeout(connectWebSocket, 3000);
    });

    socket.addEventListener('error', (error) => {
        console.error("WebSocket Error:", error);
        statusDisplay.textContent = 'Status: Error. Reconnecting...';
        socket.close();
    });
}

// --- Function to join a room (now called from modal) ---
function joinRoom() {
    const roomId = roomInput.value.trim();
    if (roomId) {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ type: 'join_room', roomId: roomId }));
            
            // Update client-side state
            currentRoom = roomId;
            roomDisplay.textContent = `Room: ${currentRoom}`;
            messagesContainer.innerHTML = '';
            addSystemMessage(`You joined Room: ${currentRoom}`);
            
            // Enable UI elements and hide modal
            messageInput.disabled = false;
            sendButton.disabled = false;
            messageInput.focus();
            hideRoomModal();
        } else {
            console.error("WebSocket is not open. Cannot join room.");
        }
    } else {
        alert("Please enter a room name.");
    }
}

// --- Function to send a message ---
function sendMessage() {
    const text = messageInput.value.trim();
    if (text !== '' && currentRoom && socket && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({ type: 'message', text: text }));
        messageInput.value = '';
    }
}

// --- Modal Functions ---
function showRoomModal() {
    roomModal.style.display = 'flex';
    roomInput.focus();
}

function hideRoomModal() {
    roomModal.style.display = 'none';
}

function showNameModal() {
    namemodal.style.display = 'flex';
    name1.focus();
    name2.focus();
    name3.focus();
}

function hideNameModal() {
    namemodal.style.display = 'none';
}

// --- UI Utility Functions ---
function addMessage(data) {
    const { text, senderId, timestamp } = data;
    const messageWrapper = document.createElement('div');
    messageWrapper.className = senderId === myId ? 'my-message' : 'other-message';

    const messageElement = document.createElement('div');
    messageElement.className = 'message';

    const textElement = document.createElement('div');
    textElement.textContent = text;
    
    const timeElement = document.createElement('div');
    timeElement.className = 'timestamp';
    timeElement.textContent = new Date(timestamp).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });

    messageElement.appendChild(textElement);
    messageElement.appendChild(timeElement);
    messageWrapper.appendChild(messageElement);
    messagesContainer.appendChild(messageWrapper);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function addSystemMessage(text) {
    const systemMessage = document.createElement('div');
    systemMessage.className = 'system-message';
    systemMessage.textContent = text;
    messagesContainer.appendChild(systemMessage);
}

// --- DOM Event Listeners ---

changeRoomBtn.addEventListener('click', showRoomModal); // Show modal on click
joinRoomBtn.addEventListener('click', joinRoom);
roomInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        joinRoom();
    }
});
sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (event) => {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

// Initial connection
connectWebSocket();