import { isSignal, createEffect, signal } from "../SimpleSignal.js";

export default class GenericElement {
  #element;

  /**
   * Creates a new generic HTML element, with optional reactive props.
   * @param {string} [tagName="div"] - The HTML tag to create.
   * @param {Object} [options={}] - Configuration or reactive signals.
   * @param {string|signal} [options.content] - Plain text or signal for content.
   * @param {string|signal} [options.html] - HTML string or signal for innerHTML.
   * @param {object|signal} [options.styles] - Style object or signal for inline styles.
   * @param {object} [options.events] - Event handlers map.
   * @param {object|signal} [options.attributes] - Attribute map or signal.
   * @param {Array<GenericElement|HTMLElement>} [options.children] - Initial children.
   */
  constructor(
    tagName = "div",
    {
      content = "",
      html = "",
      styles = {},
      events = {},
      attributes = {},
      children = [],
    } = {},
  ) {
    this.#element = document.createElement(tagName);

    // Reactive HTML takes precedence over content
    if (isSignal(html)) {
      createEffect(() => this.setHTML(html.get()));
    } else if (html) {
      this.setHTML(html);
    } else {
      // Only apply content if no html provided
      if (isSignal(content)) {
        createEffect(() => this.setContent(content.get()));
      } else if (content) {
        this.setContent(content);
      }
    }

    // Reactive styles
    if (isSignal(styles)) {
      createEffect(() => this.setStyles(styles.get()));
    } else {
      this.setStyles(styles);
    }

    // Reactive attributes
    if (isSignal(attributes)) {
      createEffect(() => this.setAttributes(attributes.get()));
    } else {
      this.setAttributes(attributes);
    }

    // Attach static event listeners
    Object.entries(events).forEach(([event, handler]) => {
      this.addEventListener(event, handler);
    });

    // Append initial children
    children.forEach((child) => this.appendChild(child));
  }

  /**
   * Sets multiple HTML attributes.
   * @param {object} attrs
   */
  setAttributes(attrs) {
    Object.entries(attrs).forEach(([key, value]) => {
      this.#element.setAttribute(key, value);
    });
  }

  /**
   * Sets plain text content.
   * @param {string} text
   */
  setContent(text) {
    this.#element.textContent = text;
  }

  /**
   * Sets inner HTML.
   * @param {string} htmlString
   */
  setHTML(htmlString) {
    this.#element.innerHTML = htmlString;
  }

  /**
   * Applies multiple inline styles.
   * @param {object} stylesObj
   */
  setStyles(stylesObj) {
    Object.entries(stylesObj).forEach(([prop, val]) => {
      this.#element.style[prop] = val;
    });
  }

  /**
   * Sets a single inline style.
   * @param {string} property
   * @param {string} value
   */
  setStyle(property, value) {
    this.#element.style[property] = value;
  }

  /**
   * Attaches an event listener.
   * @param {string} event
   * @param {Function} handler
   */
  addEventListener(event, handler) {
    this.#element.addEventListener(event, handler);
  }

  /**
   * Appends a child element.
   * @param {GenericElement|HTMLElement} child
   */
  appendChild(child) {
    if (child instanceof GenericElement) {
      this.#element.appendChild(child.get());
    } else if (child instanceof HTMLElement) {
      this.#element.appendChild(child);
    } else {
      console.warn("Invalid child. Must be GenericElement or HTMLElement.");
    }
  }

  /**
   * Appends this element to a parent.
   * @param {GenericElement|HTMLElement} parent
   */
  appendTo(parent) {
    if (parent instanceof GenericElement) {
      parent.get().appendChild(this.#element);
    } else if (parent instanceof HTMLElement) {
      parent.appendChild(this.#element);
    } else {
      console.warn("Invalid parent. Must be GenericElement or HTMLElement.");
    }
  }

  /**
   * Returns the underlying DOM element.
   * @returns {HTMLElement}
   */
  get() {
    return this.#element;
  }
}
