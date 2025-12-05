// ------------------------------------------------------------------
// 🔧 SUPABASE CONFIG - Using Environment Variables
// These will be loaded from the backend API
// ------------------------------------------------------------------

let supabase;

async function initializeSupabase() {
    try {
        const response = await fetch('/api/config');
        const config = await response.json();
        
        // Access Supabase from the global window object
        const { createClient } = window.supabase;
        supabase = createClient(
            config.SUPABASE_URL,
            config.SUPABASE_ANON_KEY
        );
        
        console.log('Supabase initialized successfully');
    } catch (error) {
        console.error('Failed to initialize Supabase:', error);
        showMessage('Configuration error. Please contact support.', 'error');
    }
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    initializeSupabase();
});

document.getElementById('signupForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    
    if (!supabase) {
        showMessage('Application not ready. Please refresh the page.', 'error');
        return;
    }
    
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
        // Insert data into 'users' table
        const { error } = await supabase
            .from('users')
            .insert([
                { name: data.name, phone: data.phone, station: data.station }
            ]);

        if (error) {
            console.error('Supabase Error:', error);
            if (error.code === '23505') { // Unique violation
                showMessage('This phone number is already registered.', 'error');
            } else {
                showMessage('Error saving data. Please try again.', 'error');
            }
        } else {
            showMessage('Successfully signed up for alerts!', 'success');
            this.reset();
        }
    } catch (err) {
        console.error('Unexpected Error:', err);
        showMessage('An unexpected error occurred.', 'error');
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
