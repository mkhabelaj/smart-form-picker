import GenericElement from "./elements/GenericElement";

/**
 * Class Overlay
 * Represents the overlay container that acts as the backdrop for the modal.
 * Provides methods to create, access, append to, and remove the overlay.
 */
export default class Overlay {
  constructor() {
    this.overlay = this.#create();
    document.body.append(this.overlay);
  }

  /**
   * Creates the overlay element with full-screen styling.
   * @returns {HTMLElement} The overlay div element.
   */
  #create() {
    const overlay = new GenericElement("div", {
      styles: {
        position: "fixed",
        top: "0",
        left: "0",
        width: "100%",
        height: "100%",
        background: "rgba(0,0,0,0.5)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
      },
    });
    return overlay.get();
  }

  /**
   * Returns the overlay element.
   * @returns {HTMLElement} The overlay element.
   */
  get() {
    return this.overlay;
  }

  /**
   * Appends a given item to the overlay.
   * @param {HTMLElement} item - The element to append.
   */
  append(item) {
    this.overlay.append(item);
  }

  /**
   * Removes the overlay from the DOM.
   */
  remove() {
    this.overlay.remove();
  }
}
