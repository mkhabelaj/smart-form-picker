import { Toast } from "../../toasts/Toast";
import { checkIfInputIsImpty } from "../../utils";
import TemplateController from "../TemplateController";
import ControllerAction from "./ControllerAction";

class EmptyTextAreaError extends Error {}

export default class TemplateControllerAction extends ControllerAction {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   */
  constructor(textArea, modal, templateController) {
    super(modal);
    this.textArea = textArea;
    this.templateController = templateController;
    this.savedNamesListKey = this.templateController.getSavedNamesListKey();
  }

  checkIfTextAreaIsEmpty() {
    try {
      checkIfInputIsImpty(this.textArea, "Template area is empty");
    } catch (error) {
      throw new EmptyTextAreaError(error.message);
    }
  }

  /**
   * @param {Error} error
   */
  toastEmptyTextAreaError(error) {
    if (error instanceof EmptyTextAreaError) {
      const toast = new Toast();
      toast.error(error.message);
    }
  }

  makeActionButton(name, onclick = null) {
    return this.makeTinyButton(name, "primary", onclick);
  }
  makeDangerButton(name, onclick = null) {
    return this.makeTinyButton(name, "danger", onclick);
  }
  makeInfoButton(name, onclick = null) {
    return this.makeTinyButton(name, "info", onclick);
  }
  makeSecondaryButton(name, onclick = null) {
    return this.makeTinyButton(name, "secondary", onclick);
  }
}
