import ChevronLeft from "@heroicons/react/24/outline/ChevronLeftIcon";
import type { DataFunctionArgs } from "@remix-run/node";
import { defer } from "@remix-run/node";
import type { ShouldRevalidateFunction} from "@remix-run/react";
import { Outlet, useMatches } from "@remix-run/react";
import { Mastodon } from "~/lib/mastodon";

// should revalidate
export const shouldRevalidate: ShouldRevalidateFunction = (data) => {
    return false
}

export async function loader({ request, params }: DataFunctionArgs) {
  try {
    return defer(
      {
        timeline: Mastodon.getTimeline(),
      },
      {
        headers: {
          "Cache-Control": "max-age=60, private, stale-while-revalidate=3600",
        },
      }
    );
  } catch (e) {
    throw new Response(e.message, { status: 500 });
  }
}

export default function Index() {
  // get `title` from most nested handle
  const matches = useMatches();
  const title = matches[matches.length - 1]?.handle?.title ?? "Mas.to";
  const back = !!matches[matches.length - 1]?.handle?.back ?? false;

  return (
    <div className="flex-1 max-h-full">
      <nav className="pt-safe bg-gray-50/80 backdrop-blur-xl border-b border-gray-200 fixed w-full top-0 flex justify-center">
        <div
          className="h-[64px] grid w-full items-center"
          style={{
            gridTemplateColumns: "1fr 4fr 1fr",
          }}
        >
          {back ? (
            <button
              className="flex cursor-pointer pointer-events-auto text-orange-500 active:text-orange-300"
              onClick={() => {
                history.back();
              }}
            >
              <ChevronLeft className="h-6" />
              <span>Back</span>
            </button>
          ) : (
            <div />
          )}
          <h1 className="font-semibold py-3 flex-1 flex justify-center">
            {title}
          </h1>
        </div>
        <div></div>
      </nav>

      <div className="z-0">
        <Outlet />
      </div>
    </div>
  );
}
