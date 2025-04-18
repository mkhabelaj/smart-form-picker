import jsPDF from "jspdf";

/**
 * Converts a template string to a jsPDF document with Google Doc-like styling.
 * @param {string} template - The text content to be included in the PDF.
 * @returns {jsPDF} A jsPDF document with Google Doc-like styling.
 */
export function getGeneratedGoogleLikeJsPDF(template) {
  // Create a new jsPDF instance with letter format (common for Google Docs exports) and point units.
  const doc = new jsPDF({
    unit: "pt", // Points as the unit (1 pt ≈ 1/72 inch)
    format: "letter", // Use letter size paper
  });

  // Define margins (all in points)
  const marginLeft = 40; // left margin
  const marginRight = 40; // right margin
  const marginTop = 60; // top margin
  const marginBottom = 40; // bottom margin

  // Get page dimensions
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Calculate available width for text (leaving room for both left and right margins)
  const availableWidth = pageWidth - marginLeft - marginRight;

  // Set a clean, modern sans-serif font that resembles Google Docs (Helvetica is a good proxy).
  doc.setFont("Helvetica");
  doc.setFontSize(11); // Use a slightly larger font size typical for Google Docs

  // Split the text to fit within the available width.
  const lines = doc.splitTextToSize(template, availableWidth);

  // Define an approximate line height for the 11pt font.
  const lineHeight = 13;
  let currentY = marginTop;

  // Iterate over each line and add it to the document.
  lines.forEach((line) => {
    // Check if adding the next line would exceed the page's bottom margin.
    if (currentY + lineHeight > pageHeight - marginBottom) {
      // Add a new page and reset the y-coordinate to the top margin.
      doc.addPage();
      currentY = marginTop;
    }
    // Add the line of text starting from the left margin.
    doc.text(line, marginLeft, currentY);
    currentY += lineHeight;
  });

  return doc;
}

/**
 * Creates a PDF document Google Doc-like styling.
 * @param {string} template - The text content to be included in the PDF.
 * @param {string} filename - The filename for the generated PDF.
 * @returns {jsPDF} A jsPDF document with Google Doc-like styling.
 */
export function createGoogleDocLikePDF(template, filename) {
  const doc = getGeneratedGoogleLikeJsPDF(template);
  doc.save(`${filename}.pdf`);
  return doc;
}

/**
 * Injects a Blob into a file input element.
 * @param {Blob} blob - The Blob to be injected.
 * @param {HTMLInputElement} target - The target file input element.
 * @param {string} fileName - The name of the file to be injected.
 * @throws {Error} If the target element is not a file input.
 * @throws {Error} If there is an error injecting the blob.
 * @returns {void}
 */
export function injectBlobToFile(
  blob,
  target,
  fileName,
  defaultfileType = "text/plain",
) {
  // assume target is a file input
  if (!target.files) {
    throw new Error("Target element is not a file input.");
  }

  try {
    const file = new File([blob], fileName, {
      type: blob.type || defaultfileType,
    });
    const dataTransfer = new DataTransfer();
    dataTransfer.items.add(file);
    target.files = dataTransfer.files;
    target.dispatchEvent(new Event("change", { bubbles: true }));
  } catch (error) {
    throw new Error(`Error injecting blob: ${error.message}`);
  }
}

/**
 * Returns the content of the label element associated with the input element.
 * If no label element is found, it returns the name, placeholder, or id of the input element.
 *
 * @param {HTMLInputElement} input - The input element.
 * @returns {string} The content of the label element.
 */
export function getInputLabelContent(input) {
  // To be sure of the label we need get the label element by the for attribute
  const id = input.getAttribute("id");
  let label = null;

  if (id !== null) {
    label = document.querySelector(`label[for="${id}"]`);
  }

  if (label !== null) {
    return label.textContent;
  }
  return input.name || input.placeholder || input.id || "";
}

/**
 * Makes an element draggable.
 * @param {HTMLElement} container - The element to make draggable.
 * @param {HTMLElement} handle - The element to use as the drag handle.
 */
export function makeDraggable(container, handle) {
  let dragging = false;
  let startX, startY, origX, origY;

  handle.addEventListener("mousedown", onMouseDown);
  document.addEventListener("mousemove", onMouseMove);
  document.addEventListener("mouseup", onMouseUp);

  function onMouseDown(e) {
    dragging = true;
    startX = e.clientX;
    startY = e.clientY;
    const style = getComputedStyle(container);
    origX = parseInt(style.left, 10);
    origY = parseInt(style.top, 10);
    e.preventDefault(); // prevents text selection
  }

  function onMouseMove(e) {
    if (!dragging) return;
    const dx = e.clientX - startX;
    const dy = e.clientY - startY;
    container.style.left = `${origX + dx}px`;
    container.style.top = `${origY + dy}px`;
  }

  function onMouseUp() {
    dragging = false;
  }
}
