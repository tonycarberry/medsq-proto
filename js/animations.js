const NBSP = "\u00A0";

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

  // Ticker frame scroll animation:
  // - Frame enters as a square (width = height)
  // - Scroll expands width until it's full width
  // - Optional subtle video zoom on scroll
  const tickerSection = document.querySelector(".ticker-component");
  const tickerFrame = document.querySelector(".ticker__frame");
  const tickerVideo = document.querySelector(".ticker__video");

  if (tickerSection && tickerFrame && typeof ScrollTrigger !== "undefined") {
    // Guard against double-init (index loads animations.js + animations-experiments.js)
    if (!tickerFrame.dataset.scrollWidthInit) {
      tickerFrame.dataset.scrollWidthInit = "true";

      const getAvailableWidth = () => tickerFrame.parentElement?.clientWidth || tickerSection.clientWidth || window.innerWidth;
      const getFrameHeight = () => tickerFrame.getBoundingClientRect().height || 563;

      const frameTimeline = gsap.timeline({
        scrollTrigger: {
          trigger: tickerSection,
          start: "top bottom", // when ticker enters viewport
          // Finish earlier: be full width when the ticker is ~60% up the viewport
          // (i.e. section top reaches 40% from the top of the viewport)
          end: "top 40%",
          scrub: true,
          invalidateOnRefresh: true,
        },
      });

      frameTimeline.fromTo(
        tickerFrame,
        {
          width: () => `${Math.min(getFrameHeight(), getAvailableWidth())}px`,
        },
        {
          width: () => `${getAvailableWidth()}px`,
          ease: "none",
        }
      );

      // Video should stay fixed - no animation, no movement, no scaling
      if (tickerVideo) {
        gsap.set(tickerVideo, { 
          scale: 1, 
          transformOrigin: "center center",
          x: 0,
          y: 0,
        });
        // No animation on video - it stays fixed
      }
    }
  }

  // Ticker text horizontal scrolling animation
  const tickerTextWrapper = document.querySelector(".ticker__text-wrapper");
  const tickerText = document.querySelector(".ticker__text");
  const tickerContent = document.querySelector(".ticker__content");

  if (tickerTextWrapper && tickerText && tickerContent) {
    // Guard against double-init (index loads animations.js + animations-experiments.js)
    if (tickerContent.dataset.tickerTextInit) return;
    tickerContent.dataset.tickerTextInit = "true";

    // Wait for layout to be ready before calculating dimensions
    const initTickerAnimation = () => {
      // Intro mask reveal from center outward, triggered on enter (not on load)
      if (typeof ScrollTrigger !== "undefined") {
        gsap.set(tickerContent, { clipPath: "inset(0 50% 0 50%)" });
        gsap.to(tickerContent, {
          clipPath: "inset(0 0% 0 0%)",
          duration: 1.2,
          ease: "power2.out",
          scrollTrigger: {
            trigger: tickerSection || tickerContent,
            start: "top 85%",
            end: "top 60%",
            once: true,
          },
        });
      }

      // Calculate the width of one text element
      const textWidth = tickerText.offsetWidth;
      const contentWidth = window.innerWidth || document.documentElement.clientWidth;

      // Ensure we have enough text copies to cover viewport + buffer
      // Calculate how many copies we need (viewport width + 2x text width for safety)
      const neededCopies = Math.ceil((contentWidth + textWidth * 2) / textWidth);
      const currentCopies = tickerTextWrapper.querySelectorAll(".ticker__text").length;

      // Add more copies if needed to ensure seamless coverage
      if (currentCopies < neededCopies) {
        for (let i = currentCopies; i < neededCopies; i++) {
          const newText = tickerText.cloneNode(true);
          newText.classList.add("ticker__text--duplicate");
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
  // Works on all pages
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

        // Animate description text with same slide-in effect as title, after title completes
        if (attractionDescription) {
          // Split description text into words and wrap each in a span
          const descriptionParagraphs = attractionDescription.querySelectorAll("p");

          descriptionParagraphs.forEach((paragraph) => {
            const text = paragraph.textContent.trim();
            const words = text.split(/\s+/);

            // Clear and rebuild with wrapped words
            paragraph.innerHTML = words.map((word) => `<span class="attraction__description-word">${word}</span>`).join(" ");
          });

          // Get all word elements from all paragraphs
          const descriptionWordElements = attractionDescription.querySelectorAll(".attraction__description-word");

          // Set initial state: words are invisible and positioned to the left (same as titles)
          gsap.set(descriptionWordElements, {
            opacity: 0,
            x: -50, // Start from left (negative = left side)
          });

          // Calculate when description should start animating (after all title words have animated)
          const wordCount = wordElements.length;
          const descriptionStartTime = wordCount * 0.08 + 0.2; // After all words + their duration

          // Add description word-by-word animation to timeline after title completes
          // Same animation style as title: slide from left to right
          descriptionWordElements.forEach((word, index) => {
            titleTimeline.to(
              word,
              {
                opacity: 1,
                x: 0, // End at aligned position (x: 0)
                duration: 0.2, // Duration per word (same as title)
                ease: "power2.out",
              },
              descriptionStartTime + index * 0.08 // Stagger delay between words (same as title)
            );
          });
        }
      }
    });
  }

  // Attraction description animation for sections without titles (e.g., Co-op Live)
  // Apply same slide-in animation as titles
  const attractionsWithoutTitles = document.querySelectorAll(".attraction");

  if (attractionsWithoutTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    attractionsWithoutTitles.forEach((attractionSection) => {
      const title = attractionSection.querySelector(".attraction__title");
      const description = attractionSection.querySelector(".attraction__description");

      // Only animate if there's a description but no title
      if (description && !title) {
        // Split description text into words and wrap each in a span
        const descriptionParagraphs = description.querySelectorAll("p");

        descriptionParagraphs.forEach((paragraph) => {
          const text = paragraph.textContent.trim();
          const words = text.split(/\s+/);

          // Clear and rebuild with wrapped words
          paragraph.innerHTML = words.map((word) => `<span class="attraction__description-word">${word}</span>`).join(" ");
        });

        // Get all word elements from all paragraphs
        const descriptionWordElements = description.querySelectorAll(".attraction__description-word");

        // Set initial state: words are invisible and positioned to the left (same as titles)
        gsap.set(descriptionWordElements, {
          opacity: 0,
          x: -50, // Start from left (negative = left side)
        });

        // Detect if we're on mobile (matches CSS breakpoint)
        const isMobile = window.innerWidth <= 768;
        const startPoint = isMobile ? "top 30%" : "top 60%";
        const endPoint = isMobile ? "top 10%" : "top 30%";

        // Create a scrubbed timeline for description animation
        const descriptionTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: attractionSection,
            start: startPoint,
            end: endPoint,
            scrub: 0.15, // Smooth scroll-linked animation that reverses
          },
        });

        // Add description word-by-word animation to timeline
        // Same animation style as title: slide from left to right
        descriptionWordElements.forEach((word, index) => {
          descriptionTimeline.to(
            word,
            {
              opacity: 1,
              x: 0, // End at aligned position (x: 0)
              duration: 0.2, // Duration per word (same as title)
              ease: "power2.out",
            },
            index * 0.08 // Stagger delay between words (same as title)
          );
        });
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

  // Teasers Section Animations - Copy from attractions section on home page
  // Image mask reveal animation (clip-path from left to right)
  const teaserImageContainers = document.querySelectorAll(".teasers-image-container");

  if (teaserImageContainers.length > 0 && typeof ScrollTrigger !== "undefined") {
    teaserImageContainers.forEach((container) => {
      const teaserImage = container.querySelector(".teasers-image") || container.querySelector(".teasers-video");
      const logoGrid = container.querySelector(".teasers-logo-grid");

      // Apply mask reveal to containers with images/videos OR logo grids
      if (teaserImage || logoGrid) {
        // Check if this is a reverse row (image on the left)
        const teaserRow = container.closest(".teasers-row");
        const isReverseRow = teaserRow && teaserRow.classList.contains("teasers-row--reverse");
        
        // Set initial state based on row direction
        if (isReverseRow) {
          // For reverse rows (image on left): mask from left, reveal right to left
          gsap.set(container, {
            clipPath: "inset(0 0 0 100%)", // Fully masked - 100% from left
          });
        } else {
          // For normal rows (image on right): mask from right, reveal left to right
          gsap.set(container, {
            clipPath: "inset(0 100% 0 0)", // Fully masked - 100% from right
          });
        }

        // Set initial state for image/video: normal scale and position (skip for logo grids)
        if (teaserImage) {
          gsap.set(teaserImage, {
            scale: 1,
            x: 0,
            transformOrigin: "center center",
          });
        }

        // Create scroll-triggered animation for mask reveal
        if (isReverseRow) {
          // Mask reveals from right to left (for images on the left)
          gsap.to(container, {
            clipPath: "inset(0 0 0 0%)", // Fully revealed - 0% from left
            ease: "none", // Linear easing - no easing
            scrollTrigger: {
              trigger: container, // Trigger on the individual image container
              start: "top bottom", // Start when the top of the image enters the bottom of the viewport
              end: "top 40%", // End when the top of the image is 40% down from the top of the viewport
              scrub: 0.15, // Slower, smoother scroll-linked animation
              // markers: true, // Uncomment for debugging
            },
          });
        } else {
          // Mask reveals from left to right (for images on the right)
          gsap.to(container, {
            clipPath: "inset(0 0% 0 0)", // Fully revealed - 0% from right
            ease: "none", // Linear easing - no easing
            scrollTrigger: {
              trigger: container, // Trigger on the individual image container
              start: "top bottom", // Start when the top of the image enters the bottom of the viewport
              end: "top 40%", // End when the top of the image is 40% down from the top of the viewport
              scrub: 0.15, // Slower, smoother scroll-linked animation
              // markers: true, // Uncomment for debugging
            },
          });
        }

        // Create scroll-triggered animation for image zoom (only for images/videos, not logo grids)
        if (teaserImage) {
          gsap.to(teaserImage, {
            scale: 1.1, // Zoom to 110%
            ease: "none", // Linear easing for smooth scroll-linked movement
            scrollTrigger: {
              trigger: container, // Trigger on the individual image container
              start: "top bottom", // Start when image enters viewport
              end: "bottom top", // End when image leaves viewport
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

  // Food & Drink logos animation - staggered scale and opacity
  const logoGrid = document.querySelector(".teasers-logo-grid");
  if (logoGrid && typeof ScrollTrigger !== "undefined" && typeof gsap !== "undefined") {
    const logoImages = logoGrid.querySelectorAll(".teasers-logo-image");
    const logoContainer = logoGrid.closest(".teasers-image-container");
    const logoGridContainer = logoGrid.querySelector(".teasers-logo-grid-container");
    
    if (logoImages.length > 0 && logoContainer) {
      // Set initial state instantly (for page load)
      const setInitialState = () => {
        logoImages.forEach((logo) => {
          gsap.set(logo, {
            opacity: 0,
            scale: 0.8,
            transformOrigin: "center center",
          });
          logo.classList.remove("teasers-logo-image--animated");
        });
        
        // Set initial state for container (centered, normal scale)
        if (logoGridContainer) {
          gsap.set(logoGridContainer, {
            scale: 1,
            transformOrigin: "center center",
          });
        }
      };
      
      // Animate logos out (reverse of animate in)
      // Store the last random order to reverse in the same order
      let lastRandomOrder = null;
      
      const resetLogos = () => {
        if (logoImages.length === 0) return;
        
        // Use the same random order as the last animate in (if available)
        // Otherwise create a new random order
        if (!lastRandomOrder) {
          const indices = Array.from({ length: logoImages.length }, (_, i) => i);
          for (let i = indices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [indices[i], indices[j]] = [indices[j], indices[i]];
          }
          lastRandomOrder = indices;
        }
        
        // Reverse animation: fade out and scale down in reverse of animate order
        logoImages.forEach((logo, originalIndex) => {
          const randomOrder = lastRandomOrder.indexOf(originalIndex);
          gsap.to(logo, {
            opacity: 0,
            scale: 0.8,
            duration: 0.15, // same duration as animate in
            ease: "power2.out", // same easing as animate in
            delay: randomOrder * 0.12, // same stagger as animate in (120ms)
            onComplete: () => {
              logo.classList.remove("teasers-logo-image--animated");
            },
          });
        });
        
        // Reset container scale
        if (logoGridContainer) {
          gsap.to(logoGridContainer, {
            scale: 1,
            duration: 0.3,
            ease: "power2.out",
          });
        }
        
        // Clear the stored order after reset
        lastRandomOrder = null;
      };
      
      // Set initial state for all logos (instant, for page load)
      setInitialState();
      
      // Animate logos when container enters viewport
      const animateLogos = () => {
        if (logoImages.length === 0) return;
        
        // Create random order for this animation cycle
        const indices = Array.from({ length: logoImages.length }, (_, i) => i);
        // Fisher-Yates shuffle
        for (let i = indices.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [indices[i], indices[j]] = [indices[j], indices[i]];
        }
        
        // Store this order for reverse animation
        lastRandomOrder = indices;
        
        // Fast staggered pop-in (match Figma feel) in random order
        // Each logo has its own overshoot animation (0.8 → 1.05 → 1.0)
        logoImages.forEach((logo, originalIndex) => {
          const randomOrder = indices.indexOf(originalIndex);
          
          // Create timeline for each logo with overshoot
          const logoTimeline = gsap.timeline({
            delay: randomOrder * 0.12, // slightly slower stagger (120ms between logos)
            onComplete: () => {
              logo.classList.add("teasers-logo-image--animated");
            },
          });
          
          // Animate: fade in + scale from 0.8 to 1.05 (overshoot)
          logoTimeline.to(logo, {
            opacity: 1,
            scale: 1.05, // Overshoot to 105%
            duration: 0.2,
            ease: "power2.out",
          })
          // Then settle back to 1.0
          .to(logo, {
            scale: 1, // Settle back to 100%
            duration: 0.15,
            ease: "power2.out",
          });
        });
      };
      
      // Keep logos visible while the container is visible.
      // Only reset once the container is fully off-screen.
      // Delay animation until container is well centered in viewport
      ScrollTrigger.create({
        trigger: logoContainer,
        start: "top 50%", // Wait until container top reaches middle of viewport
        end: "bottom top", // fully off-screen above
        onEnter: animateLogos,
        onEnterBack: animateLogos,
        onLeave: resetLogos,
        onLeaveBack: resetLogos,
      });
    }
  }

  // Teasers title scramble text animation (matching hero logo style)
  const teaserTitles = document.querySelectorAll(".teasers-title");
  const teaserCharSet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

  // Scramble text function (same as hero logo)
  const scrambleElement = (element, config = {}) => {
    const { duration = 3, scrambleRatio = 0.65, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", once = true, scrambleInterval = 50, target, onStart, onUpdate, onComplete, ease = (t) => t } = config;

    const originalText = element.dataset.scrambleWord || element.dataset.word || element.textContent.trim();
    if (!originalText) {
      return;
    }
    if (!element.dataset.scrambleWord || element.dataset.scrambleWord.length === 0) {
      element.dataset.scrambleWord = originalText;
    }

    const targetText = typeof target === "string" && target.length > 0 ? target : element.dataset.scrambleWord;
    if (!targetText) {
      return;
    }

    if (once && element.dataset.scrambleCompleted === "true") {
      return;
    }

    const totalDuration = duration * 1000;
    const scrambleDuration = Math.max(0, totalDuration * Math.min(Math.max(scrambleRatio, 0), 1));
    const revealDuration = Math.max(0, totalDuration - scrambleDuration);
    const letters = targetText.split("");
    const availableChars = chars.split("");
    const pickRandomChar = () => availableChars[Math.floor(Math.random() * availableChars.length)] || " ";
    const toDisplayChar = (char) => (char === " " ? NBSP : char);
    const revealCountForTime = (elapsed) => {
      if (revealDuration === 0) {
        return letters.length;
      }
      const revealElapsed = Math.max(0, elapsed - scrambleDuration);
      const linearProgress = Math.min(1, revealElapsed / revealDuration);
      const easedProgress = ease ? ease(linearProgress) : linearProgress;
      return Math.floor(easedProgress * letters.length);
    };

    const runId = `teaser-${Date.now()}-${Math.random()}`;
    element.dataset.scrambleId = runId;
    element.dataset.scrambleActive = "running";
    if (typeof onStart === "function") {
      onStart();
    }
    const startTime = performance.now();

    let lastScrambleUpdate = startTime;

    const update = (now) => {
      if (element.dataset.scrambleId !== runId) {
        return;
      }

      const elapsed = now - startTime;
      if (elapsed >= totalDuration) {
        element.textContent = toDisplayChar(targetText);
        element.dataset.scrambleActive = once ? "done" : "";
        if (once) {
          element.dataset.scrambleCompleted = "true";
        } else {
          element.dataset.scrambleCompleted = "";
        }
        if (typeof onComplete === "function") {
          onComplete();
        }
        return;
      }

      const revealCount = revealCountForTime(elapsed);
      let display = "";

      const allowScrambleUpdate = now - lastScrambleUpdate >= scrambleInterval;
      if (allowScrambleUpdate) {
        lastScrambleUpdate = now;
      }

      letters.forEach((char, index) => {
        if (char === " ") {
          display += NBSP;
        } else if (elapsed < scrambleDuration) {
          display += allowScrambleUpdate ? pickRandomChar() : element.textContent[index] || pickRandomChar();
        } else if (index < revealCount) {
          display += char;
        } else if (allowScrambleUpdate) {
          display += pickRandomChar();
        } else {
          display += element.textContent[index] || pickRandomChar();
        }
      });

      element.textContent = display;
      if (typeof onUpdate === "function") {
        onUpdate(display);
      }
      requestAnimationFrame(update);
    };

    requestAnimationFrame(update);
  };

  if (teaserTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    const rootStyles = getComputedStyle(document.documentElement);
    // MSQ color palette (same as hero logo)
    const msqColors = [
      "#75D8FF", // Blue
      "#64D187", // Green
      "#F2FA7D", // Yellow
      "#9D78FE", // Purple
      "#FEA5E5", // Pink
      "#FE8F00", // Orange
    ];
    const getRandomMSQColor = () => msqColors[Math.floor(Math.random() * msqColors.length)];
    const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)] || "A";
    const baseColor = (rootStyles.getPropertyValue("--theme-text-dark") || "#1f1d1e").trim() || "#1f1d1e";
    const toDisplayChar = (char) => (char === " " ? NBSP : char);

    teaserTitles.forEach((title) => {
      // Split title text into letters and wrap each in a span (like hero logo)
      const text = title.textContent.trim();
      const letters = text.split("");

      // Clear and rebuild with wrapped letters
      title.innerHTML = letters.map((letter) => `<span class="teasers-title-letter">${letter === " " ? "&nbsp;" : letter}</span>`).join("");

      // Get all letter elements
      const letterElements = Array.from(title.querySelectorAll(".teasers-title-letter"));

      // Initialize each letter with base color and store original text (no scrambling)
      letterElements.forEach((letter) => {
        const original = letter.textContent.trim() || letter.innerHTML.trim();
        if (original.length > 0 && original !== "&nbsp;") {
          letter.dataset.scrambleWord = original;
        } else if (original === "&nbsp;") {
          letter.dataset.scrambleWord = " ";
        }
        const isSpace = letter.dataset.scrambleWord === " ";
        letter.textContent = isSpace ? NBSP : letter.dataset.scrambleWord;
        letter.style.color = baseColor;
      });

      // Set initial state: letters are invisible
      gsap.set(letterElements, {
        opacity: 0,
      });

      // Get the parent teaser row for ScrollTrigger
      const teaserRow = title.closest(".teasers-row");

      if (teaserRow) {
        const teaserOpening = teaserRow.querySelector(".teasers-opening");
        const openingFadeDuration = 0.25;
        const openingBaseScale = 0.8;

        const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
        
        // Reset function to prepare for replay
        const resetScramble = () => {
          // Reset letters to original text and base color
          letterElements.forEach((letter) => {
            const isSpace = letter.dataset.scrambleWord === " ";
            letter.textContent = isSpace ? NBSP : letter.dataset.scrambleWord;
            letter.style.color = baseColor;
            letter.style.opacity = "0";
          });

          if (teaserOpening) {
            gsap.set(teaserOpening, {
              opacity: 0,
              scale: openingBaseScale,
              transformOrigin: "center center",
            });
          }
        };

        // Color-only pop (no character scrambling)
        const scrambleIntoPlace = () => {
          // Ensure badge is hidden until the title finishes animating
          if (teaserOpening) {
            gsap.set(teaserOpening, {
              opacity: 0,
              scale: openingBaseScale,
              transformOrigin: "center center",
            });
          }

          letterElements.forEach((letter, index) => {
            const targetColor = getRandomMSQColor();
            gsap.to(letter, {
              opacity: 1,
              duration: 0.1,
              delay: index * 0.045,
              ease: "none",
            });
            gsap.to(letter, {
              color: targetColor,
              duration: 0.6,
              delay: index * 0.045,
              ease: easeOutCubic,
              yoyo: true,
              repeat: 1,
              onComplete: () => {
                letter.style.color = baseColor;
              },
            });
          });

          // Fade the badge in AFTER the last letter has appeared
          if (teaserOpening) {
            const lastLetterEnd = (Math.max(letterElements.length - 1, 0) * 0.045) + 0.1;
            gsap.to(teaserOpening, {
              opacity: 1,
              scale: 1,
              duration: openingFadeDuration,
              delay: lastLetterEnd + 0.1,
              ease: "power2.out",
              overwrite: "auto",
            });
          }
        };

        // Detect if we're on mobile (matches CSS breakpoint)
        const isMobile = window.innerWidth <= 768;

        // Trigger only when the row is well inside the viewport; end when it actually leaves
        const startPoint = isMobile ? "top 85%" : "top 90%";
        const endPoint = "bottom top";

        // Create ScrollTrigger for scramble animation - replay every time it enters
        const st = ScrollTrigger.create({
          trigger: teaserRow,
          start: startPoint,
          end: endPoint,
          once: false, // Allow replay
          onEnter: scrambleIntoPlace,
          onEnterBack: scrambleIntoPlace,
          onLeave: resetScramble,
          onLeaveBack: resetScramble,
        });

        // IntersectionObserver fallback to ensure titles animate when entering viewport
        // Note: This is kept for compatibility but ScrollTrigger handles the replay logic
        if ("IntersectionObserver" in window) {
          const observer = new IntersectionObserver(
            (entries) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  // Only trigger if ScrollTrigger hasn't already handled it
                  if (!title.dataset.scrambleStarted) {
                    scrambleIntoPlace();
                  }
                } else {
                  // Reset when leaving viewport
                  resetScramble();
                }
              });
            },
            {
              root: null,
              threshold: 0.25,
            }
          );
          observer.observe(teaserRow);
        }
      }
    });
  }

  // Teasers video playback (all teaser videos)
  // Play when in view, pause when off-screen (saves CPU/battery).
  const teaserVideos = Array.from(document.querySelectorAll(".teasers-section .teasers-row video"));

  if (teaserVideos.length > 0 && typeof ScrollTrigger !== "undefined") {
    const safePlay = (videoEl) => {
      if (!videoEl || typeof videoEl.play !== "function") return;
      // If already playing, don't spam play()
      if (!videoEl.paused && !videoEl.ended) return;
      videoEl.play().catch((e) => {
        // Autoplay can still be blocked in some cases; keep it quiet in prod.
        // console.log("Video play prevented:", e);
      });
    };

    const safePause = (videoEl) => {
      if (!videoEl || typeof videoEl.pause !== "function") return;
      if (videoEl.paused) return;
      videoEl.pause();
    };

    teaserVideos.forEach((videoEl) => {
      const teaserRow = videoEl.closest(".teasers-row") || videoEl;

      ScrollTrigger.create({
        trigger: teaserRow,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: () => safePlay(videoEl),
        onEnterBack: () => safePlay(videoEl),
        onLeave: () => safePause(videoEl),
        onLeaveBack: () => safePause(videoEl),
        onRefresh: (self) => {
          if (self.isActive) safePlay(videoEl);
          else safePause(videoEl);
        },
      });
    });

    ScrollTrigger.refresh();
  } else if (teaserVideos.length > 0) {
    // No ScrollTrigger available: default to paused to avoid background playback.
    teaserVideos.forEach((videoEl) => {
      if (videoEl && typeof videoEl.pause === "function") {
        videoEl.pause();
      }
    });
  }

  // Altitude logo animation - rises up smoothly after 2 seconds of being on screen
  const altitudeLogoContainer = document.querySelector(".teasers-altitude-logo");
  if (altitudeLogoContainer) {
    const altitudeLogoImg = altitudeLogoContainer.querySelector("img");
    const altitudeVideoContainer = altitudeLogoContainer.closest(".teasers-image-container");
    
    if (altitudeLogoImg && altitudeVideoContainer) {
      // Set initial state: logo is small, invisible, and positioned at final location
      gsap.set(altitudeLogoImg, {
        opacity: 0,
        scale: 0.3,
        y: -200, // Final position - 200px above center
        transformOrigin: "bottom center",
      });

      let timeoutId = null;

      const resetAnimation = () => {
        // Clear any pending timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }
        // Reset to initial state
        gsap.set(altitudeLogoImg, {
          opacity: 0,
          scale: 0.3,
          y: -200, // Final position - 200px above center
          transformOrigin: "bottom center",
        });
      };

      const startAnimation = () => {
        // Clear any existing timeout
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        // Wait 1 second after entering viewport, then animate
        timeoutId = setTimeout(() => {
          gsap.to(altitudeLogoImg, {
            opacity: 1,
            scale: 1,
            y: -200, // Stay at final position - 200px above center
            duration: 3,
            ease: "power2.out",
          });
        }, 1000);
      };

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: altitudeVideoContainer,
          start: "top 80%",
          end: "bottom 20%",
          onEnter: startAnimation,
          onEnterBack: startAnimation,
          onLeave: resetAnimation,
          onLeaveBack: resetAnimation,
          onRefresh: (self) => {
            if (self.isActive) {
              startAnimation();
            } else {
              resetAnimation();
            }
          },
        });
      } else if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                startAnimation();
              } else {
                resetAnimation();
              }
            });
          },
          { root: null, threshold: 0.25 }
        );
        observer.observe(altitudeVideoContainer);
      }
    }
  }

  // Teaser button arrow micro-animation - animate arrows when button enters viewport
  const teaserButtons = Array.from(document.querySelectorAll(".teasers-button, .attractions-section__button"));
  
  if (teaserButtons.length > 0 && typeof gsap !== "undefined") {
    teaserButtons.forEach((button) => {
      // Skip nav buttons
      if (button.closest(".nav") || button.classList.contains("nav__button")) {
        return;
      }

      const teaserRow = button.closest(".teasers-row") || button.closest(".attractions-section") || button;
      
      // Set initial state: arrows start slightly to the left and invisible
      button.style.setProperty("--arrow-opacity", "0");
      button.style.setProperty("--arrow-x", "-8px");

      const animateArrows = () => {
        // Create a bouncy animation timeline for the arrows
        const tl = gsap.timeline({ delay: 0.2 });
        
        // Fade in and slide in with bounce
        tl.to(button, {
          "--arrow-opacity": 1,
          "--arrow-x": "0px",
          duration: 0.3,
          ease: "power2.out",
        })
        // First bounce
        .to(button, {
          "--arrow-x": "6px",
          duration: 0.15,
          ease: "power2.out",
        })
        .to(button, {
          "--arrow-x": "0px",
          duration: 0.15,
          ease: "power2.out",
        })
        // Second bounce (smaller)
        .to(button, {
          "--arrow-x": "4px",
          duration: 0.12,
          ease: "power2.out",
        })
        .to(button, {
          "--arrow-x": "0px",
          duration: 0.12,
          ease: "power2.out",
        })
        // Third bounce (even smaller)
        .to(button, {
          "--arrow-x": "2px",
          duration: 0.1,
          ease: "power2.out",
        })
        .to(button, {
          "--arrow-x": "0px",
          duration: 0.1,
          ease: "power2.out",
        });
      };

      const resetArrows = () => {
        button.style.setProperty("--arrow-opacity", "0");
        button.style.setProperty("--arrow-x", "-8px");
      };

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: teaserRow,
          start: "top 85%",
          end: "bottom 20%",
          once: false, // Allow replay
          onEnter: animateArrows,
          onEnterBack: animateArrows,
          onLeave: resetArrows,
          onLeaveBack: resetArrows,
        });
      } else if ("IntersectionObserver" in window) {
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                animateArrows();
              } else {
                resetArrows();
              }
            });
          },
          { root: null, threshold: 0.25 }
        );
        observer.observe(teaserRow);
      }
    });
  }
});
