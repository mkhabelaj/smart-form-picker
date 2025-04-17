// SimpleModal.test.js
//
// Run these tests with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import SimpleModal from "./SimpleModal.js"; // adjust path if needed

describe("SimpleModal", () => {
  let modal;
  let overlayEl;
  let modalContainer;

  beforeEach(() => {
    modal = new SimpleModal("Test Title");
    overlayEl = modal.getOverlay();
    modalContainer = modal.getModal();
  });

  test("getOverlay returns an HTMLElement containing the modal host", () => {
    expect(overlayEl).toBeInstanceOf(HTMLElement);
    expect(overlayEl.querySelector("#data-modal-host")).not.toBeNull();
  });

  test("getModal returns the '#data-modal' container", () => {
    expect(modalContainer).toBeInstanceOf(HTMLElement);
    expect(modalContainer.id).toBe("data-modal");
  });

  test("default styles are applied to the modal container", () => {
    expect(modalContainer.style.background).toBe("#fff");
    expect(modalContainer.style.padding).toBe("20px");
    expect(modalContainer.style.borderRadius).toBe("5px");
    expect(modalContainer.style.minWidth).toBe("300px");
    expect(modalContainer.style.maxWidth).toBe("500px");
    expect(modalContainer.style.boxShadow).toBe("0 2px 8px rgba(0, 0, 0, 0.3)");
    expect(modalContainer.style.fontFamily).toBe("Arial, sans-serif");
  });

  test("constructor appends header, content, and footer to modal container", () => {
    const children = modalContainer.children;
    expect(children.length).toBeGreaterThanOrEqual(3);
    expect(children[0].tagName).toBe("HEADER");
    expect(children[1].tagName).toBe("MAIN");
    expect(children[2].tagName).toBe("FOOTER");
  });

  test("title() appends an <h2> with the given text to the header", () => {
    const headerEl = modalContainer.querySelector("header");
    const h2 = headerEl.querySelector("h2");
    expect(h2).not.toBeNull();
    expect(h2.textContent).toBe("Test Title");
  });

  test("appendHeader adds an item to the header", () => {
    const headerEl = modalContainer.querySelector("header");
    const extra = document.createElement("span");
    extra.textContent = "Extra";
    modal.appendHeader(extra);
    expect(headerEl.lastChild).toBe(extra);
  });

  test("appendContent adds an item to the content area", () => {
    const contentEl = modalContainer.querySelector("main");
    const item = document.createElement("div");
    item.id = "content-item";
    modal.appendContent(item);
    expect(contentEl.querySelector("#content-item")).toBe(item);
  });

  test("renderContent replaces existing content", () => {
    const contentEl = modalContainer.querySelector("main");
    contentEl.appendChild(document.createElement("p"));
    expect(contentEl.children.length).toBe(1);

    const newItem = document.createElement("section");
    newItem.id = "rendered";
    modal.renderContent(newItem);

    expect(contentEl.children.length).toBe(1);
    expect(contentEl.firstChild).toBe(newItem);
  });

  test("appendFooter adds an item to the footer", () => {
    const footerEl = modalContainer.querySelector("footer");
    const initialCount = footerEl.children.length;
    const btn = document.createElement("button");
    modal.appendFooter(btn);
    expect(footerEl.children.length).toBe(initialCount + 1);
    expect(footerEl.lastChild).toBe(btn);
  });

  test("setStyles overrides modal container styles", () => {
    modal.setStyles({ color: "red", margin: "10px" });
    expect(modalContainer.style.color).toBe("red");
    expect(modalContainer.style.margin).toBe("10px");
  });

  test("mergeStyles merges with existing styles", () => {
    modal.setStyles({ padding: "30px" });
    modal.mergeStyles({ margin: "20px" });
    expect(modalContainer.style.padding).toBe("30px");
    expect(modalContainer.style.margin).toBe("20px");
  });

  test("close() does not throw", () => {
    expect(() => modal.close()).not.toThrow();
  });
});
