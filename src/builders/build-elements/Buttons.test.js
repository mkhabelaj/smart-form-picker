// ModalButtonBuilder.test.js
//
// Run with Bun’s DOM support enabled:
//   bun test --dom

import { describe, test, expect } from "bun:test";
import { ModalButtonBuilder } from "./Buttons";

const builder = ModalButtonBuilder.build;
const { buttonSize } = ModalButtonBuilder;

describe("ModalButtonBuilder", () => {
  const cases = [
    {
      method: "buildDangerButton",
      defaultText: "Danger",
      styles: {
        color: "#fff",
        "background-color": "#a71d2a",
        "border-color": "#a71d2a",
      },
    },
    {
      method: "buildPrimaryButton",
      defaultText: "Primary",
      styles: {
        color: "#fff",
        "background-color": "#007bff",
        "border-color": "#007bff",
      },
    },
    {
      method: "buildSecondaryButton",
      defaultText: "Secondary",
      styles: {
        color: "#fff",
        "background-color": "#6c757d",
        "border-color": "#6c757d",
      },
    },
    {
      method: "buildSuccessButton",
      defaultText: "Success",
      styles: {
        color: "#fff",
        "background-color": "#28a745",
        "border-color": "#28a745",
      },
    },
    {
      method: "buildWarningButton",
      defaultText: "Warning",
      styles: {
        color: "#212529",
        "background-color": "#ffc107",
        "border-color": "#ffc107",
      },
    },
    {
      method: "buildInfoButton",
      defaultText: "Info",
      styles: {
        color: "#fff",
        "background-color": "#17a2b8",
        "border-color": "#17a2b8",
      },
    },
    {
      method: "buildLightButton",
      defaultText: "Light",
      styles: {
        color: "#212529",
        "background-color": "#f8f9fa",
        "border-color": "#f8f9fa",
      },
    },
    {
      method: "buildDarkButton",
      defaultText: "Dark",
      styles: {
        color: "#fff",
        "background-color": "#343a40",
        "border-color": "#343a40",
      },
    },
  ];

  for (const { method, defaultText, styles } of cases) {
    test(`${method} creates a <button> with correct text and styles`, () => {
      const btn = builder[method]();
      expect(btn.tagName).toBe("BUTTON");
      expect(btn.textContent).toBe(defaultText);
      // Builder-specific styles
      for (const [prop, expected] of Object.entries(styles)) {
        expect(btn.style[prop]).toBe(expected);
      }
      // Core button styles from the generic builder
      // expect(btn.style.borderRadius).toBe("4px");
      // expect(btn.style.borderStyle).toBe("solid");
    });
  }

  test("buildDangerButton attaches click handler", () => {
    let clicked = false;
    const handler = () => {
      clicked = true;
    };
    const btn = builder.buildDangerButton("OK", handler);
    btn.click();
    expect(clicked).toBe(true);
  });

  test("buildPrimaryButton with small size adjusts padding and fontSize", () => {
    const btn = builder.buildPrimaryButton("P", null, buttonSize.small);
    expect(btn.style.padding).toBe("4px 8px");
    expect(btn.style.fontSize).toBe("12px");
  });
});
