document.addEventListener("DOMContentLoaded", () => {
  
  // Page load animations
  document.body.classList.add("loaded");

  // Theme toggle
  const toggleBtn = document.querySelector(".nav-right-btn");
  toggleBtn.addEventListener("click", () => {
    document.body.classList.toggle("light");
    toggleBtn.textContent = document.body.classList.contains("light") ? "🌙" : "⚙";
  });

  // Navbar scroll effect
  const navbar = document.querySelector(".navbar");
  window.addEventListener("scroll", () => {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  });
});
document.addEventListener("DOMContentLoaded", () => {
  const voiceToggle = document.getElementById("voiceToggle");
  const voiceStatus = document.getElementById("voiceStatus");

  if (voiceToggle && voiceStatus) {
    let listening = true;

    voiceToggle.addEventListener("click", () => {
      listening = !listening;
      if (listening) {
        voiceStatus.textContent = "Live";
        voiceStatus.style.backgroundColor = "rgba(34, 197, 94, 0.2)";
        voiceStatus.style.color = "#bbf7d0";
        voiceToggle.textContent = "⏸";
      } else {
        voiceStatus.textContent = "Paused";
        voiceStatus.style.backgroundColor = "rgba(248, 250, 252, 0.15)";
        voiceStatus.style.color = "#e5e7eb";
        voiceToggle.textContent = "▶";
      }
    });
  }
});



function addChatBubble(text, sender) {
  const bubble = document.createElement('div');
  bubble.classList.add('chat-bubble', sender); 
  bubble.textContent = text;

  chatmsgs.appendChild(bubble);

  chatmsgs.scrollTop = chatmsgs.scrollHeight;
}

function clearchat(){
const chat = document.getElementById("chatMessages");

chat.textContent = '';

}




function addMessage(text, sender = "user") {
  const chat = document.getElementById("chatMessages");

  const msg = document.createElement("div");
  msg.classList.add("message");

  if (sender === "user") {
    msg.classList.add("user-msg");
  } else {
    msg.classList.add("ai-msg");
  }

  msg.textContent = text;
  chat.appendChild(msg);

  chat.scrollTop = chat.scrollHeight;
    return msg;

}









const API_BASE = () => 'http://localhost:8000';

const chatmsg = document.getElementById('chatInput');
const submitbtn = document.querySelector('.chat-send');
const msgbx = document.querySelector('.msgbox');
const chatmsgs = document.getElementById('chatMessages');

submitbtn.addEventListener('click', async (e) => {
  e.preventDefault();
  const question = chatmsg.value.trim();
  if (!question) {
    msgbx.textContent = 'Please provide a question!';
    return; 
  }
  addMessage(question, 'user');
  chatmsg.value = '';

  const thinkingBubble = addMessage('Thinking...', 'ai');

    try {
    const response = await fetch(API_BASE() + '/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    if (response.ok) {
      thinkingBubble.textContent = data.answer;
    } else {
      thinkingBubble.textContent = 'Error from backend';
      msgbx.textContent = data.detail || 'Error from backend';
    }
  } catch (err) {
    console.error(err);
    thinkingBubble.textContent = 'Server error or Ollama not running';
    msgbx.textContent = 'Server error or Ollama not running';
  }
});