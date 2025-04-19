import Select from "../../elements/Select.js";
export const SelectBuilder = {
  /**
   * Creates a new Select element.
   * @param {string} placeholder - The placeholder text to display as the first disabled option.
   *
   * @param {Array} options - An array of options. Each option can be:
   *   - A string (applied as both name and value),
   *   - An object with { name, value } or { text, value } properties,
   *   - Or added later using the two-argument version of addOption.
   * @returns {Select} A new Select element.
   */
  build: (placeholder, options = []) => {
    return new Select(options, null, placeholder, {
      border: "1px solid #ccc",
      padding: "5px",
      fontSize: "16px",
    });
  },
};
