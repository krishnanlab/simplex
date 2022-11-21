import { exampleText } from "@/assets/example.json";
import { ReadArticle, ReadAuthor, ReadCollection } from "@/global/types";

/** code used to generate mock data */

const order: Record<string, number> = {};
const rand = <T>(array: Array<T>, key?: string): T =>
  array[
    key
      ? (order[key] = (key in order ? order[key] + 1 : 0) % array.length)
      : Math.floor(Math.random() * array.length)
  ];

const id = () =>
  Array(10)
    .fill("")
    .map(() =>
      rand(
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789".split(
          ""
        )
      )
    )
    .join("");

let denom = 0;
const date = () =>
  new Date(
    new Date().valueOf() -
      Math.floor(
        5 *
          Math.random() *
          [1000, 60, 60, 24, 30, 12]
            .slice(0, 1 + (denom++ % 6))
            .reduce((product, value) => product * value, 1)
      )
  ).toISOString();

const complexWords = [
  "coronavirus",
  "zoonotic",
  "respiratory",
  "inflammation",
  "pandemic",
  "epidemiology",
];
const complexText = () =>
  Array(20)
    .fill("")
    .map(() => rand(complexWords))
    .join(" ");

const simpleWords = ["apple", "blue", "cat", "dog", "elephant", "fig"];
const simpleText = () =>
  Array(20)
    .fill("")
    .map(() => rand(simpleWords))
    .join(" ");

export let authors: Array<ReadAuthor> = [];
export let articles: Array<ReadArticle> = [];
export let collections: Array<ReadCollection> = [];

authors = [
  {
    id: id(),
    name: "Dummy McGee",
    email: "dummy.mcgee@hotmail.com",
    institution: "Dummy Institute",
    newsletter: true,
  },
  {
    id: id(),
    name: "Clark Kent",
    email: "clark.kent@krypton.com",
    institution: "Superman University",
    newsletter: false,
  },
];

articles = Array(10)
  .fill({})
  .map(() => ({
    id: id(),
    author: rand(authors).id,
    date: date(),
    title: rand(
      [
        "My first article",
        "Test article",
        "Dummy article",
        "Novel coronavirus",
        "Article for dummies",
        "Chicken soup for the soul",
        "My favorite pets",
        "Discussion of machine learning",
        "Cool plants and other things",
      ],
      "article-title"
    ),
    source:
      "https://" +
      rand(
        ["google", "bing", "ncbi", "nih", "science", "yep", "nope", "maybe"],
        "article-source"
      ) +
      ".com/",
    originalText: complexText(),
    simplifiedText: simpleText(),
    ignoreWords: [rand(complexWords), rand(complexWords), rand(simpleWords)],
    collections: [],
  }));

articles[0].originalText = exampleText;
articles[0].simplifiedText = exampleText.replaceAll(/[a-zA-Z]{7,}/g, "cat");

collections = Array(5)
  .fill({})
  .map(() => ({
    id: id(),
    author: rand(authors).id,
    date: date(),
    title: rand(
      [
        "My first collection",
        "Test collection",
        "Dummy collection",
        "Cool collection",
        "Collection for dummies",
        "My favorites",
      ],
      "collection-title"
    ),
    description: rand(
      [
        "Lorem ipsum",
        "dolor sit amet",
        "consectetur adipiscing elit",
        "sed do eiusmod tempor incididunt",
        "ut labore et dolore magna aliqua",
        "Ut enim ad minim veniam",
        "quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat",
      ],
      "collection-description"
    ),
    articles: [],
  }));

for (const collection of collections) {
  for (const article of articles) {
    if (article.author === collection.author && Math.random() > 0.5) {
      article.collections.push(collection.id);
      collection.articles.push(article.id);
    }
  }
}

console.info(authors);
console.info(articles);
console.info(collections);
