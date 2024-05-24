document.addEventListener('DOMContentLoaded', () => {
    const seats = document.querySelectorAll('.seat');
    const form = document.getElementById('booking-form');

    seats.forEach(seat => {
        seat.addEventListener('click', () => {
            seat.classList.toggle('selected');
        });
    });

    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const selectedSeats = document.querySelectorAll('.seat.selected');
        if (selectedSeats.length === 0) {
            alert('Please select at least one seat to book.');
            return;
        }

        const seatNumbers = Array.from(selectedSeats).map(seat => seat.dataset.seat);
        const username = form.username.value;
        const email = form.email.value;

        console.log('Booking Details:');
        console.log('Name:', username);
        console.log('Email:', email);
        console.log('Seats:', seatNumbers);

        alert(`Booking successful for ${username}. Seats: ${seatNumbers.join(', ')}`);
        selectedSeats.forEach(seat => seat.classList.remove('selected'));
        form.reset();
    });
});
