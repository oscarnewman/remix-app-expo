import type { DataFunctionArgs } from "@remix-run/node";
import { redirect } from "@remix-run/node";

export async function loader({ request, params }: DataFunctionArgs) {
  throw redirect("/timeline");
}
