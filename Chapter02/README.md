# Chapter 2: Building a Markdown Editor

Running the project

```sh
npm install
npm start
```

## Publishing to the GitHub

Update the `package.json` file and provide the `build` settings:

```json
{
  "build": {
      "appId": "com.my.markdown-editor",
      "publish": {
        "provider": "github",
        "owner": "<account>",
        "repo": "electron-updates"
      }
  }
}
```

## Available NPM scripts

| Script | Description |
| --- | --- |
| start | starts the Electron application |
| build:macos | creates a testing build for macOS |
| publish:github | releases the macOS version to the GitHub |