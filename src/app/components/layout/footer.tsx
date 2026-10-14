import Link from "next/link";

export default function Footer() {
  return (
    <footer className="footer footer-horizontal footer-center bg-base-200 text-base-content p-6">
      <aside>
        <p className="font-semibold">LivingDex Tracker</p>
        <p>Track your living dex across games.</p>
        <p>© 2026 PokéTracker</p>
      </aside>

      <nav className="flex gap-4">
        <Link href="/" className="link link-hover">
          Pokédex
        </Link>
        <a
          href="https://pokeapi.co/"
          target="_blank"
          rel="noopener noreferrer"
          className="link link-hover"
        >
          PokéAPI
        </a>
      </nav>
    </footer>
  );
}
