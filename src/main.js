import FormPickerController from "./controllers/form-picker/FormPickerController";
import FileUploadController from "./controllers/FileUploadController";
import TemplateController from "./controllers/TemplateController";
import ConfigController from "./controllers/ConfigController";
import FormPickerTargetPasteAction from "./controllers/form-picker/list-actions/FormPickerTargetPasteAction";
import FormPickerCopyAction from "./controllers/form-picker/list-actions/FormPickerCopyAction";
import ModalDialog from "./modals/modals/ModalDialog";

document.addEventListener("keydown", (event) => {
  // Ctrl+U triggers upload open.
  if (event.ctrlKey && event.key === "u") {
    event.preventDefault();
    new FileUploadController();
    return;
  }
  // Ctrl+K triggers configuration
  if (event.ctrlKey && event.key === "k") {
    event.preventDefault();
    // new ConfigController();
    const d = new ModalDialog({ title: "Configuration" });
    return;
  }
  // Ctrl+T triggers template Controller
  if (event.ctrlKey && event.key === "t") {
    event.preventDefault();
    new TemplateController();
    return;
  }
  //Ctrl+Shift+M Form Picker Copy Modal
  if (event.ctrlKey && event.shiftKey && event.key === "M") {
    event.preventDefault();
    new FormPickerController([new FormPickerCopyAction()]);
    return;
  }
});

// Event listener to trigger the modal via a keyboard shortcut (Ctrl+M)
// when an INPUT or TEXTAREA element is focused. OR Ctrl+Shift+M to open the modal outside of a form
document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    target.addEventListener("keydown", function handler(e) {
      // Ctrl+M triggers the modal to open.
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        new FormPickerController([
          new FormPickerTargetPasteAction(target),
          new FormPickerCopyAction(),
        ]);
        target.removeEventListener("keydown", handler);
      }
    });
  }
});
