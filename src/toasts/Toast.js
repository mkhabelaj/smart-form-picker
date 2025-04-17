import GenericElement from "../elements/GenericElement.js";
export class Toast {
  /**
   * Creates a Toast instance with an optional config.
   * @param {Object} options - Configuration options.
   * @param {string} options.position - Position of the toast container.
   *                                    Supported values: 'top-left', 'top-center', 'top-right',
   *                                    'bottom-left', 'bottom-center' (default), 'bottom-right'.
   */
  constructor(options = {}) {
    // Determine container position using provided options (default is 'bottom-center').
    this.position = options.position || "bottom-center";

    // Check if a container already exists; if not, create one.
    this.toastContainer = document.getElementById("toast-container");
    if (!this.toastContainer) {
      this.toastContainer = new GenericElement("div", {
        attributes: { id: "toast-container" },
        styles: this.#getContainerStyle(this.position),
      });
      document.body.appendChild(this.toastContainer.get());
    }
  }

  /**
   * Computes the style object for the toast container based on the desired position.
   * @param {string} position - The desired position of the container.
   * @returns {Object} The style object.
   */
  #getContainerStyle(position) {
    const defaults = {
      position: "fixed",
      zIndex: "100000",
      display: "flex",
      flexDirection: "column",
    };
    switch (position) {
      case "top-left":
        return {
          top: "20px",
          left: "20px",
          alignItems: "flex-start",
          ...defaults,
        };
      case "top-center":
        return {
          top: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          alignItems: "center",
          ...defaults,
        };
      case "top-right":
        return {
          top: "20px",
          right: "20px",
          alignItems: "flex-end",
          ...defaults,
        };
      case "bottom-left":
        return {
          bottom: "20px",
          left: "20px",
          alignItems: "flex-start",
          ...defaults,
        };
      case "bottom-right":
        return {
          bottom: "20px",
          right: "20px",
          alignItems: "flex-end",
          ...defaults,
        };
      case "bottom-center":
      default:
        return {
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          alignItems: "center",
          ...defaults,
        };
    }
  }

  /**
   * Internal method to create and display a toast.
   *
   * @param {string} message - The message to display.
   * @param {string} type - The type of the toast: 'success', 'error', or 'warn'.
   * @param {number} [duration=3000] - Duration in milliseconds to display the toast.
   */
  show(message, type = "success", duration = 3000) {
    // Set the background color based on the type.
    let backgroundColor;
    switch (type) {
      case "success":
        backgroundColor = "#4CAF50"; // green
        break;
      case "error":
        backgroundColor = "#f44336"; // red
        break;
      case "warn":
        backgroundColor = "#ff9800"; // orange
        break;
      default:
        backgroundColor = "#333"; // default dark gray
    }

    const toast = new GenericElement("div", {
      attributes: { class: "toast" },
      content: message,
      styles: {
        minWidth: "200px",
        margin: "5px 0",
        padding: "12px 20px",
        color: "#fff",
        backgroundColor,
        borderRadius: "4px",
        boxShadow: "0 2px 4px rgba(0, 0, 0, 0.2)",
        opacity: "0",
        transition: "opacity 0.5s ease-in-out",
      },
    });
    this.toastContainer.appendChild(toast.get());

    // Force reflow before triggering the fade-in.
    window.getComputedStyle(toast.get()).opacity;
    toast.setStyle("opacity", "1");

    // Remove the toast after the duration.
    setTimeout(() => {
      toast.setStyle("opacity", "0");
      toast.addEventListener("transitionend", () => {
        if (toast.get().parentNode === this.toastContainer) {
          this.toastContainer.removeChild(toast.get());
        }
      });
    }, duration);
  }

  /**
   * Display a success toast.
   *
   * @param {string} message - The success message.
   * @param {number} [duration=3000] - Duration to display.
   */
  success(message, duration = 3000) {
    this.show(message, "success", duration);
  }

  /**
   * Display an error toast.
   *
   * @param {string} message - The error message.
   * @param {number} [duration=3000] - Duration to display.
   */
  error(message, duration = 3000) {
    this.show(message, "error", duration);
  }

  /**
   * Display a warning toast.
   *
   * @param {string} message - The warning message.
   * @param {number} [duration=3000] - Duration to display.
   */
  warn(message, duration = 3000) {
    this.show(message, "warn", duration);
  }
}
