import { rest } from "msw";
import articles from "./articles.json";
import authors from "./authors.json";
import collections from "./collections.json";
import revisions from "./revisions.json";
import { isWord } from "@/util/string";

/** dummy cache store of word scores */
const scoreStore: Record<string, number> = {};

export const getWordScore = (word: string) =>
  scoreStore[word] || (scoreStore[word] = Math.random() * 100);

/** mock api responses */
export const handlers = [
  rest.get(/\/check-login$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/signup$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(authors[0]))
  ),

  rest.post(/\/login$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(authors[1]))
  ),

  rest.post(/\/logout$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.get(/\/authors\/\w+$/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").at(-1);
    const match = authors.find((author) => author.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.post(/\/save-info$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json(authors[0]))
  ),

  rest.post(/\/change-password$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/forgot-password$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/reset-password$/, async (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.post(/\/analyze$/, async (req, res, ctx) => {
    const body = await req.json();

    const scores: Record<string, number> = {};
    for (const word of body.words)
      if (isWord(word))
        scores[word] = body.ignoreWords.includes(word) ? 0 : getWordScore(word);

    return res(
      ctx.status(200),
      ctx.json({
        scores,
        complexity: 50,
        gradeLevel: 45,
        gradeLevelText: "Collegiate",
        sentences: 12,
        syllables: 123,
        words: 1234,
        chars: 12345,
      })
    );
  }),

  rest.get(/\/simplify\/.+$/, (req, res, ctx) =>
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

  rest.get(/\/articles$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(articles))
  ),

  rest.get(/\/articles\/\w+$/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").at(-1);
    const match = articles.find((article) => article.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.post(/\/articles\/batch$/, async (req, res, ctx) => {
    const body = await req.json();
    const filtered = articles.filter((article) =>
      body.ids.includes(article.id)
    );
    return res(ctx.status(200), ctx.json(filtered));
  }),

  rest.get(/\/articles\/\w+\/revisions$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(revisions))
  ),

  rest.get(/\/articles\/\w+\/revisions\/\d+$/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").at(-3);
    const revision = req.url.pathname.split("/").at(-1);
    let match = articles.find((article) => article.id === id);
    if (match) {
      match = { ...match };
      match.revision = Number(revision);
      const date = revisions.find((r) => r.revision === Number(revision))?.date;
      if (date) match.date = date;
      match.text = match.text.slice(0, Number(revision) * 10);
      return res(ctx.status(200), ctx.json(match));
    } else return res(ctx.status(404));
  }),

  rest.post(/\/articles$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: articles[0].id }))
  ),

  rest.put(/\/articles\/\w+$/, (req, res, ctx) =>
    res(ctx.status(401), ctx.json({}))
  ),

  rest.delete(/\/articles\/\w+$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.get(/\/collections$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json(collections))
  ),

  rest.get(/\/collections\/\w+$/, (req, res, ctx) => {
    const id = req.url.pathname.split("/").at(-1);
    const match = collections.find((collection) => collection.id === id);
    if (match) return res(ctx.status(200), ctx.json(match));
    else return res(ctx.status(404));
  }),

  rest.post(/\/collections$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({ id: collections[0].id }))
  ),

  rest.put(/\/collections\/\w+$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),

  rest.delete(/\/collections\/\w+$/, (req, res, ctx) =>
    res(ctx.status(200), ctx.json({}))
  ),
];
