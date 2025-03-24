document.addEventListener('DOMContentLoaded', () => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user) {
        alert('Please log in to view your profile.');
        window.location.href = '/signup/signup.html';
        return;
    }

    document.getElementById('signup-name').value = user.name;
    document.getElementById('signup-email').value = user.email;
    document.getElementById('bio').value = user.profile?.bio || '';
    if (user.profile?.avatar) {
        document.getElementById('profileImage').src = user.profile.avatar;
        console.log(`Profile image URL: ${user.profile.avatar}`);
    }

    document.getElementById('avatar').addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                document.getElementById('profileImage').src = reader.result;
            };
            reader.readAsDataURL(file);
        }
    });

    document.getElementById('profileForm').addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = new FormData();
        formData.append('name', document.getElementById('signup-name').value);
        formData.append('bio', document.getElementById('bio').value);
        const avatarFile = document.getElementById('avatar').files[0];
        if (avatarFile) {
            formData.append('avatar', avatarFile);
        }

        try {
            const response = await fetch('/api/profile', {
                method: 'PUT',
                headers: {
                    Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Updated user data received:', result.user);
                alert('Profile updated successfully.');
                
                // Update user in localStorage
                localStorage.setItem('user', JSON.stringify(result.user));
                
                // Update UI with new user data
                document.getElementById('signup-name').value = result.user.name;
                document.getElementById('bio').value = result.user.profile.bio || '';
                if (result.user.profile.avatar) {
                    document.getElementById('profileImage').src = result.user.profile.avatar;
                }
            } else {
                console.error('Server Error:', result);
                alert(result.message || 'Failed to update profile.');
            }
        } catch (err) {
            console.error('Error:', err);
            alert('An error occurred. Please try again.');
        }
    });
});
