import Link from "next/link";
export default function NotFound() {
  return (
    <section className="page-intro">
      <p className="eyebrow">A different path</p>
      <h1>This page has wandered off.</h1>
      <Link className="button" href="/">
        Return to Elyon
      </Link>
    </section>
  );
}
