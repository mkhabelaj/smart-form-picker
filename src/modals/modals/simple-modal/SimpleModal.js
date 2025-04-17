import Overlay from "../../../Overlay.js";
import ModalHeader from "../../modal-blocks/ModalHeader.js";
import ModalContent from "../../modal-blocks/ModalContent.js";
import ModalFooter from "../../modal-blocks/ModalFooter.js";
import SimpleModalElementBuilder from "../../../builders/SimpleElementBuilder.js";
import GenericElement from "../../../elements/GenericElement.js";
/**
 * Class SimpleModel
 * A composite class that brings together Overlay, ModelHeader, ModelContent, and ModelFooter
 * to create a complete modal dialog encapsulated within a Shadow DOM.
 */
export default class SimpleModal {
  #overlay;
  #header;
  #content;
  #footer;
  #modal;
  #styles;
  #modalContainer;
  constructor(title = "Modal", { styles = {} } = {}) {
    // Create overlay and modal sections.
    this.elementBuilder = SimpleModalElementBuilder;
    this.#overlay = new Overlay();
    this.#header = new ModalHeader();
    this.#content = new ModalContent();
    this.#footer = new ModalFooter();
    // Create the modal host element with Shadow DOM.
    this.#modal = this.#create();

    // Get the modal container inside the Shadow DOM.
    const shadow = this.#modal.shadowRoot;
    this.#modalContainer = shadow.getElementById("data-modal");

    // if styles are provided, set them.
    if (Object.keys(styles).length > 0) {
      this.setStyles(styles);
    } else {
      this.#setDefaultStyles();
    }

    // Append header, content, and footer to the modal container.
    this.#modalContainer.appendChild(this.#header.get());
    this.#modalContainer.appendChild(this.#content.get());
    this.#modalContainer.appendChild(this.#footer.get());

    this.#andCloseButton();
    this.title(title);

    // Append the complete modal host to the overlay.
    this.#overlay.append(this.#modal);
  }

  /**
   * Sets the styles for the modal.
   * @param {Object} styles - An object containing css properties and values.
   */
  setStyles(styles) {
    this.#styles = styles;
    for (const [key, value] of Object.entries(styles)) {
      this.#modalContainer.style.setProperty(key, value);
    }
  }

  /**
   * Merges styles into the existing styles of the modal.
   * @param {Object} styles - An object containing css properties and values.
   */
  mergeStyles(styles) {
    const mergedStyles = { ...this.#styles, ...styles };
    this.setStyles(mergedStyles);
  }

  /**
   * Sets the title of the modal.
   * @param {string} title - The title to set.
   */
  title(title) {
    const h2 = new GenericElement("h2", {
      content: title,
    });
    this.#header.append(h2.get());
  }
  /**
   * Closes the modal by removing the overlay from the DOM.
   * @returns {void}
   */
  close() {
    this.#overlay.remove();
  }
  /**
   * Appends a header item to the modal.
   * @param {HTMLElement} item - The element to append.
   */
  appendHeader(item) {
    this.#header.append(item);
  }
  /**
   * Appends a content item to the modal.
   * @param {HTMLElement} item - The element to append.
   */
  appendContent(item) {
    this.#content.append(item);
  }
  /**
   * Clears existing content and appends new content.
   * @param {HTMLElement} item - The element to render.
   */
  renderContent(item) {
    this.#content.render(item);
  }
  /**
   * Appends a footer item to the modal.
   * @param {HTMLElement} item - The element to append.
   */
  appendFooter(item) {
    this.#footer.append(item);
  }

  #setDefaultStyles() {
    this.#styles = {
      background: "#fff",
      padding: "20px",
      borderRadius: "5px",
      minWidth: "300px",
      maxWidth: "500px",
      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.3)",
      fontFamily: "Arial, sans-serif",
    };
    this.setStyles(this.#styles);
  }

  /**
   * Creates the modal host element, attaches a Shadow DOM, injects styling,
   * and returns the host element.
   * @returns {HTMLElement} The modal host element with an attached shadow root.
   */
  #create() {
    const modalHost = document.createElement("div");
    modalHost.id = "data-modal-host";

    // Attach a shadow root.
    const shadow = modalHost.attachShadow({ mode: "open" });

    // Create the actual modal container.
    const modalContainer = document.createElement("div");
    modalContainer.id = "data-modal";

    shadow.appendChild(modalContainer);

    return modalHost;
  }

  #andCloseButton() {
    const self = this;
    const closeButton = this.elementBuilder.buttons.build.buildDangerButton(
      "Close",
      function handler() {
        self.close();
        document.removeEventListener("click", handler);
      },
    );
    this.#footer.append(closeButton);
  }

  /**
   * Returns the overlay element that contains the modal.
   * @returns {HTMLElement} The overlay element.
   */
  getOverlay() {
    return this.#overlay.get();
  }

  /**
   * Returns the modal container element from inside the Shadow DOM.
   * @returns {HTMLElement} The modal container element.
   */
  getModal() {
    return this.#modal.shadowRoot.getElementById("data-modal");
  }

  /**
   * Appends an additional item to the modal container.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.getModal().append(item);
  }
}
