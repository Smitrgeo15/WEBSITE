document.addEventListener('DOMContentLoaded', function() {
    async function loadNavbar() {
        try {
            const response = await fetch('navbar.html');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const navbarHtml = await response.text();

            const navbarPlaceholder = document.getElementById('navbar-placeholder');
            if (navbarPlaceholder) {
                navbarPlaceholder.innerHTML = navbarHtml;

                // --- Navbar Active State Logic ---
                const currentPath = window.location.pathname.split('/').pop(); // Get current page filename
                const navLinks = document.querySelectorAll('.main_nav ul li a');

                navLinks.forEach(link => {
                    const linkPath = link.getAttribute('href');
                    if (linkPath && linkPath.split('/').pop() === currentPath) {
                        link.classList.add('active'); // Add 'active' class to current page link
                        // For parent links with dropdowns, ensure they also get an 'active-parent' class if any child is active
                        let parentLi = link.closest('li');
                        while (parentLi && parentLi.parentNode.classList.contains('main_nav')) {
                            const parentLink = parentLi.querySelector(':scope > a');
                            if (parentLink) {
                                parentLink.classList.add('active-parent'); // Optional: for different styling of active parents
                            }
                            parentLi = parentLi.parentNode.closest('li'); // Move up to grandparent li
                        }
                    }
                });

                // --- Mobile Navigation Toggle Logic (Re-attached) ---
                const navTrigger = document.getElementById('navTrigger');
                const mainNav = document.querySelector('.main_nav');

                if (navTrigger && mainNav) {
                    navTrigger.addEventListener('change', function() {
                        if (this.checked) {
                            mainNav.style.transform = 'translateX(0%)';
                            document.body.style.overflow = 'hidden'; // Prevent scrolling when menu is open
                        } else {
                            mainNav.style.transform = 'translateX(-100%)';
                            document.body.style.overflow = ''; // Restore scrolling
                        }
                    });

                    // Close mobile menu when a link is clicked
                    navLinks.forEach(link => {
                        link.addEventListener('click', function() {
                            if (window.innerWidth <= 767) { // Only for mobile view
                                if (!link.closest('li').querySelector('ul')) { // If it's not a parent with a dropdown
                                     navTrigger.checked = false; // Uncheck the trigger
                                     mainNav.style.transform = 'translateX(-100%)';
                                     document.body.style.overflow = '';
                                }
                            }
                        });
                    });

                    // --- Dropdown Toggle on Mobile (for 'People' -> 'Students') ---
                    // This uses a click toggle for main parent links on mobile
                    const topLevelNavItems = document.querySelectorAll('.main_nav > ul > li');
                    topLevelNavItems.forEach(item => {
                        const hasDropdown = item.querySelector('ul');
                        const link = item.querySelector('a');

                        if (hasDropdown && link) {
                            if (window.innerWidth <= 767) { // Only apply this click behavior on mobile
                                link.addEventListener('click', function(e) {
                                    // Prevent default link behavior if it's a parent link with a dropdown
                                    // unless it's explicitly the "People" link itself (which also has a page)
                                    // For "People" link, if it has href="#", it's a placeholder. If it has actual href, it's a page.
                                    if (link.getAttribute('href') === '#') {
                                        e.preventDefault();
                                        // Toggle visibility of the current dropdown
                                        const currentDropdown = this.nextElementSibling; // The UL
                                        if (currentDropdown && currentDropdown.tagName === 'UL') {
                                            if (currentDropdown.style.display === 'block') {
                                                currentDropdown.style.display = 'none';
                                                this.querySelector('i').style.transform = 'translateY(-50%) rotate(90deg)'; // Rotate back for mobile close
                                            } else {
                                                // Close other open dropdowns at this level
                                                topLevelNavItems.forEach(otherItem => {
                                                    const otherDropdown = otherItem.querySelector(':scope > ul');
                                                    if (otherDropdown && otherDropdown !== currentDropdown && otherDropdown.style.display === 'block') {
                                                        otherDropdown.style.display = 'none';
                                                        otherItem.querySelector('i').style.transform = 'translateY(-50%) rotate(90deg)';
                                                    }
                                                });
                                                currentDropdown.style.display = 'block';
                                                this.querySelector('i').style.transform = 'translateY(-50%) rotate(270deg)'; // Rotate for mobile open
                                            }
                                        }
                                    }
                                });
                            }
                        }
                    });
                }
            } else {
                console.error('Navbar placeholder div not found. Please add <div id="navbar-placeholder"></div> to your HTML.');
            }
        } catch (error) {
            console.error('Error loading navbar:', error);
        }
    }

    loadNavbar(); // Call the function to load the navbar

    // Add event listener for screen resize to handle mobile menu close
    window.addEventListener('resize', function() {
        const navTrigger = document.getElementById('navTrigger');
        const mainNav = document.querySelector('.main_nav');
        if (window.innerWidth > 767) {
            if (navTrigger) navTrigger.checked = false;
            if (mainNav) mainNav.style.transform = 'translateX(0%)';
            document.body.style.overflow = '';
            // Ensure dropdowns are hidden when switching from mobile to desktop
            document.querySelectorAll('.main_nav ul ul').forEach(dropdown => {
                dropdown.style.display = ''; // Reset display property
            });
        }
    });
});
