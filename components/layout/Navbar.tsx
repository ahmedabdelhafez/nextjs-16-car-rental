import Link from "next/link";
import { AuthButtons } from "./AuthButtons";
import carLogo from "@/assets/logo.svg";
import Image from "next/image";

export function Navbar() {
  const navLinks = [
    { name: "New Cars", href: "/admin/cars/new" },
    { name: "Used Cars", href: "/admin/cars/used" },
    { name: "Services", href: "/admin/services" },
    { name: "Showrooms", href: "/admin/showrooms" },
    { name: "Contact Us", href: "/admin/contact" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold text-xl">
          <Image
            src={carLogo}
            alt="CarPortal Logo"
            className="h-24 w-24 text-primary"
            width={100}
            height={100}
          />
          <span>CarPortal</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className="transition-colors hover:text-foreground/80 text-foreground/60"
            >
              {link.name}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <AuthButtons />
        </div>
      </div>
    </header>
  );
}
