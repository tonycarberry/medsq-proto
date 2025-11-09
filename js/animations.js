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
  // Image starts aligned to bottom (showing people), then moves up to reveal sky as user scrolls
  // Image bottom must always align with container bottom at 100% animation (when section bottom reaches viewport top)
  const tickerImage = document.querySelector(".ticker__image");
  const tickerSection = document.querySelector(".ticker-component");

  if (tickerImage && tickerSection && typeof ScrollTrigger !== "undefined") {
    // Wait for layout to calculate proper movement distance
    const initParallax = () => {
      const sectionHeight = tickerSection.offsetHeight;
      const imageHeight = tickerImage.offsetHeight;

      // Calculate the extra height available for parallax movement
      // Image is taller than container, so we can move it up to reveal more sky
      const extraHeight = imageHeight - sectionHeight;

      // Ensure we never reveal background: limit movement to ensure image always covers container
      // The maximum safe upward movement is when the top of the image reaches the top of the container
      // This means we can move up by at most (imageHeight - sectionHeight)
      // But we need to ensure the image bottom stays aligned with container bottom at 100%

      // Start position: Image aligned to bottom (y: 0), showing people at bottom, less sky
      // Since image is anchored to bottom, y: 0 means bottom of image aligns with bottom of container
      const startY = 0; // Start with image at bottom - showing people, less sky

      // End position: Image moved up to show more sky, but bottom must align with container bottom
      // At 100% animation (when section bottom reaches viewport top), image bottom = container bottom
      // Maximum safe movement: move up by extraHeight, but ensure image top never goes above container top
      // Negative Y moves image up (reveals sky at top)
      // We use the full extraHeight to maximize parallax effect while ensuring coverage
      const endY = -extraHeight; // End with image shifted up - bottom still aligns with container bottom

      // Verify the image will always cover: when moved up by extraHeight,
      // the image top will be at (imageHeight - extraHeight) = sectionHeight from bottom
      // This means top of image aligns with top of container, ensuring full coverage

      // Set initial position to start frame (image at bottom, showing people)
      // Image is anchored to bottom, so y: 0 aligns bottom of image with bottom of container
      gsap.set(tickerImage, {
        y: startY, // Start position - image at bottom, showing people
      });

      // Create parallax effect: as user scrolls, image moves up to reveal more sky
      // Start: section enters viewport (top of section at bottom of viewport)
      // End: bottom of section reaches top of viewport (100% - image bottom aligns with container bottom)
      // As section scrolls up, image moves up within frame (from showing people to showing sky)
      // At 100%, image bottom is still aligned with container bottom (y = -extraHeight)
      gsap.to(tickerImage, {
        y: endY, // End position - image moved up, bottom aligned with container bottom
        ease: "none",
        scrollTrigger: {
          trigger: tickerSection,
          start: "top bottom", // Start when top of section enters bottom of viewport
          end: "bottom top", // End when bottom of section reaches top of viewport (100% - image bottom at container bottom)
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

  // Intro text secondary large ScrambleText animation with yellow color
  // Text scrambles/reveals character by character and turns yellow during animation
  // Works on both homepage and attractions page
  const introTextSecondarySections = document.querySelectorAll(".intro-text-secondary-component");

  if (introTextSecondarySections.length > 0 && typeof ScrollTrigger !== "undefined") {
    // Characters used for scrambling
    const scrambleChars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()";

    introTextSecondarySections.forEach((section) => {
      const introTextSecondaryLarge = section.querySelector(".intro-text-secondary__large");

      if (introTextSecondaryLarge) {
        const originalText = introTextSecondaryLarge.textContent.trim();
        const chars = originalText.split("");

        // Store original text
        introTextSecondaryLarge.dataset.originalText = originalText;

        // Split text into characters and wrap each in a span
        introTextSecondaryLarge.innerHTML = chars
          .map((char, index) => {
            if (char === " ") {
              return `<span class="intro-text-secondary__char" data-index="${index}">&nbsp;</span>`;
            }
            return `<span class="intro-text-secondary__char" data-index="${index}" data-char="${char}">${char}</span>`;
          })
          .join("");

        // Get all character elements
        const charElements = introTextSecondaryLarge.querySelectorAll(".intro-text-secondary__char[data-char]");

        // Set initial state: all characters show random scramble characters in yellow
        charElements.forEach((charEl) => {
          const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
          charEl.textContent = randomChar;
          gsap.set(charEl, {
            color: "#f2fa7d", // Yellow color
            opacity: 1,
          });
        });

        // Create scroll-triggered timeline for scramble reveal
        const scrambleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 75%",
            end: "center center",
            scrub: true,
          },
        });

        // Reveal each character sequentially with scramble effect
        charElements.forEach((charEl, index) => {
          const originalChar = charEl.dataset.char;

          // Create a dummy object to track progress (GSAP can animate object properties)
          const progressObj = { value: 0 };

          // Create a scramble animation that reveals the correct character
          scrambleTimeline.to(
            progressObj,
            {
              value: 1,
              duration: 0.2,
              ease: "none",
              onUpdate: function () {
                // During scramble, show random characters
                const progress = progressObj.value;
                if (progress < 0.9) {
                  // Show random scramble characters
                  const randomChar = scrambleChars[Math.floor(Math.random() * scrambleChars.length)];
                  charEl.textContent = randomChar;
                } else {
                  // Reveal the correct character
                  charEl.textContent = originalChar;
                }
              },
            },
            index * 0.02 // Stagger characters
          );

          // Change color from yellow to normal during reveal
          scrambleTimeline.to(
            charEl,
            {
              color: "var(--theme-text)", // Normal text color
              duration: 0.15,
              ease: "power1.out",
            },
            index * 0.02 + 0.15 // Slightly delayed color change
          );
        });

        // Fade in the small text paragraph when scramble animation completes
        const introTextSecondarySmall = section.querySelector(".intro-text-secondary__small");
        if (introTextSecondarySmall) {
          gsap.set(introTextSecondarySmall, {
            opacity: 0,
          });

          const totalChars = charElements.length;
          const animationEndTime = totalChars * 0.02 + 0.3;

          scrambleTimeline.to(
            introTextSecondarySmall,
            {
              opacity: 1,
              duration: 0.4,
              ease: "power1.out",
            },
            animationEndTime
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

  // Food & Drink Attraction image scroll-based mask reveal animation
  // Images are revealed one-by-one with a mask moving from left to right over yellow background
  const foodAttractionVisuals = document.querySelectorAll(".food-attraction__visual");

  if (foodAttractionVisuals.length > 0 && typeof ScrollTrigger !== "undefined") {
    const isMobileViewport = window.innerWidth <= 768;

    foodAttractionVisuals.forEach((visual) => {
      const attractionSection = visual.closest(".food-attraction");
      const imageContainers = Array.from(visual.querySelectorAll(".food-attraction__image-container"));

      if (!attractionSection || imageContainers.length === 0) {
        return;
      }

      if (isMobileViewport) {
        imageContainers.forEach((container) => {
          const image = container.querySelector(".food-attraction__image");
          if (image) {
            gsap.set(image, {
              clipPath: "inset(0 0% 0 0)",
              scale: 1,
              x: 0,
              yPercent: 0,
              transformOrigin: "center center",
            });
          }
        });

        return;
      }

      imageContainers.forEach((container) => {
        const image = container.querySelector(".food-attraction__image");
        if (image) {
          gsap.set(image, {
            clipPath: "inset(0 100% 0 0)",
            scale: 1,
            x: 0,
            transformOrigin: "center center",
          });
        }
      });

      const isMobile = window.innerWidth <= 768;

      imageContainers.forEach((container, index) => {
        const staggerStep = 12;
        const baseStart = isMobile ? 95 : 85;
        const baseEnd = isMobile ? 70 : 55;
        const startValue = Math.max(baseStart - index * staggerStep, 25);
        const endValue = Math.max(baseEnd - index * staggerStep, 5);
        const startPoint = `top ${startValue}%`;
        const endPoint = `top ${endValue}%`;

        const image = container.querySelector(".food-attraction__image");
        if (!image) {
          return;
        }

        gsap.to(image, {
          clipPath: "inset(0 0% 0 0)",
          ease: "none",
          scrollTrigger: {
            trigger: attractionSection,
            start: startPoint,
            end: endPoint,
            scrub: 0.1,
          },
        });

        gsap.to(image, {
          scale: 1.1,
          ease: "none",
          scrollTrigger: {
            trigger: attractionSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.15,
          },
        });

        // All images move up (negative values) at varying speeds for parallax effect
        // Higher index = more movement (faster parallax)
        const parallaxAmount = -(30 + index * 12);
        gsap.to(image, {
          yPercent: parallaxAmount,
          ease: "none",
          force3D: true,
          scrollTrigger: {
            trigger: attractionSection,
            start: "top bottom",
            end: "bottom top",
            scrub: 0.25,
          },
        });
      });
    });

    ScrollTrigger.refresh();
  }

  // Food & Drink Attraction title and description animations (match homepage style)
  const foodAttractionTitles = document.querySelectorAll(".food-attraction__title");

  if (foodAttractionTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    foodAttractionTitles.forEach((title) => {
      const text = title.textContent.trim();
      const words = text.split(/\s+/);

      title.innerHTML = words.map((word) => `<span class="food-attraction__title-word">${word}</span>`).join(" ");

      const wordElements = title.querySelectorAll(".food-attraction__title-word");

      gsap.set(wordElements, {
        opacity: 0,
        x: -50,
      });

      const attractionSection = title.closest(".food-attraction");
      const description = attractionSection?.querySelector(".food-attraction__description");

      if (description) {
        gsap.set(description, { opacity: 0 });
      }

      if (attractionSection) {
        const isMobile = window.innerWidth <= 768;
        const startPoint = isMobile ? "top 80%" : "top 65%";
        const endPoint = isMobile ? "top 40%" : "top 35%";

        const titleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: attractionSection,
            start: startPoint,
            end: endPoint,
            scrub: 0.15,
          },
        });

        wordElements.forEach((word, index) => {
          titleTimeline.to(
            word,
            {
              opacity: 1,
              x: 0,
              duration: 0.2,
              ease: "power2.out",
            },
            index * 0.08
          );
        });

        if (description) {
          const wordCount = wordElements.length;
          const descriptionStart = wordCount * 0.08 + 0.2;

          titleTimeline.to(
            description,
            {
              opacity: 1,
              duration: 0.4,
              ease: "power2.out",
            },
            descriptionStart
          );
        }

        // Animate images after text on mobile
        if (isMobile) {
          const images = attractionSection.querySelectorAll(".food-attraction__image-container");
          if (images.length > 0) {
            const wordCount = wordElements.length;
            const descriptionStart = wordCount * 0.08 + 0.2;
            const imagesStart = descriptionStart + 0.4; // Start after description animation

            // Set initial state: images are invisible
            gsap.set(images, {
              opacity: 0,
              y: 30,
            });

            // Animate images in sequence after text
            images.forEach((image, index) => {
              titleTimeline.to(
                image,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.5,
                  ease: "power2.out",
                },
                imagesStart + index * 0.1 // Stagger images
              );
            });
          }
        }

        // Add parallax effect to text content - moves slower than images
        // Images move at -30% to -54%, text moves at -12% (slower)
        if (!isMobile) {
          const content = attractionSection.querySelector(".food-attraction__content");
          if (content) {
            gsap.to(content, {
              yPercent: -12, // Move up slower than images
              ease: "none",
              force3D: true,
              scrollTrigger: {
                trigger: attractionSection,
                start: "top bottom",
                end: "bottom top",
                scrub: 0.25,
              },
            });
          }
        }
      }
    });
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

  // Sticky Left Section height sync (Attractions page only)
  if (document.body.classList.contains("page-attractions")) {
    const stickySections = Array.from(document.querySelectorAll(".sticky-left-section"));

    if (stickySections.length > 0) {
      const updateStickyLeftHeights = () => {
        const isDesktop = window.innerWidth > 768;
        let didUpdate = false;

        stickySections.forEach((sectionEl) => {
          const container = sectionEl.querySelector(".sticky-left-section__container");
          const visuals = sectionEl.querySelector(".sticky-left-section__visuals");

          if (!container || !visuals) {
            return;
          }

          if (!isDesktop) {
            const resetProps = [
              [container, "minHeight"],
              [container, "height"],
              [sectionEl, "minHeight"],
              [sectionEl, "height"],
            ];

            resetProps.forEach(([element, prop]) => {
              if (element.style[prop] !== "") {
                element.style[prop] = "";
                didUpdate = true;
              }
            });
            return;
          }

          const visualsHeight = visuals.getBoundingClientRect().height;
          if (visualsHeight <= 0) {
            return;
          }

          const heightValue = `${visualsHeight}px`;

          const assignments = [
            [container, "minHeight", heightValue],
            [container, "height", heightValue],
            [sectionEl, "minHeight", heightValue],
            [sectionEl, "height", heightValue],
          ];

          assignments.forEach(([element, prop, value]) => {
            if (element.style[prop] !== value) {
              element.style[prop] = value;
              didUpdate = true;
            }
          });
        });

        if (didUpdate && typeof ScrollTrigger !== "undefined") {
          ScrollTrigger.refresh();
        }
      };

      const scheduleHeightUpdate = () => {
        updateStickyLeftHeights();
        setTimeout(updateStickyLeftHeights, 120);
      };

      scheduleHeightUpdate();
      window.addEventListener("load", scheduleHeightUpdate, { once: true });

      let resizeTimeout;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimeout);
        resizeTimeout = setTimeout(updateStickyLeftHeights, 150);
      });

      if ("ResizeObserver" in window) {
        const observers = [];
        stickySections.forEach((sectionEl) => {
          const visuals = sectionEl.querySelector(".sticky-left-section__visuals");
          if (!visuals) {
            return;
          }
          const observer = new ResizeObserver(updateStickyLeftHeights);
          observer.observe(visuals);
          observers.push(observer);
        });

        window.addEventListener(
          "beforeunload",
          () => {
            observers.forEach((observer) => observer.disconnect());
          },
          { once: true }
        );
      }
    }
  }

  // Sticky Left Section - No parallax scrolling, just static layout
  // All animations removed - component is now static
});
