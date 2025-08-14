// --- Start of Hero Section Animation Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const heroSection = document.querySelector('.hero');

    if (heroSection) {
        // Apply the final state styles after a short delay
        // This allows the initial (hidden/transformed) state to render first
        setTimeout(() => {
            heroSection.style.opacity = '1'; // Fade in
            heroSection.style.transform = 'translateY(0)'; // Slide up to original position
        }, 100); // A small delay (e.g., 100ms) can sometimes make the animation more reliable
    }
});
// --- End of Hero Section Animation Logic ---


// --- Start of Announcement Slider Logic ---
document.addEventListener('DOMContentLoaded', function() {
    const sliderContainer = document.getElementById('announcementsSliderContainer');
    const sliderItems = Array.from(sliderContainer.querySelectorAll('.slider-item'));
    // Updated selectors to target <a> tags
    const readMoreBtns = document.querySelectorAll('a.read-more-btn');
    const readLessBtns = document.querySelectorAll('a.read-less-btn');

    if (sliderItems.length === 0) {
        console.warn("No slider items found for announcements slider.");
        return;
    }

    let currentIndex = 0;
    const displayDuration = 1000; // 1 second display for heading-only
    const animationDuration = 800; // 0.8 seconds for slide animation
    let autoSlideTimeout; // Stores the timeout for the next slide cycle
    let isSliderPaused = false; // Flag to control auto-sliding

    // Store initial height of each item (heading + read more button only)
    let initialItemHeights = [];

    // Temporarily make all items visible to correctly calculate their initial (collapsed) height
    // And ensure full content is hidden for accurate initial height measurement
    sliderItems.forEach(item => {
        const fullContent = item.querySelector('.full-content');
        const readMoreBtn = item.querySelector('.read-more-btn');

        if (fullContent) fullContent.style.display = 'none'; // Ensure full content is hidden
        if (readMoreBtn) readMoreBtn.style.display = 'inline-block'; // Ensure button is visible

        item.style.display = 'block'; // Make it display block to measure its collapsed height
        item.style.opacity = '1';
        item.style.transform = 'translateX(0%)'; // Also reset transform for accurate measurement
    });

    sliderItems.forEach((item) => {
        initialItemHeights.push(item.offsetHeight); // Capture initial height after setup
    });

    // Now hide and position correctly for the start (all but first off-screen right)
    sliderItems.forEach((item, index) => {
        if (index !== 0) {
            item.style.display = 'none';
            item.style.opacity = '0';
            item.style.transform = 'translateX(100%)';
        }
    });

    /**
     * Adjusts the container's min-height to match the current active slide's content.
     * This makes the container expand/shrink smoothly with content.
     * @param {number} [indexToMeasure=currentIndex] - The index of the slide to measure height.
     */
    function adjustContainerHeight(indexToMeasure = currentIndex) {
        if (sliderItems[indexToMeasure]) {
            // Use scrollHeight for accurate content height, whether expanded or collapsed
            sliderContainer.style.minHeight = sliderItems[indexToMeasure].scrollHeight + 'px';
        }
    }

    /**
     * Controls the visibility and animation of slider items.
     * @param {number} newIndex - The index of the slide to become active.
     */
    function showSlide(newIndex) {
        if (isSliderPaused) {
            return; // Don't proceed if slider is paused
        }

        // Ensure the previous item's full content is hidden and button text is "Read More"
        // This is important if a slide was expanded and then the auto-slider moved on
        if (sliderItems[currentIndex]) {
            const currentFullContent = sliderItems[currentIndex].querySelector('.full-content');
            const currentReadMoreBtn = sliderItems[currentIndex].querySelector('.read-more-btn');
            if (currentFullContent) currentFullContent.style.display = 'none';
            if (currentReadMoreBtn) {
                currentReadMoreBtn.style.display = 'inline-block';
                currentReadMoreBtn.textContent = 'Read More'; // Ensure text is reset
            }
        }

        const prevIndex = currentIndex;
        currentIndex = newIndex;

        // Ensure index loops correctly
        if (currentIndex >= sliderItems.length) {
            currentIndex = 0;
        } else if (currentIndex < 0) {
            currentIndex = sliderItems.length - 1;
        }

        const prevSlide = sliderItems[prevIndex];
        const nextSlide = sliderItems[currentIndex];

        // --- Animate previous slide out (to left) ---
        if (prevSlide && prevSlide !== nextSlide) {
            prevSlide.style.transform = 'translateX(-100%)'; // Slide out left
            prevSlide.style.opacity = '0'; // Fade out
            // Hide completely and reset position after animation
            setTimeout(() => {
                prevSlide.style.display = 'none';
                prevSlide.style.transform = 'translateX(100%)'; // Reset to off-screen right for next cycle
            }, animationDuration);
        }

        // --- Prepare and Animate next slide in (from right) ---
        nextSlide.style.display = 'block'; // Make it visible for animation
        nextSlide.style.transform = 'translateX(100%)'; // Start from off-screen right
        nextSlide.style.opacity = '0'; // Start invisible

        // Force reflow to ensure initial transform is applied before transition
        nextSlide.offsetWidth; // Triggers reflow

        // Animate the next slide in
        nextSlide.style.transform = 'translateX(0%)'; // Slide to center
        nextSlide.style.opacity = '1'; // Fade in

        // Adjust container height for the new slide (initial heading-only height)
        sliderContainer.style.minHeight = initialItemHeights[currentIndex] + 'px';


        // Re-start auto-slide cycle if not paused
        if (!isSliderPaused) {
            autoSlide();
        }
    }

    /**
     * Starts the automatic slide cycling.
     */
    function autoSlide() {
        // Clear any existing timeout to prevent multiple cycles
        clearTimeout(autoSlideTimeout);

        if (isSliderPaused || sliderItems.length < 2) { // Don't auto-slide if paused or only one item
            return;
        }

        // Schedule the next slide transition
        autoSlideTimeout = setTimeout(() => {
            showSlide(currentIndex + 1);
        }, displayDuration + animationDuration); // Total time = display time + animation time
    }

    // --- Event Listeners for Read More/Less buttons ---
    readMoreBtns.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            isSliderPaused = true; // Pause the slider
            clearTimeout(autoSlideTimeout); // Stop current auto-slide

            const fullContent = this.nextElementSibling; // The div right after the button
            const sliderItem = this.closest('.slider-item');
            const readLessBtn = fullContent ? fullContent.querySelector('.read-less-btn') : null;

            if (fullContent && sliderItem) {
                fullContent.style.display = 'block'; // Show the full content
                this.style.display = 'none'; // Hide "Read More" button
                if (readLessBtn) readLessBtn.style.display = 'inline-block'; // Ensure "Read Less" is shown

                // Adjust container height to fit expanded content
                setTimeout(() => { // Small delay to allow content to render before measuring
                     sliderContainer.style.minHeight = sliderItem.scrollHeight + 'px';
                }, 50);
            }
        });
    });

    readLessBtns.forEach(button => {
        button.addEventListener('click', function(event) {
            event.preventDefault(); // Prevent default link behavior
            const fullContent = this.closest('.full-content');
            const sliderItem = this.closest('.slider-item');
            const readMoreBtn = sliderItem ? sliderItem.querySelector('.read-more-btn') : null;

            if (fullContent && sliderItem) {
                fullContent.style.display = 'none'; // Hide the full content
                if (readMoreBtn) {
                    readMoreBtn.style.display = 'inline-block'; // Show "Read More" button
                    readMoreBtn.textContent = 'Read More'; // Ensure text is reset
                }
                this.style.display = 'none'; // Hide "Read Less" button

                // Revert container height to the initial heading-only height for this slide
                sliderContainer.style.minHeight = initialItemHeights[currentIndex] + 'px';

                isSliderPaused = false; // Resume the slider
                autoSlide(); // Start auto-sliding again
            }
        });
    });


    // Initial setup: show the first slide and start auto-play
    if (sliderItems.length > 0) {
        // Ensure the first slide is correctly positioned and visible at start
        sliderItems[0].style.display = 'block';
        sliderItems[0].style.transform = 'translateX(0%)';
        sliderItems[0].style.opacity = '1';

        // Adjust height for the initially visible slide (its heading-only state)
        adjustContainerHeight(0);
        autoSlide(); // Start the auto-slide cycle
    }

    // Optional: Re-adjust height on window resize
    window.addEventListener('resize', () => {
        // Only adjust if the current item is visible and not paused (or if it's currently expanded)
        if (!isSliderPaused || sliderItems[currentIndex].querySelector('.full-content').style.display === 'block') {
            adjustContainerHeight(); // Measure current actual height
        } else {
             // If paused and not expanded, revert to initial height calculation
             sliderContainer.style.minHeight = initialItemHeights[currentIndex] + 'px';
        }
    });
});
// --- End of Announcement Slider Logic ---
