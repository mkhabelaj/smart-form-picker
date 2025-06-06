import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import { fetchData, fetchBlob } from "../api.js";
import GenericElement from "../elements/GenericElement.js";
import { Toast } from "../toasts/Toast.js";
import { getInputLabelContent, injectBlobToFile } from "../utils.js";

export default class FileUploadController {
  constructor() {
    this.toast = new Toast();
    this.modal = new SimpleModal("Smart File Upload");
    this.#loadContent();
  }

  async #loadContent() {
    try {
      // Load resource map data (e.g., a JSON mapping)
      const resourceMap = await fetchData("mapping.json");

      // Create the form
      const form = this.#createForm();

      // Build the targetMap from available file inputs
      const targetMap = this.#buildTargetMap();

      // Attach the form submit handler that uses the targetMap
      this.#attachFormSubmitHandler(form, targetMap, resourceMap["files"]);

      // Create the container for sub-sections and append it
      const container = this.#createContainer();
      form.appendChild(container);

      // Create inner containers for file and target selectors
      const { targetContainer, fileContainer } = this.#createSubContainers();
      container.appendChild(targetContainer);
      container.appendChild(fileContainer);

      // Create a multiple file select dropdown (based on resourceMap)
      const fileSelect = this.#createFileSelect(resourceMap);
      fileContainer.appendChild(fileSelect);

      // Create a target dropdown using the targetMap
      const targetSelect = this.#createTargetSelect(targetMap);
      targetContainer.appendChild(targetSelect);

      // Create and append the submit button to the form
      const submitButton =
        this.modal.elementBuilder.buttons.build.buildPrimaryButton(
          "Upload",
          () => {
            form.requestSubmit();
          },
        );

      this.modal.appendFooter(submitButton);

      // Append the completed form to your modal content area
      this.modal.renderContent(form);
    } catch (error) {
      console.error("Error loading content:", error);
      this.toast.error("Error loading content.");
    }
  }

  // Creates and returns a new form element.
  #createForm() {
    const form = new GenericElement("form", {
      styles: {
        display: "flex",
        flexDirection: "column",
        padding: "10px",
      },
    });
    return form.get();
  }

  // Attaches a submit handler to the form. The handler retrieves the selected target using targetMap.
  #attachFormSubmitHandler(form, targetMap, resourceMap) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      try {
        const formData = new FormData(e.target);
        const selectedTargetId = formData.get("target-list");
        const fileInput = formData.get("file-list");
        const targetInput = targetMap.get(selectedTargetId);
        const blob = await fetchBlob(resourceMap[fileInput]);
        injectBlobToFile(blob, targetInput, resourceMap[fileInput]);
        this.toast.success(`${resourceMap[fileInput]} successfully uploaded.`);
        this.modal.close();
      } catch (error) {
        console.error("Error uploading file:", error);
        this.toast.error("Error uploading file.");
      }
    };
  }

  #createContainer() {
    const container = new GenericElement("div", {
      styles: {
        display: "flex",
        justifyContent: "space-between",
        marginBottom: "15px",
        gap: "2px",
      },
    });
    return container.get();
  }

  // Creates two sub-containers: one for the target selector and one for the file selector.
  #createSubContainers() {
    const targetContainer = new GenericElement("div", {
      styles: {
        width: "100%",
      },
    });
    const fileContainer = new GenericElement("div", {
      styles: {
        width: "100%",
      },
    });
    return {
      targetContainer: targetContainer.get(),
      fileContainer: fileContainer.get(),
    };
  }

  // Builds and returns a <select> element for choosing files,
  // populating it with options based on the provided resourceMap.
  #createFileSelect(resourceMap) {
    const select = this.modal.elementBuilder.select.build("Select a file");
    select.setName("file-list");
    for (const name in resourceMap["files"]) {
      select.addOption(name, name);
    }
    return select.get();
  }

  // Searches the document for file inputs, builds a Map keyed by a unique identifier, and returns it.
  #buildTargetMap() {
    const targets = document.querySelectorAll('input[type="file"]');
    const targetMap = new Map();

    targets.forEach((target, index) => {
      let identifier = target.name || target.id;

      // If neither name nor id exists, generate a unique key.
      if (!identifier) {
        identifier = `file-target-${index}`;
        target.dataset.generatedId = identifier;
      }
      targetMap.set(identifier, target);
    });

    return targetMap;
  }

  // Creates and returns a <select> element for target file inputs, populated with options from targetMap.
  #createTargetSelect(targetMap) {
    const targetSelect =
      this.modal.elementBuilder.select.build("Select a target");
    targetSelect.setName("target-list");

    // Create options from the targetMap identifiers.
    for (const [id] of targetMap.entries()) {
      const label = getInputLabelContent(targetMap.get(id));
      targetSelect.addOption(label || id, id);
    }

    return targetSelect.get();
  }
}
