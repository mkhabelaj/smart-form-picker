/**
 * Class ModelHeader
 * Represents the header section of the modal.
 * Provides methods to create and access the header element.
 */
export default class ModalHeader {
  constructor() {
    this.header = this.create();
  }

  /**
   * Creates the header element with basic styling.
   * @returns {HTMLElement} The header div element.
   */
  create() {
    const header = document.createElement("header");
    header.style.display = "flex";
    header.style.gap = "2px";
    header.style.flexDirection = "column";
    header.style.marginBottom = "5px";
    header.style.padding = "1px";
    return header;
  }

  /**
   * Returns the header element.
   * @returns {HTMLElement} The header element.
   */
  get() {
    return this.header;
  }

  /**
   * Appends a given item to the header.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.header.append(item);
  }
}
