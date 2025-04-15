import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../elements/GenericElement.js";
import { fetchData, fetchText } from "../api.js";
import SimpleElementBuilder from "../builders/SimpleElementBuilder.js";

export default class TemplateController {
  #textArea;
  #container;
  constructor() {
    this.elementbuilder = SimpleElementBuilder;
    this.#container = this.#createContainer();
    this.#textArea = this.#createTexArea();
    this.#createTemplateSelectLoader();
    this.#container.append(this.#textArea);
    this.modal = new SimpleModal("Template Picker");
    this.modal.renderContent(this.#container);
  }

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
  #createTexArea() {
    const textArea = new GenericElement("textarea", {
      attributes: {
        placeholder: "Paste your template here",
        rows: 10,
        cols: 50,
      },
      styles: {
        width: "100%",
        borderRadius: "5px",
      },
    });
    return textArea.get();
  }
  async #createTemplateSelectLoader() {
    const data = await fetchData("mapping.json");
    const templateSelect = this.elementbuilder.select.build("Select Template");

    templateSelect.setOnChange(async (e) => {
      console.log(e.target.value);
      const text = await fetchText(e.target.value);
      this.#textArea.value = text;
    });

    for (const name of data["templates"]) {
      templateSelect.addOption(name, name);
    }
    this.#container.append(templateSelect.get());
  }
}
