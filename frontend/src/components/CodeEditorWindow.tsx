// CodeEditorWindow.js

import React, { useState } from "react";

import Editor from "@monaco-editor/react";

type Params = {
  onChange: any; //need to change onChange's type
  language: string;
  code: string;
  theme: string;
};

const CodeEditorWindow = ({ onChange, language, code, theme }: Params) => {
  const [value, setValue] = useState(code || "");

  const handleEditorChange = (value: any) => {
    //need to change value's type
    setValue(value);
    onChange("code", value);
  };

  return (
    <div className="overlay rounded-md overflow-hidden w-full h-full shadow-4xl">
      <Editor
        height="85vh"
        width={`100%`}
        language={language || "python"}
        value={value}
        theme={theme}
        defaultValue={code}
        onChange={handleEditorChange}
      />
    </div>
  );
};
export default CodeEditorWindow;
