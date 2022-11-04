import { rest } from "msw";
import { isWord } from "@/util/string";
import { audiences } from "@/global/types";
import authors from "./authors.json";
import articles from "./articles.json";
import collections from "./collections.json";

const scoreStore: Record<string, number> = {};
export const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

export const handlers = [
  rest.post(/\/signup/i, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[0]));
  }),

  rest.post(/\/login/i, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[1]));
  }),

  rest.post(/\/logout/i, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.get(/\/author/, (req, res, ctx) => {
    // return res(ctx.status(404));
    const id = req.url.pathname.split("/").pop();
    const match = authors.find((author) => author.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.post(/\/save-info/i, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[0]));
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
    const id = req.url.pathname.split("/").pop();
    const match = articles.find((article) => article.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.get(/\/collections/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(collections))
  ),

  rest.get(/\/collection/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").pop();
    const match = collections.find((collection) => collection.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.delete(/\/collection/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
];
