import { Button, buttonSize } from "../../elements/Button.js";

const ButtonBuilder = {
  /**
   * Creates a button with the specified name, size, and type.
   *
   * @param {string} name - The name (text label) of the button.
   * @param {Function} [onClick] - Optional click event handler for the button.
   * @param {Object} [options] - Configuration options for the button.
   * @param {"small" | "medium" | "large"} [options.size="medium"] - The size of the button.
   * @param {"primary" | "secondary" | "danger"} [options.type="primary"] - The type/style of the button.
   * @returns {HTMLElement} The created button element.
   */
  getButton: (
    name = "Ok",
    onClick = null,
    { size = "medium", type = "primary" } = {},
  ) => {
    const button = new Button(name, null, {
      "border-radius": "4px",
      "border-style": "solid",
    });
    button.setButtonSize(size);
    if (onClick) button.setOnClick(onClick);

    switch (type) {
      case "primary":
        button.mergeStyles({
          color: "#fff",
          "background-color": "#007bff", // Bootstrap primary color
          "border-color": "#007bff",
        });
        break;
      case "secondary":
        button.mergeStyles({
          color: "#fff",
          "background-color": "#6c757d", // Bootstrap secondary color
          "border-color": "#6c757d",
        });
        break;
      case "success":
        button.mergeStyles({
          color: "#fff",
          "background-color": "#28a745", // Bootstrap success color
          "border-color": "#28a745",
        });
      case "warning":
        button.mergeStyles({
          color: "#212529", // Dark text for better contrast
          "background-color": "#ffc107", // Bootstrap warning color
          "border-color": "#ffc107",
        });
        break;
      case "info":
        button.mergeStyles({
          color: "#fff",
          "background-color": "#17a2b8", // Bootstrap info color
          "border-color": "#17a2b8",
        });
        break;
      case "light":
        button.mergeStyles({
          color: "#212529", // Dark text for legibility on light background
          "background-color": "#f8f9fa", // Bootstrap light color
          "border-color": "#f8f9fa",
        });
        break;
      case "dark":
        button.mergeStyles({
          color: "#fff",
          "background-color": "#343a40", // Bootstrap dark color
          "border-color": "#343a40",
        });
        break;
      default:
        button.mergeStyles({
          color: "#fff",
          "background-color": "#007bff", // Bootstrap primary color
          "border-color": "#007bff",
        });
        break;
    }
    return button.get();
  },
};
/**
 * @deprecated
 * Modal Button Builder
 * @type {Buttons}
 */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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

  /**
   * @deprecated
   * see {@link ButtonBuilder}
   */
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
/**
 * Modal Button Builder
 * @deprecated  Will be removed soon
 * @see ButtonBuilder
 */
const ModalButtonBuilder = {
  build: new Buttons(),
  buttonSize: buttonSize,
};

export { ModalButtonBuilder, ButtonBuilder };
