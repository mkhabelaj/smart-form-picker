// ModalFooter.test.js
//
// Run these tests with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import ModalFooter from "./ModalFooter.js";
import GenericElement from "../../elements/GenericElement.js";

describe("ModalFooter", () => {
  let footer;
  let el;

  beforeEach(() => {
    footer = new ModalFooter();
    el = footer.get();
  });

  test("constructor creates a <footer> with correct styles", () => {
    expect(el.tagName).toBe("FOOTER");
    expect(el.style.display).toBe("flex");
    expect(el.style.justifyContent).toBe("center");
    expect(el.style.gap).toBe("3px");
    expect(el.style.marginBottom).toBe("15px");
  });

  test("get() returns the same underlying HTMLElement", () => {
    const first = footer.get();
    const second = footer.get();
    expect(first).toBeInstanceOf(HTMLElement);
    expect(second).toBe(first);
  });

  test("append() adds a raw HTMLElement child", () => {
    const child = document.createElement("div");
    child.textContent = "Raw child";
    footer.append(child);

    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(child);
    expect(el.firstChild.textContent).toBe("Raw child");
  });

  test("append() adds a GenericElement child", () => {
    const geo = new GenericElement("span");
    geo.setContent("Wrapped child");
    // Pass the GenericElement's HTMLElement
    footer.append(geo.get());

    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(geo.get());
    expect(el.firstChild.textContent).toBe("Wrapped child");
  });
});
