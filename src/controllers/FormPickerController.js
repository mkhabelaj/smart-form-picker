import SimpleModal from "../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../elements/GenericElement.js";
import { fetchData } from "../api.js";
import { Toast } from "../toasts/Toast.js";
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
    this.toast = new Toast();
    this.target = target;
    this.modal = new SimpleModal("Smart Form Picker");
    this.#loaderHeaderTabs();
    this.#loadInitialContent();
  }

  /**
   * Renders a key/value list within the modal content.
   * @param {Object} dataObj - An object containing key/value pairs.
   */
  #keyValueRender(dataObj) {
    const list = this.#keyPairToUl(dataObj);
    this.modal.renderContent(list);
  }

  /**
   * Renders a profile section based on provided data.
   * Assumes dataObj contains nested key/value pairs.
   * @param {Object} dataObj - The profile data object.
   */
  #profileRender(dataObj) {
    const section = new GenericElement("section");
    for (const key in dataObj) {
      const details = new GenericElement("details");
      const summary = new GenericElement("summary");
      summary.setContent(key);
      details.appendChild(summary);
      details.appendChild(this.#keyPairToUl(dataObj[key]));
      section.appendChild(details);
    }
    this.modal.renderContent(section.get());
  }

  /**
   * Converts a key/value object to an unordered list.
   * Each list item has a click listener that populates the target field.
   * @param {Object} dataObj - The object containing key/value pairs.
   * @returns {HTMLElement} An unordered list element.
   */
  #keyPairToUl(dataObj) {
    const list = new GenericElement("ul", {
      styles: { listStyle: "none", padding: "0" },
    });

    try {
      for (const key in dataObj) {
        const value = dataObj[key];

        const limit = (value) => {
          if (value.length > 50) {
            return value.substring(0, 200) + "...";
          }
          return value;
        };
        const self = this;

        const listItem = new GenericElement("li", {
          styles: {
            padding: "8px",
            "border-bottom": "1px solid #ddd",
            cursor: "pointer",
          },
          events: {
            click: () => {
              self.target.value = dataObj[key];
              self.modal.close();
              self.toast.success(`${key} successfully populated.`);
            },
          },
          children: [
            new GenericElement("span", {
              content: `${key} : `,
              styles: { "font-weight": "bold", "font-size": "16px" },
            }),
            new GenericElement("span", {
              content: limit(value),
              styles: { "font-size": "14px", "font-style": "italic" },
            }),
          ],
        });

        list.appendChild(listItem);
      }
    } catch (error) {
      console.error(error);
      this.toast.error("Error rendering key/value list.");
    }
    return list.get();
  }

  /**
   * Loads the initial content into the modal.
   * Displays a default informational message.
   */
  #loadInitialContent() {
    const info = new GenericElement("p", {
      content: "Select the tabs above for the desired fill content",
      styles: {
        textAlign: "center",
      },
    });
    this.modal.renderContent(info.get());
  }

  #createHeaderSection() {
    const section = new GenericElement("section", {
      styles: {
        display: "flex",
        justifyContent: "center",
        gap: "1px",
      },
    });
    return section.get();
  }

  /**
   * Loads header tabs based on a JSON mapping of resource files.
   * Registers an event handler based on the type (keyValue or profile).
   */
  async #loaderHeaderTabs() {
    try {
      const resourceMap = await fetchData("mapping.json");
      const headerSection = this.#createHeaderSection();
      this.modal.appendHeader(headerSection);
      for (const fileName of resourceMap["tabs"]) {
        const data = await fetchData(fileName);
        const tab = this.modal.elementBuilder.buttons.build.buildPrimaryButton(
          data["name"],
          null,
          this.modal.elementBuilder.buttons.buttonSize.small,
        );
        headerSection.append(tab);
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
    } catch (error) {
      console.error(error);
      this.toast.error("Error loading header tabs.");
    }
  }
}
