import GenericElement from "../../../elements/GenericElement";
import { createGoogleDocLikePDF } from "../../../utils";
import TemplateControllerButton from "../TemplateControllerButton";

export default class DownloadButton extends TemplateControllerButton {
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

    const downloadButton =
      this.elementbuilder.buttons.build.buildSecondaryButton(
        "Download",
        async () => {
          try {
            // Create a popup for downloading the template.
            const { popup, container } =
              this.createContainerAndPopup("Download Template");

            // File name input field (without extension)
            const fileNameInput = this.elementbuilder.input.build({
              attributes: {
                placeholder: "File Name (without extension)",
              },
            });
            container.appendChild(fileNameInput);

            // Create the "Download as TXT" button.
            const downloadTxtButton =
              this.elementbuilder.buttons.build.buildPrimaryButton(
                "Download as TXT",
                async () => {
                  try {
                    const fileName = fileNameInput.value.trim() || "template";
                    const template = textArea.value;
                    this.checkIfTextAreaIsEmpty();
                    // Create a Blob with plain text.
                    const blob = new Blob([template], { type: "text/plain" });
                    const url = URL.createObjectURL(blob);
                    const a = new GenericElement("a", {
                      attributes: {
                        href: url,
                        download: `${fileName}.txt`,
                      },
                    });
                    a.get().click();
                    URL.revokeObjectURL(url);
                    popup.close();
                    this.toast.success(`TXT saved as ${fileName}.txt`);
                  } catch (error) {
                    this.toastEmptyTextAreaError(error);
                    console.error(error);
                    this.toast.error("Error downloading TXT.");
                  }
                },
                this.elementbuilder.buttons.buttonSize.small,
              );

            // Create the "Download as PDF" button.
            const downloadPdfButton =
              this.elementbuilder.buttons.build.buildPrimaryButton(
                "Download as PDF",
                async () => {
                  try {
                    const fileName = fileNameInput.value.trim() || "template";
                    const template = textArea.value;

                    this.checkIfTextAreaIsEmpty();
                    createGoogleDocLikePDF(template, fileName);
                    popup.close();
                    this.toast.success(`PDF saved as ${fileName}.pdf`);
                  } catch (error) {
                    this.toastEmptyTextAreaError(error);
                    console.error(error);
                    this.toast.error("Error downloading PDF.");
                  }
                },
                this.elementbuilder.buttons.buttonSize.small,
              );

            // Create a container to hold both download buttons.
            const buttonsContainer = new GenericElement("div", {
              styles: {
                display: "flex",
                justifyContent: "space-around",
                gap: "10px",
              },
            });
            buttonsContainer.appendChild(downloadTxtButton);
            buttonsContainer.appendChild(downloadPdfButton);

            // Set the popup's body (with file name input) and footer (buttons).
            popup.setBody(container.get());
            popup.setFooter(buttonsContainer.get());
          } catch (error) {
            console.error(error);
            this.toast.error("Error initializing download popup.");
          }
        },
      );

    this.modal.appendFooter(downloadButton);
  }
}
