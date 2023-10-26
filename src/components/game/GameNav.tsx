import Link from "next/link";

export function GameNav({
  slug,
  type,
}: {
  type: "add-ons" | "base";
  slug: string;
}) {
  return (
    <nav id="game-nav">
      <ul className="flex gap-4 items-center">
        <li>
          <h2 className={"text-lg " + (type === "base" ? "active-link" : "")}>
            <Link href={"/" + slug} className={"text-white_primary/60 "}>
              Overview
            </Link>
          </h2>
        </li>
        <li>
          <h2
            className={"text-lg " + (type === "add-ons" ? "active-link" : "")}
          >
            <Link href={slug + "/add-ons"} className={"text-white_primary/60 "}>
              Add-Ons
            </Link>
          </h2>
        </li>
      </ul>
    </nav>
  );
}
