import { Button, buttonSize } from "../../../elements/Button.js";
class Buttons {
  /**
   * Builds a generic button
   * @param {string} name
   * @param {Function|null} onClick
   * @param {string} size
   * @returns {Button}
   */
  #buildGenericButton(name = "Ok", onClick = null, size = buttonSize.medium) {
    const button = new Button(name, null, {
      "border-radius": "4px",
      "border-style": "solid",
    });
    button.setButtonSize(size);
    if (onClick) button.setOnClick(onClick);
    return button;
  }
  buildDangerButton(name = "Danger", onClick = null, size = buttonSize.medium) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#F44336",
      "border-color": "#F44336",
    });
    return button.get();
  }
  // primary
  buildPrimaryButton(
    name = "Primary",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = this.#buildGenericButton(name, onClick, size);
    button.mergeStyles({
      color: "#fff",
      "background-color": "#2196F3",
      "border-color": "#2196F3",
    });
    return button.get();
  }
}
const ModalButtonBuilder = {
  build: new Buttons(),
  buttonSize: buttonSize,
};

export { ModalButtonBuilder };
