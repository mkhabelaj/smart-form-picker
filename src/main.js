import FormPickerController from "./controllers/FormPickerController";
import FileUploadController from "./controllers/FileUploadController";

document.addEventListener("keydown", (event) => {
  // Ctrl+U triggers upload open.
  if (event.ctrlKey && event.key === "u") {
    event.preventDefault();
    new FileUploadController();
  }
});

// Event listener to trigger the modal via a keyboard shortcut (Ctrl+M)
// when an INPUT or TEXTAREA element is focused.
document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    target.addEventListener("keydown", function handler(e) {
      // Ctrl+M triggers the modal to open.
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        new FormPickerController(target);
        target.removeEventListener("keydown", handler);
      }
    });
  }
});
