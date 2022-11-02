import { capitalize } from "@/util/string";
import { rest } from "msw";

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
];
