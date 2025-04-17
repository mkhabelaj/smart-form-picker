import GenericElement from "../../elements/GenericElement";
/**
 * Class ModelHeader
 * Represents the header section of the modal.
 * Provides methods to create and access the header element.
 */
export default class ModalHeader {
  constructor() {
    this.header = this.#create();
  }

  /**
   * Creates the header element with basic styling.
   * @returns {GenericElement} The header div element.
   */
  #create() {
    const header = new GenericElement("header", {
      styles: {
        display: "flex",
        gap: "2px",
        flexDirection: "column",
        marginBottom: "5px",
        padding: "1px",
      },
    });
    return header;
  }

  /**
   * Returns the header element.
   * @returns {HTMLElement} The header element.
   */
  get() {
    return this.header.get();
  }

  /**
   * Appends a given item to the header.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.header.appendChild(item);
  }
}
