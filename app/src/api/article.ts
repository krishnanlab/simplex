import { exampleText } from "@/assets/example.json";
import { ReadArticle } from "@/types";

export const getArticle = async (): Promise<ReadArticle> => {
  return {
    id: "123",
    author: { id: "abc" },
    date: new Date(),
    title: "Dummy article title",
    source: "https://fake.com",
    originalText: exampleText,
    simplifiedText: exampleText.replaceAll("coronavirus", "cat"),
    ignoreWords: ["coronavirus", "respiratory"],
    collections: [],
  };
};
