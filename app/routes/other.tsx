import { Link } from "@remix-run/react";

export default function Other() {
  return (
    <div
      style={{
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <h1>Another page</h1>
      <Link to="/">Go home</Link>
      <button
        onClick={() => {
          window.location.reload();
        }}
      >
        Hard refressh
      </button>
    </div>
  );
}
