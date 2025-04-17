// Toast.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import { Toast } from "./Toast.js";

describe("Toast", () => {
  let toast;
  let container;

  beforeEach(() => {
    // Clear existing DOM to isolate tests
    document.body.innerHTML = "";
    toast = new Toast();
    container = document.getElementById("toast-container");
  });

  test("constructor creates a container with id 'toast-container'", () => {
    expect(container).toBeInstanceOf(HTMLElement);
    expect(container.id).toBe("toast-container");
  });

  test("default container styles for bottom-center", () => {
    const style = container.style;
    expect(style.position).toBe("fixed");
    expect(style.zIndex).toBe("100000");
    expect(style.display).toBe("flex");
    expect(style.flexDirection).toBe("column");
    expect(style.bottom).toBe("20px");
    expect(style.left).toBe("50%");
    expect(style.transform).toBe("translateX(-50%)");
    expect(style.alignItems).toBe("center");
  });

  const positions = {
    "top-left": { top: "20px", left: "20px", alignItems: "flex-start" },
    "top-center": {
      top: "20px",
      left: "50%",
      transform: "translateX(-50%)",
      alignItems: "center",
    },
    "top-right": { top: "20px", right: "20px", alignItems: "flex-end" },
    "bottom-left": { bottom: "20px", left: "20px", alignItems: "flex-start" },
    "bottom-right": { bottom: "20px", right: "20px", alignItems: "flex-end" },
  };

  for (const [pos, expected] of Object.entries(positions)) {
    test(`constructor honors position option "${pos}"`, () => {
      document.body.innerHTML = "";
      const t = new Toast({ position: pos });
      const c = document.getElementById("toast-container");
      for (const [prop, val] of Object.entries(expected)) {
        expect(c.style[prop]).toBe(val);
      }
    });
  }

  describe("show()", () => {
    test("appends a toast with correct message and default 'success' styling", () => {
      toast.show("Hello");
      const toasts = container.querySelectorAll(".toast");
      expect(toasts.length).toBe(1);

      const tEl = toasts[0];
      expect(tEl.textContent).toBe("Hello");
      expect(tEl.style.backgroundColor).toBe("#4CAF50");
      expect(tEl.style.opacity).toBe("1"); // faded in
    });

    test("show() with type 'error' uses red background", () => {
      toast.show("Err!", "error");
      const tEl = container.querySelector(".toast");
      expect(tEl.style.backgroundColor).toBe("#f44336");
    });

    test("show() with type 'warn' uses orange background", () => {
      toast.show("Warn!", "warn");
      const tEl = container.querySelector(".toast");
      expect(tEl.style.backgroundColor).toBe("#ff9800");
    });

    test("multiple calls reuse the same container", () => {
      toast.show("First");
      toast.show("Second");
      const all = document.querySelectorAll("#toast-container");
      expect(all.length).toBe(1);
      expect(container.querySelectorAll(".toast").length).toBe(2);
    });

    //TODO: test transitionend
    // test("toast is removed after transitionend event", () => {
    //   // Stub setTimeout so that our removal handler installs immediately
    //   const realSetTimeout = globalThis.setTimeout;
    //   globalThis.setTimeout = (cb) => cb();
    //
    //   toast.show("Bye", "success", 0);
    //   const tEl = container.querySelector(".toast");
    //   expect(tEl).toBeInstanceOf(HTMLElement);
    //
    //   // Now that the handler is attached, dispatch transitionend to remove it
    //   tEl.dispatchEvent(new Event("transitionend"));
    //
    //   expect(container.querySelector(".toast")).toBeNull();
    //
    //   // Restore real timers
    //   globalThis.setTimeout = realSetTimeout;
    // });
  });

  describe("shortcuts", () => {
    test("success() calls show() with 'success' type", () => {
      toast.success("Yay", 0);
      const tEl = container.querySelector(".toast");
      expect(tEl.style.backgroundColor).toBe("#4CAF50");
    });

    test("error() calls show() with 'error' type", () => {
      toast.error("Oops", 0);
      const tEl = container.querySelector(".toast");
      expect(tEl.style.backgroundColor).toBe("#f44336");
    });

    test("warn() calls show() with 'warn' type", () => {
      toast.warn("Careful", 0);
      const tEl = container.querySelector(".toast");
      expect(tEl.style.backgroundColor).toBe("#ff9800");
    });
  });
});
