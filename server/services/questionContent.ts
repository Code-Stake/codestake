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
      start: "# <prompt>",
      end: "# </prompt>",
      name: "prompt",
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
  const inputs = [];
  const outputs = [];
  let i = 1;
  while (true) {
    const inputPlaceholder = `# <testCaseInput${i}>`;
    const outputPlaceholder = `# <testCaseOutput${i}>`;
    const inputRegex = new RegExp(
      `${inputPlaceholder}([\\s\\S]*?)# </testCaseInput${i}>`,
      "s"
    );
    const outputRegex = new RegExp(
      `${outputPlaceholder}([\\s\\S]*?)# </testCaseOutput${i}>`,
      "s"
    );
    const inputMatch = fileContents.match(inputRegex);
    const outputMatch = fileContents.match(outputRegex);
    console.log(inputMatch);
    console.log(outputMatch);
    if (!inputMatch || !outputMatch) {
      break;
    }
    inputs.push(inputMatch[1]);
    outputs.push(outputMatch[1]);
    result[`testCaseInput${i}`] = inputMatch[1];
    result[`testCaseOutput${i}`] = outputMatch[1];
    i++;
  }
  result["inputs"] = inputs;
  result["outputs"] = outputs;
  console.log(inputs);
  console.log(outputs);
  return result;
};
