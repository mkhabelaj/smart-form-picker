import GenericElement from "../../../elements/GenericElement";
import ModalDialog from "../../../modals/modals/ModalDialog";
import FormPickerAction from "./FormPickerAction";

export default class FormPickerCopyAction extends FormPickerAction {
  constructor() {
    super();
  }

  /**
   * Gets the copy action.
   * @param {string} key - The key of the action.
   * @param {{ [key: string]: string }} dataObj - The data object.
   * @param {ModalDialog} modal - The modal instance.
   * @returns {GenericElement}
   */
  getAction(key, dataObj, modal) {
    return new GenericElement("span", {
      attributes: { class: "text-lg cursor-pointer" },
      content: "📄",
      events: {
        click: () => {
          navigator.clipboard.writeText(dataObj[key]);
          modal.close();
          this.toast.success(`${key} successfully copied.`);
        },
      },
    });
  }
}
