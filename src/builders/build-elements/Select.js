import Select from "../../elements/Select.js";
export const SelectBuilder = {
  /**
   * Creates a new Select element.
   * @param {string} placeholder - The placeholder text to display as the first disabled option.
   * @returns {Select} A new Select element.
   */
  build: (placeholder) => {
    return new Select([], null, placeholder, {
      border: "1px solid #ccc",
      padding: "5px",
      fontSize: "16px",
    });
  },
};
