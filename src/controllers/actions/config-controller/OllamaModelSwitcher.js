import {
  getAvailabelOllamaModels,
  getDataSource,
  setOllamaModel,
} from "../../../api";
import GenericElement from "../../../elements/GenericElement";
import ModalDialog from "../../../modals/modals/ModalDialog";
import SimplePopup from "../../../popups/simple-popup/SimplePopup";
import ConfigControllerButton from "../ConfigControllerButton";

export default class OllamaModelSwitcher extends ConfigControllerButton {
  /**
   * @param {ModalDialog} modal
   */
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
            const popup = new SimplePopup("Change Ollama Model");
            const selected = await getDataSource();
            const sources = await getAvailabelOllamaModels();
            const selectSwitch = this.elementbuilder.select.build(
              "Select Ollama Model",
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
              await setOllamaModel(event.target.value);
              this.toast.success("Ollama Model changed successfully");
              this.modal.close();
              popup.close();
            });
          } catch (error) {
            console.error(error);
            this.toast.error("Error switching Ollama Model");
          }
        },
      );
    this.modal.appendFooter(changeSourceButton);
  }
}
