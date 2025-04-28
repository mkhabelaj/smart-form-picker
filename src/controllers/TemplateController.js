import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../elements/GenericElement.js";
import { fetchData, fetchText } from "../api.js";
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
  #templateSelectLoader;
  /** @type {HTMLElement | null} */
  #documentContext = null;

  constructor() {
    this.toast = new Toast();
    this.elementbuilder = SimpleElementBuilder;
    this.#container = this.#createContainer();
    // Kick off the template select loader early so it’s added to the container.
    this.#createTemplateSelectLoader();
    this.#textArea = this.#createTexArea();
    this.#container.append(this.#textArea);

    this.#createStyleSheet().then((styleSheet) => {
      this.modal = new SimpleModal("Template Picker", {
        confirmClose: true,
        stylesheet: styleSheet,
      });
      this.modal.mergeStyles({ "min-width": "700px", "max-width": "900px" });
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
    });
  }

  async #createStyleSheet() {
    const url = chrome.runtime.getURL("styles/style.css");
    const response = await fetch(url);
    const styleSheet = await response.text();
    return new GenericElement("style", {
      content: styleSheet,
    });
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
  // Creates the container element.
  #createContainer() {
    const container = new GenericElement("div", {
      styles: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
    });
    return container.get();
  }
  // Creates the textarea element.
  #createTexArea() {
    const textArea = new GenericElement("textarea", {
      attributes: {
        placeholder: "Paste your template here",
        rows: 10,
        cols: 50,
      },
      styles: {
        borderRadius: "5px",
      },
    });
    return textArea.get();
  }

  // Initializes the template select loader to load templates from mapping.json into a select element.
  async #createTemplateSelectLoader() {
    try {
      const data = await fetchData("mapping.json");
      const templateSelect =
        this.elementbuilder.select.build("Select Template");

      templateSelect.setOnChange(async (e) => {
        const selectedValue = e.target.value;
        const text = await fetchText(selectedValue);
        this.#textArea.value = text;
      });

      for (const name of data["templates"]) {
        templateSelect.addOption(name, name);
      }
      this.#templateSelectLoader = templateSelect.get();
      this.#container.append(this.#templateSelectLoader);
    } catch (error) {
      console.error("Error loading templates:", error);
      this.toast.error("Error loading templates.");
    }
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
}
