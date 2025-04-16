# Smart Form Picker

!> [!WARNING]

> These docs are outdated!! and will be updated soon

Smart Form Picker is a browser extension that helps users manually select and populate form fields on web pages via an interactive modal interface. Instead of automatic filling, it allows users to review and choose from pre-configured data sources (provided as JSON files) to populate form fields.

The modal interface is implemented using the Shadow DOM to encapsulate its UI and styles from the host page, ensuring consistent and isolated behavior. The extension runs on both Google Chrome and Arc Browser (which supports Chrome extensions).

## Table of Contents

- [Features](#features)
- [Installation](#installation)
  - [For Google Chrome](#for-google-chrome)
  - [For Arc Browser](#for-arc-browser)
- [Usage](#usage)
- [File Structure](#file-structure)
  - [Create File Structure](#create-data-directory) **_!Important_**

## Features

- **Manual Data Selection:**  
  Pick from pre-defined data sets (e.g., user details or work experience) to populate form fields.
- **Shadow DOM Encapsulation:**  
  Uses a Shadow DOM in the modal interface to prevent style leakage and conflicts with the host page.
- **Dynamic Modal Interface:**  
  Offers header tabs for different data sets, dynamic content rendering, and an option to cancel the selection.
- **Cross-Browser Compatibility:**  
  Works in both Google Chrome and Arc Browser (which supports Chrome extensions).
- **Lightweight and Extendable:**  
  Built using plain JavaScript; the extension is modular, making it easy to customize data sources and UI behavior.

## Installation

### For Google Chrome

1. **Clone or Download the Repository:**
   ```bash
   git clone git@github.com:mkhabelaj/smart-form-picker.git
   ```
1. **Open Chrome and Navigate to the Extensions Page:**
   - Type chrome://extensions/ in your address bar.
1. Enable Developer Mode:
   - Toggle the “Developer mode” switch in the upper right corner.
1. Load the Unpacked Extension:
   - Click on Load unpacked and select the smart-form-picker folder.
1. The extension icon should now appear in your Chrome toolbar.

### For Arc Browser

Arc Browser supports Chrome extensions natively. Follow these steps:

1. **Clone or Download the Repository:**
   ```bash
   git clone git@github.com:mkhabelaj/smart-form-picker.git
   ```
1. **Open Arc Browser:**
   - Arc supports chrome://extensions/. Navigate to this URL.
1. **Enable Developer Mode (if needed):**
   - Use the toggle to enable Developer Mode.
1. **Load Unpacked:**
   - Click Load unpacked and select the smart-form-picker project folder.
1. **The extension should now be active and visible in your Arc Browser toolbar.**

## Usage

1. Navigate to a Webpage with Form Fields:
   Open any webpage that contains form inputs (e.g., login forms, job applications, etc.).
1. **Activate the Extension:**
   - Click on a text input or textarea.
   - Press Ctrl + M on your keyboard to trigger the Smart Form Picker modal.
1. **Interact with the Modal:**
   - Use the header tabs to switch between different data sets.
   - Click on an option from the list to populate the active field.
   - Click the Cancel button if you wish to dismiss the modal.
1. **Enjoy Manual Selection:**
   The extension allows you to pick the data you want to input into each field manually, giving you full control over your form entries.

## File Structure

### Create data directory

The data directory currently supports three types of files _mapping.json_, _keyvalue_, _profile_.

#### mapping.json

Registers any number of **keyvalue** and **profile** files.

```json
{
  "userData": "userdata.json",
  "fullstack-resume": "fullstack-resume.json"
}
```

#### keyvalue.json

Represents a list of key/value pairs.

```json
{
  "name": "User Data",
  "type": "keyValue",
  "data": {
    "Email": "someone@gmail.com",
    "FullName": "John Doe",
    "Address": "203 Ave, Ridge View",
    "Alphnumric Phone": "+1(239)-686-111",
    "LinkedIn": "https://www.linkedin.com/in/johndoe/",
    "Porfolio": "https://portfolio.johndoe.com/"
  }
}
```

This will create a tab called _User Data_ in the modal.

#### profile.json

```json
{
  "name": "Senior Fullstack Developer",
  "type": "profile",
  "data": {
    "Freelance Fullstack Developer": {
      "Position": "Freelance Fullstack Developer",
      "Company": "Localhost",
      "Start Date": "10-04-24",
      "End Date": "10-06-24",
      "Description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quas.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quas.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quas."
    },
    "Junior Developer": {
      "Position": "Junior Developer",
      "Company": "Localhost",
      "Start Date": "10-10-16",
      "End Date": "10-06-17",
      "Description": "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quas.\n\nLorem ipsum dolor sit amet consectetur adipisicing elit. Quos, quas."
    }
  }
}
```

This will create a tab called _Senior Fullstack Developer Resume_ in the modal.
