// Hero animations
document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP plugins
  if (typeof ScrollTrigger !== "undefined") {
    gsap.registerPlugin(ScrollTrigger);
  }

  // Hero vector image (logo/text) scale-in on page load (homepage only)
  const heroVectorImage = document.querySelector(".hero__vector-image");
  if (heroVectorImage) {
    // Scale in the logo from 50% to 100% over 0.2 seconds
    setTimeout(() => {
      heroVectorImage.classList.add("visible");
    }, 0);
  }

  // Hero zipwire frames cycling animation - cycles through all variant frames every 2 seconds (homepage only)
  // Based on Figma variants: Variant2, Variant3, Variant4, Variant5, Variant6, Variant7, Variant8
  const heroZipwireFrames = document.querySelectorAll(".hero__zipwire-frame");
  const heroZipwireBases = document.querySelectorAll(".hero__zipwire-base");
  
  if (heroZipwireFrames.length > 0) {
    let currentFrameIndex = 0;
    let cyclingInterval = null;

    // Start showing images immediately after logo animation finishes (0.2s - logo scales in over 0.2s)
    setTimeout(() => {
      // Show the base images
      heroZipwireBases.forEach((base) => {
        base.classList.add("visible");
      });

      // Show the first frame image
      heroZipwireFrames[0].classList.add("active");

      // Hide base images after first frame appears (they only show with first frame)
      setTimeout(() => {
        heroZipwireBases.forEach((base) => {
          base.style.transition = "none";
          base.offsetHeight; // Force reflow
          base.classList.remove("visible");
        });
      }, 400); // Hide base images after first frame animation completes (0.2s)

      // Start cycling through remaining frames after 2 seconds (first image displays for 2 seconds)
      cyclingInterval = setInterval(() => {
        // Remove transition from old image and hide it instantly
        const oldFrame = heroZipwireFrames[currentFrameIndex];
        oldFrame.style.transition = "none";
        // Force reflow to ensure transition is removed before class change
        oldFrame.offsetHeight;
        oldFrame.classList.remove("active");
        
        // Move to next frame (loop back to 0 after last frame)
        currentFrameIndex = (currentFrameIndex + 1) % heroZipwireFrames.length;

        // Add active class to new frame with scale animation
        const newFrame = heroZipwireFrames[currentFrameIndex];
        // Reset transition to allow scale animation (use CSS default)
        newFrame.style.transition = "";
        // Force reflow to ensure transition is reset before class change
        newFrame.offsetHeight;
        newFrame.classList.add("active");
      }, 2000); // 2 second interval
    }, 200); // 0.2 seconds delay: logo scales in over 0.2s, then images appear immediately after
  }

  // Standard hero elements (not homepage)
  const heroTitle = document.querySelector(".hero:not(.hero--homepage) .hero__title");
  const heroSubtitle = document.querySelector(".hero:not(.hero--homepage) .hero__subtitle");
  const heroImage = document.querySelector(".hero:not(.hero--homepage) .hero__image");
  const heroBgColor = document.querySelector(".hero:not(.hero--homepage) .hero__bg-color");
  const heroSection = document.querySelector(".hero:not(.hero--homepage)");

  // Hero title word-by-word animation (copying reference site style)
  if (heroTitle) {
    // Split title text into words and wrap each in a span
    const text = heroTitle.textContent.trim();
    const words = text.split(/\s+/);

    // Clear and rebuild with wrapped words
    heroTitle.innerHTML = words.map((word) => `<span class="hero__title-word">${word}</span>`).join(" ");

    // Get all word elements
    const wordElements = heroTitle.querySelectorAll(".hero__title-word");

    // Set initial state: words are invisible and positioned to the right
    gsap.set(wordElements, {
      opacity: 0,
      x: 50,
    });

    // Animate words sequentially with stagger
    gsap.to(wordElements, {
      opacity: 1,
      x: 0,
      duration: 0.8,
      delay: 1,
      stagger: 0.1, // 0.1 second delay between each word
      ease: "power2.out",
    });
  }

  // Hero subtitle fade-in animation (fades in last, after title)
  if (heroSubtitle) {
    // Set initial opacity to 0
    gsap.set(heroSubtitle, { opacity: 0 });

    // Fade in after title finishes (1s delay + 1s duration = 2s, then add slight gap)
    gsap.to(heroSubtitle, {
      opacity: 1,
      duration: 1,
      delay: 2.2,
      ease: "power2.out",
    });
  }

  // Hero background image fade-in and zoom from dark overlay
  if (heroImage && heroBgColor) {
    // Set initial state: image invisible and zoomed out, dark overlay fully visible
    gsap.set(heroImage, { opacity: 0, scale: 1.15 });
    gsap.set(heroBgColor, { opacity: 1 });

    // Animate both simultaneously: image fades in and zooms in, overlay fades out
    gsap.to(heroImage, {
      opacity: 1,
      scale: 1,
      duration: 5,
      ease: "power2.out",
    });

    gsap.to(heroBgColor, {
      opacity: 0,
      duration: 5,
      ease: "power2.out",
    });
  }

  // Hero image parallax scroll animation
  if (heroImage && heroSection && typeof ScrollTrigger !== "undefined") {
    // Create parallax effect: image moves slower than scroll
    // As user scrolls down, image moves down at 30% speed, creating depth
    gsap.to(heroImage, {
      yPercent: 30, // Move image 30% down when scrolled past hero section
      ease: "none",
      scrollTrigger: {
        trigger: heroSection,
        start: "top top", // Start when top of hero hits top of viewport
        end: "bottom top", // End when bottom of hero hits top of viewport
        scrub: true, // Smooth scroll-linked animation (no jumps)
      },
    });
  }

  // Ticker image parallax scroll animation
  // Image is anchored to bottom of frame, parallax moves it up to show less sky as user scrolls
  const tickerImage = document.querySelector(".ticker__image");
  const tickerSection = document.querySelector(".ticker-component");

  if (tickerImage && tickerSection && typeof ScrollTrigger !== "undefined") {
    // Wait for layout to calculate proper movement distance
    const initParallax = () => {
      const sectionHeight = tickerSection.offsetHeight;
      const imageHeight = tickerImage.offsetHeight;

      // Calculate the extra height available for parallax movement
      // Image is taller than container, so we can move it up to reveal less sky
      const extraHeight = imageHeight - sectionHeight;

      // Start position: Image anchored to bottom, showing more sky (image positioned lower)
      // Since image is anchored to bottom, positive Y moves it down (shows more sky)
      const startY = extraHeight * 0.6; // Start with image shifted down significantly to show more sky

      // End position: Image moved up to show less sky (more of the bottom/people visible)
      // Negative Y moves image up (shows less sky, more bottom)
      const endY = -extraHeight * 0.4; // End with image shifted up significantly to show less sky

      // Set initial position to start frame (showing more sky)
      // Image is anchored to bottom, so we use transform Y to shift it
      gsap.set(tickerImage, {
        y: startY, // Start position - image shifted down to show more sky
      });

      // Create parallax effect: as user scrolls, image moves up to reveal less sky
      // Start: section bottom at viewport bottom
      // End: section bottom at viewport top
      // As section moves up, image moves up within frame (from showing sky to showing less sky)
      gsap.to(tickerImage, {
        y: endY, // End position - image moved up to show less sky
        ease: "none",
        scrollTrigger: {
          trigger: tickerSection,
          start: "bottom bottom", // Start when bottom of section is at bottom of viewport
          end: "bottom top", // End when bottom of section is at top of viewport
          scrub: true, // Smooth scroll-linked animation (no jumps)
        },
      });
    };

    // Initialize after layout is ready
    if (tickerImage.offsetHeight > 0 && tickerSection.offsetHeight > 0) {
      initParallax();
    } else {
      window.addEventListener("load", initParallax);
      setTimeout(initParallax, 100); // Fallback
    }
  }

  // Ticker text horizontal scrolling animation
  const tickerTextWrapper = document.querySelector(".ticker__text-wrapper");
  const tickerText = document.querySelector(".ticker__text");
  const tickerContent = document.querySelector(".ticker__content");

  if (tickerTextWrapper && tickerText && tickerContent) {
    // Wait for layout to be ready before calculating dimensions
    const initTickerAnimation = () => {
      // Calculate the width of one text element
      const textWidth = tickerText.offsetWidth;
      const contentWidth = tickerContent.offsetWidth;

      // Ensure we have enough text copies to cover viewport + buffer
      // Calculate how many copies we need (viewport width + 2x text width for safety)
      const neededCopies = Math.ceil((contentWidth + textWidth * 2) / textWidth);
      const currentCopies = tickerTextWrapper.querySelectorAll(".ticker__text").length;

      // Add more copies if needed to ensure seamless coverage
      if (currentCopies < neededCopies) {
        const textContent = tickerText.textContent;
        for (let i = currentCopies; i < neededCopies; i++) {
          const newText = document.createElement("p");
          newText.className = "ticker__text ticker__text--duplicate";
          newText.textContent = textContent;
          tickerTextWrapper.appendChild(newText);
        }
      }

      // For seamless looping: move by exactly one text width
      // When reset happens, the next copy is in the exact same position
      const totalWidth = textWidth;

      // Start position: start from 0 so text immediately covers full viewport
      // The first text element starts at the left edge, and duplicates follow seamlessly
      const initialX = 0;

      gsap.set(tickerTextWrapper, {
        x: initialX,
      });

      // Animate continuously moving left
      // The animation moves by exactly one text width, then seamlessly loops
      // With multiple copies, there's always text visible, preventing any gaps
      // Starting from 0 ensures full viewport coverage from the start
      gsap.to(tickerTextWrapper, {
        x: initialX - totalWidth, // Move left by exactly one text width
        duration: 35, // Slower animation (higher duration = slower speed)
        ease: "none", // Constant speed - essential for seamless loop
        repeat: -1, // Infinite loop - seamless reset
      });
    };

    // Initialize after a short delay to ensure layout is ready
    if (tickerText.offsetWidth > 0) {
      initTickerAnimation();
    } else {
      // Wait for font/rendering to complete
      window.addEventListener("load", initTickerAnimation);
      setTimeout(initTickerAnimation, 100); // Fallback
    }
  }

  // Intro text scroll-based word-by-word opacity animation
  const introTextBody = document.querySelector(".intro-text__body");
  const introTextSection = document.querySelector(".intro-text-component");

  if (introTextBody && introTextSection && typeof ScrollTrigger !== "undefined") {
    // Split text into words and wrap each in a span
    const text = introTextBody.textContent.trim();
    const words = text.split(/\s+/);

    // Clear and rebuild with wrapped words
    introTextBody.innerHTML = words.map((word) => `<span class="intro-text__word">${word}</span>`).join(" ");

    // Get all word elements
    const wordElements = introTextBody.querySelectorAll(".intro-text__word");

    // Set initial state: words start at 20% opacity (faded state)
    gsap.set(wordElements, {
      opacity: 0.2, // 20% opacity - faded gray state
    });

    // Create scroll-triggered timeline that animates words sequentially word-by-word
    // Each word transitions from 20% to 100% opacity based on scroll progress
    // Animation completes when section reaches center/just below center of screen
    const wordTimeline = gsap.timeline({
      scrollTrigger: {
        trigger: introTextSection,
        start: "top 75%", // Start animation earlier
        end: "center center", // Complete when section is at center of viewport
        scrub: true, // Smooth scroll-linked animation
        // Markers can be enabled for debugging
        // markers: true,
      },
    });

    // Add each word to the timeline sequentially with a small stagger
    // This ensures words animate one after another, not line-by-line
    wordElements.forEach((word, index) => {
      wordTimeline.to(
        word,
        {
          opacity: 1, // 100% opacity - full visibility
          duration: 0.2, // Quick transition per word
          ease: "power1.out",
        },
        index * 0.05 // Small stagger (0.05s per word) to ensure sequential animation
      );
    });
  }

  // Intro text secondary large scroll-based word-by-word opacity animation
  // Matches intro-text__body animation style: words fade from 20% to 100% opacity
  // Works on both homepage and attractions page
  const introTextSecondarySections = document.querySelectorAll(".intro-text-secondary-component");

  if (introTextSecondarySections.length > 0 && typeof ScrollTrigger !== "undefined") {
    introTextSecondarySections.forEach((section) => {
      const introTextSecondaryLarge = section.querySelector(".intro-text-secondary__large");

      if (introTextSecondaryLarge) {
        // Split text into words and wrap each in a span
        const text = introTextSecondaryLarge.textContent.trim();
        const words = text.split(/\s+/);

        // Clear and rebuild with wrapped words
        introTextSecondaryLarge.innerHTML = words.map((word) => `<span class="intro-text-secondary__word">${word}</span>`).join(" ");

        // Get all word elements
        const wordElements = introTextSecondaryLarge.querySelectorAll(".intro-text-secondary__word");

        // Set initial state: words start at 20% opacity (faded state) - matching intro-text__body
        gsap.set(wordElements, {
          opacity: 0.2, // 20% opacity - faded gray state
        });

        // Create scroll-triggered timeline that animates words sequentially word-by-word
        // Each word transitions from 20% to 100% opacity based on scroll progress
        // Animation completes when section reaches center/just below center of screen
        const wordTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%", // Start animation earlier
            end: "center center", // Complete when section is at center of viewport
            scrub: true, // Smooth scroll-linked animation
            // Markers can be enabled for debugging
            // markers: true,
          },
        });

        // Add each word to the timeline sequentially with a small stagger
        // This ensures words animate one after another, not line-by-line
        wordElements.forEach((word, index) => {
          wordTimeline.to(
            word,
            {
              opacity: 1, // 100% opacity - full visibility
              duration: 0.2, // Quick transition per word
              ease: "power1.out",
            },
            index * 0.05 // Small stagger (0.05s per word) to ensure sequential animation
          );
        });

        // Fade in the small text paragraph when the word-by-word animation completes
        const introTextSecondarySmall = section.querySelector(".intro-text-secondary__small");
        if (introTextSecondarySmall) {
          // Set initial state: small text starts invisible
          gsap.set(introTextSecondarySmall, {
            opacity: 0,
          });

          // Fade in when the word-by-word animation reaches the end
          // Add to the same timeline so it triggers after all words have animated
          const totalWords = wordElements.length;
          const animationEndTime = totalWords * 0.05; // Time when last word finishes

          wordTimeline.to(
            introTextSecondarySmall,
            {
              opacity: 1, // Fade to full opacity
              duration: 0.4, // 0.4 second fade-in
              ease: "power1.out",
            },
            animationEndTime // Start fade-in when word animation completes
          );
        }
      }
    });
  }

  // Attraction image scroll-based mask reveal animation
  // Images are revealed with a mask moving from left to right
  const attractionVisuals = document.querySelectorAll(".attraction__visual");

  if (attractionVisuals.length > 0 && typeof ScrollTrigger !== "undefined") {
    // Check if we're on hotel page and need to skip animations for peach section and below
    const peachSection = document.querySelector(".attraction--peach");
    let sectionsToSkip = new Set();

    if (peachSection) {
      // Find the parent attractions-section
      const attractionsSection = peachSection.closest(".attractions-section");
      if (attractionsSection) {
        // Get all attraction sections in this container
        const allAttractions = Array.from(attractionsSection.querySelectorAll(".attraction"));
        // Find the index of the peach section
        const peachIndex = allAttractions.indexOf(peachSection);
        // Add peach section and all subsequent sections to skip set
        if (peachIndex !== -1) {
          allAttractions.slice(peachIndex).forEach((section) => {
            sectionsToSkip.add(section);
          });
        }
      }
    }

    attractionVisuals.forEach((visual) => {
      // Get the parent attraction section for ScrollTrigger
      const attractionSection = visual.closest(".attraction");
      const attractionImage = visual.querySelector(".attraction__image");

      if (attractionSection) {
        // Skip animation if this section should be excluded
        if (sectionsToSkip.has(attractionSection)) {
          // Set visual to be fully visible (no mask) and image to normal scale
          gsap.set(visual, {
            clipPath: "inset(0 0% 0 0)", // Fully revealed - no mask
          });
          if (attractionImage) {
            gsap.set(attractionImage, {
              scale: 1,
              x: 0,
              transformOrigin: "center center",
            });
          }
          return; // Skip animation for this section
        }

        // Set initial state: fully masked (clip-path inset right at 100%)
        gsap.set(visual, {
          clipPath: "inset(0 100% 0 0)", // Fully masked - 100% from right
        });

        // Set initial state for image: normal scale and position
        if (attractionImage) {
          gsap.set(attractionImage, {
            scale: 1,
            x: 0,
            transformOrigin: "center center",
          });
        }

        // Create scroll-triggered animation for mask reveal
        // Mask reveals from left to right
        // Starts earlier in the scroll timeline so it's further along when visible
        gsap.to(visual, {
          clipPath: "inset(0 0% 0 0)", // Fully revealed - 0% from right
          ease: "none", // Linear easing - no easing
          scrollTrigger: {
            trigger: attractionSection,
            start: "top 100%", // Start when the top of the section enters the viewport from the bottom
            end: "top 40%", // End when the top of the section is 40% down from the top of the viewport
            scrub: 0.15, // Slower, smoother scroll-linked animation (animates in/out based on scroll position)
            // markers: true, // Uncomment for debugging
          },
        });

        // Create scroll-triggered animation for image zoom
        // Images zoom to 110% as user scrolls
        if (attractionImage) {
          gsap.to(attractionImage, {
            scale: 1.1, // Zoom to 110%
            ease: "none", // Linear easing for smooth scroll-linked movement
            scrollTrigger: {
              trigger: attractionSection,
              start: "top bottom", // Start when section enters viewport
              end: "bottom top", // End when section leaves viewport
              scrub: 0.15, // Smooth scroll-linked animation (matches mask reveal timing)
              // markers: true, // Uncomment for debugging
            },
          });
        }
      }
    });

    // Refresh ScrollTrigger to handle sections already in view
    ScrollTrigger.refresh();
  }

  // Attraction title word-by-word animation (matching hero title style)
  // Words fade in and slide in from the right (opacity + x translation)
  const attractionTitles = document.querySelectorAll(".attraction__title");

  if (attractionTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    attractionTitles.forEach((title) => {
      // Split title text into words and wrap each in a span
      const text = title.textContent.trim();
      const words = text.split(/\s+/);

      // Clear and rebuild with wrapped words
      title.innerHTML = words.map((word) => `<span class="attraction__title-word">${word}</span>`).join(" ");

      // Get all word elements
      const wordElements = title.querySelectorAll(".attraction__title-word");

      // Set initial state: words are invisible and positioned to the left
      // This makes them come in from left to right when scrolling down
      // When scrolling back up, they'll go out from right to left (reverse direction)
      gsap.set(wordElements, {
        opacity: 0,
        x: -50, // Start from left (negative = left side)
      });

      // Get the parent attraction section for ScrollTrigger
      const attractionSection = title.closest(".attraction");
      const attractionDescription = attractionSection?.querySelector(".attraction__description");

      if (attractionSection) {
        // Detect if we're on mobile (matches CSS breakpoint)
        const isMobile = window.innerWidth <= 768;

        // On mobile, titles are below images, so trigger animation later
        // On desktop, start later so transition is visible when scrolling down
        const startPoint = isMobile ? "top 30%" : "top 60%"; // Later trigger so transition is visible
        const endPoint = isMobile ? "top 10%" : "top 30%"; // Complete when section is more centered

        // Create a scrubbed timeline for title animation that reverses on scroll
        const titleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: attractionSection,
            start: startPoint, // Start when section enters viewport (later on mobile)
            end: endPoint, // End when section reaches middle/upper viewport
            scrub: 0.15, // Smooth scroll-linked animation that reverses
            // markers: true, // Uncomment for debugging
          },
        });

        // Add title word-by-word animation to timeline
        // Coming in (scroll down): words slide from left to right (x: -50 to x: 0)
        // Final position: x: 0 for proper left alignment with paragraph
        // Going out (scroll up): when reversed, words slide from right to left (x: 0 to x: -50)
        // The reverse naturally creates the "right to left" exit effect (words move leftward)
        wordElements.forEach((word, index) => {
          titleTimeline.to(
            word,
            {
              opacity: 1,
              x: 0, // End at aligned position (x: 0) - matches paragraph left alignment
              duration: 0.2, // Duration per word
              ease: "power2.out",
            },
            index * 0.08 // Stagger delay between words
          );
        });

        // Fade in description text after title animation completes
        if (attractionDescription) {
          // Set initial state: description starts invisible
          gsap.set(attractionDescription, {
            opacity: 0,
          });

          // Calculate when description should fade in (after all words have animated)
          const wordCount = wordElements.length;
          const descriptionStartTime = wordCount * 0.08 + 0.2; // After all words + their duration

          // Add description fade-in to timeline after title completes
          titleTimeline.to(
            attractionDescription,
            {
              opacity: 1,
              duration: 0.3, // Fade-in duration
              ease: "power2.out",
            },
            descriptionStartTime // Start fade-in after title animation completes
          );
        }
      }
    });
  }

  // Sticky Left Section title word-by-word animation (matching attraction title style)
  // Words fade in and slide in from the right (opacity + x translation)
  const stickyLeftTitles = document.querySelectorAll(".sticky-left-section__title");

  if (stickyLeftTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    stickyLeftTitles.forEach((title) => {
      // Split title text into words and wrap each in a span
      const text = title.textContent.trim();
      const words = text.split(/\s+/);

      // Clear and rebuild with wrapped words
      title.innerHTML = words.map((word) => `<span class="sticky-left-section__title-word">${word}</span>`).join(" ");

      // Get all word elements
      const wordElements = title.querySelectorAll(".sticky-left-section__title-word");

      // Set initial state: words are invisible and positioned to the right
      gsap.set(wordElements, {
        opacity: 0,
        x: 50,
      });

      // Get the parent sticky-left section for ScrollTrigger
      const stickyLeftSection = title.closest(".sticky-left-section");

      if (stickyLeftSection) {
        // Create scroll-triggered animation
        // Words fade in and slide in from the right sequentially
        gsap.to(wordElements, {
          opacity: 1,
          x: 0,
          duration: 0.8,
          stagger: 0.1, // 0.1 second delay between each word
          ease: "power2.out",
          scrollTrigger: {
            trigger: stickyLeftSection,
            start: "top 75%", // Start when top of section enters 75% of viewport
            end: "top 50%", // End when top reaches middle of viewport
            scrub: false, // Not scrubbed - plays once when triggered
            once: true, // Only play once
            // markers: true, // Uncomment for debugging
          },
        });
      }
    });
  }

  // Sticky Left Section scroll animation
  // Text stays fixed at top while images scroll, then both align to bottom when images finish
  // Desktop only - mobile shows simple stack of images
  const stickyLeftSections = document.querySelectorAll(".sticky-left-section");

  if (stickyLeftSections.length > 0 && typeof ScrollTrigger !== "undefined") {
    // Function to check if we're on mobile (matches CSS media query breakpoint)
    const isMobile = () => window.innerWidth <= 768;

    stickyLeftSections.forEach((section) => {
      const container = section.querySelector(".sticky-left-section__container");
      const visuals = section.querySelector(".sticky-left-section__visuals");
      const content = section.querySelector(".sticky-left-section__content");

      if (container && visuals && content) {
        // Skip sticky behavior on mobile
        if (isMobile()) {
          // Kill any existing ScrollTriggers for this section
          ScrollTrigger.getAll().forEach((trigger) => {
            if (trigger.trigger === section || trigger.vars?.trigger === section) {
              trigger.kill();
            }
          });

          // Ensure content is not sticky on mobile and reset any transforms
          gsap.set(content, {
            position: "static",
            top: "auto",
          });
          gsap.set(visuals, {
            y: 0,
          });
          gsap.set(container, {
            minHeight: "auto",
          });
          return;
        }

        // Wait for layout to calculate proper dimensions
        const initStickyScroll = () => {
          // Calculate heights
          const visualsHeight = visuals.offsetHeight;
          const contentHeight = content.offsetHeight;
          const contentPaddingTop = parseInt(getComputedStyle(content).paddingTop) || 0;
          const contentPaddingBottom = parseInt(getComputedStyle(content).paddingBottom) || 0;

          // Calculate the difference between visuals and content heights
          // This is how much we need to scroll to align bottoms
          const heightDifference = visualsHeight - contentHeight;

          // Pin duration: scroll distance needed to move visuals through while content stays sticky
          // This ensures images finish scrolling when content bottom aligns with visuals bottom
          const pinDuration = Math.max(0, heightDifference);

          // Set container height to exactly match visuals height (no extra space)
          // Container should be exactly the height of the visuals to prevent gaps
          container.style.minHeight = `${visualsHeight}px`;
          container.style.height = `${visualsHeight}px`;

          // Pin the section when it reaches the top
          ScrollTrigger.create({
            trigger: section,
            start: "top top",
            end: `+=${pinDuration}`,
            pin: true,
            pinSpacing: false, // Don't add extra spacing between sections
            anticipatePin: 1,
            invalidateOnRefresh: true, // Recalculate on refresh to prevent shifts
            // markers: true, // Uncomment for debugging
          });

          // Content sticky positioning is now handled in CSS for better performance
          // No need to set it via GSAP

          // Animate visuals to scroll up during the pin duration
          // This moves the visuals up by the height difference, aligning bottoms when unpinned
          if (pinDuration > 0) {
            // Use GPU acceleration and smooth scrubbing for better performance
            gsap.set(visuals, {
              willChange: "transform",
              force3D: true, // Force GPU acceleration
            });

            gsap.to(visuals, {
              y: -pinDuration,
              ease: "none",
              force3D: true, // Force GPU acceleration for smoother animation
              scrollTrigger: {
                trigger: section,
                start: "top top",
                end: `+=${pinDuration}`,
                scrub: true, // No smoothing - instant scroll-linked animation
                invalidateOnRefresh: true,
              },
            });
          }
        };

        // Initialize after layout is ready (only on desktop)
        if (!isMobile()) {
          if (visuals.offsetHeight > 0) {
            initStickyScroll();
          } else {
            window.addEventListener("load", initStickyScroll);
            setTimeout(initStickyScroll, 100);
          }
        }
      }
    });

    // Handle window resize - kill sticky behavior if switching to mobile
    let resizeTimer;
    window.addEventListener("resize", () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (isMobile()) {
          stickyLeftSections.forEach((section) => {
            const container = section.querySelector(".sticky-left-section__container");
            const visuals = section.querySelector(".sticky-left-section__visuals");
            const content = section.querySelector(".sticky-left-section__content");

            if (container && visuals && content) {
              // Kill any ScrollTriggers
              ScrollTrigger.getAll().forEach((trigger) => {
                if (trigger.trigger === section || trigger.vars?.trigger === section) {
                  trigger.kill();
                }
              });

              // Reset all transforms and positioning
              gsap.set(content, {
                position: "static",
                top: "auto",
                willChange: "auto",
              });
              gsap.set(visuals, {
                y: 0,
                willChange: "auto",
                force3D: false,
              });
              gsap.set(container, {
                minHeight: "auto",
              });
            }
          });
        }
      }, 250);
    });
  }
});
