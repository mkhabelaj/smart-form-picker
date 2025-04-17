import GenericElement from "./GenericElement";

const buttonSize = {
  small: "small",
  medium: "medium",
  large: "large",
};
Object.freeze(buttonSize);
class Button {
  #button;
  #styles = {};

  /**
   * Creates a new Button element.
   *
   * @param {string} text - The text to display on the button.
   * @param {Function|null} onClick - Optional click event handler.
   * @param {object} styles - Optional object containing initial inline CSS styles.
   * @param {string|null} value - Optional value for the button element.
   */
  constructor(text = "Button", onClick = null, styles = {}, value = null) {
    this.#button = new GenericElement("button");

    // Set the button content. If a value is provided, assign it as the button's value.
    this.setContent(text, value);

    // Apply initial styles if provided.
    this.setStyles(styles);

    // Attach a click event listener if the onClick handler is provided.
    if (onClick) {
      this.setOnClick(onClick);
    }
  }

  /**
   * Sets multiple inline styles on the button.
   *
   * @param {object} styles - An object whose keys are CSS properties and values are the CSS values.
   */
  setStyles(styles) {
    this.#styles = styles;
    this.#button.setStyles(styles);
  }

  /**
   * Merges additional inline styles onto the existing styles.
   *
   * @param {object} styles - An object whose keys are CSS properties and values are the CSS values.
   */
  mergeStyles(styles) {
    this.#styles = { ...this.#styles, ...styles };
    this.#button.setStyles(this.#styles);
  }

  /**
   * Sets an individual inline style on the button.
   *
   * @param {string} property - The CSS property name.
   * @param {string} value - The CSS value to assign.
   */
  setStyle(property, value) {
    this.#button.setStyle(property, value);
  }

  /**
   * Sets the content of the button. When called with two parameters,
   * the first parameter is used for the displayed text and the second is set as the button's value attribute.
   *
   * @param {string} text - The text content for the button.
   * @param {string} [value] - Optional value attribute for the button.
   */
  setContent(text, value) {
    this.#button.setContent(text);
    if (value !== undefined && value !== null) {
      this.#button.setAttributes({ value: value });
    }
  }

  /**
   * Sets the border color of the button.
   *
   * @param {string} color - A valid CSS border color.
   */
  setBorderColor(color) {
    this.#button.setStyle("borderColor", color);
  }

  /**
   * Adjusts the button size by applying appropriate padding and font-size.
   * Valid options include: "small", "medium", and "large".
   *
   * @param {string} sizeOption - The button size option.
   */
  setButtonSize(sizeOption) {
    switch (sizeOption) {
      case "small":
        this.mergeStyles({
          padding: "4px 8px",
          fontSize: "12px",
        });
        break;
      case "medium":
        this.mergeStyles({
          padding: "8px 16px",
          fontSize: "16px",
        });
        break;
      case "large":
        this.mergeStyles({
          padding: "12px 24px",
          fontSize: "20px",
        });
        break;
      default:
        console.warn("Invalid size option provided:", sizeOption);
    }
  }

  /**
   * Attaches a click event listener to the button.
   *
   * @param {Function} handler - The function to execute when the button is clicked.
   */
  setOnClick(handler) {
    this.#button.addEventListener("click", handler);
  }

  /**
   * Returns the underlying DOM button element.
   *
   * @returns {HTMLElement} The button element.
   */
  get() {
    return this.#button.get();
  }
}

export { buttonSize, Button };
