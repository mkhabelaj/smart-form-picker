import { Toast } from "../../toasts/Toast";
import { checkIfInputIsImpty } from "../../utils";
import TemplateController from "../TemplateController";
import ControllerButton from "./ControllerButton";

class EmptyTextAreaError extends Error {}

export default class TemplateControllerButton extends ControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   */
  constructor(textArea, modal, templateController) {
    super(modal);
    this.textArea = textArea;
    this.templateController = templateController;
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
}
