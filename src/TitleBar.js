import GenericElement from "./elements/GenericElement";

export default class TitleBar extends GenericElement {
  /**
   * @param {Object} options
   * @param {string}   [options.title=""]         – Text to show in the bar
   * @param {Function} [options.onMinimize]       – Callback when “–” is clicked
   * @param {Function} [options.onMaximize]       – Callback when “▢” is clicked
   * @param {Function} [options.onClose]          – Callback when “×” is clicked
   * @param {Object}   [options.styles]           – Override title‑bar container styles
   */
  constructor({
    title = "",
    onMinimize = () => {},
    onMaximize = () => {},
    onClose = () => {},
    styles = {},
  } = {}) {
    super("div", {
      styles: {
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "4px 8px",
        backgroundColor: "#eee",
        userSelect: "none",
        cursor: "default",
        ...styles,
      },
    });

    // Title text
    this._titleText = new GenericElement("span", {
      content: title,
      styles: {
        flex: "1",
        fontSize: "14px",
        fontWeight: "500",
        overflow: "hidden",
        whiteSpace: "nowrap",
        textOverflow: "ellipsis",
      },
    });

    // Controls container
    const controls = new GenericElement("div", {
      styles: { display: "flex", alignItems: "center" },
    });

    // Minimize button
    this._minBtn = new GenericElement("button", {
      content: "–",
      styles: buttonStyles(),
      events: { click: onMinimize },
    });

    // Maximize button
    this._maxBtn = new GenericElement("button", {
      content: "▢",
      styles: buttonStyles(),
      events: { click: onMaximize },
    });

    // Close button
    this._closeBtn = new GenericElement("button", {
      content: "×",
      styles: buttonStyles(),
      events: { click: onClose },
    });

    // Build order: title + [min, max, close]
    controls.appendChild(this._minBtn);
    controls.appendChild(this._maxBtn);
    controls.appendChild(this._closeBtn);
    this.appendChild(this._titleText);
    this.appendChild(controls);

    // Helper for consistent button styling
    function buttonStyles() {
      return {
        width: "24px",
        height: "24px",
        margin: "0 2px",
        border: "none",
        background: "transparent",
        fontSize: "16px",
        lineHeight: "24px",
        cursor: "pointer",
      };
    }
  }

  /** Update the displayed title. */
  setTitle(newTitle) {
    this._titleText.setContent(newTitle);
  }

  /** Expose the buttons for later use or styling. */
  get minimizeButton() {
    return this._minBtn;
  }
  get maximizeButton() {
    return this._maxBtn;
  }
  get closeButton() {
    return this._closeBtn;
  }
}
