import { admin } from "../firebase";
import { questionContent } from "../services/questionContent";
import { Request, Response } from "express";

const getQuestionFile = async (req: Request, res: Response) => {
  const bucket = admin.storage().bucket();

  // can i pick a random file
  // pick a random file from the bucket
  const [files] = await bucket.getFiles();

  const file = files[Math.floor(Math.random() * files.length)];
  console.log(file.name);

  // const file = bucket.file("questions/longestCommonPrefix.txt");

  const response = await getQuestionContent(file);
  return res.send(response);
};

const getQuestionContent = async (file: any) => {
  try {
    const contents = await file.download().then((contents) => {
      return questionContent(contents.toString());
    });
    return contents;
  } catch (error) {
    return error;
  }
};

export const gameInterfaceController = {
  getQuestionFile,
  getQuestionContent,
};
