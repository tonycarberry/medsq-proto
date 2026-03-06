// Hotel Page Interactions (Booking Form)
document.addEventListener("DOMContentLoaded", function () {
  // Booking Form Elements
  const dateTriggers = document.querySelectorAll(".js-date-trigger");
  const guestsTrigger = document.querySelector(".js-guests-trigger");
  const guestsModal = document.getElementById("guests-modal");
  const allModals = document.querySelectorAll(".booking-modal");

  // Toggle Modals
  function closeAllModals() {
    allModals.forEach(m => m.classList.remove("booking-modal--open"));
  }

  // Date Picker Triggers
  dateTriggers.forEach((trigger) => {
    trigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const type = trigger.getAttribute("data-type");
      const targetModal = document.getElementById(`date-picker-${type}`);
      
      const wasOpen = targetModal.classList.contains("booking-modal--open");
      closeAllModals();
      
      if (!wasOpen) {
        targetModal.classList.add("booking-modal--open");
        
        // Update selected state in picker based on current value
        const currentValue = trigger.querySelector(".booking-form__value").textContent;
        const dayMatch = currentValue.match(/\d+/);
        if (dayMatch) {
          updatePickerSelection(targetModal, dayMatch[0]);
        }
      }
    });
  });

  // Date Selection Logic for all pickers
  document.querySelectorAll(".js-date-picker-modal").forEach(modal => {
    const type = modal.id.replace('date-picker-', '');
    const days = modal.querySelectorAll(".date-picker__day");
    
    days.forEach((day) => {
      day.addEventListener("click", function (e) {
        if (day.classList.contains("date-picker__day--disabled")) return;
        
        const selectedDay = day.textContent;
        updatePickerSelection(modal, selectedDay);
        
        const targetField = document.querySelector(`.js-date-trigger[data-type="${type}"] .booking-form__value`);
        if (targetField) {
          const weekdays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const date = new Date(2025, 4, parseInt(selectedDay)); // 4 is May
          const dayName = weekdays[date.getDay()];
          targetField.textContent = `${dayName} ${selectedDay} May`;
        }
      });
    });
  });

  function updatePickerSelection(modal, dayNum) {
    const days = modal.querySelectorAll(".date-picker__day");
    days.forEach((d) => {
      if (d.textContent.trim() === dayNum.trim() && !d.classList.contains("date-picker__day--disabled")) {
        d.classList.add("date-picker__day--selected");
      } else {
        d.classList.remove("date-picker__day--selected");
      }
    });
  }

  // Toggle Guests Modal
  if (guestsTrigger) {
    guestsTrigger.addEventListener("click", function (e) {
      e.stopPropagation();
      const wasOpen = guestsModal.classList.contains("booking-modal--open");
      closeAllModals();
      if (!wasOpen) {
        guestsModal.classList.add("booking-modal--open");
      }
    });
  }

  // Close modals when clicking outside
  document.addEventListener("click", function (e) {
    // Only close if clicking outside modal triggers
    const clickedTrigger = e.target.closest(".js-date-trigger, .js-guests-trigger");
    const clickedModal = e.target.closest(".booking-modal");
    
    if (!clickedTrigger && !clickedModal) {
      closeAllModals();
    }
  });

  // Prevent closing when clicking inside modals
  allModals.forEach(modal => {
    modal.addEventListener("click", (e) => e.stopPropagation());
  });

  // Counter Logic for Participants
  const counterRows = document.querySelectorAll(".participants__row");
  counterRows.forEach((row) => {
    const decBtn = row.querySelector(".participants__btn:first-child");
    const incBtn = row.querySelector(".participants__btn:last-child");
    const valueSpan = row.querySelector(".participants__value");

    if (decBtn && incBtn && valueSpan) {
      decBtn.addEventListener("click", () => {
        let val = parseInt(valueSpan.textContent);
        if (val > 0) {
          valueSpan.textContent = val - 1;
          updateGuestsDisplay();
        }
      });

      incBtn.addEventListener("click", () => {
        let val = parseInt(valueSpan.textContent);
        valueSpan.textContent = val + 1;
        updateGuestsDisplay();
      });
    }
  });

  function updateGuestsDisplay() {
    const values = Array.from(document.querySelectorAll(".participants__value")).map((v) => parseInt(v.textContent));
    const adultCount = values[0];
    const childCount = values[1];
    const infantCount = values[2];

    const display = document.querySelector(".js-guests-trigger .booking-form__value");
    if (display) {
      let parts = [];
      if (adultCount > 0) parts.push(`${adultCount} adult${adultCount > 1 ? "s" : ""}`);
      if (childCount > 0) parts.push(`${childCount} child${childCount > 1 ? "ren" : ""}`);
      if (infantCount > 0) parts.push(`${infantCount} infant${infantCount > 1 ? "s" : ""}`);
      display.textContent = parts.join(", ") || "Select guests";
    }
  }

  // Hero video - ensure it plays automatically
  const heroVideo = document.querySelector(".hero__video");
  if (heroVideo) {
    // Ensure video is muted and has autoplay attributes
    heroVideo.muted = true;
    heroVideo.setAttribute('autoplay', '');
    heroVideo.setAttribute('playsinline', '');
    heroVideo.setAttribute('loop', '');
    heroVideo.setAttribute('preload', 'auto');
    
    // Add error handler
    heroVideo.addEventListener('error', (e) => {
      console.error("Hero video error:", e, heroVideo.error);
      console.log("Video src:", heroVideo.currentSrc);
      console.log("Video readyState:", heroVideo.readyState);
    });
    
    // Try to play immediately
    const tryPlay = () => {
      if (heroVideo.paused) {
        const playPromise = heroVideo.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              console.log("Hero video playing successfully");
            })
            .catch(e => {
              console.log("Hero video play attempt failed:", e.message);
            });
        }
      }
    };
    
    // Try playing when video is ready
    heroVideo.addEventListener('loadeddata', () => {
      console.log("Hero video loadeddata event");
      tryPlay();
    });
    heroVideo.addEventListener('canplay', () => {
      console.log("Hero video canplay event");
      tryPlay();
    });
    heroVideo.addEventListener('canplaythrough', () => {
      console.log("Hero video canplaythrough event");
      tryPlay();
    });
    
    // Try immediately
    tryPlay();
    
    // Also try after delays
    setTimeout(tryPlay, 100);
    setTimeout(tryPlay, 500);
    setTimeout(tryPlay, 1000);
    
    // Ensure it plays when visible and pauses when not visible
    const heroObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting && entry.intersectionRatio > 0.1) {
          // Play when visible
          tryPlay();
        } else {
          // Pause when not visible to save resources
          if (!heroVideo.paused) {
            heroVideo.pause();
            console.log("Hero video paused (not visible)");
          }
        }
      });
    }, { threshold: [0.1] });
    
    heroObserver.observe(heroVideo);
    
    // Fallback: try on any user interaction
    document.addEventListener('click', () => {
      tryPlay();
    }, { once: true });
    
    // Log video state
    console.log("Hero video initialized:", {
      src: heroVideo.currentSrc,
      readyState: heroVideo.readyState,
      paused: heroVideo.paused,
      muted: heroVideo.muted
    });
  } else {
    console.error("Hero video element not found!");
  }

  // Video Playback Control: Only one teaser/room video playing at a time (the most visible)
  const teaserVideos = document.querySelectorAll(".teasers-video");
  const roomVideos = document.querySelectorAll(".room-video");
  const allContentVideos = Array.from(teaserVideos).concat(Array.from(roomVideos));
  
  if (allContentVideos.length > 0) {
    const observerOptions = {
      threshold: [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0]
    };

    const videoRatios = new Map();
    let rafId = null;

    const videoObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        videoRatios.set(entry.target, entry.intersectionRatio);
      });

      if (rafId) cancelAnimationFrame(rafId);
      
      rafId = requestAnimationFrame(() => {
        let mostVisibleVideo = null;
        let maxRatio = 0;

        videoRatios.forEach((ratio, video) => {
          if (ratio > maxRatio) {
            maxRatio = ratio;
            mostVisibleVideo = video;
          }
        });

        // Pause all content videos and play only the most visible one
        allContentVideos.forEach((video) => {
          if (video === mostVisibleVideo && maxRatio > 0.1) {
            if (video.paused) {
              video.play().catch(e => console.log("Video play interrupted", e));
            }
          } else {
            if (!video.paused) {
              video.pause();
            }
          }
        });
      });
    }, observerOptions);

    allContentVideos.forEach((video) => {
      videoObserver.observe(video);
    });
  }
});
