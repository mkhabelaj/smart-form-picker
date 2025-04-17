import GenericElement from "./GenericElement.js";
export default class Select {
  #select;

  /**
   * Creates a new Select element.
   *
   * @param {Array} options - An array of options. Each option can be:
   *   - A string (applied as both name and value),
   *   - An object with { name, value } or { text, value } properties,
   *   - Or added later using the two-argument version of addOption.
   * @param {Function|null} onChange - Optional callback function for the change event.
   * @param {string|null} placeholder - Optional placeholder text to display as the first disabled option.
   * @param {object} styles - Optional object of inline styles (e.g., { border: "1px solid #ccc", padding: "5px" }).
   */
  constructor(options = [], onChange = null, placeholder = null, styles = {}) {
    this.#select = new GenericElement("select");

    // If a placeholder is provided, add it as a disabled, selected option.
    if (placeholder) {
      const placeholderOption = new GenericElement("option", {
        content: placeholder,
        attributes: { disabled: true, selected: true },
      });
      this.#select.appendChild(placeholderOption);
    }

    // Add provided options to the select.
    options.forEach((option) => {
      this.addOption(option);
    });

    // Attach the onChange event, if provided.
    if (onChange) {
      this.setOnChange(onChange);
    }

    // Apply any provided inline styles.
    this.setStyles(styles);
  }

  /**
   * Sets the name attribute of the select element.
   * @param {string} name
   */
  setName(name) {
    this.#select.setAttributes({ name: name });
  }

  /**
   * Applies multiple inline styles to the select element.
   * @param {object} styles - An object containing CSS property names and values.
   */
  setStyles(styles) {
    this.#select.setStyles(styles);
  }

  /**
   * Sets an individual inline style on the select element.
   * @param {string} property - The CSS property name.
   * @param {string} value - The value to assign.
   */
  setStyle(property, value) {
    this.#select.setStyle(property, value);
  }

  /**
   * Adds an option to the select element.
   *
   * Supports multiple signatures:
   * - addOption(option)
   *      option: a string or an object with properties:
   *         - If object: can be { name, value } or { text, value }.
   * - addOption(name, value)
   *      name: text to display.
   *      value: underlying option value.
   *
   * @param {(string|object)} option - A string or an object with option details.
   * @param {string} [value] - An optional value if a separate name parameter is used.
   */
  addOption(option, value) {
    // let opt = document.createElement("option");
    let opt = new GenericElement("option");
    // If two parameters are provided, treat the first as display text and the second as its value.
    if (value !== undefined) {
      opt.setContent(option);
      opt.setAttributes({ value: value });
    } else if (typeof option === "object" && option !== null) {
      // Check for a name or text property in the object.
      opt.setContent(option.name || option.text || option.value);
      opt.setAttributes({ value: option.value });
    } else if (typeof option === "string") {
      // If only a string is provided, use it as both text and value.
      opt.setContent(option);
      opt.setAttributes({ value: option });
    }

    this.#select.appendChild(opt);
  }

  /**
   * Removes an option from the select element by its value.
   * @param {string} value - The value of the option to remove.
   */
  removeOption(value) {
    const options = this.#select.get().options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value === value) {
        this.#select.remove(i);
        break;
      }
    }
  }

  /**
   * Clears all options from the select element.
   */
  clearOptions() {
    this.#select.setHTML("");
  }

  /**
   * Sets an onChange event handler for the select element.
   * @param {Function} handler - The function to run when the select's value changes.
   */
  setOnChange(handler) {
    this.#select.addEventListener("change", handler);
  }

  /**
   * Gets the current selected value.
   * @returns {string} The value of the selected option.
   */
  getValue() {
    return this.#select.get().value;
  }

  /**
   * Sets the current selected value.
   * @param {string} value - The value to select.
   */
  setValue(value) {
    this.#select.setAttributes({ value: value });
  }

  /**
   * Returns the underlying DOM select element.
   * @returns {HTMLElement} The select element.
   */
  get() {
    return this.#select.get();
  }
}
