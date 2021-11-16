# Vaadin Theme Assistant

A browser extension that allows to visually identify elements of Vaadin components that can be themed, and gives instructions on how to set up the correct CSS in a Vaadin application.

> ⚠️ This is not an official Vaadin product. No support will be provided by Vaadin employees.

## Development

1. Install dependencies:
    ```sh
    yarn install
    ```
2. Start rollup build:
    ```sh
    yarn dev
    ```
3. Install extension in browser
    - Chrome: 
      - Open extension settings
      - Add unpacked extension
      - Select this folder
    - Firefox: 
      - Open Add-ons / Themes settings
      - Click cog
      - Select debug add-on
      - Add temporary add-on
      - Select manifest.json from this folder