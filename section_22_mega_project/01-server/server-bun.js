import { serve } from "bun";

serve({
  fetch(request) {
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return new Response("Hello ice tea", { status: 200 });
    } else if (url.pathname === "/ice-tea") {
      return new Response("Thanks for ordering ice tea", { status: 200 });
    } else {
      return new Response("Not found", { status: 404 });
    }
  },
  port: 8000,
  hostname: "127.0.0.1",
});
