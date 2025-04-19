const DATA_SOURCE_KEY = "smart-form-picker-data-source";

/**
 * Fetches extension configuration from root
 * @returns {Promise<Object>} The parsed JSON data.
 */
export async function getConfig() {
  const url = chrome.runtime.getURL(`config.json`);
  const response = await fetch(url);
  return await response.json();
}

/**
 * Sets the data source in storage.
 * @param {string} dataSource - The data source.
 */
export async function setDataSource(dataSource) {
  await setStorage({ [DATA_SOURCE_KEY]: dataSource });
}

/**
 * Retrieves the data source from storage.
 * @returns {Promise<string>} The data source.
 */
export async function getDataSource() {
  const result = await getStorage(DATA_SOURCE_KEY);
  let dataSource = result[DATA_SOURCE_KEY] || null;

  if (!dataSource) {
    const config = await getConfig();
    await setDataSource(config.dataSource);
    dataSource = config.dataSource;
  }

  return dataSource;
}

/**
 * Retrieves the data source from storage.
 * @returns {Promise<Array<string>>} The data source.
 */
export async function getDataSources() {
  const config = await getConfig();
  return config.sources;
}

/**
 * Fetches data from the extension's assets.
 * @param {string} item - The name of the file to load.
 * @returns {Promise<Object>} The parsed data.
 */
export async function fetchDataResponse(item) {
  const dataSource = await getDataSource();
  const url = chrome.runtime.getURL(`data/${dataSource}/${item}`);
  const response = await fetch(url);
  return response;
}

/**
 * Fetches JSON data from the extension's assets.
 * @param {string} fileName - The name of the JSON file to load.
 * @returns {Promise<Object>} The parsed JSON data.
 */
export async function fetchData(fileName) {
  const response = await fetchDataResponse(fileName);
  return await response.json();
}

/**
 * Fetches Blob data from the extension's assets.
 * @param {string} fileName - The name of the file to load.
 * @returns {Promise<Object>} The parsed Blob data.
 */
export async function fetchBlob(fileName) {
  const response = await fetchDataResponse(fileName);
  return await response.blob();
}

/**
 * Fetches text data from the extension's assets.
 * @param {string} fileName - The name of the file to load.
 * @returns {Promise<Object>} The parsed text data.
 */
export async function fetchText(fileName) {
  const response = await fetchDataResponse(fileName);
  return await response.text();
}
// Helper function to wrap chrome.storage.local.get in a Promise
export async function getStorage(keys) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get(keys, (result) => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve(result);
    });
  });
}

// Helper function to wrap chrome.storage.local.set in a Promise
export async function setStorage(item) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set(item, () => {
      if (chrome.runtime.lastError) {
        return reject(chrome.runtime.lastError);
      }
      resolve();
    });
  });
}
