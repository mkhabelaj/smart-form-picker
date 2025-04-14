import { Button, buttonSize } from "../../../elements/Button.js";
class Buttons {
  getDangerButton(name = "Danger", size = buttonSize.medium, onClick = null) {
    const button = new Button(name, size, "white", "#f44336");
    return button.get();
  }
  getSuccessButton(name = "Success", size = buttonSize.medium, onClick = null) {
    const button = new Button(name, size, "white", "#4CAF50");
    return button.get();
  }
  // primary
  getPrimaryButton(name = "Primary", size = buttonSize.medium, onClick = null) {
    const button = new Button(name, size, "white", "#2196F3");
    return button.get();
  }
  //secondary
  getSecondaryButton(
    name = "Secondary",
    size = buttonSize.medium,
    onClick = null,
  ) {
    const button = new Button(name, size, "white", "#607D8B");
    return button.get();
  }

  //light grey
  getLightButton(name = "Light", size = buttonSize.medium, onClick = null) {
    const button = new Button(name, size, "black", "#E0E0E0");
    return button.get();
  }
}
const ModalButtonBuilder = {
  build: new Buttons(),
  buttonSize: buttonSize,
};

export { ModalButtonBuilder };
