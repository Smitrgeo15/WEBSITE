document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeBtn = document.getElementsByClassName('image-modal-close')[0];
    const facilityItems = document.querySelectorAll('.facility-item');

    // Function to open the modal
    function openModal(imageSrc, imageAlt, captionText) {
        modal.style.display = 'flex'; // Use flex to center
        modalImage.src = imageSrc;
        modalImage.alt = imageAlt; // Set alt for accessibility
        modalCaption.textContent = captionText;
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Function to close the modal
    function closeModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto'; // Allow background scrolling
    }

    // Add double-click event listener to each facility item
    facilityItems.forEach(item => {
        item.addEventListener('dblclick', function() {
            const img = item.querySelector('.facility-image');
            const caption = item.querySelector('.image-caption');
            if (img && caption) {
                openModal(img.src, img.alt, caption.textContent);
            }
        });
    });

    // Event listener for the close button
    closeBtn.addEventListener('click', closeModal);

    // Close the modal if clicking outside the image content (on the overlay)
    modal.addEventListener('click', function(event) {
        if (event.target === modal) {
            closeModal();
        }
    });
});
