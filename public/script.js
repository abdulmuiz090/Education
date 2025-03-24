// Slideshow Functionality
document.addEventListener("DOMContentLoaded", () => {
  const slides = document.querySelectorAll(".slide");
  let currentIndex = 0;

  function showNextSlide() {
    // Remove 'active' from the current slide
    slides[currentIndex].classList.remove("active");

    // Move to the next slide
    currentIndex = (currentIndex + 1) % slides.length;

    // Add 'active' to the next slide
    slides[currentIndex].classList.add("active");
  }

  // Automatically slide every 3 seconds
  setInterval(showNextSlide, 3000);
});
// Subscribe Form Submission
const subscribeForm = document.querySelector('.subscribe form');

if (subscribeForm) {
  subscribeForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = subscribeForm.querySelector('input').value;
    if (email) {
      alert(`Thank you for subscribing, ${email}!`);
      subscribeForm.reset();
    } else {
      alert('Please enter a valid email address.');
    }
  });
} else {
  console.warn('Subscribe form not found. Ensure there is a form with the class "subscribe".');
}