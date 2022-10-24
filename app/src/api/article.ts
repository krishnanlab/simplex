import { exampleText } from "@/assets/example.json";
import { ReadArticle } from "@/types";
import { sleep } from "@/util/debug";
import { exampleLogin } from "@/state";

export const getArticle = async (): Promise<ReadArticle> => {
  await sleep(100);

  return {
    id: 123,
    author: exampleLogin,
    date: new Date(),
    title: "Dummy article title",
    source: "https://fake.com",
    originalText: exampleText,
    simplifiedText: exampleText.replaceAll("coronavirus", "cat"),
    ignoreWords: ["coronavirus", "respiratory"],
  };
};
