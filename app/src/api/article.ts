import { exampleText } from "@/assets/example.json";
import { Article } from "@/api/types";
import { sleep } from "@/util/debug";
import { exampleLogin } from "@/state";

export const getArticle = async (): Promise<Article> => {
  await sleep(100);

  return {
    id: "dummy-article-id",
    author: exampleLogin,
    date: new Date(),
    title: "Dummy article title",
    source: "https://fake.com",
    originalText: exampleText,
    simplifiedText: exampleText.replaceAll("coronavirus", "cat"),
    ignoreWords: ["coronavirus", "respiratory"],
  };
};
