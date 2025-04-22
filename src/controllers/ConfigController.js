import { getDataSource, getDataSources, setDataSource } from "../api";
import SimpleModalElementBuilder from "../builders/SimpleElementBuilder";
import GenericElement from "../elements/GenericElement";
import SimpleModal from "../modals/modals/simple-modal/SimpleModal";
import { Toast } from "../toasts/Toast";
import DataSourceSwitcher from "./action-buttons/config-controller/DataSourceSwitcher";
import OllamaModelSwitcher from "./action-buttons/config-controller/OlammaModelSwitcher";

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
