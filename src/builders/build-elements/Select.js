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
    return new Select(
      options,
      null,
      placeholder,
      {},
      {
        class: `block w-full bg-accent text-text border border-secondary rounded-lg px-3 py-2 shadow-sm
            transition focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary
            disabled:opacity-50 disabled:cursor-not-allowed`,
      },
    );
  },
};
