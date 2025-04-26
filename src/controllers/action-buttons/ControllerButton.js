import SimpleModalElementBuilder from "../../builders/SimpleElementBuilder";
import GenericElement from "../../elements/GenericElement";
import SimpleModal from "../../modals/modals/simple-modal/SimpleModal";
import SimplePopup from "../../popups/simple-popup/SimplePopup";
import { Toast } from "../../toasts/Toast";
import { signal } from "../../SimpleSignal.js";

export default class ControllerButton {
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
