import { marked } from "marked";
import {
  fetchData,
  fetchText,
  getCurrentOllamaModel,
  ollamaModel,
  queryOllama,
} from "../../../api";
import TemplateControllerAction from "../TemplateControllerAtionc";
import GenericElement from "../../../elements/GenericElement";
import TemplateController from "../../TemplateController";
import { signal } from "../../../SimpleSignal";
import ModalDialog from "../../../modals/modals/ModalDialog";
export default class GenerateAIButton extends TemplateControllerAction {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {ModalDialog} modal
   * @param {TemplateController} templateController
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.#initTemplatePrompts();
  }

  scrapePageText() {
    return document.documentElement.innerText;
  }

  async #getTemplatePrompts() {
    const templates = await fetchData("mapping.json");
    const templatePrompts = await fetchData(templates["template-prompts"]);
    return templatePrompts;
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
   *
   * Function to get the document context
   * @returns {string} - The document context
   **/
  getDocumentContext() {
    if (this.templateController.isDocumentContextSet()) {
      return this.templateController.getDocumentContext().innerText;
    }
    return this.scrapePageText();
  }

  /**
   * Function to build the buttons from the template prompts
   * @param {Array<Object>} templatePrompts - The array of template prompts
   * @returns {Promise<void>}
   *
   * */
  async #buildButtonsFromPrompts(templatePrompts) {
    const aiBtn = this.makeSecondaryButton("AI", async () => {
      try {
        const selectedModel = ollamaModel;
        const whichContext = this.templateController.isDocumentContextSet()
          ? "User selected context"
          : "Configuration context: defined as $document in the template-prompts mapping.json";
        const title = signal("Generate with AI");
        const { popup, container } = this.createContainerAndPopup(title);

        const div = new GenericElement("div", {
          styles: {
            display: "flex",
            flexDirection: "column",
            gap: "2px",
          },
          children: [
            new GenericElement("h4", {
              content: "Select and action to begin AI generation",
            }),
            new GenericElement("div", {
              styles: {
                display: "flex",
                flexDirection: "row",
                gap: "2px",
              },
              children: [
                new GenericElement("p", {
                  styles: {
                    "font-weight": "bold",
                  },
                  content: `Select model: `,
                }),

                new GenericElement("p", {
                  styles: {
                    "font-weight": "bold",
                  },
                  content: selectedModel,
                }),
              ],
            }),
            new GenericElement("p", {
              styles: {
                "font-weight": "bold",
              },
              content: `${whichContext}`,
            }),
          ],
        });
        selectedModel.set(await getCurrentOllamaModel());
        container.appendChild(div);
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
                title.set("Generate with AI" + " - " + prompt.name);
                let joinPrompt = prompt.prompt.join(" ");
                if (prompt.output === "$textarea") {
                  this.checkIfTextAreaIsEmpty();
                }
                joinPrompt = joinPrompt.replace(
                  "$textarea",
                  this.textArea.value,
                );
                joinPrompt = joinPrompt.replace("$container", container.get());
                joinPrompt = joinPrompt.replace(
                  "$document",
                  this.getDocumentContext(),
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
    });
    this.modal.appendFooter(aiBtn);
  }
}
