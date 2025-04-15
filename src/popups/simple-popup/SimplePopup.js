import GenericElement from "../../elements/GenericElement.js";
import SimpleElementBuilder from "../../builders/SimpleElementBuilder.js";

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

  constructor(title = "Popup") {
    this.elementBuilder = SimpleElementBuilder;
    this.#popup = this.#createPopup();
    this.#header = this.#createHeader();
    this.#body = this.#createBody();
    this.#footer = this.#createFooter();

    this.#popup.append(this.#header);
    this.#popup.append(this.#body);
    this.#popup.append(this.#footer);

    this.setTitle(title);
    this.#addCloseButton();
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
        flexDirection: "column",
        gap: "5px",
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
    const style = document.createElement("style");
    const shadowContent = document.createElement("div");
    shadowContent.appendChild(style);
    style.textContent = `
      .pop-up {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        z-index: 9999;
        background-color: #fff;
        border: 1px solid #ccc;
        border-radius: 5px;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.2);
        min-width: 200px;
        padding: 10px;
      }

    `;
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
