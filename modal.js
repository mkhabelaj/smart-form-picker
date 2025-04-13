class ModelHeader {
  constructor() {
    this.header = this.create();
  }

  create() {
    const header = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-around";
    header.style.marginBottom = "15px";
    return header;
  }
  get() {
    return this.getModal();
  }
  append(item) {
    this.header.append(item);
  }
}
class ModelContent {
  constructor() {
    this.content = this.#create();
  }

  #create() {
    const content = document.createElement("div");
    content.id = "modal-content";
    return content;
  }

  get() {
    return this.getModal();
  }

  append(item) {
    this.content.append(item);
  }
  clear() {
    this.content.innerHTML = "";
  }
  render(item) {
    this.clear();
    this.content.append(item);
  }
}
class ModelFooter {
  constructor() {
    this.footer = this.create();
  }

  create() {
    const footer = document.createElement("div");
    header.style.display = "flex";
    header.style.justifyContent = "space-around";
    header.style.marginBottom = "15px";
    return footer;
  }
  get() {
    return this.getModal();
  }
  append(item) {
    this.footer.append(item);
  }
}

class Overlay {
  constructor() {
    this.overlay = this.create();
  }
  create() {
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
  get() {
    return this.overlay;
  }
  append(item) {
    this.modal.append(item);
  }
  remove() {
    this.overlay.remove();
  }
}

class SimpleModel {
  constructor() {
    this.overlay = new Overlay();
    this.header = new ModelHeader();
    this.content = new ModelContent();
    this.footer = new ModelContent();
    this.modal = this.create();
    this.modal.append(this.header.get());
    this.modal.append(this.content.get());
    this.modal.append(this.footer.get());
    this.overlay.append(this.modal);
  }

  create() {
    const modal = document.createElement("div");
    modal.id = "data-modal";
    modal.style.background = "#fff";
    modal.style.padding = "20px";
    modal.style.borderRadius = "5px";
    modal.style.minWidth = "300px";
    modal.style.maxWidth = "500px";
    return modal;
  }
  get() {
    return this.get();
  }

  append(item) {
    this.modal.append(item);
  }
}

class FillHelper {
  constructor(target) {
    this.target = target;
    this.modal = new SimpleModel();
    this.#addCancelButton();
    this.#loadInitialContent();
  }

  #addCancelButton() {
    const cancelButton = document.createElement("button");
    cancelButton.textContent = "Cancel";
    cancelButton.style.marginTop = "15px";
    this.modal.footer.append(cancelButton);
    const self = this;
    //TODO remove listeners
    document.addEventListener("click", function () {
      self.modal.overlay.remove();
    });
  }

  #keyValueRender(dataObj) {
    const list = this.#keyPairToUl(dataObj);
    this.modal.content.render(list);
  }

  #profileRender(dataObj) {
    const section = document.createElement("section");
    const header = document.createElement("h3");
    header.textContent = dataObj["name"];
    section.append(header);

    for (const key in dataObj.data) {
      const details = document.createElement("details");
      const summary = document.createElement("summary");
      summary.textContent = key;
      details.append(summary);
      details.append(this.#keyPairToUl(data));
      section.append(details);
    }
    this.modal.content.render(section);
  }

  #keyPairToUl(dataObj) {
    const list = document.createElement("ul");
    list.style.listStyle = "none";
    list.style.padding = "0";
    for (const key in dataObj) {
      const listItem = document.createElement("li");
      listItem.style.padding = "8px";
      listItem.style.borderBottom = "1px solid #ddd";
      listItem.style.cursor = "pointer";
      limited = dataObj[key].slice(0, 70);
      listItem.textContent = `${key}: ${limited}`;
      // When an option is clicked, set the target input’s value.
      const self = this;
      listItem.addEventListener("click", () => {
        self.target.value = dataObj[key];
        self.modal.overlay.remove();
      });
      list.appendChild(listItem);
    }
    return list;
  }
  #loadInitialContent() {
    const info = document.createElement("p");
    info.textContent = "Select the tabs above to for the desired fill content";
    this.modal.content.clear();
    this.modal.content.append(info);
  }

  async #loaderHeaderTabs() {
    const resourceMap = await this.fetchData("mapping.json");

    for (const key in resourceMap) {
      const data = this.fetchData();
      const tab = document.createElement("button");
      tab.textContent = data["name"];
      this.modal.header.append(tab);
      const self = this;
      switch (data["type"]) {
        case "keyValue":
          tab.addEventListener("click", function () {
            self.#keyValueRender(data);
          });
          break;
        case "profile":
          tab.addEventListener("click", function () {
            self.#profileRender(data);
          });
          break;
        default:
          throw Error(
            "Unrecorgnised resource type. Valid types are keyValue, profile",
          );
      }
    }
  }

  async fetchData(fileName) {
    const url = chrome.runtime.getURL(`data/${fileName}`);
    const response = await fetch(url);
    return await response.json();
  }
}

document.addEventListener("focusin", (event) => {
  const target = event.target;
  if (target.tagName === "INPUT" || target.tagName === "TEXTAREA") {
    // For demonstration, bind a key (e.g., Ctrl+M) to open the modal.
    target.addEventListener("keydown", function handler(e) {
      // Ctrl+M triggers the modal
      if (e.ctrlKey && e.key === "m") {
        e.preventDefault();
        new SimpleModel(target);
        // Remove this handler to avoid duplicate bindings.
        target.removeEventListener("keydown", handler);
      }
    });
  }
});
