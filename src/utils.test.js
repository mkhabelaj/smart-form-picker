// utils.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import {
  getGeneratedJsPDF,
  injectBlobToFile,
  getInputLabelContent,
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
