import SimpleModalElementBuilder from "../../builders/SimpleElementBuilder.js";
import GenericElement from "../../elements/GenericElement.js";
import SimpleModal from "../../modals/modals/simple-modal/SimpleModal.js";
import SimplePopup from "../../popups/simple-popup/SimplePopup.js";
import { Toast } from "../../toasts/Toast.js";
import { signal } from "../../SimpleSignal.js";

export default class ControllerAction {
  /**
   * @param {SimpleModal} modal
   */
  constructor(modal) {
    this.modal = modal;
    this.toast = new Toast();
    this.elementbuilder = SimpleModalElementBuilder;
  }

  /**
   * Creates a container element and a popup element.
   * @param {string | signal} popupName
   * @param {object} [styles=null] styles
   *        default styles:
   *        display: "flex"
   *        flexDirection: "column"
   *        gap: "10px"
   *
   * @returns {{ popup: SimplePopup, container: GenericElement }}
   * @private
   */

  createContainerAndPopup(popupName, styles = null) {
    const popup = new SimplePopup(popupName);
    const container = new GenericElement(
      "div",
      styles || {
        styles: {
          display: "flex",
          flexDirection: "column",
          gap: "10px",
        },
      },
    );

    return { popup, container };
  }
}
