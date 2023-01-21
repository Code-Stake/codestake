import React from "react";
import { classnames } from "../utils/general";

const CustomInput = ({
  customInput,
  setCustomInput,
}: {
  customInput: any;
  setCustomInput: any;
}) => {
  return (
    <>
      {" "}
      <textarea
        rows={5} // changed to num from str
        value={customInput}
        onChange={(e) => setCustomInput(e.target.value)}
        placeholder={`Custom input`}
        className={classnames(
          "focus:outline-none w-full border-2 border-black z-10 rounded-md shadow-[5px 5px 0px 0px rgba(0,0,0)] px-4 py-2 hover:shadow transition duration-200 bg-white mt-2"
        )}
      ></textarea>
    </>
  );
};

export default CustomInput;
