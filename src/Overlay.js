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
    const overlay = document.createElement("div");
    overlay.id = "data-modal-overlay";
    overlay.style.position = "fixed";
    overlay.style.top = "0";
    overlay.style.left = "0";
    overlay.style.width = "100%";
    overlay.style.height = "100%";
    overlay.style.background = "rgba(0,0,0,0.5)";
    overlay.style.display = "flex";
    overlay.style.alignItems = "center";
    overlay.style.justifyContent = "center";
    overlay.style.zIndex = 10000;
    return overlay;
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
