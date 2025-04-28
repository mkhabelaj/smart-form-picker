import {
  getGeneratedGoogleLikeJsPDF,
  getInputLabelContent,
  injectBlobToFile,
} from "../../../utils";
import TemplateControllerAction from "../TemplateControllerAtionc";

export default class UploadPdfButton extends TemplateControllerAction {
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

    const uploadPdfButton = this.makeSecondaryButton("Upload PDF", async () => {
      try {
        // Get all file upload inputs on the page
        const fileInputs = document.querySelectorAll('input[type="file"]');
        if (fileInputs.length === 0) {
          throw new Error("No file upload inputs found on this page.");
        }

        // Create a popup for selecting the file input and naming the PDF
        const { popup, container } = this.createContainerAndPopup("Upload PDF");

        // Create a dropdown (select) element to list each file input.
        // We’ll label them by their name attribute (if available) or by index.
        const inputSelect = this.elementbuilder.select.build(
          "-- Select Upload Input --",
        );
        fileInputs.forEach((input, index) => {
          const label = `File Input ${index + 1} (${getInputLabelContent(input)})`;
          inputSelect.addOption(label, index.toString());
        });
        container.appendChild(inputSelect.get());

        // Create an input field for the PDF filename (without extension)
        const fileNameInput = this.elementbuilder.input.build({
          attributes: {
            placeholder: "Enter PDF File Name",
          },
        });
        container.appendChild(fileNameInput);

        // Create an "Upload" button inside the popup.
        const uploadButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Upload",
            async () => {
              try {
                // Ensure a file input was selected
                const selectedIndex = inputSelect.get().value;
                if (selectedIndex === "") {
                  this.toast.error("No file input selected.");
                  throw new Error("No file input selected.");
                }
                const fileInput = fileInputs[parseInt(selectedIndex)];

                const text = textArea.value;
                this.checkIfTextAreaIsEmpty();
                const doc = getGeneratedGoogleLikeJsPDF(text);

                // Generate the PDF as a Blob.
                const pdfBlob = doc.output("blob");

                // Create a File object for the PDF.
                const fileName =
                  (fileNameInput.value.trim() || "template") + ".pdf";

                injectBlobToFile(
                  pdfBlob,
                  fileInput,
                  fileName,
                  "application/pdf",
                );

                popup.close();
                this.toast.success(`PDF uploaded as ${fileName}`);
              } catch (error) {
                this.toastEmptyTextAreaError(error);
                console.error(error);
                this.toast.error("Error uploading PDF.");
              }
            },
            this.elementbuilder.buttons.buttonSize.small,
          );

        popup.setBody(container.get());
        popup.setFooter(uploadButton);
      } catch (error) {
        console.error(error);
        this.toast.error("Error initializing PDF upload.");
      }
    });

    // Append the Upload PDF button to the modal's footer.
    this.modal.appendFooter(uploadPdfButton);
  }
}
