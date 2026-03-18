import { gsap } from "gsap";
import { Draggable } from "gsap/Draggable";
import { Flip } from "gsap/Flip";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { Observer } from "gsap/Observer";
import { ScrollSmoother } from "gsap/ScrollSmoother";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { TextPlugin } from "gsap/TextPlugin";

const gsapRegistryState = globalThis as typeof globalThis & {
  __unimetricsLandingGsapPluginsRegistered__?: boolean;
};

if (!gsapRegistryState.__unimetricsLandingGsapPluginsRegistered__) {
  gsap.registerPlugin(
    Observer,
    ScrollTrigger,
    ScrollSmoother,
    ScrollToPlugin,
    SplitText,
    TextPlugin,
    Flip,
    MotionPathPlugin,
    Draggable
  );

  gsapRegistryState.__unimetricsLandingGsapPluginsRegistered__ = true;
}

export { gsap } from "gsap";
export { Draggable } from "gsap/Draggable";
export { Flip } from "gsap/Flip";
export { MotionPathPlugin } from "gsap/MotionPathPlugin";
export { Observer } from "gsap/Observer";
export { ScrollSmoother } from "gsap/ScrollSmoother";
export { ScrollToPlugin } from "gsap/ScrollToPlugin";
export { ScrollTrigger } from "gsap/ScrollTrigger";
export { SplitText } from "gsap/SplitText";

export { TextPlugin } from "gsap/TextPlugin";
