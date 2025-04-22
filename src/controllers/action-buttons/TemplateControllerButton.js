import { Toast } from "../../toasts/Toast";
import { checkIfInputIsImpty } from "../../utils";
import ControllerButton from "./ControllerButton";

class EmptyTextAreaError extends Error {}

export default class TemplateControllerButton extends ControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   */
  constructor(textArea, modal) {
    super();
    this.textArea = textArea;
    this.modal = modal;
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
