// Generic error handler
function handleError(error) {
    console.error('Error:', error);
    document.getElementById('result').textContent = 'Operation failed: ' + error.message;
}

// Appointment functions
async function bookAppointment() {
    try {
        const response = await fetch('/book', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                patient: document.getElementById('patient').value,
                time: document.getElementById('time').value
            })
        });
        if (!response.ok) throw new Error(await response.text());
        updateUI(await response.json());
    } catch (error) {
        handleError(error);
    }
}

async function cancelAppointment() {
    try {
        const response = await fetch('/cancel', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                patient: document.getElementById('patient').value
            })
        });
        if (!response.ok) throw new Error(await response.text());
        updateUI(await response.json());
    } catch (error) {
        handleError(error);
    }
}

async function findAppointment() {
    try {
        const response = await fetch('/find', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                patient: document.getElementById('patient').value
            })
        });
        if (!response.ok) throw new Error(await response.text());
        const data = await response.json();
        document.getElementById('result').textContent = data.result;
    } catch (error) {
        handleError(error);
    }
}

async function updateAppointment() {
    try {
        const response = await fetch('/update', {
            method: 'POST',
            headers: {'Content-Type': 'application/x-www-form-urlencoded'},
            body: new URLSearchParams({
                patient: document.getElementById('patient').value,
                new_time: document.getElementById('time').value
            })
        });
        if (!response.ok) throw new Error(await response.text());
        updateUI(await response.json());
    } catch (error) {
        handleError(error);
    }
}

// Chatbot functions
function sendMessage() {
    const inputField = document.getElementById('userInput');
    const chatArea = document.getElementById('chatArea');
    const message = inputField.value.trim();
    
    if (!message) return;

    // Add user message
    chatArea.innerHTML += `<div class="user-message">You: ${message}</div>`;
    
    // Get bot response
    fetch('/chatbot', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ message: message })
    })
    .then(response => {
        if (!response.ok) throw new Error('Chatbot response error');
        return response.json();
    })
    .then(data => {
        chatArea.innerHTML += `<div class="bot-message">Bot: ${data.response}</div>`;
        inputField.value = '';
        chatArea.scrollTop = chatArea.scrollHeight;
    })
    .catch(error => {
        console.error('Chatbot error:', error);
        chatArea.innerHTML += `<div class="bot-message error">Bot: Sorry, I'm having trouble responding</div>`;
    });
}

// Enter key support for chatbot
document.getElementById('userInput').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendMessage();
});

// Update UI function
function updateUI(data) {
    document.getElementById('result').textContent = data.result;
    const tbody = document.querySelector('#appointmentsTable tbody');
    tbody.innerHTML = data.appointments
        .map(([patient, time]) => `
            <tr>
                <td>${patient}</td>
                <td>${time}</td>
            </tr>
        `).join('');
}
