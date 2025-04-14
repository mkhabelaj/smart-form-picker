export default class GenericElement {
  #element;

  /**
   * Creates a new generic HTML element.
   *
   * @param {string} tagName - The HTML tag to create (default is "div").
   * @param {object} options - Optional configuration settings.
   *   options.content: String for plain text content.
   *   options.html: String for inner HTML (overrides plain text if provided).
   *   options.styles: An object of inline CSS styles.
   *   options.events: An object where keys are event names and values are event handlers.
   */
  constructor(
    tagName = "div",
    { content = "", html = "", styles = {}, events = {} } = {},
  ) {
    this.#element = document.createElement(tagName);

    // Set content if provided. Prefer html over plain text if both exist.
    if (html) {
      this.setHTML(html);
    } else if (content) {
      this.setContent(content);
    }

    // Apply provided inline styles.
    this.setStyles(styles);

    // Attach event listeners provided in the events object.
    Object.entries(events).forEach(([event, handler]) => {
      this.addEventListener(event, handler);
    });
  }

  /**
   * Sets plain text content of the element.
   *
   * @param {string} text - The text content for the element.
   */
  setContent(text) {
    this.#element.textContent = text;
  }

  /**
   * Sets the inner HTML of the element.
   *
   * @param {string} htmlContent - The HTML content to set.
   */
  setHTML(htmlContent) {
    this.#element.innerHTML = htmlContent;
  }

  /**
   * Applies multiple inline styles.
   *
   * @param {object} stylesObj - An object where keys are CSS property names and values are CSS values.
   */
  setStyles(stylesObj) {
    for (const [key, value] of Object.entries(stylesObj)) {
      this.#element.style[key] = value;
    }
  }

  /**
   * Sets a single inline style.
   *
   * @param {string} property - The CSS property name.
   * @param {string} value - The CSS value.
   */
  setStyle(property, value) {
    this.#element.style[property] = value;
  }

  /**
   * Attaches an event listener to the element.
   *
   * @param {string} event - The event type (e.g., "click").
   * @param {Function} handler - The function to call when the event occurs.
   */
  addEventListener(event, handler) {
    this.#element.addEventListener(event, handler);
  }

  /**
   * Appends a child to the element.
   *
   * @param {(GenericElement|HTMLElement)} child - The child element. It can be either another GenericElement instance or an existing DOM HTMLElement.
   */
  appendChild(child) {
    if (child instanceof GenericElement) {
      this.#element.appendChild(child.get());
    } else if (child instanceof HTMLElement) {
      this.#element.appendChild(child);
    } else {
      console.warn(
        "Invalid child element provided. It must be an instance of GenericElement or HTMLElement.",
      );
    }
  }

  /**
   * Appends the element to a parent element in the DOM.
   *
   * @param {(GenericElement|HTMLElement)} parent - The parent element.
   */
  appendTo(parent) {
    if (parent instanceof GenericElement) {
      parent.get().appendChild(this.#element);
    } else if (parent instanceof HTMLElement) {
      parent.appendChild(this.#element);
    } else {
      console.warn(
        "Invalid parent element provided. It must be an instance of GenericElement or HTMLElement.",
      );
    }
  }

  /**
   * Returns the underlying DOM element.
   *
   * @returns {HTMLElement} The wrapped HTML element.
   */
  get() {
    return this.#element;
  }
}
