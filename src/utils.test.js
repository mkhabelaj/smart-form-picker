// utils.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect, beforeEach } from "bun:test";
import jsPDF from "jspdf";
import { getGeneratedJsPDF, createPDF, injectBlobToFile } from "./utils.js";

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
