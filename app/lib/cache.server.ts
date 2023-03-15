import LRUCache from "lru-cache";

let cache: LRUCache<string, any>;

declare global {
  var __cache__: LRUCache<string, any>;
}

// this is needed because in development we don't want to restart
// the server with every change, but we want to make sure we don't
// create a new connection to the DB with every change either.
// in production we'll have a single connection to the DB.
if (process.env.NODE_ENV === "production") {
  cache = new LRUCache({
    max: 100,
  });
} else {
  if (!global.__cache__) {
    global.__cache__ = new LRUCache({
      max: 100,
    });
  }
  cache = global.__cache__;
}

export { cache };


