// ThemeDropdown.js

import React from "react";
import Select from "react-select";
//@ts-ignore
import monacoThemes from "monaco-themes/themes/themelist";
import { customStyles } from "../../constants/customStyles";

const ThemeDropdown = ({
  handleThemeChange,
  theme,
}: {
  handleThemeChange: any;
  theme: any;
}) => {
  return (
    <Select
      placeholder={`Select Theme`}
      // options={languageOptions}
      options={Object.entries(monacoThemes).map(([themeId, themeName]) => ({
        label: themeName,
        value: themeId,
        key: themeId,
      }))}
      value={theme}
      styles={customStyles}
      onChange={handleThemeChange}
    />
  );
};

export default ThemeDropdown;
