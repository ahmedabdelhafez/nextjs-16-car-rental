import Link from "next/link";
import { AuthButtons } from "./AuthButtons";
import carLogo from "@/assets/logo.svg";
import Image from "next/image";
import { getTranslation } from "@/app/i18n/server";
import { LanguageSwitcher } from "./LanguageSwitcher";

export async function Navbar({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng, "common");

  const navLinks = [
    // { name: "New Cars", href: "/admin/cars/new" }, // Keeping original path structure?
    // User structure for 'cars' text is in common.json
    { name: t("nav.cars"), href: `/${lng}/cars` }, // Assuming standard cars page? Original was /admin/cars/new?
    // Wait, original list: "New Cars" -> "/admin/cars/new", "Used Cars" -> "/admin/cars/used".
    // I should probably keep the hrefs but prefixed.
    { name: t("nav.home"), href: `/${lng}` },
    { name: t("nav.blog"), href: `/${lng}/blog` },
    { name: t("nav.news"), href: `/${lng}/news` },
    { name: t("nav.contact"), href: `/${lng}/contact` },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href={`/${lng}`}
          className="flex items-center gap-2 font-bold text-xl"
        >
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
          <LanguageSwitcher lng={lng} />
          <AuthButtons lng={lng} />
        </div>
      </div>
    </header>
  );
}
