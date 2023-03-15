import BeakerIcon from "@heroicons/react/24/solid/BeakerIcon";
import HomeIcon from "@heroicons/react/24/solid/HomeIcon";
import type {
  ErrorBoundaryComponent,
  LinksFunction,
  V2_MetaFunction
} from "@remix-run/node";
import {
  Links,
  LiveReload,
  Meta, NavLink, Outlet,
  Scripts,
  ScrollRestoration
} from "@remix-run/react";
import clsx from "clsx";
import tailwindStyles from "./generated/tailwind.css";

export const meta: V2_MetaFunction = () => [
  {
    name: "viewport",
    content: "initial-scale=1, viewport-fit=cover",
    "viewport-fit": "cover",
  },
];

export const links: LinksFunction = () => [
  { rel: "stylesheet", href: tailwindStyles },
];

const navigation = [
  { name: "Home", href: "/timeline", icon: HomeIcon },
  {
    name: "Other",
    href: "/other",
    icon: BeakerIcon,
  },
];

export default function App() {

  return (
    <html
      lang="en"
      className="flex flex-col  min-h-full overflow-x-hidden relative"
    >
      <head>
        <Meta />
        <Links />
      </head>
      <body className="flex-1 flex flex-col relative">
        <div className="flex-1 pb-nav">
          <Outlet />
        </div>

        <nav
          className="bg-gray-100 z-10 backdrop-blur-xl fixed bottom-0 w-full flex justify-center border-t border-gray-200"
          style={{
            paddingBottom: "env(safe-area-inset-bottom)",
          }}
        >
          {navigation.map((item) => (
            <NavLink
              prefetch="render"
              to={item.href}
              key={item.href}
              className={({ isActive }) =>
                clsx(
                  "flex flex-1 flex-col items-center gap-1 h-[50px] pt-1 justify-center touch-manipulation"
                )
              }
            >
              {({ isActive }) => (
                <>
                  <item.icon
                    className={clsx(
                      "h-6 w-6 -mb-1",
                      isActive ? "text-orange-500" : "text-gray-400"
                    )}
                    aria-hidden="true"
                  />
                  <span
                    className={clsx(
                      "text-[10px] font-medium tracking-wide",
                      isActive ? "text-orange-500" : "text-gray-400"
                    )}
                  >
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <ScrollRestoration getKey={(location) => location.pathname} />
        <Scripts />
        <LiveReload />
        <div
          style={{
            position: "absolute",
            whiteSpace: "nowrap",
            top: -50,
            left: "-100%",
            overflow: "hidden",
            width: 10,
          }}
        >
          {"*".repeat(1024)}
        </div>
      </body>
    </html>
  );
}

export const ErrorBoundary: ErrorBoundaryComponent = ({ error }) => {
  return (
    <div>
      <h1>Something went wrong</h1>
      <pre>{error.message}</pre>
      <button
        onClick={() => {
          window.location.href = "/";
        }}
      >
        Hard Refresh
      </button>
    </div>
  );
};
