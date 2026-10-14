import Link from "next/link";

import { Show, SignInButton, SignUpButton, UserButton } from "@clerk/nextjs";

export default function Header() {
  return (
    <header className="navbar bg-base-200 shadow-sm px-4">
      {/* Logo */}
      <div className="navbar-start">
        <Link href="/" className="btn btn-ghost text-xl">
          LivingDex Tracker
        </Link>
      </div>

      {/* Navigation */}
      <nav className="navbar-center hidden md:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/src/app/(living-dex)/firered.tsx">
              FireRed & LeafGreen
            </Link>
          </li>

          <Show when="signed-in">
            <li>
              <Link href="/collection">My Collection</Link>
            </li>
          </Show>
        </ul>
      </nav>

      {/* Authentication */}
      <div className="navbar-end gap-2">
        <Show when="signed-out">
          <SignInButton mode="modal">
            <button className="btn btn-ghost">Sign In</button>
          </SignInButton>

          <SignUpButton mode="modal">
            <button className="btn btn-primary">Sign Up</button>
          </SignUpButton>
        </Show>

        <Show when="signed-in">
          <UserButton />
        </Show>
      </div>
    </header>
  );
}
