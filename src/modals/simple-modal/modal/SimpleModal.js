import Overlay from "../../../Overlay.js";
import ModalHeader from "../../../modal-blocks/ModalHeader.js";
import ModalContent from "../../../modal-blocks/ModalContent.js";
import ModalFooter from "../../../modal-blocks/ModalFooter.js";
import SimpleModalElementBuilder from "../SimpleModalElementBuilder.js";
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
  constructor(title = "Modal") {
    // Create overlay and modal sections.
    this.elementBuilder = new SimpleModalElementBuilder();
    this.#overlay = new Overlay();
    this.#header = new ModalHeader();
    this.#content = new ModalContent();
    this.#footer = new ModalFooter();
    // Create the modal host element with Shadow DOM.
    this.#modal = this.#create();

    // Get the modal container inside the Shadow DOM.
    const shadow = this.#modal.shadowRoot;
    const modalContainer = shadow.getElementById("data-modal");

    // Append header, content, and footer to the modal container.
    modalContainer.appendChild(this.#header.get());
    modalContainer.appendChild(this.#content.get());
    modalContainer.appendChild(this.#footer.get());

    this.#andCloseButton();
    this.title(title);

    // Append the complete modal host to the overlay.
    this.#overlay.append(this.#modal);
  }

  title(title) {
    const h2 = document.createElement("h2");
    h2.textContent = title;
    this.#header.append(h2);
  }
  close() {
    this.#overlay.remove();
  }
  appendHeader(item) {
    this.#header.append(item);
  }
  appendContent(item) {
    this.#content.append(item);
  }
  renderContent(item) {
    this.#content.render(item);
  }
  appendFooter(item) {
    this.#footer.append(item);
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

    // Create a style element for the modal encapsulated within Shadow DOM.
    const style = document.createElement("style");
    style.textContent = `
      #data-modal {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
      }
      /* Styling for header, content, and footer could be added here if needed */
    `;
    shadow.appendChild(style);
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
