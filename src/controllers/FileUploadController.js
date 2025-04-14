import SimpleModal from "../modals/SimpleModal.js";
import { fetchData, fetchBlob } from "../api.js";

export default class FileUploadController {
  constructor() {
    this.modal = new SimpleModal("Smart File Upload");
    this.#loadContent();
  }

  async #loadContent() {
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
    const submitButton = this.#createSubmitButton();
    form.appendChild(submitButton);

    // Append the completed form to your modal content area
    this.modal.renderContent(form);
  }

  // Creates and returns a new form element.
  #createForm() {
    const form = document.createElement("form");
    form.style.display = "flex";
    form.style.flexDirection = "column";
    form.style.padding = "10px";
    return form;
  }

  // Attaches a submit handler to the form. The handler retrieves the selected target using targetMap.
  #attachFormSubmitHandler(form, targetMap, resourceMap) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      const formData = new FormData(e.target);
      const selectedTargetId = formData.get("target-list");
      const fileInput = formData.get("file-list");
      const targetInput = targetMap.get(selectedTargetId);
      const blob = await fetchBlob(resourceMap[fileInput]);
      this.#injectBlob(blob, targetInput, resourceMap[fileInput]);
    };
  }

  #injectBlob(blob, target, fileName) {
    console.log("Injecting file:", fileName, blob, target);
    try {
      const file = new File([blob], fileName, {
        type: blob.type || "text/plain",
      });
      const dataTransfer = new DataTransfer();
      dataTransfer.items.add(file);
      target.files = dataTransfer.files;
      target.dispatchEvent(new Event("change", { bubbles: true }));
    } catch (error) {
      console.error("Error injecting file:", error);
    }
  }

  // Creates a submit button element and sets up its properties.
  #createSubmitButton() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "center";
    const button = document.createElement("button");
    button.type = "submit";
    button.textContent = "Upload";
    container.appendChild(button);
    return container;
  }

  // Creates a container element to hold the form sections.
  #createContainer() {
    const container = document.createElement("div");
    container.style.display = "flex";
    container.style.justifyContent = "space-around";
    container.style.marginBottom = "15px";
    return container;
  }

  // Creates two sub-containers: one for the target selector and one for the file selector.
  #createSubContainers() {
    const targetContainer = document.createElement("div");
    targetContainer.style.width = "100%";
    const fileContainer = document.createElement("div");
    fileContainer.style.width = "100%";
    return { targetContainer, fileContainer };
  }

  // Builds and returns a <select> element for choosing files,
  // populating it with options based on the provided resourceMap.
  #createFileSelect(resourceMap) {
    const select = document.createElement("select");
    select.name = "file-list";
    select.style.width = "100%";
    select.style.marginBottom = "15px";

    const defaultOption = document.createElement("option");
    defaultOption.value = "";
    defaultOption.textContent = "Select a file";

    select.appendChild(defaultOption);
    for (const name in resourceMap["files"]) {
      const option = document.createElement("option");
      option.value = name;
      option.textContent = name;
      select.appendChild(option);
    }
    return select;
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
    const targetSelect = document.createElement("select");
    targetSelect.name = "target-list";

    // Add a default option.
    const defaultOption = document.createElement("option");
    defaultOption.value = "none";
    defaultOption.textContent = "Select a target";
    targetSelect.appendChild(defaultOption);

    // Create options from the targetMap identifiers.
    for (const [id] of targetMap.entries()) {
      const option = document.createElement("option");
      option.value = id;
      option.textContent = id;
      targetSelect.appendChild(option);
    }
    return targetSelect;
  }
}
