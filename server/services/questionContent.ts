export const questionContent = (fileContents: string) => {
  const sectionPlaceholders = [
    {
      start: "# <section1>",
      end: "# </section1>",
      name: "preProcessingCode",
    },
    {
      start: "# <section2>",
      end: "# </section2>",
      name: "starterCode",
    },
    {
      start: "# <section3>",
      end: "# </section3>",
      name: "executionCode",
    },
    {
      start: "# <section4>",
      end: "# </section4>",
      name: "prompt",
    },
    {
      start: "# <section5>",
      end: "# </section5>",
      name: "testCaseInput1",
    },
    {
      start: "# <section6>",
      end: "# </section6>",
      name: "testCaseOutput1",
    },
    {
      start: "# <section7>",
      end: "# </section7>",
      name: "testCaseInput2",
    },
    {
      start: "# <section8>",
      end: "# </section8>",
      name: "testCaseOutput2",
    },
    {
      start: "# <section9>",
      end: "# </section9>",
      name: "testCaseInput3",
    },
    {
      start: "# <section10>",
      end: "# </section10>",
      name: "testCaseOutput3",
    },
  ];
  const result = {};
  for (const placeholder of sectionPlaceholders) {
    const regex = new RegExp(
      `${placeholder.start}([\\s\\S]*?)${placeholder.end}`,
      "s"
    );
    const match = fileContents.match(regex);
    const contents = match ? match[1] : "";
    result[placeholder.name] = contents;
  }
  return result;
};
