import SimpleModalElementBuilder from "../../builders/SimpleElementBuilder.js";
import GenericElement from "../../elements/GenericElement.js";
import SimplePopup from "../../popups/simple-popup/SimplePopup.js";
import { Toast } from "../../toasts/Toast.js";
import { signal } from "../../SimpleSignal.js";
import ModalDialog from "../../modals/modals/ModalDialog.js";

export default class ControllerAction {
  /**
   * @param {ModalDialog} modal
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

  /**
   * Builds a generic button
   * @param {string} name
   * @param {"primary" | "secondary" | "danger" | "success" | "warning" | "info"} type
   * @param {Function|null} onClick
   * @returns {GenericElement}
   */
  makeTinyButton(name, type, onClick = null) {
    return this.elementbuilder.StyleButtonBuilder.make(
      name,
      "tiny",
      type,
      onClick,
    );
  }
  /**
   * Builds a generic button
   * @param {string} name
   * @param {"primary" | "secondary" | "danger" | "success" | "warning" | "info"} type
   * @param {Function|null} onClick
   * @returns {GenericElement}
   */
  makeSmallButton(name, type, onClick = null) {
    return this.elementbuilder.StyleButtonBuilder.make(
      name,
      "small",
      type,
      onClick,
    );
  }
  /**
   * Builds a generic button
   * @param {string} name
   * @param {"primary" | "secondary" | "danger" | "success" | "warning" | "info"} type
   * @param {Function|null} onClick
   * @returns {GenericElement}
   */
  makeMediumButton(name, type, onClick = null) {
    return this.elementbuilder.StyleButtonBuilder.make(
      name,
      "medium",
      type,
      onClick,
    );
  }

  /**
   * Builds a generic button
   * @param {string} name
   * @param {"primary" | "secondary" | "danger" | "success" | "warning" | "info"} type
   * @param {Function|null} onClick
   * @returns {GenericElement}
   */
  makesLargeButton(name, type, onClick = null) {
    return this.elementbuilder.StyleButtonBuilder.make(
      name,
      "large",
      type,
      onClick,
    );
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
