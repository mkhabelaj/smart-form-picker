import { Button, buttonSize } from "../../../elements/Button.js";
class Buttons {
  buildDangerButton(name = "Danger", onClick = null, size = buttonSize.medium) {
    // soft red
    const button = new Button(name, size, "#fff", "#F44336");
    if (onClick) button.setOnClick(onClick);
    return button.get();
  }
  buildSuccessButton(
    name = "Success",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = new Button(name, size, "white", "#4CAF50");
    if (onClick) button.setOnClick(onClick);
    return button.get();
  }
  // primary
  buildPrimaryButton(
    name = "Primary",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = new Button(name, size, "white", "#2196F3");
    if (onClick) button.setOnClick(onClick);
    return button.get();
  }
  //secondary
  buildSecondaryButton(
    name = "Secondary",
    onClick = null,
    size = buttonSize.medium,
  ) {
    const button = new Button(name, size, "white", "#607D8B");
    if (onClick) button.setOnClick(onClick);
    return button.get();
  }

  //light grey
  buildLightButton(name = "Light", onClick = null, size = buttonSize.medium) {
    const button = new Button(name, size, "black", "#E0E0E0");
    if (onClick) button.setOnClick(onClick);
    return button.get();
  }
}
const ModalButtonBuilder = {
  build: new Buttons(),
  buttonSize: buttonSize,
};

export { ModalButtonBuilder };
