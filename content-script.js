/**
 * Class ModelHeader
 * Represents the header section of the modal.
 * Provides methods to create and access the header element.
 */
class ModelHeader {
  constructor() {
    this.header = this.create();
  }

  /**
   * Creates the header element with basic styling.
   * @returns {HTMLElement} The header div element.
   */
  create() {
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-around";
    header.style.marginBottom = "15px";
    return header;
  }

  /**
   * Returns the header element.
   * @returns {HTMLElement} The header element.
   */
  get() {
    return this.header;
  }

  /**
   * Appends a given item to the header.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.header.append(item);
  }
}

/**
 * Class ModelContent
 * Represents the content section of the modal.
 * It handles content manipulation like clearing or rendering new content.
 */
class ModelContent {
  constructor() {
    this.content = this.#create();
  }

  /**
   * Creates the content element with a dedicated ID.
   * @returns {HTMLElement} The content div element.
   */
  #create() {
    const content = document.createElement("div");
    content.id = "modal-content";
    return content;
  }

  /**
   * Returns the content element.
   * @returns {HTMLElement} The content element.
   */
  get() {
    return this.content;
  }

  /**
   * Appends a given item to the content area.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.content.append(item);
  }

  /**
   * Clears the content area.
   */
  clear() {
    this.content.innerHTML = "";
  }

  /**
   * Clears existing content and appends new content.
   * @param {HTMLElement} item - The element to render.
   */
  render(item) {
    this.clear();
    this.content.append(item);
  }
}

/**
 * Class ModelFooter
 * Represents the footer section of the modal.
 * Provides methods to create and access the footer element.
 */
class ModelFooter {
  constructor() {
    this.footer = this.create();
  }

  /**
   * Creates the footer element with basic styling.
   * @returns {HTMLElement} The footer div element.
   */
  create() {
    const footer = document.createElement("div");
    footer.style.display = "flex";
    footer.style.justifyContent = "space-around";
    footer.style.marginBottom = "15px";
    return footer;
  }

  /**
   * Returns the footer element.
   * @returns {HTMLElement} The footer element.
   */
  get() {
    return this.footer;
  }

  /**
   * Appends a given item to the footer.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.footer.append(item);
  }
}

/**
 * Class Overlay
 * Represents the overlay container that acts as the backdrop for the modal.
 * Provides methods to create, access, append to, and remove the overlay.
 */
class Overlay {
  constructor() {
    this.overlay = this.#create();
    document.body.append(this.overlay);
  }

  /**
   * Creates the overlay element with full-screen styling.
   * @returns {HTMLElement} The overlay div element.
   */
  #create() {
    const overlay = document.createElement("div");
    overlay.id = "data-modal-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 10000;
    return overlay;
  }

  /**
   * Returns the overlay element.
   * @returns {HTMLElement} The overlay element.
   */
  get() {
    return this.overlay;
  }

  /**
   * Appends a given item to the overlay.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.overlay.append(item);
  }

  /**
   * Removes the overlay from the DOM.
   */
  remove() {
    this.overlay.remove();
  }
}

/**
 * Class SimpleModel
 * A composite class that brings together Overlay, ModelHeader, ModelContent, and ModelFooter
 * to create a complete modal dialog encapsulated within a Shadow DOM.
 */
class SimpleModel {
  constructor() {
    // Create overlay and modal sections.
    this.overlay = new Overlay();
    this.header = new ModelHeader();
    this.content = new ModelContent();
    this.footer = new ModelFooter();
    // Create the modal host element with Shadow DOM.
    this.modal = this.create();

    // Get the modal container inside the Shadow DOM.
    const shadow = this.modal.shadowRoot;
    const modalContainer = shadow.getElementById("data-modal");

    // Append header, content, and footer to the modal container.
    modalContainer.appendChild(this.header.get());
    modalContainer.appendChild(this.content.get());
    modalContainer.appendChild(this.footer.get());

    // Append the complete modal host to the overlay.
    this.overlay.append(this.modal);
  }

  /**
   * Creates the modal host element, attaches a Shadow DOM, injects styling,
   * and returns the host element.
   * @returns {HTMLElement} The modal host element with an attached shadow root.
   */
  create() {
    const modalHost = document.createElement("div");
    modalHost.id = "data-modal-host";

    // Attach a shadow root.
    const shadow = modalHost.attachShadow({ mode: "open" });

    // Create the actual modal container.
    const modalContainer = document.createElement("div");
    modalContainer.id = "data-modal";

    // Create a style element for the modal encapsulated within Shadow DOM.
    const style = document.createElement("style");
    style.textContent = `
      #data-modal {
        background: #fff;
        padding: 20px;
        border-radius: 8px;
        min-width: 300px;
        max-width: 500px;
        box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
        font-family: Arial, sans-serif;
      }
      /* Styling for header, content, and footer could be added here if needed */
    `;
    shadow.appendChild(style);
    shadow.appendChild(modalContainer);

    return modalHost;
  }

  /**
   * Returns the overlay element that contains the modal.
   * @returns {HTMLElement} The overlay element.
   */
  getOverlay() {
    return this.overlay.get();
  }

  /**
   * Returns the modal container element from inside the Shadow DOM.
   * @returns {HTMLElement} The modal container element.
   */
  getModal() {
    return this.modal.shadowRoot.getElementById("data-modal");
  }

