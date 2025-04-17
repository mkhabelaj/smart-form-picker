// ModalHeader.test.js
//
// Run these tests with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import ModalHeader from "./ModalHeader.js";
import GenericElement from "../../elements/GenericElement.js";

describe("ModalHeader", () => {
  let header;
  let el;

  beforeEach(() => {
    header = new ModalHeader();
    el = header.get();
  });

  test("constructor creates a <header> with correct styles", () => {
    expect(el.tagName).toBe("HEADER");
    expect(el.style.display).toBe("flex");
    expect(el.style.gap).toBe("2px");
    expect(el.style.flexDirection).toBe("column");
    expect(el.style.marginBottom).toBe("5px");
    expect(el.style.padding).toBe("1px");
  });

  test("get() returns the same underlying HTMLElement", () => {
    const first = header.get();
    const second = header.get();
    expect(first).toBeInstanceOf(HTMLElement);
    expect(second).toBe(first);
  });

  test("append() adds a raw HTMLElement child", () => {
    const child = document.createElement("div");
    child.textContent = "Raw child";
    header.append(child);

    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(child);
    expect(el.firstChild.textContent).toBe("Raw child");
  });

  test("append() adds a GenericElement child", () => {
    const gen = new GenericElement("span");
    gen.setContent("Wrapped child");
    header.append(gen.get());

    expect(el.children.length).toBe(1);
    expect(el.firstChild).toBe(gen.get());
    expect(el.firstChild.textContent).toBe("Wrapped child");
  });
});
