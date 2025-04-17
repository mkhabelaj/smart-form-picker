import GenericElement from "../../elements/GenericElement";

/**
 * Class ModelFooter
 * Represents the footer section of the modal.
 * Provides methods to create and access the footer element.
 */
export default class ModalFooter {
  #footer;
  constructor() {
    this.#footer = this.#create();
  }

  /**
   * Creates the footer element with basic styling.
   * @returns {GenericElement} The footer element.
   */
  #create() {
    const footer = new GenericElement("footer", {
      styles: {
        display: "flex",
        justifyContent: "center",
        gap: "3px",
        marginBottom: "15px",
      },
    });
    return footer;
  }

  /**
   * Returns the footer element.
   * @returns {HTMLElement} The footer element.
   */
  get() {
    return this.#footer.get();
  }

  /**
   * Appends a given item to the footer.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.#footer.appendChild(item);
  }
}
