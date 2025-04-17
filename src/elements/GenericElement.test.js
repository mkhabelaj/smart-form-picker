// GenericElement.test.js
import { describe, test, expect, beforeEach } from "bun:test";
import GenericElement from "./GenericElement.js";

describe("GenericElement", () => {
  let element;

  beforeEach(() => {
    element = new GenericElement();
  });

  test("constructor creates a DIV by default", () => {
    const el = element.get();
    expect(el).toBeInstanceOf(HTMLElement);
    expect(el.tagName).toBe("DIV");
  });

  test("constructor accepts custom tagName", () => {
    const spanEl = new GenericElement("span");
    expect(spanEl.get().tagName).toBe("SPAN");
  });

  test("setContent sets textContent", () => {
    element.setContent("Hello World");
    expect(element.get().textContent).toBe("Hello World");
  });

  test("setHTML sets innerHTML and overrides textContent", () => {
    element.setContent("Plain");
    element.setHTML("<strong>Bold</strong>");
    expect(element.get().innerHTML).toBe("<strong>Bold</strong>");
    expect(element.get().textContent).toBe("Bold");
  });

  test("setStyles applies multiple inline styles", () => {
    element.setStyles({ color: "red", backgroundColor: "blue" });
    const style = element.get().style;
    expect(style.color).toBe("red");
    expect(style.backgroundColor).toBe("blue");
  });

  test("setStyle applies a single inline style", () => {
    element.setStyle("marginTop", "10px");
    expect(element.get().style.marginTop).toBe("10px");
  });

  test("setAttributes sets attributes correctly", () => {
    element.setAttributes({ id: "test-id", "data-role": "widget" });
    expect(element.get().getAttribute("id")).toBe("test-id");
    expect(element.get().getAttribute("data-role")).toBe("widget");
  });

  test("constructor options: content, html, styles, attributes, events", () => {
    let clicked = false;
    const clickHandler = () => {
      clicked = true;
    };

    const optEl = new GenericElement("button", {
      content: "Click me",
      html: "<em>Ignore text</em>",
      styles: { padding: "5px" },
      attributes: { type: "button" },
      events: { click: clickHandler },
    });

    // html should override plain text
    expect(optEl.get().innerHTML).toBe("<em>Ignore text</em>");
    // style
    expect(optEl.get().style.padding).toBe("5px");
    // attribute
    expect(optEl.get().getAttribute("type")).toBe("button");
    // event listener
    optEl.get().click();
    expect(clicked).toBe(true);
  });

  describe("appendChild", () => {
    test("appends GenericElement child", () => {
      const parent = new GenericElement("div");
      const child = new GenericElement("span");
      parent.appendChild(child);
      expect(parent.get().firstChild).toBe(child.get());
    });

    test("appends raw HTMLElement child", () => {
      const parent = new GenericElement("div");
      const raw = document.createElement("p");
      parent.appendChild(raw);
      expect(parent.get().firstChild).toBe(raw);
    });

    test("warns on invalid child", () => {
      let warned = false;
      const origWarn = console.warn;
      console.warn = () => {
        warned = true;
      };

      element.appendChild(123);

      console.warn = origWarn;
      expect(warned).toBe(true);
    });
  });

  describe("appendTo", () => {
    test("appends to GenericElement parent", () => {
      const parent = new GenericElement("section");
      element.appendTo(parent);
      expect(parent.get().firstChild).toBe(element.get());
    });

    test("appends to raw HTMLElement parent", () => {
      const rawParent = document.createElement("article");
      element.appendTo(rawParent);
      expect(rawParent.firstChild).toBe(element.get());
    });

    test("warns on invalid parent", () => {
      let warned = false;
      const origWarn = console.warn;
      console.warn = () => {
        warned = true;
      };

      element.appendTo(null);

      console.warn = origWarn;
      expect(warned).toBe(true);
    });
  });

  test("get() returns the same underlying element instance", () => {
    const first = element.get();
    const second = element.get();
    expect(first).toBeInstanceOf(HTMLElement);
    expect(second).toBe(first);
  });
});
