"use client";

import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

export default function AOSProvider() {
  useEffect(() => {
    AOS.init({
      duration: 800, // animation duration (ms)
      once: false,    // run animation only once per element
    });
  }, []);

  return null; // this component only runs the effect
}
