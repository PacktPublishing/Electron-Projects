import React, { useState, useRef } from 'react';
import MonacoEditor from 'react-monaco-editor';

const Editor = () => {
  const [code, setCode] = useState('# hello world');
  const fileInputRef = useRef();

  const options = {
    selectOnLineNumbers: true,
    minimap: {
      enabled: false
    }
  };

  const handleCommand = payload => {
    if (payload) {
      switch (payload.command) {
        case 'file.open':
          setCode(payload.value || '');
          break;
        case 'file.save':
          saveFile(code);
          break;
        default:
          break;
      }
    }
  };

  if (window.require) {
    const electron = window.require('electron');
    const ipcRenderer = electron.ipcRenderer;

    ipcRenderer.on('commands', (_, args) => handleCommand(args));
  }

  const editorDidMount = (editor, monaco) => {
    console.log('editorDidMount', editor, monaco);
    editor.focus();

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_O, () => {
      fileInputRef.current.click();
    });

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KEY_S, () => {
      const code = editor.getModel().getValue();
      saveFile(code);
    });

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_H,
      () => generateOutput(editor, 'html')
    );

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_P,
      () => generateOutput(editor, 'pdf')
    );

    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Alt | monaco.KeyCode.KEY_E,
      () => generateOutput(editor, 'epub')
    );
  };

  const generateOutput = (editor, format) => {
    if (window.require) {
      const electron = window.require('electron');
      const ipcRenderer = electron.ipcRenderer;
      const text = editor.getModel().getValue();

      ipcRenderer.send('generate', {
        format,
        text
      });
    }
  };

  const saveFile = contents => {
    // save via node.js process
    if (window.require) {
      const electron = window.require('electron');
      const ipcRenderer = electron.ipcRenderer;

      ipcRenderer.send('save', contents);
    }
    // save via the browser
    else {
      const blob = new Blob([contents], { type: 'octet/stream' });
      const url = window.URL.createObjectURL(blob);

      const a = document.createElement('a');
      document.body.appendChild(a);
      a.style.display = 'none';
      a.href = url;
      a.download = 'markdown.md';
      a.click();

      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    }
  };

  const onFileOpened = event => {
    if (event.target.files && event.target.files.length > 0) {
      const firstFile = event.target.files[0];

      const fileReader = new FileReader();
      fileReader.onload = e => setCode(e.target.result);
      fileReader.readAsText(firstFile);

      event.target.value = null;
    }
  };

  const onChange = newValue => {
    console.log('onChange', newValue);
    setCode(newValue);
  };

  return (
    <div className="container">
      <input
        ref={fileInputRef}
        type="file"
        style={{ display: 'none' }}
        accept="text/markdown"
        onChange={onFileOpened}
      ></input>
      <MonacoEditor
        language="markdown"
        theme="vs-dark"
        value={code}
        options={options}
        onChange={onChange}
        editorDidMount={editorDidMount}
      />
    </div>
  );
};

export default Editor;
