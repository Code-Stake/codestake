import React from "react";

const OutputWindow = ({ outputDetails }: { outputDetails: any }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;
    console.log(outputDetails);

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.compile_output)}
          status 6
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails.stdout) !== null
            ? `${atob(outputDetails.stdout)}`
            : null}
        </pre>
      );
    } else if (statusId === 5) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {`Time Limit Exceeded`}
        </pre>
      );
    } else if (statusId === 4) {
      // if the last line of the output is equal to the expected output then true
      // else false
      let actualOutput = atob(outputDetails?.stdout);
      console.log(actualOutput);
      let actualOutputArray = actualOutput.split("\n");
      console.log(actualOutputArray);

      if (
        actualOutputArray[actualOutputArray.length - 2] ===
        atob(outputDetails?.expected_output)
      ) {
        return (
          <pre className="px-2 py-1 font-normal text-xs text-green-500">
            {atob(outputDetails.stdout) !== null
              ? `${atob(outputDetails.stdout)}`
              : null}
          </pre>
        );
      }

      // when expected output != actual output
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          Expected Output Does Not Match
        </pre>
      );
    } else {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {atob(outputDetails?.stderr)}
          error
        </pre>
      );
    }
  };
  return (
    <>
      <h1 className="font-bold text-xl bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
        Output
      </h1>
      <div className="w-full h-56 bg-[#1e293b] rounded-md text-white font-normal text-sm overflow-y-auto">
        {outputDetails ? <>{getOutput()}</> : null}
      </div>
    </>
  );
};

export default OutputWindow;
