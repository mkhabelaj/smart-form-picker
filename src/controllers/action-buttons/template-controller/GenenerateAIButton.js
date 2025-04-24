import { marked } from "marked";
import { fetchData, fetchText, queryOllama } from "../../../api";
import TemplateControllerButton from "../TemplateControllerButton";
import GenericElement from "../../../elements/GenericElement";
export default class GenerateAIButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   */
  constructor(textArea, modal) {
    super(textArea, modal);
    this.#initTemplatePrompts();
  }

  #createPrimaryButton(label, onClick) {
    return this.elementbuilder.ButtonBuilder.getButton(label, onClick, {
      size: "small",
    });
  }

  scrapePageText() {
    return document.documentElement.innerText;
  }

  async #getTemplatePrompts() {
    const templates = await fetchData("mapping.json");
    return templates["template-prompts"];
  }
  /**
   * Function to get the file placeholders map
   * @param {Object} prompt - The array of template prompts
   * @returns {Promise<Array<{placeholder: string, file: string}>} - The array of file placeholders
   * */
  async #getFilePlaceholdersMap(prompt) {
    try {
      const filePlaceholders = prompt.context.files.map(async (file, index) => {
        const text = await fetchText(file);
        return {
          placeholder: `$files.${index}`,
          file: text,
        };
      });
      return Promise.all(filePlaceholders);
    } catch (err) {
      console.error(err);
      throw new Error("Error fetching file placeholders");
    }
  }

  /**
   * Function to initialize the template prompts
   * @returns {Promise<void>}
   * */
  async #initTemplatePrompts() {
    const templatePrompts = await this.#getTemplatePrompts();
    this.#buildButtonsFromPrompts(templatePrompts);
  }

  #createButtonContainer() {
    const container = new GenericElement("div", {
      styles: {
        display: "grid",
        gridTemplateColumns: "repeat(4, 1fr)",
        gap: "3px",
      },
    });

    return container;
  }

  /**
   * Function to build the buttons from the template prompts
   * @param {Array<Object>} templatePrompts - The array of template prompts
   * @returns {Promise<void>}
   *
   * */
  async #buildButtonsFromPrompts(templatePrompts) {
    const aiBtn = this.elementbuilder.ButtonBuilder.getButton(
      "AI",
      () => {
        try {
          const { popup, container } =
            this.createContainerAndPopup("Generate with AI");

          container.setContent("Select and action to begin AI generation");
          popup.removeCloseButton();
          const buttonContainer = this.#createButtonContainer();

          popup.setBody(container.get());
          popup.setFooter(buttonContainer.get());

          for (const prompt of templatePrompts) {
            const buttonType = prompt.button;
            const button = this.elementbuilder.ButtonBuilder.getButton(
              prompt.name,
              async () => {
                try {
                  let joinPrompt = prompt.prompt.join(" ");
                  if (prompt.output === "$textarea") {
                    this.checkIfTextAreaIsEmpty();
                  }
                  joinPrompt = joinPrompt.replace(
                    "$textarea",
                    this.textArea.value,
                  );
                  joinPrompt = joinPrompt.replace(
                    "$container",
                    container.get(),
                  );
                  joinPrompt = joinPrompt.replace(
                    "$document",
                    this.scrapePageText(),
                  );

                  if (joinPrompt.includes("$files")) {
                    const filePlaceholders =
                      await this.#getFilePlaceholdersMap(prompt);
                    for (const { placeholder, file } of filePlaceholders) {
                      joinPrompt = joinPrompt.replace(placeholder, file);
                    }
                  }
                  const aiOutput = await queryOllama(joinPrompt);
                  if (prompt.output === "$textarea") {
                    this.textArea.value = aiOutput;
                  }
                  if (prompt.output === "$container") {
                    container.setHTML(marked(aiOutput));
                  }
                } catch (error) {
                  this.toastEmptyTextAreaError(error);
                  console.error(error);
                  this.toast.error("Error filling template.");
                }
              },
              { type: buttonType, size: "small" },
            );
            buttonContainer.appendChild(button);
          }
        } catch (err) {
          console.error(err);
          this.toast.error("Error filling template.");
        }
      },
      {
        type: "secondary",
      },
    );
    this.modal.appendFooter(aiBtn);
  }
}
