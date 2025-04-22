import { marked } from "marked";
import { fetchData, fetchText, queryOllama } from "../../../api";
import SimplePopup from "../../../popups/simple-popup/SimplePopup";
import TemplateControllerButton from "../TemplateControllerButton";
export default class GenerateAIButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   */
  constructor(textArea, modal) {
    super(textArea, modal);
    this.#initAIButton();
  }

  /**
   * Join any number of pieces into a single prompt string
   * @param  {...string} parts
   * @returns {string}
   */
  #getPrompt(...parts) {
    return parts.join(" ");
  }

  /**
   * Build a small primary button with just label + click handler
   * @param {string} label
   * @param {() => void} onClick
   * @returns {HTMLButtonElement}
   */
  #createPrimaryButton(label, onClick) {
    return this.elementbuilder.buttons.build.buildPrimaryButton(
      label,
      onClick,
      this.elementbuilder.buttons.buttonSize.small,
    );
  }

  /**
   * Handler for the "Generate Keywords" action
   * @param {{ container: any }} container
   */
  async #generateKeywords({ container }) {
    const documentText = document.documentElement.innerText;
    const prompt = this.#getPrompt(
      "Please extract up to 50 of the most important keywords from the job posting—focus",
      "on items like company name, position title, required",
      "technologies or stack, years of experience, certifications, and",
      "any other core skills or domain terms. Return your results as a",
      "html table. Here is the posting text: >",
      `{{${documentText}}}`,
    );
    const response = await queryOllama(prompt);
    container.setHTML(marked(response));
  }

  /**
   * Handler for create detailed summary for the most important details
   * @param {{ container: any }} container
   */
  async #createSummary({ container }) {
    const documentText = document.documentElement.innerText;
    const prompt = this.#getPrompt(
      "Please create a summary of the most important details",
      "return your results as a html table. Here is the content text: >",
      `{{${documentText}}}`,
    );
    const response = await queryOllama(prompt);
    container.setHTML(marked(response));
  }

  /**
   * Handler for the "Fill Template" action
   * @param {{ container: any }} contextArg
   */
  async #fillTemplate({ container }) {
    try {
      this.checkIfTextAreaIsEmpty();

      const resourceMap = await fetchData("mapping.json");
      const select = this.elementbuilder.select.build("Select Context");

      select.setOnChange(async (e) => {
        const key = e.target.value;
        const text = await fetchText(key);
        const prompt = this.#getPrompt(
          "fill all the placeholders which are represented as [...] in this template",
          `{{${this.textArea.value}}}`,
          "with the following context:",
          `{{${text}}}`,
          "keep it short and simple",
        );
        const aiOutput = await queryOllama(prompt);
        this.textArea.value = aiOutput;
      });

      // populate options
      Object.entries(resourceMap.context).forEach(([name, path]) =>
        select.addOption(name, path),
      );

      const popup = new SimplePopup("Select Context");
      popup.setBody(select.get());
    } catch (err) {
      this.toastEmptyTextAreaError(err);
      console.error(err);
      this.toast.error("Error filling template.");
    }
  }

  /**
   * Set up the single "AI" footer button with two sub‐actions
   */
  #initAIButton() {
    const aiBtn = this.elementbuilder.buttons.build.buildSecondaryButton(
      "AI",
      () => {
        const { popup, container } =
          this.createContainerAndPopup("Generate with AI");

        // define your actions once
        const actions = [
          {
            label: "Generate Keywords",
            handler: this.#generateKeywords.bind(this),
          },
          { label: "Fill Template", handler: this.#fillTemplate.bind(this) },
          { label: "Create Summary", handler: this.#createSummary.bind(this) },
        ];

        // build and attach them in a loop
        actions.forEach(({ label, handler }) => {
          const btn = this.#createPrimaryButton(label, () =>
            handler({ container }),
          );
          popup.setFooter(btn);
        });

        popup.setBody(container.get());
      },
    );

    this.modal.appendFooter(aiBtn);
  }
}
