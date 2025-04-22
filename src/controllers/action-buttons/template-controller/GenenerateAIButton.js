import { marked } from "marked";
import { fetchData, fetchText, queryOllama } from "../../../api";
import SimplePopup from "../../../popups/simple-popup/SimplePopup";
import TemplateControllerButton from "../TemplateControllerButton";
export default class GenenerateAIButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * */
  constructor(textArea, modal) {
    super(textArea, modal);
    this.#createAIPopup();
  }

  #createAIPopup() {
    const textArea = this.textArea;
    const AIButton = this.elementbuilder.buttons.build.buildSecondaryButton(
      "AI",
      () => {
        const { popup, container } =
          this.createContainerAndPopup("Generate with AI");
        //--------------- generate keywords button ----------------------------
        const genKeyWordsButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Generate Keywords",
            async () => {
              const documentText = document.documentElement.innerText;

              const p =
                "Please extract up to 50 of the most important keywords from the job posting—focus on items like company name, position title, required technologies or stack, years of experience, certifications, and any other core skills or domain terms. Return your results as a html table.  Here is the posting text:  >";
              const doc = `{{${documentText}}`;
              const data = await queryOllama(p + doc);
              container.setHTML(marked(data));
            },
            this.elementbuilder.buttons.buttonSize.small,
          );

        //--------------- fill template button ----------------------------
        const fillTemplateButton =
          this.elementbuilder.buttons.build.buildPrimaryButton(
            "Fill Template",
            async () => {
              try {
                this.checkIfTextAreaIsEmpty();

                const resourceMap = await fetchData("mapping.json");
                const contextSelect =
                  this.elementbuilder.select.build("Select Context");

                contextSelect.setOnChange(async (e) => {
                  const selectedValue = e.target.value;
                  console.log(selectedValue);
                  const text = await fetchText(selectedValue);
                  const prompt = `fill all the placeholders which are represented as [...] in this template {{${textArea.value}}} with the following context: {{${text}}}. keep it short and simple`;
                  const data = await queryOllama(prompt);
                  textArea.value = data;
                });

                const files = resourceMap["context"];
                for (const name in files) {
                  contextSelect.addOption(name, files[name]);
                }

                const contextPopup = new SimplePopup("Select Context");
                contextPopup.setBody(contextSelect.get());
              } catch (error) {
                this.toastEmptyTextAreaError(error);
                console.error(error);
                this.toast.error("Error filling template.");
              }
            },
            this.elementbuilder.buttons.buttonSize.small,
          );
        //--------------- Popup buttons Registry ------------------------------
        popup.setBody(container.get());
        popup.setFooter(genKeyWordsButton);
        popup.setFooter(fillTemplateButton);
      },
    );

    this.modal.appendFooter(AIButton);
  }
}
