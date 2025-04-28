import { getStorage, setStorage } from "../../../api";
import TemplateControllerButton from "../TemplateControllerButton";

export default class SaveAsButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   *
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    console.log(this.templateController);
    this.#init();
  }
  #init() {
    const savedNamesListKey = this.savedNamesListKey;
    const textArea = this.textArea;

    const saveAsButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Save As",
      () => {
        const { popup, container } =
          this.createContainerAndPopup("Save Template As");

        const saveAsInput = this.elementbuilder.input.build({
          attributes: { placeholder: "Template Name" },
        });

        container.appendChild(saveAsInput);

        const savePopupButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Save",
            async () => {
              try {
                const templateName = saveAsInput.value;
                const template = textArea.value;
                this.checkIfTextAreaIsEmpty();
                // Retrieve the stored list of template names.
                const result = await getStorage(savedNamesListKey);
                let savedNames = result[savedNamesListKey] || [];
                // If the template name already exists, throw an error.
                if (savedNames.includes(templateName)) {
                  throw new Error("Template name already exists");
                }
                // Add the new template name to the list.
                savedNames.push(templateName);
                // Save the template under its name and update the saved names list.
                await setStorage({
                  [templateName]: template,
                  [savedNamesListKey]: savedNames,
                });
                this.toast.success(`Template saved as ${templateName}.`);
                popup.close();
              } catch (error) {
                console.error(error);
                this.toastEmptyTextAreaError(error);
                this.toast.error("Error saving template.");
              }
            },
            this.elementbuilder.buttons.buttonSize.small,
          );

        popup.setBody(container.get());
        popup.setFooter(savePopupButton);
      },
    );

    this.modal.appendFooter(saveAsButton);
  }
}
