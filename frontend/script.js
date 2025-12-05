const API_URL = 'http://127.0.0.1:5000'; // Placeholder for local dev, will update for prod

document.getElementById('signupForm').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const submitBtn = document.getElementById('submitBtn');
    const messageDiv = document.getElementById('message');
    const formData = new FormData(this);
    const data = Object.fromEntries(formData.entries());

    // Basic Validation
    if (!data.name || !data.phone || !data.station) {
        showMessage('Please fill in all fields.', 'error');
        return;
    }

    // Disable button
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing up...';
    messageDiv.textContent = '';
    messageDiv.className = 'message';

    try {
        const response = await fetch(`${API_URL}/signup`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data),
        });

        const result = await response.json();

        if (response.ok) {
            showMessage('Successfully signed up for alerts!', 'success');
            this.reset();
        } else {
            showMessage(result.error || 'Something went wrong. Please try again.', 'error');
        }
    } catch (error) {
        console.error('Error:', error);
        showMessage('Failed to connect to the server.', 'error');
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign Up for Alerts';
    }
});

function showMessage(text, type) {
    const messageDiv = document.getElementById('message');
    messageDiv.textContent = text;
    messageDiv.className = `message ${type}`;
}
