import {
  getAvailabelOllamaModels,
  getCurrentOllamaModel,
  getDataSource,
  getDataSources,
  setDataSource,
  setOllamaModel,
} from "../../../api";
import GenericElement from "../../../elements/GenericElement";
import SimplePopup from "../../../popups/simple-popup/SimplePopup";
import ConfigControllerButton from "../ConfigControllerButton";

export default class OllamaModelSwitcher extends ConfigControllerButton {
  constructor(modal) {
    super(modal);
    this.#createlDataSourceSwitcher();
  }

  #createlDataSourceSwitcher() {
    const changeSourceButton =
      this.elementbuilder.buttons.build.buildPrimaryButton(
        "Change Ollama Model",
        async () => {
          try {
            const popup = new SimplePopup("Change DataSource");
            const selected = await getCurrentOllamaModel();
            const sources = await getAvailabelOllamaModels();
            console.log({ sources, selected });
            const selectSwitch = this.elementbuilder.select.build(
              "Select Model",
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
                      content: "Current model :",
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
              await setOllamaModel(event.target.value);
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
}
