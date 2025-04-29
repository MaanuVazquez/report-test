import type { Route } from "../+types/root";

export async function action({ request }: Route.ActionArgs) {
  const body = await request.json();

  console.log("RECEIVED", JSON.stringify(body));

  return new Response(JSON.stringify(body), {
    headers: {
      "content-type": "application/json",
    },
  });
}
