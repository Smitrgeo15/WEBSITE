document.addEventListener('DOMContentLoaded', function() {
    const modal = document.getElementById('imageModal');
    const modalImage = document.getElementById('modalImage');
    const modalCaption = document.getElementById('modalCaption');
    const closeButton = document.querySelector('.close-button');
    const galleryItems = document.querySelectorAll('.gallery-item');

    let lastTapTime = 0; // Variable to track last tap time for double-tap detection

    galleryItems.forEach(item => {
        // Event listener for desktop double-click
        item.addEventListener('dblclick', function() {
            openModal(item);
        });

        // Event listeners for mobile double-tap
        item.addEventListener('touchstart', function(e) {
            const currentTime = new Date().getTime();
            const tapLength = currentTime - lastTapTime;

            if (tapLength < 300 && tapLength > 0) { // Check if it's a double-tap (within 300ms)
                e.preventDefault(); // Prevent default zoom/scroll on double-tap
                openModal(item);
            }
            lastTapTime = currentTime;
        }, { passive: false }); // Use passive: false to allow e.preventDefault()
    });

    // Function to open the modal, called by both double-click and double-tap
    function openModal(item) {
        const img = item.querySelector('img');
        const caption = item.querySelector('.gallery-caption');

        modal.classList.add('active'); // Add active class to show modal with transition
        modalImage.src = img.src;
        modalImage.alt = img.alt;
        modalCaption.textContent = caption ? caption.textContent : img.alt; // Use caption or alt text
        document.body.style.overflow = 'hidden'; // Prevent scrolling background
    }

    // Close modal when close button is clicked
    closeButton.addEventListener('click', function() {
        modal.classList.remove('active'); // Remove active class to hide modal
        document.body.style.overflow = ''; // Restore scrolling
    });

    // Close modal when clicking anywhere outside the modal content (on the overlay)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) { // Check if the click was directly on the overlay
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });

    // Close modal with Escape key
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape' && modal.classList.contains('active')) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    });
});
