/**
 * Fetches JSON data from the extension's assets.
 * @param {string} fileName - The name of the JSON file to load.
 * @returns {Promise<Object>} The parsed JSON data.
 */
export async function fetchData(fileName) {
  const url = chrome.runtime.getURL(`data/${fileName}`);
  const response = await fetch(url);
  return await response.json();
}

/**
 * Fetches Blob data from the extension's assets.
 * @param {string} fileName - The name of the file to load.
 * @returns {Promise<Object>} The parsed Blob data.
 */
export async function fetchBlob(fileName) {
  const url = chrome.runtime.getURL(`data/${fileName}`);
  const response = await fetch(url);
  return await response.blob();
}

/**
 * Fetches text data from the extension's assets.
 * @param {string} fileName - The name of the file to load.
 * @returns {Promise<Object>} The parsed text data.
 */
export async function fetchText(fileName) {
  const url = chrome.runtime.getURL(`data/${fileName}`);
  const response = await fetch(url);
  return await response.text();
}
