import type { DataFunctionArgs } from "@remix-run/node";
import { Response } from "@remix-run/node";
import { defer } from "@remix-run/node";
import { Await, useLoaderData, useNavigationType } from "@remix-run/react";
import { Suspense } from "react";
import { ClientOnly } from "remix-utils";
import Spinner from "~/components/Spinner";
import { Mastodon } from "~/lib/mastodon";

export async function loader({ request, params }: DataFunctionArgs) {
  try {
    const statusId = params.statusId as string;

    const status = Mastodon.getStatus(statusId);
    const context = Mastodon.getStatusContext(statusId);

    return defer({
      status: await status,
      context: context,
    });
  } catch (e) {
    return new Response(e.message, { status: 500 });
  }
}

export const handle = {
  title: "Status",
  back: true,
};

export default function StatusPage() {
  const data = useLoaderData() as {
    status: Awaited<ReturnType<typeof Mastodon.getStatus>>;
    context: ReturnType<typeof Mastodon.getStatusContext>;
  };

  const navigationType = useNavigationType();
  const isBack = navigationType === "POP";

  return (
    <div className="pt-nav flex-1 min-h-full animate-up">
      <div className="py-4 px-3 max-w-screen-sm mx-auto">
        {/* Status */}

        <div>
          <div className="flex items-center">
            <img
              src={data.status.account.avatar}
              alt=""
              className="w-10 h-10 rounded-full"
            />
            <div className="ml-2">
              <p className="font-semibold">{data.status.account.displayName}</p>
              <p className="text-gray-500 text-sm">
                {data.status.account.username}
              </p>
              <p className="text-gray-500 text-sm">{data.status.createdAt}</p>
            </div>
          </div>
          {/* Content */}
          <div
            className="mt-2 break-words overflow-hidden whitespace-pre-wrap"
            dangerouslySetInnerHTML={{
              __html: data.status.content,
            }}
          />
        </div>

        {/* Thread */}
        <Suspense fallback={<Spinner />}>
          <Await resolve={data.context} errorElement={"Something went wrong."}>
            {(data) => (
              <div className="mt-4">
                {data.descendants.map((status) => (
                  <div key={status.id} className="flex flex-col items-start">
                    <div className="flex items-center">
                      <img
                        src={status.account.avatar}
                        alt=""
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="ml-2">
                        <p className="font-semibold">
                          {status.account.displayName}
                        </p>
                        <p className="text-gray-500 text-sm">
                          {status.account.username}
                        </p>

                        <p className="text-gray-500 text-sm">
                          {new Date(status.createdAt).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {/* Content */}
                    <p
                      className="mt-2 break-words overflow-hidden whitespace-pre-wrap"
                      dangerouslySetInnerHTML={{
                        __html: status.content,
                      }}
                    ></p>
                  </div>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}

export function ErrorBoundary({ error }: { error: Error }) {
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
    </div>
  );
}
