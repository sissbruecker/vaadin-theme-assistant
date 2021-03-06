# Vaadin Theme Assistant

A browser extension that allows to visually identify elements of Vaadin components that can be themed, and gives instructions on how to set up the correct CSS in a Vaadin Flow or Fusion application.
The application needs to use a [custom theme](https://vaadin.com/docs/latest/ds/customization/custom-theme) in order to make use of the instructions provided by the extension.

**Features**
- Custom element picker / inspector that is optimized for Vaadin components and their internal parts
- Provides instructions and code snippets that can be copied / pasted into your application
- Configure whether you want to theme all, or only specific instances of a component
- Configure whether the styles should only be applied when the component is in a specific state (opened, closed, invalid, ...) 
- Optimized for Vaadin 22 


**Demo Video (Youtube ↗)**

[![Watch the video](https://i1.ytimg.com/vi/uKZLLuKwhxU/hqdefault.jpg)](https://youtu.be/uKZLLuKwhxU)

> ⚠️ This is not an official Vaadin product. No support will be provided by Vaadin employees.

## Installation

Chrome: [Chrome Web Store](https://chrome.google.com/webstore/detail/vaadin-theme-assistant/appljeomkgjhafplceofapmechoilnhb)

Firefox: [Firefox Addon Store](https://addons.mozilla.org/de/firefox/addon/vaadin-theme-assistant/)

## Usage

- First, install the extension
- Open the application that you want to theme in your browser
- Open the developer tools
- Open the `Vaadin Theme Assistant` panel
- Click on `Pick element`
- Hover the cursor over a Vaadin component that you want to theme, notice how individual elements get highlighted
- Click on a highlighted element
- The dev tools panel will now list a number of suggestions for elements that can be themed
- Click on one of the suggested elements to start theming it
- Configure the scope for the styles that you want to apply to the element on the left side. You can choose to either style all instances of the component, or only specific ones. You can also choose to apply the styles only when the component is in a specific state.
- Follow the instructions on the right side to apply the styles in your application 

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

## Build

**Requirements**
- Latest LTS Node version
- Latest LTS NPM version
- yarn
- npx
- bash

Internally, `web-ext` is used to bundle a distribution package of the extension. You do not need to install `web-ext`.

Run the following bash script to generate a build (might need to make the file executable using `chmod +x build.sh`):
```
./build.sh
```

The script does:
- Install all dependencies using yarn
- Runs rollup to transpile and minify source files, with output written to `build`
- Run web-ext to package the extension for uploading to the Mozilla addon store and Chrome extension store

The packaged extension can be found in the `web-ext-artifacts` folder.
