import GenericElement from "../../elements/GenericElement";

/**
 * Class ModelContent
 * Represents the content section of the modal.
 * It handles content manipulation like clearing or rendering new content.
 */
export default class ModalContent {
  constructor() {
    this.content = this.#create();
  }

  /**
   * Creates the content element with a dedicated ID.
   * @returns {GenericElement} The content div element.
   */
  #create() {
    const content = new GenericElement("main", {
      attributes: { id: "modal-content" },
      styles: {
        border: "1px solid #000000",
        padding: "3px",
        marginBottom: "3px",
      },
    });
    return content;
  }

  /**
   * Returns the content element.
   * @returns {HTMLElement} The content element.
   */
  get() {
    return this.content.get();
  }

  /**
   * Appends a given item to the content area.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.content.appendChild(item);
  }

  /**
   * Clears the content area.
   */
  clear() {
    this.content.setHTML("");
  }

  /**
   * Clears existing content and appends new content.
   * @param {HTMLElement} item - The element to render.
   */
  render(item) {
    this.clear();
    this.content.appendChild(item);
  }
}
