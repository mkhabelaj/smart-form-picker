import GenericElement from "../elements/GenericElement.js";
import SimpleElementBuilder from "../builders/SimpleElementBuilder.js";
import { Toast } from "../toasts/Toast.js";
import GenenerateAIButton from "./actions/template-controller/GenenerateAIButton.js";
import DocumentContextButton from "./actions/template-controller/DocumentContextButton.js";
import TemplateAreaClearButton from "./actions/template-controller/TemplateAreaClearButton.js";
import ViewButton from "./actions/template-controller/ViewButton.js";
import SaveAsButton from "./actions/template-controller/SaveAsButton.js";
import LoadFromButton from "./actions/template-controller/LoadFromButton.js";
import ClearPopupButton from "./actions/template-controller/ClearPopupButton.js";
import CopyButton from "./actions/template-controller/CopyButton.js";
import DownloadButton from "./actions/template-controller/DownloadButton.js";
import UploadPdfButton from "./actions/template-controller/UploadPdfButton.js";
import { TemplateLoader } from "./actions/template-controller/TemplateLoader.js";
import ModalDialog from "../modals/modals/ModalDialog.js";

/**
 *
 * Controller for the template picker.
 *
 * @type {TemplateController}
 */

export default class TemplateController {
  #textArea;
  #container;
  #savedNamesListKey = "savedNamesList";
  /** @type {HTMLElement | null} */
  #documentContext = null;
  /** @type {ModalDialog} */
  modal;

  constructor() {
    this.toast = new Toast();
    this.elementbuilder = SimpleElementBuilder;
    this.#container = this.#createContainer();
    this.#textArea = this.#createTexArea();
    this.#createTemplateSelectLoader();
    this.#container.append(this.#textArea);
    this.modal = new ModalDialog({ title: "Template Picker" });
    this.modal.getModalContainer().mergeClasses("max-w-3xl");
    // this.modal.mergeStyles({ "min-width": "700px", "max-width": "900px" });
    this.#createTemplateAreaClearButton();
    this.#createClearPopupButton();
    this.#createLoadFromButton();
    this.#createDownloadButton();
    this.#createUploadPdfButton();
    this.#createCopyButton();
    this.#createSaveAsButton();
    this.#createViewButton();
    this.#createAIPopup();
    this.#createDocumentContext();
    this.modal.renderContent(this.#container);
  }

  #createTemplateAreaClearButton() {
    new TemplateAreaClearButton(this.#textArea, this.modal, this);
  }

  #createViewButton() {
    new ViewButton(this.#textArea, this.modal, this);
  }
  // Creates a "Save As" button that opens a popup to let the user save the current template.
  #createSaveAsButton() {
    new SaveAsButton(this.#textArea, this.modal, this);
  }

  // Creates a "Load From" button that opens a popup with a dropdown list to select and load a template.
  #createLoadFromButton() {
    new LoadFromButton(this.#textArea, this.modal, this);
  }

  getSavedNamesListKey() {
    return this.#savedNamesListKey;
  }

  // Creates a "Clear Template" button that opens a popup to select and remove a saved template.
  #createClearPopupButton() {
    new ClearPopupButton(this.#textArea, this.modal, this);
  }

  // Placeholder for future implementation
  #createCopyButton() {
    new CopyButton(this.#textArea, this.modal, this);
  }
  #createDownloadButton() {
    new DownloadButton(this.#textArea, this.modal, this);
  }
  #createUploadPdfButton() {
    new UploadPdfButton(this.#textArea, this.modal, this);
  }

  #createAIPopup() {
    new GenenerateAIButton(this.#textArea, this.modal, this);
  }

  #createDocumentContext() {
    new DocumentContextButton(this.#textArea, this.modal, this);
  }
  // Initializes the template select loader to load templates from mapping.json into a select element.
  #createTemplateSelectLoader() {
    new TemplateLoader(this.#textArea, this.modal, this);
  }

  // Creates the container element.
  #createContainer() {
    const container = new GenericElement("div", {
      attributes: {
        class: "flex flex-col gap-2.5",
      },
    });
    return container.get();
  }

  // Creates the textarea element.
  #createTexArea() {
    const textArea = new GenericElement("textarea", {
      attributes: {
        placeholder: "Paste your template here",
        rows: "10",
        cols: "50",
        class: [
          "block w-full",
          "bg-background text-text",
          "border border-secondary rounded-lg",
          "px-3 py-2",
          "shadow-sm",
          "placeholder:text-secondary",
          "transition",
          "focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary",
          "disabled:opacity-50 disabled:cursor-not-allowed",
        ].join(" "),
      },
    });
    return textArea.get();
  }
  /**
   *
   * @param {HTMLElement} element
   * */
  setDocumentContext(element) {
    this.#documentContext = element;
  }

  /**
   * gets the document context
   * @param {HTMLElement} element
   * */
  getDocumentContext() {
    return this.#documentContext;
  }
  /**
   * Is the document context set?
   * @returns {boolean}
   * */
  isDocumentContextSet() {
    return this.#documentContext !== null;
  }
  getContainer() {
    return this.#container;
  }
}
