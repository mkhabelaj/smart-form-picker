import GenericElement from "../../../elements/GenericElement";
import TemplateControllerAction from "../TemplateControllerAtionc";

export default class TemplateAreaClearButton extends TemplateControllerAction {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   *
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.#init();
  }

  #init() {
    const textArea = this.textArea;
    const clearTemplateButton =
      this.elementbuilder.buttons.build.buildDangerButton(
        "Clear Area",
        async () => {
          try {
            // Create a popup with a confirmation message.
            const { popup, container } = this.createContainerAndPopup(
              "Clear Template Area",
            );

            // Create a confirmation message element.
            const confirmationMessage = new GenericElement("p", {
              content: "Are you sure you want to clear the template area?",
            });

            container.appendChild(confirmationMessage);

            // Create the confirm button.
            const confirmButton =
              this.elementbuilder.buttons.build.buildPrimaryButton(
                "Yes, Clear",
                async () => {
                  textArea.value = ""; // Clear the template area
                  this.toast.success("Template area cleared.");
                  popup.close();
                },
                this.elementbuilder.buttons.buttonSize.small,
              );

            // Build a container to hold the confirm and cancel buttons.
            const buttonContainer = new GenericElement("div", {
              styles: {
                display: "flex",
                justifyContent: "space-around",
                gap: "10px",
              },
            });
            buttonContainer.appendChild(confirmButton);

            // Set the popup body and footer.
            popup.setBody(container.get());
            popup.setFooter(buttonContainer.get());
          } catch (error) {
            console.error(error);
            this.toast.error("Error clearing template area.");
          }
        },
      );

    // Append the clear button to the modal's footer.
    this.modal.appendFooter(clearTemplateButton);
  }
}
