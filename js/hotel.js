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
    closeAllModals();
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

  // Video Playback Control: Only one video playing at a time (the most visible)
  const allVideos = document.querySelectorAll("video");
  
  // Set initial state: pause all but the first visible one (handled by autoplay normally, but we'll manage it)
  const observerOptions = {
    threshold: Array.from({ length: 11 }, (_, i) => i * 0.1) // 0.0, 0.1, ..., 1.0
  };

  const videoRatios = new Map();

  const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      videoRatios.set(entry.target, entry.intersectionRatio);
    });

    // Find the video with the highest intersection ratio
    let mostVisibleVideo = null;
    let maxRatio = 0;

    videoRatios.forEach((ratio, video) => {
      if (ratio > maxRatio) {
        maxRatio = ratio;
        mostVisibleVideo = video;
      }
    });

    // Pause all videos and play only the most visible one
    allVideos.forEach((video) => {
      if (video === mostVisibleVideo && maxRatio > 0.1) { // Threshold to prevent playing if barely visible
        if (video.paused) {
          video.play().catch(e => console.log("Video play interrupted", e));
        }
      } else {
        if (!video.paused) {
          video.pause();
        }
      }
    });
  }, observerOptions);

  allVideos.forEach((video) => {
    // Ensure videos don't have the 'autoplay' attribute interfering too much
    // Though we want them to play eventually, our script will manage it.
    videoObserver.observe(video);
  });
});
