import GenericElement from "../../../elements/GenericElement";
import FormPickerAction from "./FormPickerAction";

export default class FormPickerTargetPasteAction extends FormPickerAction {
  /**
   * Constructs a FillHelper with the target field and creates the modal.
   * @param {HTMLElement} target - The form field to be populated.
   * @throws {Error} If the method is not implemented.
   */
  constructor(target) {
    super();
    this.target = target;
  }

  /**
   * Gets the target action.
   * @param {string} key - The key of the action.
   * @param {{ [key: string]: string }} dataObj - The data object.
   * @param {SimpleModal} modal - The modal instance.
   * @returns {GenericElement}
   */
  getAction(key, dataObj, modal) {
    return new GenericElement("span", {
      attributes: { class: "text-lg cursor-pointer" },
      content: "📋",
      events: {
        click: () => {
          this.target.value = dataObj[key];
          modal.close();
          this.toast.success(`${key} successfully populated.`);
        },
      },
    });
  }
}
