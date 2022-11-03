import { rest } from "msw";
import { isWord, capitalize } from "@/util/string";
import { audiences, ReadArticle, ReadCollection } from "@/types";
import { exampleText } from "@/assets/example.json";

const scoreStore: Record<string, number> = {};
const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

const randDate = () =>
  new Date(
    new Date().valueOf() - Math.round(Math.random() * 1000 * 60 * 60)
  ).toISOString();

const articleIds = ["abc", "def", "ghi", "jkl", "mno", "pqr"];
const collectionIds = ["123", "456", "789"];

const articles: Array<ReadArticle> = articleIds.map((id) => ({
  id,
  author: {
    id: "abc123",
    name: "Dummy McGee " + id,
    institution: "Dummy Institute",
  },
  date: randDate(),
  title: "Dummy article " + id,
  source: "https://sounds-fake.com",
  originalText: exampleText,
  simplifiedText: exampleText.replaceAll(/[a-zA-Z]{7,}/g, "cat"),
  ignoreWords: ["coronavirus", "respiratory"],
  collections: [],
}));

const collections: Array<ReadCollection> = collectionIds.map((id) => ({
  id,
  author: {
    id: "abc123",
    name: "Dummy McGee",
    institution: "Dummy Institute",
  },
  date: randDate(),
  title: "Dummy collection title",
  description: "A collection of papers",
  articles: [],
}));

collections.forEach((collection) => {
  collection.articles = articleIds.filter(() => Math.random() > 0.5);
  collection.articles.forEach((id) =>
    articles
      .find((article) => article.id === id)
      ?.collections.push(collection.id)
  );
});

export const handlers = [
  rest.post(/\/signup/i, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: "abc123",
        name: body.name,
        email: body.email,
        institution: body.institution,
        newsletter: body.newsletter,
      })
    );
  }),

  rest.post(/\/login/i, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: "abc123",
        name: capitalize(body.email.split("@")[0]),
        email: body.email,
        institution: capitalize(body.email.split("@")[0]) + " Institute",
        newsletter: Math.random() > 0.5,
      })
    );
  }),

  rest.post(/\/logout/i, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/save-info/i, async (req, res, ctx) => {
    const body = await req.json();
    return res(
      ctx.status(200),
      ctx.json({
        id: "abc123",
        name: body.name,
        email: body.email,
        institution: body.institution,
        newsletter: body.newsletter,
      })
    );
  }),

  rest.post(/\/change-password/i, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/forgot-password/i, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/analyze/i, async (req, res, ctx) => {
    const body = await req.json();

    const scores: Record<string, number> = {};
    for (const word of body.words)
      if (isWord(word))
        scores[word] = body.ignoreWords.includes(word)
          ? 0
          : getWordScore(word) / (audiences.indexOf(body.audience) + 1);

    const calc =
      Object.values(scores).reduce((sum, val) => sum + val, 0) /
        Object.values(scores).length || 0;

    const complexity = calc;
    const gradeLevel = calc;

    return res(ctx.status(200), ctx.json({ scores, complexity, gradeLevel }));
  }),

  rest.get(/\/articles/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(articles))
  ),

  rest.get(/\/article/, (req, res, ctx) => {
    const match = articles.find(
      (article) => article.id === req.url.pathname.split("/").pop() || {}
    );
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.get(/\/collections/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(collections))
  ),

  rest.get(/\/collection/, (req, res, ctx) => {
    const match = collections.find(
      (collection) => collection.id === req.url.pathname.split("/").pop() || {}
    );
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),
];
