import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../elements/GenericElement.js";
import { fetchData, fetchText, setStorage, getStorage } from "../api.js";
import SimpleElementBuilder from "../builders/SimpleElementBuilder.js";
import SimplePopup from "../popups/simple-popup/SimplePopup.js";
import { Toast } from "../toasts/Toast.js";
import { createPDF, getGeneratedJsPDF, injectBlobToFile } from "../utils.js";

export default class TemplateController {
  #textArea;
  #container;
  #savedNamesListKey = "savedNamesList";
  #templateSelectLoader;

  constructor() {
    this.toast = new Toast();
    this.elementbuilder = SimpleElementBuilder;
    this.#container = this.#createContainer();
    // Kick off the template select loader early so it’s added to the container.
    this.#createTemplateSelectLoader();
    this.#textArea = this.#createTexArea();
    this.#container.append(this.#textArea);

    this.modal = new SimpleModal("Template Picker");
    this.#createTemplateAreaClearButton();
    this.#createClearPopupButton();
    this.#createLoadFromButton();
    this.#createDownloadButton();
    this.#createUploadPdfButton();
    this.#createCopyButton();
    this.#createSaveAsButton();
    this.modal.renderContent(this.#container);
  }

  #createTemplateAreaClearButton() {
    const textArea = this.#textArea;
    const clearTemplateButton =
      this.elementbuilder.buttons.build.buildDangerButton(
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
                this.toast.success(`Template saved as ${templateName}.`);
                popup.close();
              } catch (error) {
                console.error(error);
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

  // Creates a "Load From" button that opens a popup with a dropdown list to select and load a template.
  #createLoadFromButton() {
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const loadFromButton =
      this.elementbuilder.buttons.build.buildSecondaryButton(
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

  // Creates a "Clear Template" button that opens a popup to select and remove a saved template.
  #createClearPopupButton() {
    const savedNamesListKey = this.#savedNamesListKey;
    const textArea = this.#textArea;

    const clearButton = this.elementbuilder.buttons.build.buildDangerButton(
      "Delete Saved",
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
      },
    );

    this.modal.appendFooter(clearButton);
  }

  // Placeholder for future implementation
  #createCopyButton() {
    const textArea = this.#textArea;

    const copyButton = this.elementbuilder.buttons.build.buildSecondaryButton(
      "Copy",
      async () => {
        try {
          const template = textArea.value;
          if (template === "") {
            this.toast.error("No text available to copy!");
            throw new Error("No text available to copy!");
          }
          // Use the Clipboard API to write text to the clipboard.
          await navigator.clipboard.writeText(template);
          this.toast.success("Template copied to clipboard.");
        } catch (error) {
          console.error(error);
          this.toast.error("Error copying template.");
        }
      },
    );

    // Append the Copy button to the modal's footer.
    this.modal.appendFooter(copyButton);
  }
  #createDownloadButton() {
    const textArea = this.#textArea;

    const downloadButton =
      this.elementbuilder.buttons.build.buildSecondaryButton(
        "Download",
        async () => {
          try {
            // Create a popup for downloading the template.
            const popup = new SimplePopup("Download Template");
            const container = new GenericElement("div", {
              styles: {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              },
            });

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
                    if (template === "") {
                      this.toast.error("No text available to download!");
                      throw new Error("No text available to download!");
                    }
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

                    if (template === "") {
                      this.toast.error("No text available to download!");
                      throw new Error("No text available to download!");
                    }
                    createPDF(template, fileName);
                    popup.close();
                    this.toast.success(`PDF saved as ${fileName}.pdf`);
                  } catch (error) {
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
  #createUploadPdfButton() {
    const textArea = this.#textArea;

    const uploadPdfButton =
      this.elementbuilder.buttons.build.buildSecondaryButton(
        "Upload PDF",
        async () => {
          try {
            // Get all file upload inputs on the page
            const fileInputs = document.querySelectorAll('input[type="file"]');
            if (fileInputs.length === 0) {
              throw new Error("No file upload inputs found on this page.");
            }

            // Create a popup for selecting the file input and naming the PDF
            const popup = new SimplePopup("Upload PDF");
            const container = new GenericElement("div", {
              styles: {
                display: "flex",
                flexDirection: "column",
                gap: "10px",
              },
            });

            // Create a dropdown (select) element to list each file input.
            // We’ll label them by their name attribute (if available) or by index.
            const inputSelect = this.elementbuilder.select.build(
              "-- Select Upload Input --",
            );
            fileInputs.forEach((input, index) => {
              const label = input.name
                ? `${input.name} (${index + 1})`
                : `File Input ${index + 1}`;
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
                    if (text === "") {
                      this.toast.error("No text available to upload!");
                      throw new Error("No text available to upload!");
                    }
                    const doc = getGeneratedJsPDF(text);

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
        },
      );

    // Append the Upload PDF button to the modal's footer.
    this.modal.appendFooter(uploadPdfButton);
  }
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
      this.toast.error("Error loading templates.");
    }
  }
}
