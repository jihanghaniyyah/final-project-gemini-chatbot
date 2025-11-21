const form = document.getElementById('chat-form');
// The user's HTML snippet used 'user-input', but your starter code used 'input'.
// I'll assume the correct ID is 'user-input' based on the HTML.
const input = document.getElementById('user-input'); 
const chatBox = document.getElementById('chat-box');

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const userMessage = input.value.trim();
    if (!userMessage) return;

    // 1. Add the user's message to the chat box
    appendMessage('user', userMessage);
    input.value = '';

    // 2. Show a temporary "Thinking..." bot message
    // We store the element to update it later.
    const thinkingMsgElement = appendMessage('bot', 'Gemini is thinking...');

    try {
        // 3. Send the user's message to the backend API
        const response = await fetch('/api/chat', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                // Based on your index.js, the backend expects an array of messages
                // with `role` and `text` properties.
                messages: [{ role: 'user', text: userMessage }],
            }),
        });

        if (!response.ok) {
            // If the server responds with an error status (e.g., 500)
            const errorData = await response.json();
            throw new Error(errorData.error || 'Failed to get response from server.');
        }

        const data = await response.json();

        // 4. Replace the "Thinking..." message with the AI's reply
        if (data.result) {
            thinkingMsgElement.textContent = data.result;
        } else {
            thinkingMsgElement.textContent = 'Sorry, no response received.';
        }

    } catch (error) {
        // 5. If an error occurs, show an error message
        console.error('Error:', error);
        thinkingMsgElement.textContent = error.message;
        thinkingMsgElement.classList.add('error'); // Optional: for styling error messages
    }
});

/**
 * Appends a new message to the chat box.
 * @param {string} role - The role of the sender ('user' or 'bot').
 * @param {string} text - The message content.
 * @returns {HTMLElement} The created message element.
 */
function appendMessage(role, text) {
    const msgElement = document.createElement('div');
    msgElement.classList.add('message', role);
    msgElement.textContent = text;
    chatBox.appendChild(msgElement);
    // Scroll to the bottom of the chat box
    chatBox.scrollTop = chatBox.scrollHeight;
    return msgElement; // Return the element so we can modify it later
}
