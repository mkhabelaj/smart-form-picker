const buttonSize = {
  small: "small",
  medium: "medium",
  large: "large",
};
Object.freeze(buttonSize);
class Button {
  #button;

  constructor(
    text = "Button",
    size = "small",
    textColor = "black",
    backgroundColor = "#E0E0E0",
    onClick = null,
  ) {
    this.#button = document.createElement("button");
    this.#button.textContent = text;
    this.setBorderRadius("5px");
    this.setButtonSize(size);
    this.setTextColor(textColor);
    this.setBackgroundColor(backgroundColor);
    this.setBorderColor(backgroundColor);
    this.setBorderStyle("solid");
    this.setBorderWidth("1px");
    this.#button.style.cursor = "pointer";
    if (onClick) this.#button.addEventListener("click", onClick);
  }

  setBorderColor(color) {
    this.#button.style.borderColor = color;
  }

  setBorderStyle(style) {
    this.#button.style.borderStyle = style;
  }

  setBorderRadius(radius) {
    this.#button.style.borderRadius = radius;
  }

  setBorderWidth(width) {
    this.#button.style.borderWidth = width;
  }

  setOnClick(onClick) {
    this.#button.addEventListener("click", onClick);
  }

  setTextColor(color) {
    this.#button.style.color = color;
  }

  setBackgroundColor(color) {
    this.#button.style.backgroundColor = color;
  }

  setText(text) {
    this.#button.textContent = text;
  }

  setButtonSize(sizeOption) {
    // Reset any previous inline styles for padding and font-size.
    this.#button.style.padding = "";
    this.#button.style.fontSize = "";

    // Apply styles based on the selected size option.
    switch (sizeOption) {
      case buttonSize.small:
        this.#button.style.padding = "4px 8px";
        this.#button.style.fontSize = "12px";
        break;
      case buttonSize.medium:
        this.#button.style.padding = "8px 16px";
        this.#button.style.fontSize = "16px";
        break;
      case buttonSize.large:
        this.#button.style.padding = "12px 24px";
        this.#button.style.fontSize = "20px";
        break;
      default:
        console.warn("Invalid size option provided:", sizeOption);
    }
  }

  get() {
    return this.#button;
  }
}

export { buttonSize, Button };