  /**
   * Appends an additional item to the modal container.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.getModal().append(item);
  }
}

/**
 * Fetches JSON data from the extension's assets.
 * @param {string} fileName - The name of the JSON file to load.
 * @returns {Promise<Object>} The parsed JSON data.
 */
async function fetchData(fileName) {
  const url = chrome.runtime.getURL(`data/${fileName}`);
  const response = await fetch(url);
  return await response.json();
}

/**
 * Fetches Blob data from the extension's assets.
 * @param {string} fileName - The name of the file to load.
 * @returns {Promise<Object>} The parsed Blob data.
 */
async function fetchBlob(fileName) {
  const url = chrome.runtime.getURL(`data/${fileName}`);
  const response = await fetch(url);
  return await response.blob();
}

//TODO: Add DropzoneHelper

class FileUploadHelper {
  constructor() {
    this.modal = new SimpleModel();
    this.#updateHeader();
    this.#loadContent();
    this.#andCloseButton();
  }
  #updateHeader() {
    const h3 = document.createElement("h3");
    h3.textContent = "Smart Form Uploadler";
    this.modal.header.append(h3);
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
    this.modal.content.append(form);
  }

  // Creates and returns a new form element.
  #createForm() {
    const form = document.createElement("form");
    form.style.border = "1px solid #000";
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

  #andCloseButton() {
    const closeButton = document.createElement("button");
    closeButton.textContent = "Close";
    closeButton.style.marginTop = "15px";
    this.modal.footer.append(closeButton);
    const self = this;
    //TODO remove listeners
    closeButton.addEventListener("click", function handler() {
      self.modal.overlay.remove();
      document.removeEventListener("click", handler);
    });
  }
}

/**
 * Class FillHelper
 * Orchestrates the modal population and event handling.
 * Loads read-only data (from JSON files) to provide manual auto-fill options.
 */
class FillHelper {
  /**
   * Constructs a FillHelper with the target field and creates the modal.
   * @param {HTMLElement} target - The form field to be populated.
   */
  constructor(target) {
    this.target = target;
    this.modal = new SimpleModel();
    this.#loaderHeaderTabs();
    this.#loadInitialContent();
    this.#addCancelButton();
  }

  /**
   * Adds a cancel button to the modal footer.
   * Clicking the cancel button removes the overlay.
   * TODO: Remove event listeners when no longer needed.
   */
  #addCancelButton() {
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.marginTop = "15px";
    this.modal.footer.append(cancelButton);
    const self = this;
    cancelButton.addEventListener("click", function () {
      self.modal.overlay.remove();
    });
  }

  /**
   * Renders a key/value list within the modal content.
   * @param {Object} dataObj - An object containing key/value pairs.
   */
  #keyValueRender(dataObj) {
    const list = this.#keyPairToUl(dataObj);
    this.modal.content.render(list);
  }

  /**
   * Renders a profile section based on provided data.
   * Assumes dataObj contains nested key/value pairs.
   * @param {Object} dataObj - The profile data object.
   */
  #profileRender(dataObj) {
    const section = document.createElement("section");
    for (const key in dataObj) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = key;
      details.append(summary);
      details.append(this.#keyPairToUl(dataObj[key]));
      section.append(details);
    }
    this.modal.content.render(section);
  }

  /**
   * Converts a key/value object to an unordered list.
   * Each list item has a click listener that populates the target field.
   * @param {Object} dataObj - The object containing key/value pairs.
   * @returns {HTMLElement} An unordered list element.
   */
  #keyPairToUl(dataObj) {
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    for (const key in dataObj) {
      const listItem = document.createElement("li");
      listItem.style.padding = "8px";
      listItem.style.borderBottom = "1px solid #ddd";
      listItem.style.cursor = "pointer";
      const value = dataObj[key];
      let limited = value.slice(0, 70);
      listItem.textContent = `${key}: ${limited}`;
      const self = this;
      listItem.addEventListener("click", () => {
        self.target.value = dataObj[key];
        self.modal.overlay.remove();
      });
      list.appendChild(listItem);
    }
    return list;
  }

  /**
   * Loads the initial content into the modal.
   * Displays a default informational message.
   */
  #loadInitialContent() {
    const info = document.createElement("p");
    info.textContent = "Select the tabs above for the desired fill content";
    this.modal.content.render(info);
  }

  /**
   * Loads header tabs based on a JSON mapping of resource files.
   * Registers an event handler based on the type (keyValue or profile).
   */
  async #loaderHeaderTabs() {
    const resourceMap = await fetchData("mapping.json");
    for (const fileName of resourceMap["tabs"]) {
      const data = await fetchData(fileName);
      const tab = document.createElement("button");
      tab.textContent = data["name"];
      this.modal.header.append(tab);
      const self = this;
      if (!("type" in data)) {
        throw Error(`${key} does not contain "type" key`);
      }
      switch (data["type"]) {
        case "keyValue":
          tab.addEventListener("click", function () {
            self.#keyValueRender(data["data"]);
          });
          break;
        case "profile":
          tab.addEventListener("click", function () {
            self.#profileRender(data["data"]);
          });
          break;
        default:
          throw Error(
            "Unrecognized resource type. Valid types are keyValue, profile",
          );
      }
    }
  }
}

document.addEventListener("keydown", (event) => {
  // Ctrl+U triggers upload open.
  if (event.ctrlKey && event.key === "u") {
    event.preventDefault();
    new FileUploadHelper();
  }
});

// Event listener to trigger the modal via a keyboard shortcut (Ctrl+M)
// when an INPUT or TEXTAREA element is focused.
document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    target.addEventListener("keydown", function handler(e) {
      // Ctrl+M triggers the modal to open.
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        new FillHelper(target);
        target.removeEventListener("keydown", handler);
      }
    });
  }
});
