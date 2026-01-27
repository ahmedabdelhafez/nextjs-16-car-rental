"use client";

import Link from "next/link";
import Image from "next/image";
import {
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Mail,
  Phone,
  MapPin,
} from "lucide-react";
import carLogo from "@/assets/logo.svg";
import { useTranslation } from "@/app/i18n/client";

export function Footer({ lng }: { lng: string }) {
  const { t } = useTranslation(lng, "common");

  const socialLinks = [
    { icon: Facebook, href: "#", name: "Facebook" },
    { icon: Twitter, href: "#", name: "Twitter" },
    { icon: Instagram, href: "#", name: "Instagram" },
    { icon: Linkedin, href: "#", name: "LinkedIn" },
  ];

  const quickLinks = [
    { name: t("nav.home"), href: `/${lng}` },
    { name: t("nav.cars"), href: `/${lng}/admin/cars` },
    { name: t("nav.blog"), href: `/${lng}/admin/blog` },
    { name: t("nav.news"), href: `/${lng}/admin/news` },
    { name: t("nav.contact"), href: `/${lng}/admin/contact` },
  ];

  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
      <div className="container mx-auto px-4 py-12 md:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 md:gap-8">
          {/* Brand Section */}
          <div className="space-y-6">
            <Link
              href={`/${lng}`}
              className="flex items-center gap-2 font-bold text-2xl"
            >
              <Image
                src={carLogo}
                alt="CarPortal Logo"
                className="h-12 w-12"
                width={48}
                height={48}
              />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                CarPortal
              </span>
            </Link>
            <p className="text-slate-600 dark:text-slate-400 max-w-xs leading-relaxed">
              {t("footer.aboutDescription")}
            </p>
            <div className="flex gap-4">
              {socialLinks.map((social) => (
                <a
                  key={social.name}
                  href={social.href}
                  className="p-2 rounded-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-primary hover:border-primary transition-all shadow-sm"
                  aria-label={social.name}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t("footer.quickLinks")}
            </h3>
            <ul className="space-y-4">
              {quickLinks.map((link) => (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    className="text-slate-600 dark:text-slate-400 hover:text-primary transition-colors flex items-center gap-2"
                  >
                    <span className="h-1 w-1 rounded-full bg-slate-400 group-hover:bg-primary transition-colors" />
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              {t("footer.contactUs")}
            </h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 text-slate-600 dark:text-slate-400">
                <MapPin className="text-primary shrink-0" size={20} />
                <span>123 Car Street, Automotive City, 12345</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Phone className="text-primary shrink-0" size={20} />
                <span>+1 (234) 567-890</span>
              </li>
              <li className="flex items-center gap-3 text-slate-600 dark:text-slate-400">
                <Mail className="text-primary shrink-0" size={20} />
                <span>support@carportal.com</span>
              </li>
            </ul>
          </div>

          {/* Newsletter / CTA */}
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">
              Subscribe to our newsletter
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Get the latest updates on new cars and rental offers.
            </p>
            <div className="flex flex-col space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-3 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all text-sm"
              />
              <button className="w-full py-3 px-6 rounded-xl bg-primary text-white font-semibold hover:bg-primary/90 transition-all shadow-lg shadow-primary/25 text-sm">
                Subscribe
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-500">
          <p>
            © {new Date().getFullYear()} CarPortal. {t("footer.rights")}
          </p>
          <div className="flex gap-8">
            <Link href="#" className="hover:text-primary transition-colors">
              {t("footer.terms")}
            </Link>
            <Link href="#" className="hover:text-primary transition-colors">
              {t("footer.privacy")}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
