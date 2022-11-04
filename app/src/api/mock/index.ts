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
  rest.post(/\/signup/, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[0]));
  }),

  rest.post(/\/login/, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[1]));
  }),

  rest.post(/\/logout/, async (req, res, ctx) => res(ctx.status(200))),

  rest.get(/\/author/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").pop();
    const match = authors.find((author) => author.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.post(/\/save-info/, async (req, res, ctx) => {
    const body = await req.json();
    console.info(body);
    return res(ctx.status(200), ctx.json(authors[0]));
  }),

  rest.post(/\/change-password/, async (req, res, ctx) => res(ctx.status(200))),

  rest.post(/\/forgot-password/, async (req, res, ctx) => res(ctx.status(200))),

  rest.post(/\/analyze/, async (req, res, ctx) => {
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

  rest.get(/\/simplify/, (req, res, ctx) =>
    res(
      ctx.status(200),
      ctx.json({
        definition:
          "Pneumonia is an inflammatory condition of the lung primarily affecting the small air sacs known as alveoli. Symptoms typically include some combination of productive or dry cough, chest pain, fever, and difficulty breathing. The severity of the condition is variable.",
        image:
          "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg/1920px-Normal_posteroanterior_%28PA%29_chest_radiograph_%28X-ray%29.jpg",
        synonyms:
          "avid insatiable prodigious rapacious ravenous devouring".split(" "),
        link: "https://google.com",
      })
    )
  ),

  rest.get(/\/articles/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(articles))
  ),

  rest.get(/\/article/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").pop();
    const match = articles.find((article) => article.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.delete(/\/article/, (req, res, ctx) => res(ctx.status(200))),

  rest.post(/\/article/, (req, res, ctx) => res(ctx.status(200))),

  rest.put(/\/article/, (req, res, ctx) => res(ctx.status(200))),

  rest.put(/\/share/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ link: "https://simpl.io/123456789" }))
  ),

  rest.get(/\/collections/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(collections))
  ),

  rest.get(/\/collection/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").pop();
    const match = collections.find((collection) => collection.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.delete(/\/collection/, (req, res, ctx) => res(ctx.status(200))),

  rest.post(/\/collection/, (req, res, ctx) => res(ctx.status(200))),

  rest.put(/\/collection/, (req, res, ctx) => res(ctx.status(200))),
];
