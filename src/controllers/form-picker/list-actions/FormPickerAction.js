import GenericElement from "../../../elements/GenericElement.js";
import ModalDialog from "../../../modals/modals/ModalDialog.js";
import { Toast } from "../../../toasts/Toast.js";
export default class FormPickerAction {
  toast = new Toast();
  constructor() {}

  /**
   * Executes the action.
   * @param {string} key - The key of the action.
   * @param {{ [key: string]: string }} dataObj - The data object.
   * @param {ModalDialog} modal - The modal instance.
   * @throws {Error} If the method is not implemented.
   * @returns {GenericElement}
   */
  getAction(key, dataObj, modal) {
    throw new Error("Method not implemented");
  }
}
