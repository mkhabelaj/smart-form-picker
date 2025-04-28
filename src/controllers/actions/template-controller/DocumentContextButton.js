import GenericElement from "../../../elements/GenericElement";
import TemplateController from "../../TemplateController";
import TemplateControllerButton from "../TemplateControllerButton";

export default class DocumentContextButton extends TemplateControllerButton {
  /**
   * @param {HTMLTextAreaElement} textArea
   * @param {SimpleModal} modal
   * @param {TemplateController} templateController
   *
   */
  constructor(textArea, modal, templateController) {
    super(textArea, modal, templateController);
    this.#initDocumentContext();
  }

  #initDocumentContext() {
    const STYLE_ID = "hover-highlight-style";

    // Create the <style> node once (but don’t append yet)
    const styleNode = new GenericElement("style", {
      attributes: { id: STYLE_ID },
      content: `
      .hover-highlight {
        outline: 2px solid yellow !important;
        cursor: pointer !important;
      }
    `,
    }).get();

    let lastHovered = null;

    // Handlers capture `this` via arrow syntax
    const handleMouseOver = (event) => {
      const target = event.target;
      if (lastHovered && lastHovered !== target) {
        lastHovered.classList.remove("hover-highlight");
      }
      target.classList.add("hover-highlight");
      lastHovered = target;
    };

    const handleMouseOut = (event) => {
      if (event.target === lastHovered) {
        lastHovered.classList.remove("hover-highlight");
        lastHovered = null;
      }
    };

    const handleDoubleClick = (event) => {
      event.preventDefault();
      event.stopPropagation();

      // Show your modal and set context
      this.modal.show();
      const clicked = event.target;
      this.templateController.setDocumentContext(clicked);

      // Clean up highlight and style
      clicked.classList.remove("hover-highlight");
      const existingStyle = document.getElementById(STYLE_ID);
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }

      // Remove all injected listeners
      document.removeEventListener("mouseover", handleMouseOver);
      document.removeEventListener("mouseout", handleMouseOut);
      document.removeEventListener("dblclick", handleDoubleClick);
    };

    // Button that toggles the selection mode
    const selectorButton = this.elementbuilder.ButtonBuilder.getButton(
      "Context Selector",
      () => {
        // Inject stylesheet if missing
        if (!document.getElementById(STYLE_ID)) {
          document.head.appendChild(styleNode);
        }
        this.modal.hide();

        // Start listening for hover & dblclick
        document.addEventListener("mouseover", handleMouseOver);
        document.addEventListener("mouseout", handleMouseOut);
        document.addEventListener("dblclick", handleDoubleClick);
      },
      { size: "small" },
    );

    this.modal.appendFooter(selectorButton);
  }
}
