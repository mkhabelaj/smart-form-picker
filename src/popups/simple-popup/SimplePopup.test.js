// SimplePopup.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import SimplePopup from "./SimplePopup.js";

describe("SimplePopup", () => {
  let popup;
  let host;
  let popupEl;

  beforeEach(() => {
    // Clear any existing DOM to isolate each test
    document.body.innerHTML = "";

    // Instantiate with a custom title
    popup = new SimplePopup("MyTitle");
    host = document.getElementById("popup-host");
    popupEl = host.shadowRoot.querySelector("#shadow-content");
  });

  test("constructor appends host to document.body", () => {
    expect(host).toBeInstanceOf(HTMLElement);
    expect(document.body.contains(host)).toBe(true);
  });

  test("popup element has default styles applied", () => {
    expect(popupEl.style.position).toBe("fixed");
    expect(popupEl.style.top).toBe("50%");
    expect(popupEl.style.left).toBe("50%");
    expect(popupEl.style.transform).toBe("translate(-50%, -50%)");
    expect(popupEl.style.zIndex).toBe("99999");
    expect(popupEl.style.background).toBe("#fff");
    expect(popupEl.style.border).toBe("1px solid #ccc");
    expect(popupEl.style.borderRadius).toBe("5px");
    expect(popupEl.style.boxShadow).toBe("0 0 10px rgba(0, 0, 0, 0.2)");
    expect(popupEl.style.minWidth).toBe("200px");
    expect(popupEl.style.padding).toBe("10px");
  });

  test("header, body, and footer are created and appended", () => {
    const children = Array.from(popupEl.children);
    expect(children.length).toBe(3);
    expect(children[0].tagName).toBe("HEADER");
    expect(children[1].tagName).toBe("MAIN");
    expect(children[2].tagName).toBe("FOOTER");
  });

  test("initial title is rendered as <h3> in header", () => {
    const headerEl = popupEl.querySelector("header");
    const h3 = headerEl.querySelector("h3");
    expect(h3).not.toBeNull();
    expect(h3.textContent).toBe("MyTitle");
  });

  test("a Close button is appended to footer with correct text", () => {
    const footerEl = popupEl.querySelector("footer");
    const closeBtn = footerEl.querySelector("button");
    expect(closeBtn).not.toBeNull();
    expect(closeBtn.textContent).toBe("Close");
  });

  test("clicking the Close button removes the popup element", () => {
    const footerEl = popupEl.querySelector("footer");
    const closeBtn = footerEl.querySelector("button");
    closeBtn.click();
    // After click, the shadow-content element should be removed
    expect(host.shadowRoot.querySelector("#shadow-content")).toBeNull();
  });

  test("setStyles overrides existing popup styles", () => {
    popup.setStyles({ background: "yellow", top: "10px" });
    expect(popupEl.style.background).toBe("yellow");
    expect(popupEl.style.top).toBe("10px");
  });

  test("mergeStyles merges new styles with existing ones", () => {
    popup.setStyles({ color: "black" });
    popup.mergeStyles({ color: "white", left: "20px" });
    expect(popupEl.style.color).toBe("white");
    expect(popupEl.style.left).toBe("20px");
  });

  test("setTitle appends a new <h3> to the header", () => {
    popup.setTitle("Another");
    const headerEl = popupEl.querySelector("header");
    const headings = Array.from(headerEl.querySelectorAll("h3"));
    expect(headings.map((h) => h.textContent)).toContain("Another");
  });

  test("setBody appends an element to the body section", () => {
    const bodyEl = popupEl.querySelector("main");
    const item = document.createElement("div");
    item.id = "test-body";
    popup.setBody(item);
    expect(bodyEl.querySelector("#test-body")).toBe(item);
  });

  test("setFooter appends an element to the footer section", () => {
    const footerEl = popupEl.querySelector("footer");
    const item = document.createElement("span");
    item.id = "test-footer";
    popup.setFooter(item);
    expect(footerEl.querySelector("#test-footer")).toBe(item);
  });

  test("close() removes the popup element even when called directly", () => {
    // Re-create since previous close may have removed it
    document.body.innerHTML = "";
    popup = new SimplePopup();
    host = document.getElementById("popup-host");
    popupEl = host.shadowRoot.querySelector("#shadow-content");

    expect(host.shadowRoot.contains(popupEl)).toBe(true);
    popup.close();
    expect(host.shadowRoot.contains(popupEl)).toBe(false);
  });
});
