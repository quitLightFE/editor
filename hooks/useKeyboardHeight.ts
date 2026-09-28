"use client";

import { useEffect, useState } from "react";

export function useKeyboardHeight() {
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const viewport = window.visualViewport;

    if (!viewport) return;

    const update = () => {
      const height =
        window.innerHeight - viewport.height - viewport.offsetTop;

      setKeyboardHeight(Math.max(0, height));
    };

    update();

    viewport.addEventListener("resize", update);
    viewport.addEventListener("scroll", update);

    return () => {
      viewport.removeEventListener("resize", update);
      viewport.removeEventListener("scroll", update);
    };
  }, []);

  return keyboardHeight;
}