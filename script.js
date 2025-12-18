/*
    Bon Appétit Luxury Restaurant Website
    JavaScript File: script.js
*/

/* ======== Navbar Toggle (Mobile) ======== */
const navMenu = document.getElementById('nav-menu');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close'); // You can add a close icon if you want

if (navToggle) {
    navToggle.addEventListener('click', () => {
        navMenu.classList.toggle('show-menu');
    });
}

// Close menu when a link is clicked
const navLinks = document.querySelectorAll('.navbar-link');
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        if (navMenu.classList.contains('show-menu')) {
            navMenu.classList.remove('show-menu');
        }
    });
});

/* ======== Sticky Header Shadow ======== */
window.addEventListener('scroll', () => {
    const header = document.getElementById('header');
    if (window.scrollY >= 50) {
        header.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.3)';
    } else {
        header.style.boxShadow = 'none';
    }
});

/* ======== Reservation Form Popup ======== */
// This logic will only run on the reservation.html page
const reservationForm = document.getElementById('reservation-form');
const popupModal = document.getElementById('popup-modal');
const popupClose = document.getElementById('popup-close');

if (reservationForm && popupModal && popupClose) {
    
    reservationForm.addEventListener('submit', (e) => {
        e.preventDefault(); // Prevent the form from actually submitting
        
        // 1. Get data from the form
        const formData = new FormData(reservationForm);
        const reservationData = Object.fromEntries(formData.entries());

        // 2. Check if user is logged in (optional, but good practice)
        if (!localStorage.getItem('bonAppetitCurrentUser')) {
            alert('Please log in to make a reservation.');
            window.location.href = 'membership.html';
            return;
        }

        // 3. Save reservation to history in localStorage
        const history = JSON.parse(localStorage.getItem('bonAppetitReservationHistory')) || [];
        history.push(reservationData);
        localStorage.setItem('bonAppetitReservationHistory', JSON.stringify(history));

        // 4. Show the success popup
        popupModal.classList.add('show');
    });

    popupClose.addEventListener('click', () => {
        // Hide the popup
        popupModal.classList.remove('show');
        
        // Reset the form
        reservationForm.reset();
    });

    // Also close if clicking outside the content
    popupModal.addEventListener('click', (e) => {
        if (e.target === popupModal) {
            popupModal.classList.remove('show');
            reservationForm.reset();
        }
    });
}

/* ======== Active Page Link Styling ======== */
// This highlights the current page in the navbar
const currentPage = window.location.pathname.split('/').pop(); // Get the current html file name

navLinks.forEach(link => {
    const linkPage = link.getAttribute('href').split('/').pop();
    
    // Remove active from all links first
    link.classList.remove('active-link');
    
    if (currentPage === "") {
        // If on home page (index.html or root)
        if (linkPage === "index.html") {
            link.classList.add('active-link');
        }
    } else if (linkPage === currentPage) {
        link.classList.add('active-link');
    }
});

/* ======== Simple Scroll Animations (Fade-in) ======== */
// A simple animation observer for elements
const sectionsToAnimate = document.querySelectorAll('.menu-card, .chef-card, .branch-card, .membership-card, .gallery-item');

const animationObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeIn 1s ease-out forwards';
            observer.unobserve(entry.target); // Stop observing once animated
        }
    });
}, { threshold: 0.1 }); // Trigger when 10% of the element is visible

sectionsToAnimate.forEach(el => {
    el.style.opacity = 0; // Hide elements initially
    animationObserver.observe(el);
});

/*
=================================================
    NEW: Simulated Login & Membership Portal
=================================================
*/

// Get the forms from membership.html
const registerForm = document.getElementById('register-form');
const loginForm = document.getElementById('login-form');

// --- 1. Handle Registration ---
if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get data from register form
        const name = document.getElementById('reg-name').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-pass').value;

        // Basic validation
        if (!name || !email || !password) {
            alert('Please fill in all fields.');
            return;
        }

        // Create a user object
        const user = { name, email, password };

        // Save the user to localStorage
        // In a real backend, you would encrypt the password!
        localStorage.setItem('bonAppetitUserAccount', JSON.stringify(user));

        alert('Registration successful! You can now log in.');
        registerForm.reset();
    });
}

// --- 2. Handle Login ---
if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();

        // Get data from login form
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-pass').value;

        // Get the stored user account
        const storedUserJSON = localStorage.getItem('bonAppetitUserAccount');
        
        if (!storedUserJSON) {
            alert('No user account found. Please register first.');
            return;
        }

        const storedUser = JSON.parse(storedUserJSON);

        // Check if credentials match
        if (email === storedUser.email && password === storedUser.password) {
            // SUCCESS!
            alert('Login successful! Welcome, ' + storedUser.name);
            
            // Create a "session" by storing the current user
            localStorage.setItem('bonAppetitCurrentUser', JSON.stringify(storedUser));
            
            // Redirect to the home page
            window.location.href = 'index.html';

        } else {
            // FAILED!
            alert('Invalid email or password.');
        }
    });
}

