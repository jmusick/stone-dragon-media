import type { APIRoute } from "astro";
import { clearSessionCookie, invalidateSession, SESSION_COOKIE } from "../../../lib/auth";
import { assertSameOrigin } from "../../../lib/http";

export const prerender = false;

export const POST: APIRoute = async (context) => {
  const { locals, cookies, redirect } = context;

  const csrf = assertSameOrigin(context);
  if (csrf) return csrf;

  const token = cookies.get(SESSION_COOKIE)?.value;
  if (token) {
    await invalidateSession(locals, token);
  }
  clearSessionCookie(context);
  return redirect("/login");
};
