// Mobile Navigation Menu Toggle
document.addEventListener("DOMContentLoaded", function () {
  const menuToggle = document.querySelector(".nav__mobile-menu-toggle");
  const mobileMenu = document.querySelector(".nav__mobile-menu");
  const closeButton = document.querySelector(".nav__mobile-close");
  const body = document.body;

  function openMenu() {
    mobileMenu.classList.add("nav__mobile-menu--open");
    body.style.overflow = "hidden"; // Prevent scrolling when menu is open
  }

  function closeMenu() {
    mobileMenu.classList.remove("nav__mobile-menu--open");
    body.style.overflow = ""; // Restore scrolling
  }

  if (menuToggle) {
    menuToggle.addEventListener("click", openMenu);
  }

  if (closeButton) {
    closeButton.addEventListener("click", closeMenu);
  }

  // Close menu when clicking outside
  if (mobileMenu) {
    mobileMenu.addEventListener("click", function (e) {
      if (e.target === mobileMenu) {
        closeMenu();
      }
    });
  }

  // Close menu on escape key
  document.addEventListener("keydown", function (e) {
    if (e.key === "Escape" && mobileMenu.classList.contains("nav__mobile-menu--open")) {
      closeMenu();
    }
  });

  // Hide burger icon image if it fails to load, so CSS fallback shows
  const burgerIcon = document.querySelector(".nav__burger-icon");
  if (burgerIcon) {
    burgerIcon.addEventListener("error", function () {
      this.style.display = "none";
    });
    // Also check if image loaded successfully after a short delay
    setTimeout(function () {
      if (burgerIcon.complete && burgerIcon.naturalHeight === 0) {
        burgerIcon.style.display = "none";
      }
    }, 500);
  }
});
