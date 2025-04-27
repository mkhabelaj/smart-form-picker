import GenericElement from "../../elements/GenericElement";

export default class ModalDialog extends GenericElement {
  /** @type {GenericElement} */
  #overlay;
  /** @type {GenericElement} */
  #modal;
  /** @type {GenericElement} */
  #header;
  /** @type {GenericElement} */
  #body;
  /** @type {GenericElement} */
  #content;
  /** @type {GenericElement} */
  #title;
  /** @type {GenericElement} */
  #footer;

  /** @type {string} */
  #modalTitle;

  /** @type {ShadowRoot} */
  #shadowRoot;

  constructor({ title = "Title" } = {}) {
    super("div", {
      attributes: {
        id: "modal-dialog-host",
      },
    });
    this.#modalTitle = title;
    console.log("ModalDialog");

    this.#makeShadowRoot();
    this.#setStyles().then(() => this.#makeModal());
  }
  #makeShadowRoot() {
    this.#shadowRoot = this.get().attachShadow({ mode: "open" });
  }

  /**
   * @param {string|signal} title
   */
  setTitle(title) {
    this.#title.setContent(title);
  }
  async #setStyles() {
    const url = await chrome.runtime.getURL("styles/style.css");
    const response = await fetch(url);
    const text = await response.text();
    const style = new GenericElement("style", {
      content: text,
    });

    this.#shadowRoot.appendChild(style.get());
  }

  #makeModal() {
    // overlay stays the same—semi-transparent black layer
    this.#overlay = new GenericElement("div", {
      attributes: {
        class:
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-text",
      },
    });

    // modal container now uses bg-background (Pale Lilac) and text-text (Dark Purple)
    this.#modal = new GenericElement("div", {
      attributes: {
        class:
          "bg-background rounded-2xl shadow-xl w-full max-w-lg mx-4 p-6 relative",
      },
    });

    // title uses text-primary (Majestic Purple)
    this.#title = new GenericElement("h2", {
      attributes: {
        class: "text-primary text-2xl font-semibold mb-2",
      },
    });

    // header wrapper
    this.#header = new GenericElement("header", {
      attributes: {
        class: "mb-4",
      },
      content: this.#modalTitle,
    });

    // scrollable content area
    this.#content = new GenericElement("div", {
      attributes: {
        class: "max-h-60 overflow-y-auto mt-2",
      },
    });

    // body text uses text-text (Dark Purple)
    this.#body = new GenericElement("section", {
      attributes: {
        class: "mb-6 text-text",
      },
    });

    // footer with semantic buttons
    this.#footer = new GenericElement("footer", {
      attributes: {
        class: "flex justify-end space-x-3",
      },
    });

    // example buttons—feel free to swap btn-* variants
    const okButton = new GenericElement("button", {
      attributes: { class: "btn-primary" },
      content: "OK",
    });
    const cancelButton = new GenericElement("button", {
      attributes: { class: "btn-secondary" },
      content: "Cancel",
    });

    this.#modal.appendChild(this.#header);
    this.#header.appendChild(this.#title);
    this.#modal.appendChild(this.#body);
    this.#body.appendChild(this.#content);
    this.#modal.appendChild(this.#footer);
    this.#overlay.appendChild(this.#modal);

    this.#shadowRoot.appendChild(this.#overlay.get());
    document.body.appendChild(this.get());
  }
}
