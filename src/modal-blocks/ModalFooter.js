/**
 * Class ModelFooter
 * Represents the footer section of the modal.
 * Provides methods to create and access the footer element.
 */
export default class ModalFooter {
  constructor() {
    this.footer = this.create();
  }

  /**
   * Creates the footer element with basic styling.
   * @returns {HTMLElement} The footer div element.
   */
  create() {
    const footer = document.createElement("footer");
    footer.style.display = "flex";
    footer.style.justifyContent = "center";
    footer.style.gap = "3px";
    footer.style.marginBottom = "15px";
    return footer;
  }

  /**
   * Returns the footer element.
   * @returns {HTMLElement} The footer element.
   */
  get() {
    return this.footer;
  }

  /**
   * Appends a given item to the footer.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.footer.append(item);
  }
}
