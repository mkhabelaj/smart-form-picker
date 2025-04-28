import { getStorage } from "../../../api";
import TemplateControllerButton from "../TemplateControllerButton";

export default class LoadFromButton extends TemplateControllerButton {
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
    const savedNamesListKey = this.savedNamesListKey;
    const textArea = this.textArea;

    const loadFromButton =
      this.elementbuilder.buttons.build.buildSecondaryButton(
        "Load From",
        async () => {
          try {
            const { popup, container } =
              this.createContainerAndPopup("Load Template");
            // Build a dropdown (select element) with a default option.
            const loadSelect = this.elementbuilder.select.build(
              "-- Select Template --",
            );

            // Retrieve the stored template names from storage.
            const result = await getStorage(savedNamesListKey);
            const savedNames = result[savedNamesListKey] || [];
            savedNames.forEach((name) => loadSelect.addOption(name, name));

            container.appendChild(loadSelect.get());

            const loadPopupButton =
              this.elementbuilder.buttons.build.buildPrimaryButton(
                "Load",
                async () => {
                  try {
                    const selectedName = loadSelect.get().value;
                    if (!selectedName) {
                      throw new Error("No template selected");
                    }
                    // Retrieve the template content using the selected name as key.
                    const templateResult = await getStorage(selectedName);
                    const template = templateResult[selectedName];
                    if (template === undefined) {
                      throw new Error("Template not found in storage");
                    }
                    // Set the textarea with the loaded template.
                    textArea.value = template;
                    // TODO: Optionally reset the template select loader if needed.
                    this.toast.success(`Template loaded from ${selectedName}.`);
                    popup.close();
                  } catch (error) {
                    console.error(error);
                    this.toast.error("Error loading template.");
                  }
                },
                this.elementbuilder.buttons.buttonSize.small,
              );

            popup.setBody(container.get());
            popup.setFooter(loadPopupButton);
          } catch (error) {
            console.error(error);
            this.toast.error("Error loading template.");
          }
        },
      );

    this.modal.appendFooter(loadFromButton);
  }
}
