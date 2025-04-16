import { ModalButtonBuilder } from "./build-elements/Buttons.js";
import { InputBuilder } from "./build-elements/Input.js";
import { SelectBuilder } from "./build-elements/Select.js";

/**
 * A builder class for creating HTML elements.
 */
export default SimpleModalElementBuilder = {
  buttons: ModalButtonBuilder,
  select: SelectBuilder,
  input: InputBuilder,
};
