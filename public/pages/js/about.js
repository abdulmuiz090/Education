// Testimonial Slider (Optional if you want the testimonials to slide)
let currentIndex = 0;
const testimonials = document.querySelectorAll('.testimonial');
const totalTestimonials = testimonials.length;

function showTestimonial(index) {
  testimonials.forEach((testimonial, i) => {
    testimonial.style.display = i === index ? 'block' : 'none';
  });
}

function nextTestimonial() {
  currentIndex = (currentIndex + 1) % totalTestimonials;
  showTestimonial(currentIndex);
}

setInterval(nextTestimonial, 5000);  // Change every 5 seconds
showTestimonial(currentIndex); // Initial display

// Add smooth scrolling to anchor links (for better navigation between sections)
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute('href')).scrollIntoView({
      behavior: 'smooth'
    });
  });
});