chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === "OLLAMA_GENERATE") {
    fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: msg.model,
        prompt: msg.prompt,
        stream: false,
      }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
        return res.json();
      })
      .then((data) => sendResponse({ data }))
      .catch((err) => sendResponse({ error: err.message }));
    return true; // keep channel open for async response
  }

  //get a list of available models
  if (msg.type === "OLLAMA_MODELS") {
    fetch("http://localhost:11434/api/tags", {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((res) => {
        if (!res.ok) throw new Error(`Ollama error: ${res.status}`);
        return res.json();
      })
      .then((data) => sendResponse({ data }))
      .catch((err) => sendResponse({ error: err.message }));
    return true; // keep channel open for async response
  }
});
