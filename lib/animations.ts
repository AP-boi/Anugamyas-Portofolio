/**
 * macOS-authentic motion presets shared across the OS shell.
 *
 * Apple's system animations are defined by two signatures:
 *  1. "Genie / zoom" transitions  -> gentle spring with a whisper of overshoot
 *  2. "Popover / panel" reveals   -> fast deceleration (easeOutExpo-like curve)
 *
 * Keep every duration short (150-450ms). macOS never lingers.
 */
import type { Transition, Variants } from 'framer-motion';

/** Apple's default system ease (used in NSAnimationContext). */
export const MAC_EASE = [0.32, 0.72, 0, 1] as const;

/** Aggressive deceleration for popovers, tooltips, menus. */
export const MAC_EASE_OUT = [0.16, 1, 0.3, 1] as const;

/** Gentle acceleration for things leaving the screen (minimize, dismiss). */
export const MAC_EASE_IN = [0.55, 0, 1, 0.45] as const;

/** Window open/close — smooth with a barely-there overshoot. */
export const MAC_WINDOW_SPRING: Transition = {
    type: 'spring',
    stiffness: 320,
    damping: 30,
    mass: 0.9,
};

/** Small UI elements: icons, badges, indicators. */
export const MAC_SNAPPY_SPRING: Transition = {
    type: 'spring',
    stiffness: 500,
    damping: 32,
    mass: 0.6,
};

/** Overlays: Spotlight, Control Center, Launchpad panels. */
export const MAC_OVERLAY_SPRING: Transition = {
    type: 'spring',
    stiffness: 380,
    damping: 34,
    mass: 0.8,
};

/** Dock icon magnification tracking. */
export const MAC_DOCK_SPRING = {
    mass: 0.1,
    stiffness: 350,
    damping: 21,
};

/** Frame changes (maximize / restore) — Apple animates the window frame. */
export const MAC_FRAME_TRANSITION: Transition = {
    duration: 0.42,
    ease: MAC_EASE,
};

/** Standard window open: scale up from ~94% with a soft rise + de-blur. */
export const windowOpenVariants: Variants = {
    initial: {
        opacity: 0,
        scale: 0.94,
        y: 14,
        filter: 'blur(6px)',
    },
    animate: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: MAC_WINDOW_SPRING,
    },
};

/** Quick, quiet close — macOS windows vanish without drama. */
export const windowCloseExit = {
    opacity: 0,
    scale: 0.96,
    filter: 'blur(4px)',
    transition: { duration: 0.16, ease: MAC_EASE_OUT },
};

/** Staggered grid item reveal (Launchpad pages, Spotlight results). */
export const staggerContainer = (stagger = 0.018, delayChildren = 0.04): Variants => ({
    hidden: {},
    show: {
        transition: { staggerChildren: stagger, delayChildren },
    },
});

export const staggerItem = (distance = 18): Variants => ({
    hidden: {
        opacity: 0,
        scale: 0.8,
        y: distance,
        filter: 'blur(6px)',
    },
    show: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: 'blur(0px)',
        transition: MAC_OVERLAY_SPRING,
    },
});