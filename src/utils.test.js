// utils.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import {
  getGeneratedJsPDF,
  injectBlobToFile,
  getInputLabelContent,
  makeDraggable,
} from "./utils.js";

describe("PDF Helpers", () => {
  test("getGeneratedJsPDF returns a jsPDF instance with one page and embeds text", () => {
    const template = "Hello, Bun!";
    const doc = getGeneratedJsPDF(template);

    // Should only generate one page for short text
    expect(doc.getNumberOfPages()).toBe(1);

    // The output data URI should start with the PDF base64 prefix
    const dataUri = doc.output("datauristring");
    // data:application/pdf;filename=generated.pdf;base64
    expect(dataUri).toMatch(
      /^data:application\/pdf;filename=generated.pdf;base64/,
    );
  });

  // TODO: Add tests for createPDF
  // describe("createPDF", () => {
  //   test("returns a jsPDF instance and calls save with `${filename}.pdf`", () => {});
  // });
});

describe("injectBlobToFile", () => {
  let input;

  beforeEach(() => {
    document.body.innerHTML = "";
    input = document.createElement("input");
    input.type = "file";
    document.body.appendChild(input);
  });

  test("throws if target is not a file input", () => {
    const div = document.createElement("div");
    expect(() => injectBlobToFile(new Blob(), div, "file.txt")).toThrow(
      "Target element is not a file input.",
    );
  });

  test("injects a Blob into file input and dispatches change event", () => {
    const blob = new Blob(["Hello"], { type: "text/plain" });
    let changed = false;
    input.addEventListener("change", () => {
      changed = true;
    });

    injectBlobToFile(blob, input, "hello.txt");

    // Verify FileList
    const files = input.files;
    expect(files.length).toBe(1);
    const file = files[0];
    expect(file.name).toBe("hello.txt");
    expect(file.type).toBe("text/plain");
    expect(changed).toBe(true);
  });
});

describe("getInputLabelContent", () => {
  beforeEach(() => {
    document.body.innerHTML = "";
  });

  test("returns label text when an associated <label> exists", () => {
    document.body.innerHTML = `
      <label for="input1">My Label</label>
      <input id="input1" />
    `;
    const input = document.getElementById("input1");
    expect(getInputLabelContent(input)).toBe("My Label");
  });

  test("returns name when no label is present", () => {
    const input = document.createElement("input");
    input.name = "username";
    document.body.appendChild(input);
    expect(getInputLabelContent(input)).toBe("username");
  });

  test("returns placeholder when no label or name is present", () => {
    const input = document.createElement("input");
    input.placeholder = "Enter text";
    document.body.appendChild(input);
    expect(getInputLabelContent(input)).toBe("Enter text");
  });

  test("returns id when no label, name, or placeholder is present", () => {
    const input = document.createElement("input");
    input.id = "some-id";
    document.body.appendChild(input);
    expect(getInputLabelContent(input)).toBe("some-id");
  });

  test("returns name over id when both are present", () => {
    const input = document.createElement("input");
    input.id = "some-id";
    input.name = "user";
    document.body.appendChild(input);
    expect(getInputLabelContent(input)).toBe("user");
  });

  test("returns empty string when no label, name, placeholder, or id is present", () => {
    const input = document.createElement("input");
    document.body.appendChild(input);
    expect(getInputLabelContent(input)).toBe("");
  });
});
describe("makeDraggable", () => {
  let container, handle;

  beforeEach(() => {
    // Reset DOM
    document.body.innerHTML = "";

    // Create container and handle
    container = document.createElement("div");
    handle = document.createElement("div");

    // Position container absolutely with initial left/top
    container.style.position = "absolute";
    container.style.left = "100px";
    container.style.top = "200px";

    document.body.append(container, handle);

    // Make it draggable
    makeDraggable(container, handle);
  });

  test("does not move container on mousemove before mousedown", () => {
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 120, clientY: 220 }),
    );
    expect(container.style.left).toBe("100px");
    expect(container.style.top).toBe("200px");
  });

  test("moves container on mousemove after mousedown", () => {
    // Start dragging at (100,200)
    handle.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 100, clientY: 200 }),
    );
    // Move to (110,215)
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 110, clientY: 215 }),
    );

    // Expect left = 100 + (110-100) = 110
    // Expect top  = 200 + (215-200) = 215
    expect(container.style.left).toBe("110px");
    expect(container.style.top).toBe("215px");
  });

  test("stops moving container after mouseup", () => {
    // Start dragging at (50,50)
    handle.dispatchEvent(
      new MouseEvent("mousedown", { clientX: 50, clientY: 50 }),
    );
    // Move to (70,80)
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 70, clientY: 80 }),
    );
    // End dragging
    document.dispatchEvent(
      new MouseEvent("mouseup", { clientX: 70, clientY: 80 }),
    );
    // Attempt another move to (90,100)
    document.dispatchEvent(
      new MouseEvent("mousemove", { clientX: 90, clientY: 100 }),
    );

    // After first move: left = 100 + (70-50) = 120, top = 200 + (80-50) = 230
    expect(container.style.left).toBe("120px");
    expect(container.style.top).toBe("230px");

    // It should not move further after mouseup
    expect(container.style.left).toBe("120px");
    expect(container.style.top).toBe("230px");
  });
});
