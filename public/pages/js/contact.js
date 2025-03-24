document.getElementById('contact-form').addEventListener('submit', async function(event) {
  event.preventDefault(); // Prevent form submission

  // Collect form data
  const name = document.getElementById('name').value;
  const email = document.getElementById('email').value;
  const subject = document.getElementById('subject').value;
  const message = document.getElementById('message').value;

  // Validate the form
  if (name && email && message) {
      try {
          // Send data to the server
          const response = await fetch('/api/submit-contact', {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify({ name, email, subject, message }),
          });

          if (response.ok) {
              const result = await response.json();
              alert(result.message || "Your message has been sent. We'll get back to you soon!");
              // Optionally reset the form
              document.getElementById('contact-form').reset();
          } else {
              alert("There was an error sending your message. Please try again later.");
          }
      } catch (error) {
          console.error('Error:', error);
          alert("An unexpected error occurred. Please try again later.");
      }
  } else {
      alert("Please fill out all the fields.");
  }
});
