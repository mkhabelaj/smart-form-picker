// ModalContent.test.js
//
// Run these tests with Bun’s DOM support enabled, e.g.:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import ModalContent from "./ModalContent.js";

describe("ModalContent", () => {
  let mc;
  let el;

  beforeEach(() => {
    mc = new ModalContent();
    el = mc.get();
  });

  test("constructor creates a <main> with the correct ID and styles", () => {
    expect(el.tagName).toBe("MAIN");
    expect(el.getAttribute("id")).toBe("modal-content");

    // Styles applied inline
    expect(el.style.border).toBe("1px solid #000000");
    expect(el.style.padding).toBe("3px");
    expect(el.style.marginBottom).toBe("3px");
  });

  test("get() returns the underlying HTMLElement", () => {
    const first = mc.get();
    const second = mc.get();
    expect(first).toBeInstanceOf(HTMLElement);
    expect(second).toBe(first);
  });

  test("append() adds an item to the content area", () => {
    const child = document.createElement("div");
    child.textContent = "Hello";
    mc.append(child);

    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(child);
    expect(el.firstChild.textContent).toBe("Hello");
  });

  test("clear() removes all inner HTML", () => {
    // Pre-populate with some HTML
    el.innerHTML = "<p>Test</p>";
    expect(el.children.length).toBe(1);

    mc.clear();
    expect(el.innerHTML).toBe("");
    expect(el.children.length).toBe(0);
  });

  test("render() clears existing content and appends the new item", () => {
    // Pre-populate with a dummy child
    const oldChild = document.createElement("span");
    mc.append(oldChild);
    expect(el.children.length).toBe(1);

    const newChild = document.createElement("section");
    newChild.id = "new";
    mc.render(newChild);

    // Should have exactly the newChild and nothing else
    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(newChild);
    expect(el.firstChild.id).toBe("new");
  });
});
