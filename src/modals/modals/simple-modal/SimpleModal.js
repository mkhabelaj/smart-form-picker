import Overlay from "../../../Overlay.js";
import ModalHeader from "../../modal-blocks/ModalHeader.js";
import ModalContent from "../../modal-blocks/ModalContent.js";
import ModalFooter from "../../modal-blocks/ModalFooter.js";
import SimpleModalElementBuilder from "../../../builders/SimpleElementBuilder.js";
import GenericElement from "../../../elements/GenericElement.js";
import SimplePopup from "../../../popups/simple-popup/SimplePopup.js";
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
  #confirmClose;

  /**
   * Constructor for the SimpleModal class.
   * @param {string} title - The title of the modal.
   * @param {Object} [param1={}] - An object containing optional parameters.
   * @param {{}} [param1.styles={}] - An object containing css properties and values.
   * @param {*} [param1.confirmClose=False] - A boolean value indicating whether to confirm closing the modal.
   */
  constructor(title = "Modal", { styles = {}, confirmClose = false } = {}) {
    // Create overlay and modal sections.
    this.#confirmClose = confirmClose;
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
   * The currt defined are:
   *       background: "#fff",
   *       padding: "20px",
   *      "border-radius": "5px",
   *      "box-shadow": "0 0 10px rgba(0, 0, 0, 0.2)",
   *      fontFamily: "Arial, sans-serif"
   *      "min-width": "300px",
   *      "max-width": "500px"
   *
   * @param {Object} styles - An object containing css properties and values.
   * @returns {void}
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
      "border-radius": "5px",
      "min-width": "300px",
      "max-width": "500px",
      "box-shadow": "0 2px 8px rgba(0, 0, 0, 0.3)",
      "font-family": "Arial, sans-serif",
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
        if (!self.#confirmClose) {
          self.close();
          document.removeEventListener("click", handler);
          return;
        }
        const popup = new SimplePopup("Confirm Close");
        const container = new GenericElement("div", {
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        });

        // Create a confirmation message element.
        const confirmationMessage = new GenericElement("p", {
          content: "Are you sure you want to close?",
        });

        container.appendChild(confirmationMessage);

        // Create the confirm button.
        const confirmButton =
          self.elementBuilder.buttons.build.buildPrimaryButton(
            "Yes, Close",
            async () => {
              popup.close();
              self.close();
            },
            self.elementBuilder.buttons.buttonSize.small,
          );

        // Build a container to hold the confirm and cancel buttons.
        const buttonContainer = new GenericElement("div", {
          styles: {
            display: "flex",
            justifyContent: "space-around",
            gap: "10px",
          },
        });
        buttonContainer.appendChild(confirmButton);

        // Set the popup body and footer.
        popup.setBody(container.get());
        popup.setFooter(buttonContainer.get());
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
