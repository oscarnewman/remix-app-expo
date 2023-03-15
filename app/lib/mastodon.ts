import { login } from "masto";
import { cached } from "~/lib/fetcher.server";

// singleton client, stable over reloads
let client: Awaited<ReturnType<typeof login>>;

async function initClient() {
  if (!client) {
    client = await login({
      url: "https://mas.to",
      accessToken: "Hvq4DsXhqvsyYvq-WAU3uiiGIEwNnUgRFkLJ1tXiQAI",
    });
  }

  return client;
}

export namespace Mastodon {
  export async function getTimeline(cursor?: string) {
    return cached(
      "timeline",
      async () => {
        const masto = await initClient();

        const results = await masto.v1.timelines.listHashtag("react", {
          limit: 40,
          maxId: cursor,
        });

        return results;
      },
      {
        ttl: 60 * 100,
      }
    );
  }

  export async function getStatus(id: string) {
    return cached(
      `status-${id}`,
      async () => {
        const masto = await initClient();

        const status = await masto.v1.statuses.fetch(id);

        return status;
      },
      {
        ttl: 60 * 100,
      }
    );
  }



  // cached version of the above
  export async function getStatusContext(id: string) {
    return cached(
      `status-context-${id}`,
      async () => {
        const masto = await initClient();

        const context = await masto.v1.statuses.fetchContext(id);

        return context;
      },
      {
        ttl: 60 * 100,
      }
    );
  }
}
