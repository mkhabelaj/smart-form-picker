// Button.test.js
//
// Note: run these with Bun’s DOM support enabled, e.g.:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import { Button, buttonSize } from "./Button.js";

describe("Button", () => {
  let button;
  let el;

  beforeEach(() => {
    button = new Button();
    el = button.get();
  });

  test("default constructor sets text to 'Button' and no value attribute", () => {
    expect(el.textContent).toBe("Button");
    expect(el.hasAttribute("value")).toBe(false);
  });

  test("constructor applies provided text and value", () => {
    const btn = new Button("Click me", null, {}, "myValue");
    const node = btn.get();
    expect(node.textContent).toBe("Click me");
    expect(node.getAttribute("value")).toBe("myValue");
  });

  test("setStyles applies multiple inline styles", () => {
    button.setStyles({ color: "green", margin: "5px" });
    expect(el.style.color).toBe("green");
    expect(el.style.margin).toBe("5px");
  });

  test("mergeStyles merges onto existing styles", () => {
    button.setStyles({ padding: "2px", fontSize: "10px" });
    button.mergeStyles({ padding: "4px", border: "1px solid" });
    expect(el.style.padding).toBe("4px");
    expect(el.style.fontSize).toBe("10px");
    expect(el.style.border).toBe("1px solid");
  });

  test("setStyle sets a single inline style", () => {
    button.setStyle("backgroundColor", "yellow");
    expect(el.style.backgroundColor).toBe("yellow");
  });

  test("setBorderColor sets the borderColor style", () => {
    button.setBorderColor("red");
    expect(el.style.borderColor).toBe("red");
  });

  test("setContent updates text and preserves existing styles", () => {
    button.setStyles({ padding: "8px" });
    button.setContent("New text", "val");
    expect(el.textContent).toBe("New text");
    expect(el.getAttribute("value")).toBe("val");
    expect(el.style.padding).toBe("8px");
  });

  describe("setButtonSize", () => {
    test("small applies 4px 8px padding and 12px fontSize", () => {
      button.setButtonSize(buttonSize.small);
      expect(el.style.padding).toBe("4px 8px");
      expect(el.style.fontSize).toBe("12px");
    });

    test("medium applies 8px 16px padding and 16px fontSize", () => {
      button.setButtonSize(buttonSize.medium);
      expect(el.style.padding).toBe("8px 16px");
      expect(el.style.fontSize).toBe("16px");
    });

    test("large applies 12px 24px padding and 20px fontSize", () => {
      button.setButtonSize(buttonSize.large);
      expect(el.style.padding).toBe("12px 24px");
      expect(el.style.fontSize).toBe("20px");
    });

    test("invalid size logs a warning and does not change styles", () => {
      // start with a known style
      button.setStyles({ color: "blue" });

      let warned = false;
      const origWarn = console.warn;
      console.warn = () => {
        warned = true;
      };

      button.setButtonSize("giant");
      console.warn = origWarn;

      expect(warned).toBe(true);
      // styles should remain as before
      expect(el.style.color).toBe("blue");
    });
  });

  test("setOnClick attaches click handler", () => {
    let clicked = false;
    button.setOnClick(() => {
      clicked = true;
    });
    el.click();
    expect(clicked).toBe(true);
  });

  test("get() returns the underlying HTMLElement", () => {
    const first = button.get();
    const second = button.get();
    expect(first).toBeInstanceOf(HTMLElement);
    expect(second).toBe(first);
  });
});
