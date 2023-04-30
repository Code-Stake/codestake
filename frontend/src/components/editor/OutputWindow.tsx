import React from "react";

const OutputWindow = ({ outputDetails }: { outputDetails: any }) => {
  const getOutput = () => {
    let statusId = outputDetails?.status?.id;
    console.log(outputDetails);

    if (statusId === 6) {
      // compilation error
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          {/* {atob(outputDetails?.compile_output)} */}
          {/* <br></br> */}
          {outputDetails?.status?.description}
          status 6
        </pre>
      );
    } else if (statusId === 3) {
      return (
        <pre className="px-2 py-1 font-normal text-xs text-green-500">
          {atob(outputDetails.stdout) !== null ? "Success!" : null}
          <br></br>

          {outputDetails?.status?.description}
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
          <pre className="px-2 py-1 font-normal text-xs text-red-500">
            {/* {atob(outputDetails.stdout) !== null
              ? `${atob(outputDetails.stdout)}`
              : null} */}
            {outputDetails?.status?.description}
          </pre>
        );
      }

      // when expected output != actual output
      return (
        <pre className="px-2 py-1 font-normal text-xs text-red-500">
          Expected Output Does Not Match
          <br></br>
          {outputDetails?.status?.description}
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
      <div className="text-white">
        <div className="mb-2">
          <h1 className="font-semibold text-xl bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
            Output
          </h1>
          <div className="w-full h-16 bg-[#e6e6e6] dark:bg-[#1e293b] rounded-[10px]  text-white font-normal text-sm overflow-y-auto">
            {outputDetails ? <>{getOutput()}</> : null}
          </div>
        </div>
        <div className="my-2">
          <h3 className="font-semibold text-xl bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
            Your Output
          </h3>
          <div
            className={`w-full h-16 bg-[#e6e6e6] dark:bg-[#1e293b] rounded-[10px]  font-normal text-sm overflow-y-auto ${
              outputDetails?.status["description"] === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {outputDetails ? <>{atob(outputDetails?.stdout)}</> : null}
          </div>
        </div>
        <div className="my-2">
          <h1 className="font-semibold text-xl bg-clip-text bg-gradient-to-r from-slate-900 to-slate-700 mb-2">
            Expected Output
          </h1>
          <div
            className={`w-full h-16 bg-[#e6e6e6] dark:bg-[#1e293b] rounded-[10px] font-normal text-sm overflow-y-auto ${
              outputDetails?.status["description"] === "Accepted"
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {outputDetails ? <>{atob(outputDetails?.expected_output)}</> : null}
          </div>
        </div>
      </div>
    </>
  );
};

export default OutputWindow;
