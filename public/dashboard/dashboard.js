document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));

    if (!user) {
        alert('Please log in to access the dashboard.');
        window.location.href = '/public/signup/signup.html';
        return;
    }

    // Update the user's name and avatar
    const userNameElement = document.getElementById('userName');
    const userAvatarElement = document.getElementById('userAvatar');

    userNameElement.textContent = user.name;
    userAvatarElement.src = user.profile?.avatar || '/public/default-avatar.png'; // Use default if avatar is unavailable
});


document.addEventListener('DOMContentLoaded', () => {
    const videoLink = document.getElementById('videoLink');
    const audioLink = document.getElementById('audioLink');
    const pdfLink = document.getElementById('pdfLink');
    const ebookLink = document.getElementById('ebookLink');
  
    const videoContent = document.getElementById('videoContent');
    const audioContent = document.getElementById('audioContent');
    const pdfContent = document.getElementById('pdfContent');
    const ebookContent = document.getElementById('ebookContent');
  
    const contents = [videoContent, audioContent, pdfContent, ebookContent];
  
    function hideAll() {
        contents.forEach(content => content.style.display = 'none');
    }
  
    videoLink.addEventListener('click', () => {
        hideAll();
        videoContent.style.display = 'block';
    });
  
    audioLink.addEventListener('click', () => {
        hideAll();
        audioContent.style.display = 'block';
    });
  
    pdfLink.addEventListener('click', () => {
        hideAll();
        pdfContent.style.display = 'block';
    });
  
    ebookLink.addEventListener('click', () => {
        hideAll();
        ebookContent.style.display = 'block';
    });
  });
  