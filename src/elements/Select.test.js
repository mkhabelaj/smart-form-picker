// Select.test.js
//
// Run these tests with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import Select from "./Select.js";

describe("Select", () => {
  let select;
  let el;

  beforeEach(() => {
    select = new Select();
    el = select.get();
  });

  test("default constructor creates an empty <select>", () => {
    expect(el.tagName).toBe("SELECT");
    expect(el.children.length).toBe(0);
  });

  test("constructor with placeholder adds a disabled, selected option", () => {
    const placeholderText = "Choose one";
    const s = new Select([], null, placeholderText);
    const opt = s.get().children[0];
    expect(opt.tagName).toBe("OPTION");
    expect(opt.textContent).toBe(placeholderText);
    expect(opt.disabled).toBe(true);
    expect(opt.selected).toBe(true);
  });

  test("constructor with options array of strings", () => {
    const s = new Select(["Apple", "Banana"]);
    const opts = Array.from(s.get().children);
    expect(opts.map((o) => o.textContent)).toEqual(["Apple", "Banana"]);
    expect(opts.map((o) => o.value)).toEqual(["Apple", "Banana"]);
  });

  test("constructor with options array of objects ({name,value} and {text,value})", () => {
    const items = [
      { name: "One", value: "1" },
      { text: "Two", value: "2" },
    ];
    const s = new Select(items);
    const opts = Array.from(s.get().children);
    expect(opts[0].textContent).toBe("One");
    expect(opts[0].value).toBe("1");
    expect(opts[1].textContent).toBe("Two");
    expect(opts[1].value).toBe("2");
  });

  test("setName sets the select's name attribute", () => {
    select.setName("mySelect");
    expect(el.getAttribute("name")).toBe("mySelect");
  });

  test("setStyles applies multiple inline styles", () => {
    select.setStyles({ border: "1px solid red", padding: "4px" });
    expect(el.style.border).toBe("1px solid red");
    expect(el.style.padding).toBe("4px");
  });

  test("setStyle applies a single inline style", () => {
    select.setStyle("marginTop", "10px");
    expect(el.style.marginTop).toBe("10px");
  });

  describe("addOption", () => {
    test("adds a string option", () => {
      select.addOption("Option1");
      const opt = el.children[0];
      expect(opt.textContent).toBe("Option1");
      expect(opt.value).toBe("Option1");
    });

    test("adds via name and value parameters", () => {
      select.addOption("Display", "underlying");
      const opt = el.children[0];
      expect(opt.textContent).toBe("Display");
      expect(opt.value).toBe("underlying");
    });

    test("adds option object with text and value", () => {
      select.addOption({ text: "Txt", value: "Val" });
      const opt = el.children[0];
      expect(opt.textContent).toBe("Txt");
      expect(opt.value).toBe("Val");
    });
  });

  describe("removeOption", () => {
    test("removes an existing option by value", () => {
      const s = new Select(["A", "B", "C"]);
      expect(s.get().children.length).toBe(3);
      s.removeOption("B");
      const values = Array.from(s.get().children).map((o) => o.value);
      expect(values).toEqual(["A", "C"]);
    });

    test("does nothing if value not found", () => {
      const s = new Select(["X"]);
      expect(() => s.removeOption("Y")).not.toThrow();
      expect(s.get().children.length).toBe(1);
    });
  });

  test("clearOptions removes all options", () => {
    const s = new Select(["One", "Two"]);
    expect(s.get().children.length).toBe(2);
    s.clearOptions();
    expect(s.get().children.length).toBe(0);
  });

  test("setOnChange attaches change handler", () => {
    let changed = false;
    select.setOnChange(() => {
      changed = true;
    });
    // simulate a change event
    el.dispatchEvent(new Event("change"));
    expect(changed).toBe(true);
  });

  test("getValue returns the currently selected option's value", () => {
    const s = new Select(["first", "second"]);
    // by default, the first option is selected
    expect(s.getValue()).toBe("first");
    // simulate selecting the second
    s.get().value = "second";
    expect(s.getValue()).toBe("second");
  });

  test("setValue sets the select's value attribute", () => {
    select.setValue("foo");
    expect(el.getAttribute("value")).toBe("foo");
  });

  test("get() returns the underlying <select> element", () => {
    const first = select.get();
    const second = select.get();
    expect(first).toBeInstanceOf(HTMLSelectElement);
    expect(second).toBe(first);
  });
});
