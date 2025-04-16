import GenericElement from "../../elements/GenericElement.js";
export const InputBuilder = {
  /**
   * Creates a new Input element.
   * defaults attributes.styles.type = "text"
   * param {object} options - An object containing the following optional properties:
   *  options.styles - An object of inline styles to apply to the input element.
   *  options.attributes - An object of attributes to set on the input element.
   *  options.events - An object of event listeners to attach to the input element.
   * returns {HTMLElement} The input element.
   */
  build: ({ styles = {}, attributes = {}, events = {} } = {}) => {
    const input = new GenericElement("input", {
      attributes: {
        type: "text",
        ...attributes,
      },
      styles: {
        border: "1px solid #ccc",
        padding: "5px",
        fontSize: "16px",
        ...styles,
      },
      events,
    });

    return input.get();
  },
};
