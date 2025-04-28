import { fetchData, fetchText } from "../../../api";
import ModalDialog from "../../../modals/modals/ModalDialog";
import TemplateController from "../../TemplateController";
import TemplateControllerAction from "../TemplateControllerAtionc";

export class TemplateLoader extends TemplateControllerAction {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {ModalDialog} modal
   * @param {TemplateController} templateController
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.#init();
  }

  async #init() {
    try {
      const data = await fetchData("mapping.json");
      const templateSelect =
        this.elementbuilder.select.build("Select Template");

      const textarea = this.textArea;
      templateSelect.setOnChange(async (e) => {
        const selectedValue = e.target.value;
        const text = await fetchText(selectedValue);
        textarea.value = text;
      });

      for (const name of data["templates"]) {
        templateSelect.addOption(name, name);
      }
      this.templateSelectLoader = templateSelect.get();
      this.templateController.getContainer().append(this.templateSelectLoader);
    } catch (error) {
      console.error("Error loading templates:", error);
      this.toast.error("Error loading templates.");
    }
  }
}
