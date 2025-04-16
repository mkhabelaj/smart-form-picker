import { Button, buttonSize } from "../../elements/Button.js";
class Buttons {
  /**
   * Builds a generic button
   * @param {string} name
   * @param {Function|null} onClick
   * @param {string} size
   * @returns {Button}
   */
  #buildGenericButton(name = "Ok", onClick = null, size = buttonSize.medium) {
    const button = new Button(name, null, {
      "border-radius": "4px",
      "border-style": "solid",
    });
    button.setButtonSize(size);
    if (onClick) button.setOnClick(onClick);
    return button;
  }

  buildDangerButton(name = "Danger", onClick = null, size = buttonSize.medium) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#a71d2a", // Custom danger color
      "border-color": "#a71d2a",
    });
    return button.get();
  }

  // Primary Button
  buildPrimaryButton(
    name = "Primary",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#007bff", // Bootstrap primary color
      "border-color": "#007bff",
    });
    return button.get();
  }

  // Secondary Button
  buildSecondaryButton(
    name = "Secondary",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#6c757d", // Bootstrap secondary color
      "border-color": "#6c757d",
    });
    return button.get();
  }

  // Success Button
  buildSuccessButton(
    name = "Success",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#28a745", // Bootstrap success color
      "border-color": "#28a745",
    });
    return button.get();
  }

  // Warning Button
  buildWarningButton(
    name = "Warning",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#212529", // Dark text for better contrast
      "background-color": "#ffc107", // Bootstrap warning color
      "border-color": "#ffc107",
    });
    return button.get();
  }

  // Info Button
  buildInfoButton(name = "Info", onClick = null, size = buttonSize.medium) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#17a2b8", // Bootstrap info color
      "border-color": "#17a2b8",
    });
    return button.get();
  }

  // Light Button
  buildLightButton(name = "Light", onClick = null, size = buttonSize.medium) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#212529", // Dark text for legibility on light background
      "background-color": "#f8f9fa", // Bootstrap light color
      "border-color": "#f8f9fa",
    });
    return button.get();
  }

  // Dark Button
  buildDarkButton(name = "Dark", onClick = null, size = buttonSize.medium) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#343a40", // Bootstrap dark color
      "border-color": "#343a40",
    });
    return button.get();
  }
}
const ModalButtonBuilder = {
  build: new Buttons(),
  buttonSize: buttonSize,
};

export { ModalButtonBuilder };
