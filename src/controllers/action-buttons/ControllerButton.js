import SimpleModalElementBuilder from "../../builders/SimpleElementBuilder";
import GenericElement from "../../elements/GenericElement";
import SimplePopup from "../../popups/simple-popup/SimplePopup";
import { Toast } from "../../toasts/Toast";

export default class ControllerButton {
  constructor() {
    this.toast = new Toast();
    this.elementbuilder = SimpleModalElementBuilder;
  }

  /**
   * Creates a container element and a popup element.
   * @param {string} popupName
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
