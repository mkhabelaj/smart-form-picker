import { getStorage, setStorage } from "../../../api";
import ModalDialog from "../../../modals/modals/ModalDialog";
import TemplateController from "../../TemplateController";
import TemplateControllerAction from "../TemplateControllerAtionc";

export default class ClearPopupButton extends TemplateControllerAction {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {ModalDialog} modal
   * @param {TemplateController} templateController
   *
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.#initClearPopup();
  }

  #initClearPopup() {
    const savedNamesListKey = this.savedNamesListKey;
    const textArea = this.textArea;

    const clearButton = this.makeDangerButton("Delete Saved", async () => {
      try {
        const { popup, container } =
          this.createContainerAndPopup("Clear Template");
        // Build a dropdown for selecting which template to clear.
        const clearSelect = this.elementbuilder.select.build(
          "-- Select Template to Clear --",
        );

        // Retrieve the stored list of template names.
        const result = await getStorage(savedNamesListKey);
        const savedNames = result[savedNamesListKey] || [];
        savedNames.forEach((name) => clearSelect.addOption(name, name));

        container.appendChild(clearSelect.get());

        const clearPopupButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Clear",
            async () => {
              try {
                const selectedName = clearSelect.get().value;
                if (!selectedName) {
                  this.toast.error("No template selected for clearing");
                  throw new Error("No template selected for clearing");
                }

                // Optionally capture the current content in the textarea.
                const currentContent = textArea.value;

                // Remove the template entry from storage.
                await new Promise((resolve, reject) => {
                  chrome.storage.local.remove(selectedName, () => {
                    if (chrome.runtime.lastError) {
                      return reject(chrome.runtime.lastError);
                    }
                    resolve();
                  });
                });

                // Update the saved names list by filtering out the cleared template.
                const listResult = await getStorage(savedNamesListKey);
                let updatedNames = listResult[savedNamesListKey] || [];
                updatedNames = updatedNames.filter(
                  (name) => name !== selectedName,
                );
                await setStorage({ [savedNamesListKey]: updatedNames });

                // Clear the textarea if it was displaying the cleared template.
                const templateData = await getStorage(selectedName);
                if (
                  currentContent &&
                  currentContent === templateData[selectedName]
                ) {
                  textArea.value = "";
                }

                this.toast.success(`Template cleared from ${selectedName}.`);
                popup.close();
              } catch (error) {
                console.error(error);
                this.toast.error("Error clearing template.");
              }
            },
            this.elementbuilder.buttons.buttonSize.small,
          );

        popup.setBody(container.get());
        popup.setFooter(clearPopupButton);
      } catch (error) {
        console.error(error);
        this.toast.error("Error clearing template.");
      }
    });

    this.modal.appendFooter(clearButton);
  }
}
