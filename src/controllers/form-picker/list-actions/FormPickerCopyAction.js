import GenericElement from "../../../elements/GenericElement";
import FormPickerAction from "./FormPickerAction";

export default class FormPickerCopyAction extends FormPickerAction {
  constructor() {
    super();
  }

  /**
   * Gets the copy action.
   * @param {string} key - The key of the action.
   * @param {{ [key: string]: string }} dataObj - The data object.
   * @param {SimpleModal} modal - The modal instance.
   * @returns {GenericElement}
   */
  getAction(key, dataObj, modal) {
    return new GenericElement("span", {
      content: "📄",
      styles: {
        "font-size": "18px",
        cursor: "pointer",
      },
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
