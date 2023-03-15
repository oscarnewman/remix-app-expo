import React, { useEffect } from "react";
import { motion } from "framer-motion";
import { useLocation, useNavigationType } from "@remix-run/react";

const transition = { ease: "easeInOut", duration: 0.3 };

/**
 * Base Page component that animates when it enters/exits from route change
 */
export default function Page({ children, title, ...props }) {
  const action = useNavigationType();

  useEffect(() => {
    document.title = title;
  }, [title]);

  const variants = {
    enter() {
      // if isPush is true, this is the eventual destination of the top page (sliding in from the right)
      // if isPush is false, this is the eventual destination of the bottom page (sliding in from the left)
      const isPush = action === "PUSH";

      return {
        x: 0,
        transition,
        transitionEnd: {
          // after animation has finished, reset the position to static
          position: "static",
        },
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      };
    },
    initial() {
      // if isPush is true, this is the starting position of top page (sliding in from the right)
      // if ifPush is false, this is the starting position of bottom page (sliding in from the left)
      const isPush = action === "PUSH";

      return {
        x: isPush ? "100%" : "-25%",
        // boxShadow: isPush ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : null,
        transition,
        // keep top "layer" of animation as a fixed position
        ...(isPush
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      };
    },

    // an updated history.action is provided in AnimatedSwitch via "custom" prop for AnimatePresence
    exit({ action }) {
      // if isPop is true, this is the top page being dismissed (sliding to the right)
      // if isPop is false, this is the botom page being dismissed (sliding to the left)
      const isPop = action === "POP";

      return {
        x: isPop ? "100%" : "-10%",
        zIndex: isPop ? 1 : -1,
        // boxShadow: isPop ? "0 25px 50px -12px rgba(0, 0, 0, 0.5)" : null,
        transition,

        // keep top "layer" of animation as a fixed position
        // this will, however, reset the scroll position of the page being dismissed
        ...(isPop
          ? {
              position: "fixed",
              top: 0,
              right: 0,
              left: 0,
              bottom: 0,
            }
          : {}),
      };
    },
  };

  const isBack = action === "POP";
  const direction = isBack ? "-" : "";

  return (
    <motion.main
      //   initial="initial"
      //   animate="enter"
      //   exit="exit"
      //   variants={variants}
      key={useLocation().pathname}
      initial={{ x: `${direction}10%`, opacity: 0 }}
      animate={{ x: "0", opacity: 1 }}
      exit={{ y: `0`, opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {children}
    </motion.main>
  );
}
