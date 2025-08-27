import serverless from "serverless-http";
import type { Handler } from "@netlify/functions";
import { createApp } from "../../server/app"; // we'll add this next

const app = createApp();
const wrapped = serverless(app);

// Map "/.netlify/functions/api/*" -> "/*" for Express
export const handler: Handler = async (event, context) => {
  if (event.path) {
    event.path = event.path.replace(/^\/\.netlify\/functions\/api/, "");
  }
  return wrapped(event as any, context as any);
};