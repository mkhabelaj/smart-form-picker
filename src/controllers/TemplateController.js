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
    this.#createTemplateSelectLoader();
    this.#textArea = this.#createTexArea();
    this.#container.append(this.#textArea);
    this.modal = new SimpleModal("Template Picker");
    this.#createSaveAsButton();
    this.#createLoadFromButton();
    this.#createClearPopupButton();
    this.modal.renderContent(this.#container);
  }

  // Method to create the "Save As" button
  #createSaveAsButton() {
    const self = this;
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
          attributes: {
            type: "text",
            placeholder: "Template Name",
          },
          styles: {
            width: "100%",
            borderRadius: "5px",
            padding: "5px",
          },
        });
        container.appendChild(saveAsInput);

        const savePopupButton =
          self.elementbuilder.buttons.build.buildPrimaryButton(
            "Save",
            async () => {
              try {
                const templateName = saveAsInput.get().value;
                const template = textArea.value;
                if (templateName === "") {
                  throw new Error("Template name cannot be empty");
                }
                // Retrieve the stored list of names
                const result = await getStorage(savedNamesListKey);
                let savedNames = result[savedNamesListKey] || [];
                // Check if the template name already exists
                if (savedNames.includes(templateName)) {
                  throw new Error("Template name already exists");
                }
                // Add the new template name to the list
                savedNames.push(templateName);
                // Save both the template and the updated list to storage
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

  // Method to create the "Load From" button with a dropdown
  #createLoadFromButton() {
    const self = this;
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
          // Create a dropdown (select element) for choosing a template
          const loadSelect = this.elementbuilder.select.build(
            "-- Select Template --",
          );

          // Retrieve the list of saved template names from storage
          const result = await getStorage(savedNamesListKey);
          const savedNames = result[savedNamesListKey] || [];
          console.log(savedNames);

          // Populate the dropdown with an option for each saved template name
          savedNames.forEach((name) => {
            loadSelect.addOption(name, name);
          });

          container.appendChild(loadSelect.get());

          // Create the "Load" button within the popup
          const loadPopupButton =
            self.elementbuilder.buttons.build.buildPrimaryButton(
              "Load",
              async () => {
                try {
                  const selectedName = loadSelect.get().value;
                  if (!selectedName) {
                    throw new Error("No template selected");
                  }
                  // Retrieve the template content using the selected name as key
                  const templateResult = await getStorage(selectedName);
                  const template = templateResult[selectedName];
                  if (template === undefined) {
                    throw new Error("Template not found in storage");
                  }
                  // Set the textarea with the loaded template
                  textArea.value = template;
                  //TODO:reset the template select loader
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
  // Method to create the "Clear Template" popup button
  #createClearPopupButton() {
    const self = this;
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const clearButton = this.elementbuilder.buttons.build.buildPrimaryButton(
      "Clear Template",
      async () => {
        try {
          // Create a new popup for clearing a template
          const popup = new SimplePopup("Clear Template");

          // Create a container element for the popup body
          const container = new GenericElement("div", {
            styles: {
              display: "flex",
              flexDirection: "column",
              gap: "10px",
            },
          });

          // Create a dropdown (select) element to list saved template names
          const clearSelect = this.elementbuilder.select.build(
            "-- Select Template to Clear --",
          );

          // Retrieve the stored list of saved template names
          const result = await getStorage(savedNamesListKey);
          const savedNames = result[savedNamesListKey] || [];

          // Populate the dropdown with each saved template name
          savedNames.forEach((name) => {
            clearSelect.addOption(name, name);
          });

          container.appendChild(clearSelect.get());

          // Create the "Clear" button inside the popup
          const clearPopupButton =
            self.elementbuilder.buttons.build.buildPrimaryButton(
              "Clear",
              async () => {
                try {
                  // Get the selected template name from the dropdown
                  const selectedName = clearSelect.get().value;
                  if (!selectedName) {
                    throw new Error("No template selected for clearing");
                  }

                  // Optionally, check if the current content in the textarea matches the template being cleared.
                  const currentContent = textArea.value;

                  // Remove the template entry from chrome.storage
                  await new Promise((resolve, reject) => {
                    chrome.storage.local.remove(selectedName, () => {
                      if (chrome.runtime.lastError)
                        return reject(chrome.runtime.lastError);
                      resolve();
                    });
                  });

                  // Retrieve the current list and update it by filtering out the cleared template name
                  const listResult = await getStorage(savedNamesListKey);
                  let updatedNames = listResult[savedNamesListKey] || [];
                  updatedNames = updatedNames.filter(
                    (name) => name !== selectedName,
                  );
                  await setStorage({ [savedNamesListKey]: updatedNames });

                  // If the textarea is currently showing the cleared template's content, clear it.
                  if (
                    currentContent !== "" &&
                    currentContent ===
                      (await getStorage(selectedName))[selectedName]
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

          // Set the body and footer (button area) of the popup
          popup.setBody(container.get());
          popup.setFooter(clearPopupButton);
        } catch (error) {
          alert(error);
        }
      },
    );

    // Append the Clear Template button to the modal's footer
    this.modal.appendFooter(clearButton);
  }
  #copyButon() {}
  #createDownloadButton() {}
  #createDownloadAsButton() {}

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
  async #createTemplateSelectLoader() {
    const data = await fetchData("mapping.json");
    const templateSelect = this.elementbuilder.select.build("Select Template");

    templateSelect.setOnChange(async (e) => {
      console.log(e.target.value);
      const text = await fetchText(e.target.value);
      this.#textArea.value = text;
    });

    for (const name of data["templates"]) {
      templateSelect.addOption(name, name);
    }
    this.#templateSelectLoader = templateSelect.get();
    this.#container.append(this.#templateSelectLoader);
  }
}
