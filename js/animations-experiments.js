// Hero animations - EXPERIMENTS PAGE ONLY
// This file is isolated from the main site. Changes here won't affect other pages.
// Feel free to experiment with hero animation techniques here!
document.addEventListener("DOMContentLoaded", function () {
  // Register GSAP plugins
  if (typeof ScrollTrigger !== "undefined" || typeof ScrambleTextPlugin !== "undefined") {
    const pluginsToRegister = [];
    if (typeof ScrollTrigger !== "undefined") {
      pluginsToRegister.push(ScrollTrigger);
    }
    if (typeof ScrambleTextPlugin !== "undefined") {
      pluginsToRegister.push(ScrambleTextPlugin);
    }
    if (pluginsToRegister.length > 0) {
      gsap.registerPlugin(...pluginsToRegister);
    }
  }

  // Hero vector image & zipwire animations (homepage heroes, scoped per instance)
  const homepageHeroes = document.querySelectorAll(".hero.hero--homepage");
  homepageHeroes.forEach((hero) => {
    const heroVectorImage = hero.querySelector(".hero__vector-image");
    if (heroVectorImage) {
      // Scale in the logo from 50% to 100% over 0.2 seconds
      setTimeout(() => {
        heroVectorImage.classList.add("visible");
      }, 0);
    }

    // Hero zipwire frames cycling animation - cycles through all variant frames every 2 seconds (homepage only)
    // Based on Figma variants: Variant2, Variant3, Variant4, Variant5, Variant6, Variant7, Variant8
    const heroZipwireFrames = hero.querySelectorAll(".hero__zipwire-frame");
    const heroZipwireBases = hero.querySelectorAll(".hero__zipwire-base");

    if (heroZipwireFrames.length > 0) {
      let currentFrameIndex = 0;

      // Start showing images immediately after logo animation finishes (0.2s - logo scales in over 0.2s)
      setTimeout(() => {
        // Show the base images
        heroZipwireBases.forEach((base) => {
          base.classList.add("visible");
        });

        const firstFrame = heroZipwireFrames[0];
        if (firstFrame) {
          firstFrame.classList.add("active");
        }

        // Hide base images after first frame appears (they only show with first frame)
        setTimeout(() => {
          heroZipwireBases.forEach((base) => {
            base.style.transition = "none";
            base.offsetHeight; // Force reflow
            base.classList.remove("visible");
          });
        }, 400); // Hide base images after first frame animation completes (0.2s)

        // Start cycling through remaining frames after 2 seconds (first image displays for 2 seconds)
        setInterval(() => {
          const oldFrame = heroZipwireFrames[currentFrameIndex];
          if (!oldFrame) {
            return;
          }

          // Remove transition from old image and hide it instantly
          oldFrame.style.transition = "none";
          // Force reflow to ensure transition is removed before class change
          oldFrame.offsetHeight;
          oldFrame.classList.remove("active");

          // Move to next frame (loop back to 0 after last frame)
          currentFrameIndex = (currentFrameIndex + 1) % heroZipwireFrames.length;

          // Add active class to new frame with scale animation
          const newFrame = heroZipwireFrames[currentFrameIndex];
          if (!newFrame) {
            return;
          }
          // Reset transition to allow scale animation (use CSS default)
          newFrame.style.transition = "";
          // Force reflow to ensure transition is reset before class change
          newFrame.offsetHeight;
          newFrame.classList.add("active");
        }, 2000); // 2 second interval
      }, 200); // 0.2 seconds delay: logo scales in over 0.2s, then images appear immediately after
    }
  });

  // Standard hero elements (not homepage) - iterate over each instance
  const standardHeroes = document.querySelectorAll(".hero:not(.hero--homepage)");
  standardHeroes.forEach((hero) => {
    const heroTitle = hero.querySelector(".hero__title");
    const heroSubtitle = hero.querySelector(".hero__subtitle");
    const heroImage = hero.querySelector(".hero__image");
    const heroBgColor = hero.querySelector(".hero__bg-color");

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
    if (heroImage && typeof ScrollTrigger !== "undefined") {
      // Create parallax effect: image moves slower than scroll
      // As user scrolls down, image moves down at 30% speed, creating depth
      gsap.to(heroImage, {
        yPercent: 30, // Move image 30% down when scrolled past hero section
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top", // Start when top of hero hits top of viewport
          end: "bottom top", // End when bottom of hero hits top of viewport
          scrub: true, // Smooth scroll-linked animation (no jumps)
        },
      });
    }
  });

  let scrambleRunId = 0;

  const linearEase = (t) => t;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  const scrambleElement = (element, config = {}) => {
    const { duration = 3, scrambleRatio = 0.65, chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789", once = true, scrambleInterval = 50, target, onStart, onUpdate, onComplete, ease = linearEase } = config;

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
    const revealCountForTime = (elapsed) => {
      if (revealDuration === 0) {
        return letters.length;
      }
      const revealElapsed = Math.max(0, elapsed - scrambleDuration);
      const linearProgress = Math.min(1, revealElapsed / revealDuration);
      const easedProgress = ease ? ease(linearProgress) : linearProgress;
      return Math.floor(easedProgress * letters.length);
    };

    const runId = `${++scrambleRunId}`;
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
        element.textContent = targetText;
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
          display += " ";
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

  // Utility to add scramble animations to elements
  const addScrambleAnimation = (elements, config = {}) => {
    const items = Array.from(elements || []).filter(Boolean);
    if (items.length === 0) {
      return [];
    }

    const controllers = [];
    const triggerElement = config.trigger || null;
    const start = config.start || "top 75%";
    const once = config.once !== undefined ? config.once : true;

    items.forEach((element, index) => {
      const targetText = element.dataset.scrambleWord || element.dataset.word || element.textContent.trim();
      element.dataset.scrambleWord = targetText;

      const run = () => {
        const delay = (config.stagger || 0) * 1000 * index;
        if (delay > 0) {
          setTimeout(() => scrambleElement(element, { ...config, once }), delay);
        } else {
          scrambleElement(element, { ...config, once });
        }
      };
      controllers.push(run);

      if (typeof ScrollTrigger !== "undefined") {
        ScrollTrigger.create({
          trigger: triggerElement || element,
          start,
          once,
          onEnter: run,
          onEnterBack: once ? undefined : run,
        });
      } else {
        run();
      }
    });

    return controllers;
  };

  const getRandomChar = (charset) => charset[Math.floor(Math.random() * charset.length)] || "A";

  // Experiment hero scramble text animation and hover interactions
  const experimentHero = document.querySelector(".hero.hero--experiment");
  const heroCharSet = "MEDLOCKSQABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  if (experimentHero && typeof ScrollTrigger !== "undefined") {
    const heroLetters = Array.from(experimentHero.querySelectorAll(".hero-logo__letter"));

    if (heroLetters.length > 0) {
      const rootStyles = getComputedStyle(document.documentElement);
      // MSQ color palette
      const msqColors = [
        "#75D8FF", // Blue
        "#64D187", // Green
        "#F2FA7D", // Yellow
        "#9D78FE", // Purple
        "#FEA5E5", // Pink
        "#FE8F00", // Orange
      ];
      const getRandomMSQColor = () => msqColors[Math.floor(Math.random() * msqColors.length)];
      const highlightColor = (rootStyles.getPropertyValue("--theme-highlight") || "#f2fa7d").trim() || "#f2fa7d";
      const baseColor = (rootStyles.getPropertyValue("--theme-text-dark") || "#1f1d1e").trim() || "#1f1d1e";

      heroLetters.forEach((letter) => {
        const original = letter.textContent.trim();
        if (original.length > 0) {
          letter.dataset.scrambleWord = original;
        }
        letter.textContent = letter.dataset.scrambleWord || "";
        letter.style.color = baseColor;
      });

      const scrambleLettersToTarget = (targetGetter, options = {}) => {
        const { duration = 0.5, scrambleRatio = 0.3, scrambleInterval = 60, stagger = 0.2, activeColor = null, inactiveColor = baseColor, ease = linearEase } = options;

        heroLetters.forEach((letter, index) => {
          const targetValue = targetGetter(letter, index);
          const launch = () =>
            scrambleElement(letter, {
              duration,
              scrambleRatio,
              scrambleInterval,
              chars: heroCharSet,
              once: false,
              target: targetValue,
              ease,
              onStart: () => {
                letter.style.color = activeColor || getRandomMSQColor();
              },
              onComplete: () => {
                if (letter.dataset.hovering === "true") {
                  keepScramblingWhileHover(letter);
                } else {
                  letter.style.color = inactiveColor;
                }
              },
            });

          if (stagger > 0) {
            setTimeout(launch, stagger * 1000 * index);
          } else {
            launch();
          }
        });
      };

      const scrambleIntoPlace = () =>
        scrambleLettersToTarget((letter) => letter.dataset.scrambleWord, {
          duration: 1.05,
          scrambleRatio: 0.35,
          scrambleInterval: 65,
          stagger: 0.06,
          ease: easeOutCubic,
        });

      const scrambleOutToRandom = () =>
        scrambleLettersToTarget(() => getRandomChar(heroCharSet), {
          duration: 0.7,
          scrambleRatio: 1,
          scrambleInterval: 55,
          stagger: 0.06,
          ease: linearEase,
        });

      ScrollTrigger.create({
        trigger: experimentHero,
        start: "top 80%",
        end: "bottom 20%",
        onEnter: scrambleIntoPlace,
        onEnterBack: scrambleIntoPlace,
        onLeave: scrambleOutToRandom,
        onLeaveBack: scrambleOutToRandom,
      });

      const heroIsInView = () => {
        const rect = experimentHero.getBoundingClientRect();
        const viewportHeight = window.innerHeight || document.documentElement.clientHeight;
        return rect.top < viewportHeight && rect.bottom > 0;
      };

      const setInitialState = () => {
        if (heroIsInView()) {
          scrambleIntoPlace();
        } else {
          scrambleOutToRandom();
        }
      };

      setTimeout(setInitialState, 60);
      window.addEventListener("load", setInitialState, { once: true });
      document.addEventListener("visibilitychange", () => {
        if (!document.hidden) {
          setTimeout(setInitialState, 80);
        }
      });

      // Hover interactions for individual letters
      const keepScramblingWhileHover = (letter) => {
        if (letter.dataset.hovering !== "true") {
          letter.style.color = baseColor;
          return;
        }
        scrambleElement(letter, {
          duration: 0.3,
          scrambleRatio: 1,
          scrambleInterval: 55,
          chars: heroCharSet,
          once: false,
          target: getRandomChar(heroCharSet),
          onStart: () => {
            letter.style.color = getRandomMSQColor();
          },
          onComplete: () => {
            if (letter.dataset.hovering === "true") {
              keepScramblingWhileHover(letter);
            } else {
              letter.style.color = baseColor;
            }
          },
        });
      };

      heroLetters.forEach((letter) => {
        letter.addEventListener("mouseenter", () => {
          letter.dataset.hovering = "true";
          keepScramblingWhileHover(letter);
        });

        letter.addEventListener("mouseleave", () => {
          letter.dataset.hovering = "false";
          scrambleElement(letter, {
            duration: 0.75,
            scrambleRatio: 1,
            scrambleInterval: 60,
            chars: heroCharSet,
            once: false,
            target: getRandomChar(heroCharSet),
            onStart: () => {
              letter.style.color = getRandomMSQColor();
            },
            onComplete: () => {
              scrambleElement(letter, {
                duration: 0.3,
                scrambleRatio: 0,
                scrambleInterval: 50,
                chars: heroCharSet,
                once: false,
                target: letter.dataset.scrambleWord,
                onStart: () => {
                  letter.style.color = getRandomMSQColor();
                },
                onComplete: () => {
                  letter.style.color = baseColor;
                },
              });
            },
          });
        });
      });
    }
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
    // Guard against double-init (index loads animations.js + animations-experiments.js)
    if (tickerContent.dataset.tickerTextInit) return;
    tickerContent.dataset.tickerTextInit = "true";

    // Wait for layout to be ready before calculating dimensions
    const initTickerAnimation = () => {
      // Calculate the width of one text element
      const textWidth = tickerText.offsetWidth;
      // Use viewport width for full-width scrolling
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

  // Teasers Section Animations - Copy from attractions section on home page
  // Image mask reveal animation (clip-path from left to right)
  const teaserImageContainers = document.querySelectorAll(".teasers-image-container");

  if (teaserImageContainers.length > 0 && typeof ScrollTrigger !== "undefined") {
    teaserImageContainers.forEach((container) => {
      const teaserRow = container.closest(".teasers-row");
      const teaserImage = container.querySelector(".teasers-image") || container.querySelector(".teasers-video");

      if (teaserRow && teaserImage) {
        // Check if this is a reverse row (image on the left)
        const isReverseRow = teaserRow.classList.contains("teasers-row--reverse");
        
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

        // Set initial state for image: normal scale and position
        gsap.set(teaserImage, {
          scale: 1,
          x: 0,
          transformOrigin: "center center",
        });

        // Create scroll-triggered animation for mask reveal
        if (isReverseRow) {
          // Mask reveals from right to left (for images on the left)
          gsap.to(container, {
            clipPath: "inset(0 0 0 0%)", // Fully revealed - 0% from left
            ease: "none", // Linear easing - no easing
            scrollTrigger: {
              trigger: teaserRow,
              start: "top 100%", // Start when the top of the row enters the viewport from the bottom
              end: "top 40%", // End when the top of the row is 40% down from the top of the viewport
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
              trigger: teaserRow,
              start: "top 100%", // Start when the top of the row enters the viewport from the bottom
              end: "top 40%", // End when the top of the row is 40% down from the top of the viewport
              scrub: 0.15, // Slower, smoother scroll-linked animation
              // markers: true, // Uncomment for debugging
            },
          });
        }

        // Create scroll-triggered animation for image zoom
        // Images zoom to 110% as user scrolls
        gsap.to(teaserImage, {
          scale: 1.1, // Zoom to 110%
          ease: "none", // Linear easing for smooth scroll-linked movement
          scrollTrigger: {
            trigger: teaserRow,
            start: "top bottom", // Start when row enters viewport
            end: "bottom top", // End when row leaves viewport
            scrub: 0.15, // Smooth scroll-linked animation (matches mask reveal timing)
            // markers: true, // Uncomment for debugging
          },
        });
      }
    });

    // Refresh ScrollTrigger to handle sections already in view
    ScrollTrigger.refresh();
  }

  // Teasers title word-by-word animation (matching attraction title style)
  // Only run on pages that explicitly opt in (e.g., attractions page)
  const shouldAnimateTeaserTitles = document.body.classList.contains("page-attractions");
  const teaserTitles = shouldAnimateTeaserTitles ? document.querySelectorAll(".teasers-title") : [];

  if (teaserTitles.length > 0 && typeof ScrollTrigger !== "undefined") {
    teaserTitles.forEach((title) => {
      // Split title text into words and wrap each in a span
      const text = title.textContent.trim();
      const words = text.split(/\s+/);

      // Clear and rebuild with wrapped words
      title.innerHTML = words.map((word) => `<span class="teasers-title-word">${word}</span>`).join(" ");

      // Get all word elements
      const wordElements = title.querySelectorAll(".teasers-title-word");

      // Set initial state: words are invisible and positioned to the left
      gsap.set(wordElements, {
        opacity: 0,
        x: -50, // Start from left (negative = left side)
      });

      // Get the parent teaser row for ScrollTrigger
      const teaserRow = title.closest(".teasers-row");
      const teaserDescription = teaserRow?.querySelector(".teasers-description");

      if (teaserRow) {
        // Detect if we're on mobile (matches CSS breakpoint)
        const isMobile = window.innerWidth <= 768;

        // On mobile, titles are below images, so trigger animation later
        // On desktop, start later so transition is visible when scrolling down
        const startPoint = isMobile ? "top 30%" : "top 60%"; // Later trigger so transition is visible
        const endPoint = isMobile ? "top 10%" : "top 30%"; // Complete when section is more centered

        // Create a scrubbed timeline for title animation that reverses on scroll
        const titleTimeline = gsap.timeline({
          scrollTrigger: {
            trigger: teaserRow,
            start: startPoint, // Start when row enters viewport (later on mobile)
            end: endPoint, // End when row reaches middle/upper viewport
            scrub: 0.15, // Smooth scroll-linked animation that reverses
            // markers: true, // Uncomment for debugging
          },
        });

        // Add title word-by-word animation to timeline
        // Coming in (scroll down): words slide from left to right (x: -50 to x: 0)
        wordElements.forEach((word, index) => {
          titleTimeline.to(
            word,
            {
              opacity: 1,
              x: 0, // End at aligned position (x: 0)
              duration: 0.2, // Duration per word
              ease: "power2.out",
            },
            index * 0.08 // Stagger delay between words
          );
        });

        // Animate description text with same slide-in effect as title, after title completes
        if (teaserDescription) {
          // Handle both cases: description as <p> tag or as <div> container with <p> tags inside
          let descriptionParagraphs = teaserDescription.querySelectorAll("p");

          // If no <p> tags found, treat the description itself as a paragraph
          if (descriptionParagraphs.length === 0) {
            descriptionParagraphs = [teaserDescription];
          }

          descriptionParagraphs.forEach((paragraph) => {
            const text = paragraph.textContent.trim();
            const words = text.split(/\s+/);

            // Clear and rebuild with wrapped words
            paragraph.innerHTML = words.map((word) => `<span class="teasers-description-word">${word}</span>`).join(" ");
          });

          // Get all word elements from all paragraphs
          const descriptionWordElements = teaserDescription.querySelectorAll(".teasers-description-word");

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

          // Calculate when description animation completes
          const descriptionWordCount = descriptionWordElements.length;
          const descriptionEndTime = descriptionStartTime + descriptionWordCount * 0.08 + 0.2; // After all description words + their duration

          // Fade in button and opening elements after description completes
          const teaserButton = teaserRow.querySelector(".teasers-button");
          const teaserOpening = teaserRow.querySelector(".teasers-opening");

          if (teaserButton) {
            gsap.set(teaserButton, { opacity: 0 });
            titleTimeline.to(
              teaserButton,
              {
                opacity: 1,
                duration: 0.3, // 300ms fade-in
                ease: "power2.out",
              },
              descriptionEndTime
            );
          }

          if (teaserOpening) {
            // Don't hide by default; only apply "from" values when the timeline plays
            titleTimeline.fromTo(
              teaserOpening,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.3, // 300ms fade-in
                ease: "power2.out",
                immediateRender: false,
              },
              descriptionEndTime
            );
          }
        } else {
          // If no description, fade in button and opening after title completes
          const titleWordCount = wordElements.length;
          const titleEndTime = titleWordCount * 0.08 + 0.2; // After all title words + their duration

          const teaserButton = teaserRow.querySelector(".teasers-button");
          const teaserOpening = teaserRow.querySelector(".teasers-opening");

          if (teaserButton) {
            gsap.set(teaserButton, { opacity: 0 });
            titleTimeline.to(
              teaserButton,
              {
                opacity: 1,
                duration: 0.3, // 300ms fade-in
                ease: "power2.out",
              },
              titleEndTime
            );
          }

          if (teaserOpening) {
            // Don't hide by default; only apply "from" values when the timeline plays
            titleTimeline.fromTo(
              teaserOpening,
              { opacity: 0 },
              {
                opacity: 1,
                duration: 0.3, // 300ms fade-in
                ease: "power2.out",
                immediateRender: false,
              },
              titleEndTime
            );
          }
        }
      }
    });
  }

  // Teasers description animation for rows without titles
  // Apply same slide-in animation as titles
  const teaserRows = document.querySelectorAll(".teasers-row");

  if (teaserRows.length > 0 && typeof ScrollTrigger !== "undefined") {
    teaserRows.forEach((teaserRow) => {
      const title = teaserRow.querySelector(".teasers-title");
      const description = teaserRow.querySelector(".teasers-description");

      // Only animate if there's a description but no title
      if (description && !title) {
        // Handle both cases: description as <p> tag or as <div> container with <p> tags inside
        let descriptionParagraphs = description.querySelectorAll("p");

        // If no <p> tags found, treat the description itself as a paragraph
        if (descriptionParagraphs.length === 0) {
          descriptionParagraphs = [description];
        }

        descriptionParagraphs.forEach((paragraph) => {
          const text = paragraph.textContent.trim();
          const words = text.split(/\s+/);

          // Clear and rebuild with wrapped words
          paragraph.innerHTML = words.map((word) => `<span class="teasers-description-word">${word}</span>`).join(" ");
        });

        // Get all word elements from all paragraphs
        const descriptionWordElements = description.querySelectorAll(".teasers-description-word");

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
            trigger: teaserRow,
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

        // Calculate when description animation completes
        const descriptionWordCount = descriptionWordElements.length;
        const descriptionEndTime = descriptionWordCount * 0.08 + 0.2; // After all description words + their duration

        // Fade in button and opening elements after description completes
        const teaserButton = teaserRow.querySelector(".teasers-button");
        const teaserOpening = teaserRow.querySelector(".teasers-opening");

        if (teaserButton) {
          gsap.set(teaserButton, { opacity: 0 });
          descriptionTimeline.to(
            teaserButton,
            {
              opacity: 1,
              duration: 0.3, // 300ms fade-in
              ease: "power2.out",
            },
            descriptionEndTime
          );
        }

        if (teaserOpening) {
          // Don't hide by default; only apply "from" values when the timeline plays
          descriptionTimeline.fromTo(
            teaserOpening,
            { opacity: 0 },
            {
              opacity: 1,
              duration: 0.3, // 300ms fade-in
              ease: "power2.out",
              immediateRender: false,
            },
            descriptionEndTime
          );
        }
      }
    });
  }
});
