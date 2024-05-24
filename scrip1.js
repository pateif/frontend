document.addEventListener('DOMContentLoaded', () => {
    const rows = 10;
    const seatsPerRow = 6;
    const seatingChartContainer = document.getElementById('seating-chart-container');
    const seatingChart = document.getElementById('seating-chart');
    const planeSelector = document.getElementById('plane-selector');
    const loginForm = document.getElementById('login-form');
    const loginButton = document.getElementById('login-button');
    const loginError = document.getElementById('login-error');
    const paymentForm = document.getElementById('payment-form');
    const payButton = document.getElementById('pay-button');
    const paymentError = document.getElementById('payment-error');
    let selectedSeats = [];
    let planes = {
        plane1: [],
        plane2: []
    };

    const validUsername = 'user';
    const validPassword = 'password';

    // Initialize seating chart for both planes
    function initializeSeatingChart() {
        planes.plane1 = createSeating(rows, seatsPerRow);
        planes.plane2 = createSeating(rows, seatsPerRow);
        updateSeatingChart('plane1');
    }

    // Create seating structure
    function createSeating(rows, seatsPerRow) {
        const seats = [];
        for (let i = 0; i < rows; i++) {
            const row = [];
            for (let j = 0; j < seatsPerRow; j++) {
                row.push({ row: i, seat: j, booked: false });
            }
            seats.push(row);
        }
        return seats;
    }

    // Update seating chart display
    function updateSeatingChart(plane) {
        seatingChart.innerHTML = '';
        planes[plane].forEach(row => {
            row.forEach(seat => {
                const seatElement = document.createElement('div');
                seatElement.classList.add('seat');
                seatElement.dataset.row = seat.row;
                seatElement.dataset.seat = seat.seat;
                seatElement.dataset.plane = plane;
                seatElement.textContent = `${String.fromCharCode(65 + seat.row)}${seat.seat + 1}`;
                if (seat.booked) {
                    seatElement.classList.add('booked');
                }
                seatElement.addEventListener('click', selectSeat);
                seatingChart.appendChild(seatElement);
            });
        });
    }

    // Function to select a seat
    function selectSeat(event) {
        const seatElement = event.target;
        if (!seatElement.classList.contains('booked')) {
            seatElement.classList.toggle('selected');
            const seatId = `${seatElement.dataset.row}-${seatElement.dataset.seat}`;
            if (seatElement.classList.contains('selected')) {
                selectedSeats.push({ plane: seatElement.dataset.plane, seatId });
            } else {
                selectedSeats = selectedSeats.filter(s => s.seatId !== seatId || s.plane !== seatElement.dataset.plane);
            }
        }
    }

    // Function to book selected seats
    function bookSeats() {
        if (selectedSeats.length > 0) {
            seatingChartContainer.style.display = 'none';
            paymentForm.style.display = 'block';
        } else {
            alert("Please select at least one seat to book.");
        }
    }

    // Function to process payment
    function processPayment() {
        const cardNumber = document.getElementById('card-number').value;
        const cardExpiry = document.getElementById('card-expiry').value;
        const cardCVC = document.getElementById('card-cvc').value;

        if (cardNumber && cardExpiry && cardCVC) {
            selectedSeats.forEach(({ plane, seatId }) => {
                const [row, seat] = seatId.split('-');
                const seatElement = document.querySelector(`.seat[data-plane='${plane}'][data-row='${row}'][data-seat='${seat}']`);
                seatElement.classList.add('booked');
                seatElement.classList.remove('selected');
                planes[plane][row][seat].booked = true;
            });
            selectedSeats = [];
            paymentForm.style.display = 'none';
            seatingChartContainer.style.display = 'block';
            preventSingleScatteredSeats(planeSelector.value);
        } else {
            paymentError.textContent = 'Please fill in all payment details.';
        }
    }

    // Function to prevent single scattered seats
    function preventSingleScatteredSeats(plane) {
        planes[plane].forEach(row => {
            for (let i = 1; i < row.length - 1; i++) {
                if (!row[i].booked && row[i - 1].booked && row[i + 1].booked) {
                    row[i].booked = true;
                }
            }
        });
        updateSeatingChart(plane);
    }

    // Function to handle login
    function handleLogin() {
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;

        if (username === validUsername && password === validPassword) {
            loginForm.style.display = 'none';
            seatingChartContainer.style.display = 'block';
            initializeSeatingChart();
        } else {
            loginError.textContent = 'Invalid username or password. Please try again.';
        }
    }

    // Attach event listener to the login button
    loginButton.addEventListener('click', handleLogin);

    // Attach event listener to the book seats button
    document.getElementById('book-seats').addEventListener('click', bookSeats);

    // Attach event listener to the pay button
    payButton.addEventListener('click', processPayment);

    // Attach event listener to the plane selector
    planeSelector.addEventListener('change', () => {
        updateSeatingChart(planeSelector.value);
    });
});
