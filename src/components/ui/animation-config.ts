/**
 * Animation Configuration
 *
 * Centralized settings for app-wide animations.
 * Adjust these values to fine-tune the animation behavior across the entire app.
 */

export const ANIMATION_CONFIG = {
  // Default durations (in seconds)
  durations: {
    fast: 0.2,
    normal: 0.3,
    slow: 0.4,
    blur: 0.4, // Blur animations are slightly slower for better visual effect
  },

  // Default delays (in seconds)
  delays: {
    none: 0,
    short: 0.1,
    medium: 0.2,
    long: 0.3,
  },

  // Stagger settings
  stagger: {
    children: 0.05, // Delay between child elements
    delay: 0.1, // Initial delay before staggering starts
  },

  // Easing functions
  easing: {
    easeOut: "easeOut",
    easeIn: "easeIn",
    easeInOut: "easeInOut",
  },

  // Motion values
  motion: {
    slideDistance: 20, // Distance elements slide in from
    scaleStart: 0.95, // Starting scale for scale animations
    blurAmount: "4px", // Blur amount for blur animations
  },

  // Performance settings
  performance: {
    // Reduce motion for users who prefer it
    respectReducedMotion: true,
    // Skip animations for very slow devices
    skipOnSlowDevices: false,
  },
} as const;

// Animation presets for common use cases
export const ANIMATION_PRESETS = {
  pageTransition: {
    animation: "fade" as const,
    duration: ANIMATION_CONFIG.durations.normal,
    delay: ANIMATION_CONFIG.delays.none,
  },

  cardEntry: {
    animation: "slideUp" as const,
    duration: ANIMATION_CONFIG.durations.normal,
    delay: ANIMATION_CONFIG.delays.short,
  },

  listItem: {
    animation: "slideUp" as const,
    duration: ANIMATION_CONFIG.durations.fast,
    delay: ANIMATION_CONFIG.delays.none,
  },

  modal: {
    animation: "scale" as const,
    duration: ANIMATION_CONFIG.durations.fast,
    delay: ANIMATION_CONFIG.delays.none,
  },

  header: {
    animation: "fade" as const,
    duration: ANIMATION_CONFIG.durations.normal,
    delay: ANIMATION_CONFIG.delays.short,
  },

  section: {
    animation: "slideUp" as const,
    duration: ANIMATION_CONFIG.durations.normal,
    delay: ANIMATION_CONFIG.delays.medium,
  },
} as const;
