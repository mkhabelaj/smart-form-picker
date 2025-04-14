import SimpleModal from "../modals/SimpleModal.js";
import { fetchData } from "../api.js";
/**
 * Class FillHelper
 * Orchestrates the modal population and event handling.
 * Loads read-only data (from JSON files) to provide manual auto-fill options.
 */
export default class FormPickerController {
  /**
   * Constructs a FillHelper with the target field and creates the modal.
   * @param {HTMLElement} target - The form field to be populated.
   */
  constructor(target) {
    this.target = target;
    this.modal = new SimpleModal();
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
