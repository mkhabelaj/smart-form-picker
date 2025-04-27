import SimpleModalElementBuilder from "../../builders/SimpleElementBuilder";
import GenericElement from "../../elements/GenericElement";

export default class ModalDialog extends GenericElement {
  /** @type {GenericElement} */
  #overlay;
  /** @type {GenericElement} */
  #modalContainer;
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

    this.elementBuilder = SimpleModalElementBuilder;
    this.#modalTitle = title;
    console.log("ModalDialog");

    this.#makeShadowRoot();
    this.#makeModalElements();
    this.#setStyles().then(() => {
      this.#makeModal();
      this.#makeTitleBar();
    });
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

  #makeModalElements() {
    // overlay stays the same—semi-transparent black layer
    this.#overlay = new GenericElement("div", {
      attributes: {
        class:
          "fixed inset-0 bg-black/50 flex items-center justify-center z-50 text-text",
      },
    });

    // modal container now uses bg-background (Pale Lilac) and text-text (Dark Purple)
    this.#modalContainer = new GenericElement("div", {
      attributes: {
        class:
          "bg-background rounded-2xl shadow-xl w-full max-w-lg mx-4 relative",
      },
    });

    // modal container now uses bg-background (Pale Lilac) and text-text (Dark Purple)
    this.#modal = new GenericElement("div", {
      attributes: {
        class: "p-6 relative",
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
  }

  #makeModal() {
    this.#modal.appendChild(this.#header);
    this.#header.appendChild(this.#title);
    this.#modal.appendChild(this.#body);
    this.#body.appendChild(this.#content);
    this.#modal.appendChild(this.#footer);
    this.#modalContainer.appendChild(this.#modal);
    this.#overlay.appendChild(this.#modalContainer);

    this.#shadowRoot.appendChild(this.#overlay.get());
    document.body.appendChild(this.get());
  }
  #makeTitleBar() {
    // 1) create the title text
    const titleText = new GenericElement("div", {
      attributes: { class: "text-lg font-semibold" },
      content: "Modal Title",
    });

    // 2) create each control button
    const btnClasses =
      "w-6 h-6 flex items-center justify-center hover:bg-accent rounded transition";

    const btnMinimize = new GenericElement("button", {
      attributes: {
        class: btnClasses,
        "aria-label": "Minimize",
      },
      children: [
        new GenericElement("span", {
          attributes: { class: "block w-3 h-[2px] bg-text" },
        }),
      ],
    });

    const btnMaximize = new GenericElement("button", {
      attributes: {
        class: btnClasses,
        "aria-label": "Maximize",
      },
      children: [
        new GenericElement("span", {
          attributes: { class: "block w-3 h-3 border-2 border-text" },
        }),
      ],
    });

    const btnClose = new GenericElement("button", {
      events: { click: () => this.close() },
      attributes: {
        class: btnClasses,
        "aria-label": "Close",
      },
      children: [
        new GenericElement("span", {
          attributes: { class: "block text-xl leading-none text-text" },
          content: "×",
        }),
      ],
    });

    // 3) wrap controls
    const controls = new GenericElement("div", {
      attributes: { class: "flex space-x-2" },
      children: [btnMinimize, btnMaximize, btnClose],
    });

    // 4) assemble title bar
    const titleBar = new GenericElement("div", {
      attributes: {
        class:
          "flex items-center justify-between bg-primary text-background px-4 py-2 rounded-t-2xl shadow-md",
      },
      children: [titleText, controls],
    });

    // 5) insert it into your modal (e.g. at the top)
    this.#modalContainer.get().prepend(titleBar.get());
  }

  /**
   * Closes the modal.
   * @returns {void}
   * */
  close() {
    this.#overlay.remove();
  }

  /**
   * appendFooter
   * @param {HTMLElement | GenericElement} item
   * @returns {void}
   */
  appendFooter(item) {
    this.#footer.appendChild(item);
  }

  /**
   * Adds to content area
   * @param {HTMLElement | GenericElement} item
   * @returns {void}
   */
  appendContent(item) {
    this.#content.appendChild(item);
  }

  /**
   * Adds to content area
   * @param {HTMLElement | GenericElement} item
   * @returns {void}
   */
  renderContent(item) {
    this.appendContent(item);
  }
}
