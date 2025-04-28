import TemplateController from "../../TemplateController";
import TemplateControllerButton from "../TemplateControllerButton";

export default class CopyButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   *
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.init();
  }

  init() {
    const textArea = this.textArea;

    const copyButton = this.elementbuilder.buttons.build.buildSecondaryButton(
      "Copy",
      async () => {
        try {
          const template = textArea.value;
          this.checkIfTextAreaIsEmpty();
          // Use the Clipboard API to write text to the clipboard.
          await navigator.clipboard.writeText(template);
          this.toast.success("Template copied to clipboard.");
        } catch (error) {
          this.toastEmptyTextAreaError(error);
          console.error(error);
          this.toast.error("Error copying template.");
        }
      },
    );

    // Append the Copy button to the modal's footer.
    this.modal.appendFooter(copyButton);
  }
}
