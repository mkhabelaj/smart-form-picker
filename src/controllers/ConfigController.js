import { getDataSource, getDataSources, setDataSource } from "../api";
import SimpleModalElementBuilder from "../builders/SimpleElementBuilder";
import GenericElement from "../elements/GenericElement";
import SimpleModal from "../modals/modals/simple-modal/SimpleModal";
import SimplePopup from "../popups/simple-popup/SimplePopup";
import { Toast } from "../toasts/Toast";

export default class ConfigController {
  constructor() {
    this.toast = new Toast();
    this.elementbuilder = SimpleModalElementBuilder;
    this.modal = new SimpleModal("Config");
    this.#loadContent();
    this.#loadOptions();
  }

  #loadOptions() {
    this.#createlDataSourceSwitcher();
  }
  #createlDataSourceSwitcher() {
    const changeSourceButton =
      this.elementbuilder.buttons.build.buildPrimaryButton(
        "Change Source",
        async () => {
          try {
            const popup = new SimplePopup("Change DataSource");
            const selected = await getDataSource();
            const sources = await getDataSources();
            const selectSwitch = this.elementbuilder.select.build(
              "Select DataSource",
              sources,
            );

            const container = new GenericElement("div", {
              styles: {
                display: "flex",
                "flex-direction": "column",
                gap: "10px",
              },
              children: [
                new GenericElement("div", {
                  styles: { display: "flex", gap: "10px" },
                  children: [
                    new GenericElement("span", {
                      styles: { "flex-grow": "1", "font-weight": "bold" },
                      content: "Current DataSource :",
                    }),
                    new GenericElement("span", {
                      styles: { "font-style": "italic" },
                      content: selected || "None",
                    }),
                  ],
                }),
                selectSwitch.get(),
              ],
            });

            popup.setBody(container.get());

            selectSwitch.setOnChange(async (event) => {
              await setDataSource(event.target.value);
              this.toast.success("DataSource Updated");
              this.modal.close();
              popup.close();
            });
          } catch (error) {
            console.error(error);
            this.toast.error("Error changing DataSource");
          }
        },
      );
    this.modal.appendFooter(changeSourceButton);
  }
  #loadContent() {
    const content = new GenericElement("div", {
      styles: { "text-align": "center" },
      content: "Select some options below to update config",
    });

    this.modal.renderContent(content.get());
  }
}