/* --- 3. Check Login Status & Run Page-Specific Logic --- */
document.addEventListener('DOMContentLoaded', () => {
    
    // Get all the DOM elements we need
    const currentUserJSON = localStorage.getItem('bonAppetitCurrentUser');
    const navMembershipLink = document.getElementById('nav-membership-link');
    const navAccountLink = document.getElementById('nav-account-link'); // The new <li>
    let currentUser = null;

    // --- Check login status and update navbar (runs on ALL pages) ---
    if (currentUserJSON && navMembershipLink && navAccountLink) {
        currentUser = JSON.parse(currentUserJSON); // Get the user data

        // 1. SHOW the new "Account" button
        navAccountLink.style.display = 'list-item';

        // 2. Create and add the "Logout" button
        const logoutItem = document.createElement('li');
        logoutItem.className = 'navbar-item';
        logoutItem.innerHTML = '<a href="#" id="logout-link" class="navbar-link">Logout</a>';
        
        if (!document.getElementById('logout-link')) { // Only add if it doesn't exist
            navAccountLink.after(logoutItem); // Add "Logout" AFTER "Account"
        }

    } else if (navAccountLink) {
        // User is logged out, make sure "Account" is hidden
        navAccountLink.style.display = 'none';
    }

    // --- Handle the "active-link" for the current page ---
    const currentPath = window.location.pathname;

    if (currentPath.endsWith('portal.html') && navAccountLink) {
        // On Account page
        navAccountLink.querySelector('a').classList.add('active-link');
    } else if (currentPath.endsWith('membership.html') && navMembershipLink) {
        // On Membership page
        navMembershipLink.querySelector('a').classList.add('active-link');
    }


    // --- Run logic ONLY for portal.html ---
    if (currentPath.endsWith('portal.html')) {
        
        // 1. Protect the page
        if (!currentUser) { 
            alert('You must be logged in to view your Account.');
            window.location.href = 'membership.html';
        } else {
            // 2. We are logged in! Get all data from localStorage.
            const membershipPlan = localStorage.getItem('bonAppetitMembershipPlan') || 'No Plan';
            const reservations = JSON.parse(localStorage.getItem('bonAppetitReservationHistory')) || [];

            // 3. Populate the page with user's data
            const portalUsername = document.getElementById('portal-username');
            if (portalUsername) {
                portalUsername.textContent = currentUser.name;
            }

            // 4. Populate Membership Card
            const memDisplay = document.getElementById('membership-card-display');
            if (memDisplay) {
                let memBenefits = '';
                if (membershipPlan === 'VIP') {
                    memBenefits = '<p>You get 15% off all orders and VIP lounge access.</p>';
                } else if (membershipPlan === 'Executive') {
                    memBenefits = '<p>You get 25% off, lounge access, and private dining.</p>';
                } else if (membershipPlan === 'General') {
                    memBenefits = '<p>You get 5% off all orders and priority waiting.</p>';
                }

                memDisplay.innerHTML = `
                    <div class="membership-card ${membershipPlan !== 'No Plan' ? 'featured' : ''}">
                        <h3>${membershipPlan}</h3>
                        ${memBenefits}
                        ${membershipPlan === 'No Plan' ? '<p>You have not selected a plan.</p><br><a href="membership.html" class="btn btn-primary">Choose Plan</a>' : ''}
                    </div>
                `;
            }

            // 5. Populate Reservation List
            const resList = document.getElementById('reservation-list');
            if (resList) {
                resList.innerHTML = ''; // Clear the "loading" message
                
                if (reservations.length === 0) {
                    resList.innerHTML = '<p>You have no reservation history.</p>';
                } else {
                    reservations.forEach(res => {
                        const li = document.createElement('li');
                        li.className = 'reservation-item';
                        li.innerHTML = `
                            <div>
                                <strong>${res.branch} Branch</strong> - Event: ${res.event}
                                <br>
                                <small>${res.date} at ${res.time} for ${res.guests} guests</small>
                            </div>
                            <span class="status">Confirmed</span>
                        `;
                        resList.appendChild(li);
                    });
                }
            }
        }
    }
});

// --- 4. Handle Logout ---
// We add the listener to the whole document because the logout link is created by JS
document.addEventListener('click', (e) => {
    if (e.target.id === 'logout-link') {
        e.preventDefault();

        // Remove the user session
        localStorage.removeItem('bonAppetitCurrentUser');
        
        alert('You have been logged out.');

        // Redirect to the login page
        window.location.href = 'membership.html';
    }
});

/*
=================================================
    NEW: Handle Membership "Purchase"
=================================================
*/
document.addEventListener('click', (e) => {
    // Check if the clicked item is a plan button
    if (e.target.id === 'plan-general' || e.target.id === 'plan-vip' || e.target.id === 'plan-executive') {
        e.preventDefault();
        
        // Check if user is logged in
        if (!localStorage.getItem('bonAppetitCurrentUser')) {
            alert('Please log in or register to select a membership.');
            window.location.href = 'membership.html#login-form'; // Go to login form
            return;
        }
        
        // Get plan name from the button
        let planName = 'General';
        if (e.target.id === 'plan-vip') planName = 'VIP';
        if (e.target.id === 'plan-executive') planName = 'Executive';

        // Save the plan to localStorage
        localStorage.setItem('bonAppetitMembershipPlan', planName);
        
        alert(`Congratulations! You are now a ${planName} member.`);
        
        // Send user to their new portal
        window.location.href = 'portal.html';
    }
});