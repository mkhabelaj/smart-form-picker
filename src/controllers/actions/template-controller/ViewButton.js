import GenericElement from "../../../elements/GenericElement";
import TemplateControllerAction from "../TemplateControllerAtionc";

export default class ViewButton extends TemplateControllerAction {
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
    const viewButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Preview",
      () => {
        const { popup, container } =
          this.createContainerAndPopup("Preview Template");

        const description = new GenericElement("p", {
          styles: { "text-align": "center" },
          content: "You can preview the template here.",
        });

        container.appendChild(description);
        popup.setBody(container.get());

        const previewExternalB =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Preview",
            async () => {
              try {
                const template = textArea.value;
                this.checkIfTextAreaIsEmpty();
                const doc = getGeneratedGoogleLikeJsPDF(template);

                window.open(doc.output("bloburl"), "_blank");
              } catch (error) {
                this.toastEmptyTextAreaError(error);
                console.error(error);
                this.toast.error("Error creating PDF.");
              }
            },
            this.elementbuilder.buttons.buttonSize.small,
          );
        popup.setFooter(previewExternalB);
      },
    );
    this.modal.appendFooter(viewButton);
  }
}
