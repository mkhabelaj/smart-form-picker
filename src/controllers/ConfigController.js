import GenericElement from "../elements/GenericElement";
import SimpleModal from "../modals/modals/simple-modal/SimpleModal";
import DataSourceSwitcher from "./actions/config-controller/DataSourceSwitcher.js";
import OllamaModelSwitcher from "./actions/config-controller/OllamaModelSwitcher.js";

export default class ConfigController {
  constructor() {
    this.modal = new SimpleModal("Config");
    this.#loadContent();
    this.#loadOptions();
  }

  #loadOptions() {
    this.#createlDataSourceSwitcher();
    this.#createOllamaModelSwitcher();
  }
  #createlDataSourceSwitcher() {
    new DataSourceSwitcher(this.modal);
  }

  #createOllamaModelSwitcher() {
    new OllamaModelSwitcher(this.modal);
  }
  #loadContent() {
    const content = new GenericElement("div", {
      styles: { "text-align": "center" },
      content: "Select some options below to update config",
    });

    this.modal.renderContent(content.get());
  }
}
