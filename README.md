# SMART FORM PICKER

**_Revision Date: April 20, 2025_**

---

## CONTENTS:

1. [INTRODUCTION](#introduction)
2. [INSTALLATION](#installation)
3. [PROJECT STRUCTURE](#project-structure)
4. [CONFIGURATION & DATA SETUP](#configuration--data-setup-important)
5. [Usage & Features](#usage--features)
   - Form Picker
   - Template Picker
   - File Upload
   - Configuration Switcher
6. [KEYBOARD SHORTCUTS](#keyboard-shortcuts)
7. [CUSTOMIZATION & BEST PRACTICES](#customization--best-practices)
8. [TESTING & DEVELOPMENT](#testing--development)
9. [QUICK START-UP: FULL EXAMPLE WITH INSTRUCTIONS](#quick-start-up-full-example-with-instructions)
10. [TROUBLESHOOTING](#troubleshooting)

---

1. ### INTRODUCTION

   Smart Form Picker is a Chrome extension designed to streamline form-filling tasks by dynamically populating form inputs using user-defined data. It supports various use cases including job applications, banking forms, education portals, and any repetitive form-entry scenario. All data, templates, and configurations are entirely customizable by users, providing maximum flexibility.
![Kapture 2025-04-20 at 18 12 32](https://github.com/user-attachments/assets/d2fd12e7-544d-4d6e-aea7-a535306c87a9)

2. ### INSTALLATION

   - A. Clone the repository:

     ```bash
     git clone git@github.com:mkhabelaj/smart-form-picker.git

     ```

   - B. Navigate into the directory:

     ```bash
     cd smart-form-picker
     ```

   - C. Install dependencies using Bun:
     ```bash
     bun install
     ```
   - D. Build content scripts:

     ```bash
     bun run build:content
     ```

   - E. Load into Chrome:
     - Go to chrome://extensions
     - Enable Developer Mode
     - Click “Load Unpacked” and select the project folder.

3. ### PROJECT STRUCTURE

   - smart-form-picker/
     - config.json (user-defined, see [4a](#a-configjson-placed-at-root))
     - manifest.json
       - data/ (user-defined, see [4b](#b-data-directory-user-created-at-root))
     - dist/ (build output)
     - src/
       - main.js (entry point, handles keyboard shortcuts)
       - api.js (data handling, storage, fetch logic)
       - controllers/ (UI controllers)
       - elements/ (DOM helpers)
       - modals/ (custom modals)
       - popups/ (custom popups)
       - toasts/ (user notifications)
       - utils.js (common utility functions)
     - package.json (dependencies & scripts)
     - bun.lockb (dependency lockfile)

4. ### CONFIGURATION & DATA SETUP (Important)

   **All user-specific configuration and data files are excluded from Git tracking (ignored via .gitignore). Users must manually create these files.**

   - #### A. config.json (placed at root):

     Purpose: Defines the default and available data sources.

     Example:

     ```json
     {
       "dataSource": "banking",
       "sources": ["banking", "school"]
     }
     ```

     **Explanation:**

     - dataSource: The default data folder used when the extension starts.
     - sources: List of available data folders within the ‘data/’ directory.

     ***

   - #### B. data/ directory (user-created at root):

     Structure:

     - data/
       - banking/ (example source)
         - mapping.json
         - profile.json
         - userdata.json
         - general.json
         - files (PDFs, documents)
         - templates (plain text .txt files)
         - school/ - (another example source)
         - mapping.json - (similar structure)

   **Each source folder (e.g., “banking”) must contain a `mapping.json` file.**

   - #### C. mapping.json (required per data source):

     Purpose: Defines tabs, templates, and files for the UI.

     Example:

     ```json
     {
       "tabs": ["userdata.json", "profile.json", "general.json"],
       "files": {
         "Bank Statement (pdf)": "statement.pdf"
       },
       "templates": ["letter-template.txt"]
     }
     ```

     Explanation:

     - tabs: Array of JSON files displayed as modal tabs.
     - files: User-friendly name mapped to actual filename stored within the same source directory.
     - templates: Text files containing placeholders for generating text content.

     ***

   - #### D. JSON Tab Formats:

     Two primary types:

     1. Key/Value pairs (userdata.json, general.json):

     ```json
     {
       "name": "User Data",
       "type": "keyValue",
       "data": {
         "Name": "Alice Smith",
         "Email": "alice@example.com",
         "Phone": "+1 123 456 7890"
       }
     }
     ```

     2. Profile data (profile.json):

     ```json
     {
       "name": "Professional Experience",
       "type": "profile",
       "data": {
         "Bank Manager": {
           "Position": "Bank Manager",
           "Company": "XYZ Bank",
           "Start Date (yyyy-mm-dd)": "2020-01-01",
           "End Date (yyyy-mm-dd)": "2023-12-31",
           "Description (Single Newline)": "Managed daily operations.\nImproved customer satisfaction by 20%.",
           "Description (Bulleted Double Newline)": "- Managed daily operations.\n\n- Improved customer satisfaction by 20%.",
           "Description (Long Summary)": "Detailed achievements here.",
           "Description (Short Summary)": "Brief summary here."
         }
       }
     }
     ```

     ***

   - #### E. Templates (.txt files):

     Plain text files with placeholders to dynamically generate custom content.

     ```txt

     Example (letter-template.txt):
     Dear [Recipient Name],

     I am [Your Name], applying for [Position] at [Company].

     Best regards,
     [Your Name]

     Placeholders in square brackets must match keys in your JSON tab files.
     ```

5. ### USAGE & FEATURES

- Form Pickers:

  - #### A. Form Picker (Ctrl+M):

    - Opens modal displaying tabs from mapping.json.
    - Clicking a key/value pair fills the focused form input.
    - Loads tabs from mapping.json. (see [4c](#c-mappingjson-required-per-data-source) & [4d](#d-json-tab-formats))

      ![smart-form-picker](https://github.com/user-attachments/assets/dab99991-ee09-4b44-87c5-4ff7ba19055f)

  ***

  - #### B. Template Picker (Ctrl+T):

    - Create, edit, preview, save, load, copy, modify, download templates and upload modified templates as pdf or plain text files to file input elements.
    - Supports plain text and PDF generation.
    - Basically loads and modified defined template registered in mapping.json templates section(see [4c](#c-mappingjson-required-per-data-source) & [4e](#e-templates-txt-files)).

      In the example below we load a pre-defined cover letter template, modify the place holders, save the template for later use. Then copy the modified template onto the clipboard so we can paste it into the cover letter input.

      ![smart-template-picker-fill-save-copy](https://github.com/user-attachments/assets/086c26b0-835c-46c3-ad3d-1d206b6a3dc8)

      In the example below; we load the previously saved modified template back into the text area, then make further modificaton. Once we are done with the changes, we name and upload the modified cover-letter as a pdf to a selected input.

      ![smart-template-picker-load-upload](https://github.com/user-attachments/assets/c2429d71-44a7-4193-a8cc-98527421b210)

  - #### C. File Upload (Ctrl+U):

    - Allows PDF injection into file input elements from pre-defined files.
    - Ideal for quickly submitting documents.
    - Basically loads and modified defined template registered in mapping.json files section(see [4c](#c-mappingjson-required-per-data-source)).

      ![smart-file-uploader](https://github.com/user-attachments/assets/26a2fc7f-3af4-481a-9112-a364e86ccfb0)

  - #### D. Configuration Switcher (Ctrl+K):
    - Easily switch between different data sources at runtime.
    - Refreshes tabs, files, and templates based on selected source.

6. ### KEYBOARD SHORTCUTS:

   - `Ctrl+M`: Opens Form Picker modal on focused input/textarea.
   - `Ctrl+T`: Opens Template Picker modal.
   - `Ctrl+U`: Opens File Upload modal.
   - `Ctrl+K`: Opens Configuration Switcher modal.

7. ### CUSTOMIZATION & BEST PRACTICES

   - Clearly structure data directories for easy management.
   - Use consistent naming conventions for clarity.
   - Regularly validate JSON files to avoid syntax errors.
   - Back up your data folders externally to prevent data loss.

8. ### TESTING & DEVELOPMENT:

   Scripts available via Bun (package.json):

   ```bash

   bun run build:content # Compiles content scripts.
   bun run build:watch # Watches and recompiles content scripts on changes.
   bun run test # Runs unit tests.
   bun run test:watch # Continuously runs tests on file changes.
   ```

   Continuous Integration via GitHub Actions automatically runs unit tests on pushes and pull requests.

9. ### QUICK START-UP: FULL EXAMPLE WITH INSTRUCTIONS

This quick-start example demonstrates a complete, step-by-step configuration and data setup, providing everything you need to quickly start using Smart Form Picker.

### STEP 1: SET UP CONFIGURATION FILE

Create a new file named **config.json** at the root of your extension folder with the following content:

```json
{
  "dataSource": "personal",
  "sources": ["personal", "work"]
}
```

Explanation:
• **personal** is the default data source loaded on startup.
• Two sources (**personal** and **work**) are defined, allowing quick switching via **Ctrl+K**.

---

### STEP 2: CREATE DATA DIRECTORIES AND FILES

Create the directory structure exactly as follows in the extension root:

- data/
  - personal/
    - mapping.json
    - userdata.json
    - profile.json
    - general.json
    - my-resume.pdf
    - intro-template.txt
  - work/
    - mapping.json
    - userdata.json
    - profile.json
    - general.json
    - work-resume.pdf
    - business-template.txt

---

### STEP 3: FILL OUT YOUR DATA FILES

Example content for **personal** source:

**mapping.json:**

```json
{
  "tabs": ["userdata.json", "profile.json", "general.json"],
  "files": {
    "My Personal Resume": "my-resume.pdf"
  },
  "templates": ["intro-template.txt"]
}
```

**userdata.json (key/value format):**

```json
{
  "name": "My Personal Info",
  "type": "keyValue",
  "data": {
    "Name": "Alice Doe",
    "Email": "alice.doe@example.com",
    "Phone": "+1 555 987 6543"
  }
}
```

**profile.json (profile format):**

```json
{
  "name": "My Career Profile",
  "type": "profile",
  "data": {
    "Developer": {
      "Position": "Software Developer",
      "Company": "Tech Solutions Inc.",
      "Start Date (yyyy-mm-dd)": "2021-06-01",
      "End Date (yyyy-mm-dd)": "2024-04-15",
      "Description (Single Newline)": "Developed client web applications.\nImproved performance by 30%.",
      "Description (Bulleted Double Newline)": "- Developed client web applications.\n\n- Improved performance by 30%.",
      "Description (Long Summary)": "Built numerous client-facing web apps, optimizing frontend performance significantly, leading to measurable client satisfaction improvements.",
      "Description (Short Summary)": "Developed performant client web apps."
    }
  }
}
```

**general.json (key/value format):**

```json
{
  "name": "Additional Info",
  "type": "keyValue",
  "data": {
    "Availability": "Immediate",
    "Relocation": "No",
    "Preferred Contact": "Email"
  }
}
```

**intro-template.txt:**

```txt
Dear [Recipient],

My name is [Name], and I am excited about the opportunity at your organization.

Best,
[Name]
```

---

### STEP 4: REPEAT FOR “WORK” SOURCE (if needed)

Populate your “work” source directory similarly to “personal”, customizing data relevant for your work-related forms.

STEP 5: LOAD EXTENSION INTO CHROME

- Open Chrome and go to `chrome://extensions`
- Activate “Developer Mode”.
- Click `Load unpacked` and select your Smart Form Picker extension directory.

### STEP 6: USING THE EXTENSION QUICKLY

- Navigate to any web form.
- Click on an input or textarea, then press Ctrl+M:
- Modal opens showing your tabs (“My Personal Info”, “My Career Profile”, “Additional Info”).
- Click a field to automatically populate the input.
- Press Ctrl+T to open Template Picker:
- Choose or write templates, preview, save as PDF, or copy content.
- Press Ctrl+U to open File Upload:
- Easily select files (e.g., resume PDF) to upload directly into web forms.
- Press Ctrl+K to switch data sources (“personal” ↔ “work”):
- Instantly switch the entire data context without reloading the extension.

Congratulations! You now have a fully functional, user-configurable Smart Form Picker setup ready to streamline your online form-filling process.

10. ### TROUBLESHOOTING:

Common Issues:

- Tabs or templates not loading: Check mapping.json paths, file existence, and JSON validity.
- PDF upload issues: Ensure page has file input fields; verify correct input selected in the dropdown.

