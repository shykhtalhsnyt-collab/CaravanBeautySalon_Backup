// ==========================================
// 1. UTILITY FUNCTIONS (Price & Back to Top)
// ==========================================

function updatePrice() {
    let service = document.getElementById("service");
    let price = document.getElementById("price");

    if (service && price) {
        price.value = "OMR " + service.value;
    }
}

let mybutton = document.getElementById("topBtn");

window.onscroll = function () {
    if (mybutton) {
        if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
            mybutton.style.display = "block";
        } else {
            mybutton.style.display = "none";
        }
    }
};

function topFunction() {
    document.body.scrollTop = 0;
    document.documentElement.scrollTop = 0;
}


// ==========================================
// 2. MAIN APP EVENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {

    // --- A. MAP INITIALIZATION FOR BOOKING PAGE ---
    const mapElement = document.getElementById('map');
    if (mapElement) {
        // افتراضيًا يتم ضبط الخريطة على مسقط
        const defaultLat = 23.5880;
        const defaultLng = 58.3829;

        const map = L.map('map').setView([defaultLat, defaultLng], 11);

        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors'
        }).addTo(map);

        let marker = L.marker([defaultLat, defaultLng], { draggable: true }).addTo(map);

        // تعيين قيم الموقِع المبدئية
        document.getElementById('latitude').value = defaultLat;
        document.getElementById('longitude').value = defaultLng;

        function updateMarkerPosition(lat, lng) {
            document.getElementById('latitude').value = lat;
            document.getElementById('longitude').value = lng;
        }

        // عند النقر على الخريطة نقل العلامة
        map.on('click', (e) => {
            const { lat, lng } = e.latlng;
            marker.setLatLng([lat, lng]);
            updateMarkerPosition(lat, lng);
        });

        // عند سحب العلامة
        marker.on('dragend', (e) => {
            const position = marker.getLatLng();
            updateMarkerPosition(position.lat, position.lng);
        });
    }


    // --- B. SIGN UP FORM ---
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const fullName = document.getElementById('fullName').value.trim();
            const email = document.getElementById('signupEmail').value.trim();
            const phone = document.getElementById('phone').value.trim();
            const password = document.getElementById('signupPassword').value;
            const confirmPassword = document.getElementById('confirmPassword').value;

            if (password !== confirmPassword) {
                alert('Passwords do not match!');
                return;
            }

            const userData = { fullName, email, phone, password };
            localStorage.setItem('user_' + email, JSON.stringify(userData));

            alert('Account created successfully! Redirecting to login page...');
            window.location.href = 'login.html';
        });
    }

    // --- C. LOGIN FORM ---
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const email = document.getElementById('loginEmail').value.trim();
            const password = document.getElementById('loginPassword').value;
            const savedUser = localStorage.getItem('user_' + email);

            if (savedUser) {
                const user = JSON.parse(savedUser);
                if (user.password === password) {
                    localStorage.setItem('currentUser', JSON.stringify(user));
                    alert('Login successful! Welcome back.');
                    window.location.href = 'index.html';
                } else {
                    alert('Incorrect password! Please try again.');
                }
            } else {
                alert('No account found with this email. Please sign up first.');
            }
        });
    }

    // --- D. WELCOME CARD DISPLAY ---
    const welcomeCard = document.getElementById('welcomeCard');
    const userNameDisplay = document.getElementById('userNameDisplay');

    if (userNameDisplay) {
        const currentUser = JSON.parse(localStorage.getItem('currentUser'));
        if (currentUser && currentUser.fullName) {
            userNameDisplay.textContent = currentUser.fullName;
            if (welcomeCard) welcomeCard.style.display = 'block';
        } else if (welcomeCard) {
            welcomeCard.style.display = 'none';
        }
    }

    // --- E. BOOKING FORM HANDLING ---
    const bookingForm = document.getElementById('bookingForm');
    if (bookingForm) {
        bookingForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const serviceSelect = document.getElementById('service');
            const serviceName = serviceSelect.options[serviceSelect.selectedIndex].text;
            const priceValue = document.getElementById('price').value;

            const bookingDate = document.getElementById('bookingDate').value;
            const bookingTime = document.getElementById('bookingTime').value;
            const addressNotes = document.getElementById('addressNotes').value;
            const lat = document.getElementById('latitude').value;
            const lng = document.getElementById('longitude').value;

            // حفظ بيانات الحجز مع تفاصيل العنوان والموقع
            const newBooking = {
                service: serviceName,
                date: bookingDate,
                time: bookingTime,
                price: priceValue,
                address: addressNotes,
                lat: lat,
                lng: lng,
                status: 'Confirmed'
            };

            localStorage.setItem('userBooking', JSON.stringify(newBooking));
            localStorage.setItem('selectedPrice', priceValue);

            window.location.href = 'payment.html';
        });
    }

    // --- F. PAYMENT FORM HANDLING ---
    const totalAmount = document.getElementById('totalAmount');
    if (totalAmount) {
        const savedPrice = localStorage.getItem('selectedPrice');
        if (savedPrice) {
            totalAmount.value = savedPrice;
        }
    }

    const paymentForm = document.getElementById('paymentForm');
    if (paymentForm) {
        paymentForm.addEventListener('submit', (event) => {
            event.preventDefault();
            alert('Payment completed successfully!');
            window.location.href = 'mybookings.html';
        });
    }

    // --- G. RENDER BOOKINGS TABLE IN MY BOOKINGS PAGE ---
    const bookingTableBody = document.getElementById('bookingTableBody');
    if (bookingTableBody) {
        const savedBooking = JSON.parse(localStorage.getItem('userBooking'));

        if (savedBooking) {
            const mapLink = savedBooking.lat ? `<a href="https://maps.google.com/?q=${savedBooking.lat},${savedBooking.lng}" target="_blank">View Map</a>` : 'N/A';

            const row = `
                <tr>
                    <td>${savedBooking.service}</td>
                    <td>${savedBooking.date}</td>
                    <td>${savedBooking.time}</td>
                    <td>${savedBooking.address} (${mapLink})</td>
                    <td><span style="color: green; font-weight: bold;">${savedBooking.status}</span></td>
                </tr>
            `;
            bookingTableBody.innerHTML = row;
        } else {
            bookingTableBody.innerHTML = `
                <tr>
                    <td colspan="5" style="text-align: center;">No bookings found.</td>
                </tr>
            `;
        }
    }

});