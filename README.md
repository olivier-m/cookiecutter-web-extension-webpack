# cookiecutter-web-extension-webpack

A [cookiecutter](https://github.com/audreyr/cookiecutter) template for
Web Extensions with webpack integration and a simple preferences system.

## Overwiew

This template bootstraps a new Web Extension with two noticeable features:

- Webpack integration. Your source code lives in a separate directory and is
  packed to your extension distribution directory.
- Simple preferences system. A simple, yet good enough, system for extension
  preferences. Just fill out a JSON file with your project settings and you're
  good to go!

## Usage

Clone this repository and run cookiecutter on it, or load directly this
repository through cookiecutter.

## Project layout

Your generated project looks like this:

```
.
├── addon                 (The extension itself)
│   ├── icons             (Your project icons)
│   │   ├── icon-48.png
│   │   └── icon-96.png
│   └── options
│       └── options.html  (The preferences files)
├── .eslintrc.json
├── .gitignore
├── LICENSE               (Empty file, fill this out with your license)
├── Makefile              (See below)
├── package.json
├── README.md             (Almost empty ;)
├── src
│   ├── browser
│   │   └── options.js    (The JS file used by options.html)
│   ├── lib
│   │   └── settings.js   (Settings library)
│   └── settings.json     (Extension default settings, see below)
├── webext-manifest.json  (This file will become addon/manifest.json upon building)
└── webpack.config.js
```

## Makefile targets

Your project management goes through a Makefile with the following targets:

- **make init**  
  Run `yarn` or `npm` install.
- **make source-lint**  
  Run `eslint` on your code in `src`.
- **make source-build**  
  Run `webpack` on your code and create the needed files in `addon`.
- **make moz-lint**  
  Run the target `source-lint`, `source-build` then `web-ext lint`.
- **make moz-run**  
  Build your source code and launch Firefox so you can test your extension.
  While developing, you don't need to reload, files are watched and both
  webpack and firefox will reload everything they need to upon any change.
- **make moz-pack**  
  Sign your extension with [`web-ext sign`](https://developer.mozilla.org/en-US/Add-ons/WebExtensions/web-ext_command_reference#web-ext_sign).
- **make chrome-run**  
  Build your source code and launch Chrome or Chromium. While webpack will
  rebuild sources when needed, you'll have to reload the extension in Chrome
  interface.
- **make chrome-pack**  
  Create a zip file of your extension.
- **make lint**  
  Run `source-lint`, `source-build` and `moz-lint` targets.
- **make clean**  
  Remove generated files in `addon` directory.

## Default extension settings

The file `src/settings.json` provides your settings layout and configuration.
The file's content is used by the settings library and gives you the following:

- A comprehensive setting list
- Default values, for you're going to add new settings over time and you don't
  want to break your extension :)

The `settings.json` file's content is a dictionary of settings, each one having
the following values:

- `default`: the default value
- `type`: could be one of `text`, `textarea`, `checkbox`, `radio`, `select`
- `label`: the option label
- `choices`: only for `radio` and `select` types. A dictionary of label/value.

Play with your `src/settings.json` to see how it works.

Each defined option will be available in your extension settings page.

To access those settings in your code, use something like this:

```js
// We assume your file is in src/lib
import {getSettings} from './settings';

getSettings().then(result => {
    // result contains your extension settings
    // and default values when nothing was found
});
```

## Environment variables

The `web-ext` command use some environment variables. Here are the most
important:

- `WEB_EXT_FIREFOX_BINARY`: Use it if web-ext can't find your Firefox binary
- `WEB_EXT_API_KEY`: Your Mozilla API Key (only if you plan to sign your addon)
- `WEB_EXT_API_SECRET`: Your Mozilla API Secret (only if you plan to sign your addon)

Happy hacking!
