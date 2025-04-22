import GenericElement from "../../elements/GenericElement.js";
import SimpleElementBuilder from "../../builders/SimpleElementBuilder.js";
import { makeDraggable } from "../../utils.js";
import TitleBar from "../../TitleBar.js";

/**
 * Class SimplePopup
 * A composite class that brings together Header, Body, and Footer to create a complete popup
 * encapsulated within a Shadow DOM.
 */
export default class SimplePopup {
  #popup;
  #header;
  #body;
  #footer;
  #styles = {};
  #popupContainer;
  #titleBar;

  constructor(title = "Popup", { styles = {} } = {}) {
    this.elementBuilder = SimpleElementBuilder;
    this.#popup = this.#createPopup();

    if (Object.keys(styles).length > 0) {
      this.setStyles(styles);
    } else {
      this.#setDefaultStyles();
    }

    this.#popupContainer = this.#createPopupContainer();
    this.#titleBar = new TitleBar({
      title,
      onMinimize: () => {
        this.#popupContainer.style.display = "none";
      },
      onMaximize: () => {
        this.#popupContainer.style.display = "block";
      },
      onClose: () => {
        this.#popup.remove();
      },
    });
    this.#popup.append(this.#titleBar.get());
    this.#header = this.#createHeader();
    this.#body = this.#createBody();
    this.#footer = this.#createFooter();

    this.#popup.append(this.#popupContainer);

    this.#popupContainer.append(this.#header);
    this.#popupContainer.append(this.#body);
    this.#popupContainer.append(this.#footer);

    this.setTitle(title);
    this.makeDraggable();
    this.#addCloseButton();
  }

  #createPopupContainer() {
    const container = new GenericElement("div", {
      styles: {
        padding: "10px",
      },
    });
    return container.get();
  }

  makeDraggable() {
    this.#titleBar.setStyle("cursor", "move");
    makeDraggable(this.#popup, this.#titleBar.get());
  }

  /**
   * Sets the styles for the modal.
   * @param {Object} styles - An object containing css properties and values.
   */
  setStyles(styles) {
    this.#styles = styles;
    for (const [key, value] of Object.entries(styles)) {
      this.#popup.style.setProperty(key, value);
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

  #setDefaultStyles() {
    this.#styles = {
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      "z-index": 99999,
      background: "#fff",
      border: "1px solid #ccc",
      "border-radius": "5px",
      "box-shadow": "0 0 10px rgba(0, 0, 0, 0.2)",
      "min-width": "200px",
      // padding: "10px",
    };
    this.setStyles(this.#styles);
  }
  /**
   * Adds a close button to the popup
   * @returns {void}
   */
  #addCloseButton() {
    const self = this;
    const close = this.elementBuilder.buttons.build.buildDangerButton(
      "Close",
      function handler() {
        self.close();
        document.removeEventListener("click", handler);
      },
      this.elementBuilder.buttons.buttonSize.small,
    );
    this.#footer.append(close);
  }

  /**
   * Creates the header
   * @returns {HTMLElement}
   */
  #createHeader() {
    const header = new GenericElement("header", {
      styles: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "10px",
      },
    });
    return header.get();
  }

  /**
   * Creates the body
   * @returns {HTMLElement}
   */
  #createBody() {
    const body = new GenericElement("main", {
      styles: {
        border: "1px solid #ccc",
        padding: "10px",
        marginBottom: "10px",
      },
    });
    return body.get();
  }

  /**
   * Creates the footer
   * @returns {HTMLElement}
   */
  #createFooter() {
    const footer = new GenericElement("footer", {
      styles: {
        display: "flex",
        justifyContent: "center",
        gap: "5px",
      },
    });
    return footer.get();
  }
  /**
   * Creates a popup element enclosed in a shadow
   * @returns {HTMLElement}
   */
  #createPopup() {
    const host = document.createElement("div");
    host.id = "popup-host";
    const shadowRoot = host.attachShadow({ mode: "open" });
    const shadowContent = document.createElement("div");
    shadowContent.id = "shadow-content";
    shadowContent.classList.add("pop-up");
    shadowRoot.appendChild(shadowContent);
    document.body.appendChild(host);
    return shadowContent;
  }

  /**
   * Closes the popup
   * @returns {void}
   */
  close() {
    this.#popup.remove();
  }

  /**
   * Sets the title of the popup
   * @param {string} title
   * @returns {void}
   */
  setTitle(title) {
    const titleElement = new GenericElement("h3", {
      content: title,
    });
    this.#header.append(titleElement.get());
  }

  /**
   * Sets the body of the popup
   * @param {HTMLElement} body
   * @returns {void}
   */
  setBody(body) {
    this.#body.append(body);
  }

  /**
   * Sets the footer of the popup
   * @param {HTMLElement} footer
   * @returns {void}
   */
  setFooter(footer) {
    this.#footer.append(footer);
  }
}
