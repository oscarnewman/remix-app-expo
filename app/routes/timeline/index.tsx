import ChatIcon from "@heroicons/react/24/outline/ChatBubbleOvalLeftIcon";
import HeartIcon from "@heroicons/react/24/outline/HeartIcon";
import {
  Await,
  Link,
  useNavigationType,
  useRouteLoaderData
} from "@remix-run/react";
import { useMotionValue, useTransform } from "framer-motion";
import { Suspense } from "react";
import Spinner from "~/components/Spinner";
import type { Mastodon } from "~/lib/mastodon";

function replaceATagsWithSpans(html: string) {
  return html.replace(/<a/g, "<span className='text-blue-500'").replace(/<\/a>/g, "</span>");
}

export default function Index() {
  const data = useRouteLoaderData("routes/timeline") as {
    timeline: ReturnType<typeof Mastodon.getTimeline>;
  };

  const navigationType = useNavigationType();

  const isBack = navigationType === "POP";

  // const [isRefreshing, setIsRefreshing] = useState(false);

  // const scroll = useScroll();

  // // scroll to refresh
  // useEffect(() => {
  //   console.log(scroll);
  // }, [scroll]);

  const scrollY = useMotionValue(0);
  const scale = useTransform(scrollY, [0, 100], [0, 1]);
  const opacity = useTransform(scrollY, [0, 100], [0, 1]);

  return (
    <div className="pt-nav max-h-full overflow-y-scroll">
      <div className="py-2 px-2 max-w-screen-sm mx-auto">
        <Suspense
          fallback={
            <div className="py-12">
              <Spinner />
            </div>
          }
        >
          <Await resolve={data.timeline} errorElement="Error loading timeline">
            {(data) => (
              <div className="flex -mx-2 touch-auto flex-col gap-0 divide-y-[1px] divide-gray-200">
                {data.map((status, i) => (
                  <Link
                    prefetch="render"
                    to={`/timeline/${status.id}`}
                    key={status.id}
                    className="active:bg-gray-100 animate-up-delayed"
                    style={{
                      // "--anim-duration": isBack ? '0' : `` + Math.min((0.15 + i * 0.1), 0.4) + `s`,
                      "--anim-duration": 0,
                    }}
                  >
                    <div className="p-4">
                      <div className="flex items-center">
                        <img
                          // loading="lazy"
                          src={status.account.avatar}
                          alt={status.account.displayName}
                          className="w-8 h-8 rounded-full bg-purple-200"
                        />
                        <div className="ml-2">
                          <p className="font-semibold">
                            {status.account.displayName}
                          </p>
                          <p className="text-gray-500 text-sm">
                            {status.account.username}
                          </p>
                        </div>
                      </div>
                      <div
                        className="mt-2 break-words overflow-hidden whitespace-pre-wrap"
                        dangerouslySetInnerHTML={{
                          __html: replaceATagsWithSpans(status.content),
                        }}
                      />
                      {/* Likes/Replies */}
                      <div className="flex items-center mt-2">
                        <div className="flex items-center gap-2">
                          <HeartIcon className="w-4 h-4" />
                          <p className="text-gray-500 text-sm">
                            {status.favouritesCount}
                          </p>

                          <ChatIcon className="w-4 h-4" />
                          <p className="text-gray-500 text-sm">
                            {status.repliesCount}
                          </p>

                          <p className="text-gray-500 text-sm">
                            {status.reblogsCount}
                          </p>

                          <p className="text-gray-500 text-sm">
                            {status.visibility}
                          </p>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </Await>
        </Suspense>
      </div>
    </div>
  );
}
