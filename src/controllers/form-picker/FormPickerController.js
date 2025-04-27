import SimpleModal from "../../modals/modals/simple-modal/SimpleModal.js";
import GenericElement from "../../elements/GenericElement.js";
import { fetchData } from "../../api.js";
import { Toast } from "../../toasts/Toast.js";
import FormPickerAction from "./list-actions/FormPickerAction.js";
import ModalDialog from "../../modals/modals/ModalDialog.js";
/**
 * Class FillHelper
 * Orchestrates the modal population and event handling.
 * Loads read-only data (from JSON files) to provide manual auto-fill options.
 */
export default class FormPickerController {
  /**
   * @param {FormPickerAction[]} actions
   */
  constructor(actions) {
    this.toast = new Toast();
    this.actions = actions;
    this.modal = new ModalDialog({ title: "Smart Form Picker" });
    this.#loaderHeaderTabs();
    this.#loadInitialContent();
  }

  #keyValueRender(dataObj) {
    const list = this.#keyPairToUl(dataObj);
    this.modal.renderContent(list);
  }

  #profileRender(dataObj) {
    const section = new GenericElement("section");
    Object.entries(dataObj).forEach(([key, nested]) => {
      const details = new GenericElement("details", {
        attributes: { class: "mb-2" },
      });
      const summary = new GenericElement("summary", {
        attributes: { class: "cursor-pointer font-bold" },
        content: key,
      });
      details.appendChild(summary);
      details.appendChild(this.#keyPairToUl(nested));
      section.appendChild(details);
    });
    this.modal.renderContent(section.get());
  }

  #keyPairToUl(dataObj) {
    const list = new GenericElement("ul", {
      attributes: { class: "list-none p-0" },
    });

    try {
      Object.entries(dataObj).forEach(([key, value]) => {
        const truncated = value.length > 50 ? value.slice(0, 200) + "…" : value;

        const listItem = new GenericElement("li", {
          attributes: {
            class:
              "border-b border-gray-200 flex items-start gap-2 p-2 hover:bg-gray-50",
          },
          children: [
            // custom actions (e.g. copy, paste)
            ...this.actions.map((action) =>
              action.getAction(key, dataObj, this.modal),
            ),
            // key label
            new GenericElement("span", {
              attributes: { class: "font-bold text-base" },
              content: `${key}:`,
            }),
            // truncated value
            new GenericElement("span", {
              attributes: { class: "text-sm italic" },
              content: truncated,
            }),
          ],
        });

        list.appendChild(listItem);
      });
    } catch (err) {
      console.error(err);
      this.toast.error("Error rendering key/value list.");
    }

    return list.get();
  }

  #loadInitialContent() {
    const info = new GenericElement("p", {
      attributes: { class: "text-center text-gray-600 italic" },
      content: "Select the tabs above for the desired fill content",
    });
    this.modal.renderContent(info.get());
  }

  #createHeaderSection() {
    const section = new GenericElement("section", {
      attributes: { class: "flex justify-center gap-1 mb-4" },
    });
    return section.get();
  }

  async #loaderHeaderTabs() {
    try {
      const resourceMap = await fetchData("mapping.json");
      const headerSection = this.#createHeaderSection();
      this.modal.appendHeader(headerSection);

      for (const fileName of resourceMap.tabs) {
        const data = await fetchData(fileName);
        if (!data.type) {
          throw new Error(`${fileName} is missing a "type" field`);
        }

        const tab = this.modal.elementBuilder.StyleButtonBuilder.make(
          data.name,
          "tiny",
          "info",
        );
        headerSection.append(tab.get());

        tab.addEventListener("click", () => {
          if (data.type === "keyValue") {
            this.#keyValueRender(data.data);
          } else if (data.type === "profile") {
            this.#profileRender(data.data);
          } else {
            throw new Error(
              `Unknown type "${data.type}". Valid: keyValue, profile`,
            );
          }
        });
      }
    } catch (err) {
      console.error(err);
      this.toast.error("Error loading header tabs.");
    }
  }
}
