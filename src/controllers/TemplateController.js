import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../elements/GenericElement.js";
import { fetchData, fetchText, setStorage, getStorage } from "../api.js";
import SimpleElementBuilder from "../builders/SimpleElementBuilder.js";
import SimplePopup from "../popups/simple-popup/SimplePopup.js";

export default class TemplateController {
  #textArea;
  #container;
  #savedNamesListKey = "savedNamesList";
  #templateSelectLoader;

  constructor() {
    this.elementbuilder = SimpleElementBuilder;
    this.#container = this.#createContainer();
    // Kick off the template select loader early so it’s added to the container.
    this.#createTemplateSelectLoader();
    this.#textArea = this.#createTexArea();
    this.#container.append(this.#textArea);

    this.modal = new SimpleModal("Template Picker");
    this.#createSaveAsButton();
    this.#createLoadFromButton();
    this.#createClearPopupButton();
    this.#createTemplateAreaClearButton();
    this.#createCopyButton();
    this.modal.renderContent(this.#container);
  }

  #createTemplateAreaClearButton() {
    const textArea = this.#textArea;
    const clearTemplateButton =
      this.elementbuilder.buttons.build.buildPrimaryButton(
        "Clear Area",
        async () => {
          try {
            // Create a popup with a confirmation message.
            const popup = new SimplePopup("Clear Template Area");
            const container = new GenericElement("div", {
              styles: {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              },
            });

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
                  popup.close();
                },
                this.elementbuilder.buttons.buttonSize.small,
              );

            // Create the cancel button.
            const cancelButton =
              this.elementbuilder.buttons.build.buildPrimaryButton(
                "Cancel",
                async () => {
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
            buttonContainer.appendChild(cancelButton);

            // Set the popup body and footer.
            popup.setBody(container.get());
            popup.setFooter(buttonContainer.get());
          } catch (error) {
            alert("Error clearing template area: " + error);
          }
        },
      );

    // Append the clear button to the modal's footer.
    this.modal.appendFooter(clearTemplateButton);
  }
  // Creates a "Save As" button that opens a popup to let the user save the current template.
  #createSaveAsButton() {
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const saveAsButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Save As",
      () => {
        const popup = new SimplePopup("Save Template As");
        const container = new GenericElement("div", {
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: "10px",
          },
        });

        const saveAsInput = new GenericElement("input", {
          attributes: { type: "text", placeholder: "Template Name" },
          styles: { width: "100%", borderRadius: "5px", padding: "5px" },
        });
        container.appendChild(saveAsInput);

        const savePopupButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Save",
            async () => {
              try {
                const templateName = saveAsInput.get().value;
                const template = textArea.value;
                if (templateName === "") {
                  throw new Error("Template name cannot be empty");
                }
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
                popup.close();
              } catch (error) {
                alert(error);
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

  // Creates a "Load From" button that opens a popup with a dropdown list to select and load a template.
  #createLoadFromButton() {
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const loadFromButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Load From",
      async () => {
        try {
          const popup = new SimplePopup("Load Template");
          const container = new GenericElement("div", {
            styles: {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
          });
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
                  popup.close();
                } catch (error) {
                  alert(error);
                }
              },
              this.elementbuilder.buttons.buttonSize.small,
            );

          popup.setBody(container.get());
          popup.setFooter(loadPopupButton);
        } catch (error) {
          alert(error);
        }
      },
    );

    this.modal.appendFooter(loadFromButton);
  }

  // Creates a "Clear Template" button that opens a popup to select and remove a saved template.
  #createClearPopupButton() {
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const clearButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Clear Template",
      async () => {
        try {
          const popup = new SimplePopup("Clear Template");
          const container = new GenericElement("div", {
            styles: {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
          });
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

                  popup.close();
                } catch (error) {
                  alert(error);
                }
              },
              this.elementbuilder.buttons.buttonSize.small,
            );

          popup.setBody(container.get());
          popup.setFooter(clearPopupButton);
        } catch (error) {
          alert(error);
        }
      },
    );

    this.modal.appendFooter(clearButton);
  }

  // Placeholder for future implementation
  #createCopyButton() {
    const textArea = this.#textArea;

    const copyButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Copy",
      async () => {
        try {
          const template = textArea.value;
          if (!template) {
            throw new Error("No text available to copy!");
          }
          // Use the Clipboard API to write text to the clipboard.
          await navigator.clipboard.writeText(template);
          alert("Template copied to clipboard!");
        } catch (error) {
          alert("Error copying template: " + error);
        }
      },
      this.elementbuilder.buttons.buttonSize.small,
    );

    // Append the Copy button to the modal's footer.
    this.modal.appendFooter(copyButton);
  }
  #createDownloadButton() {}
  #createDownloadAsButton() {}

  // Creates the container element.
  #createContainer() {
    const container = new GenericElement("div", {
      styles: {
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      },
    });
    return container.get();
  }

  // Creates the textarea element.
  #createTexArea() {
    const textArea = new GenericElement("textarea", {
      attributes: {
        placeholder: "Paste your template here",
        rows: 10,
        cols: 50,
      },
      styles: {
        width: "100%",
        borderRadius: "5px",
      },
    });
    return textArea.get();
  }

  // Initializes the template select loader to load templates from mapping.json into a select element.
  async #createTemplateSelectLoader() {
    try {
      const data = await fetchData("mapping.json");
      const templateSelect =
        this.elementbuilder.select.build("Select Template");

      templateSelect.setOnChange(async (e) => {
        const selectedValue = e.target.value;
        console.log(selectedValue);
        const text = await fetchText(selectedValue);
        this.#textArea.value = text;
      });

      for (const name of data["templates"]) {
        templateSelect.addOption(name, name);
      }
      this.#templateSelectLoader = templateSelect.get();
      this.#container.append(this.#templateSelectLoader);
    } catch (error) {
      console.error("Error loading templates:", error);
    }
  }
}
