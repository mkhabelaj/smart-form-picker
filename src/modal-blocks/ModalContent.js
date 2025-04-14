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
   * @returns {HTMLElement} The content div element.
   */
  #create() {
    const content = document.createElement("div");
    content.id = "modal-content";
    return content;
  }

  /**
   * Returns the content element.
   * @returns {HTMLElement} The content element.
   */
  get() {
    return this.content;
  }

  /**
   * Appends a given item to the content area.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.content.append(item);
  }

  /**
   * Clears the content area.
   */
  clear() {
    this.content.innerHTML = "";
  }

  /**
   * Clears existing content and appends new content.
   * @param {HTMLElement} item - The element to render.
   */
  render(item) {
    this.clear();
    this.content.append(item);
  }
}
