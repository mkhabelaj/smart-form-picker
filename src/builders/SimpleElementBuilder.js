import { ModalButtonBuilder } from "./build-elements/Buttons.js";
import { InputBuilder } from "./build-elements/Input.js";
import { SelectBuilder } from "./build-elements/Select.js";

/**
 * A builder for creating HTML elements.
 */
const SimpleModalElementBuilder = {
  buttons: ModalButtonBuilder,
  select: SelectBuilder,
  input: InputBuilder,
};
export default SimpleModalElementBuilder;
