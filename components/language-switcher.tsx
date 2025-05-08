"use client"

import { usePathname, useRouter } from "next/navigation";

const locales = [
  { code: "en", label: "🇬🇧" },
  { code: "fr", label: "🇫🇷" },
];

interface LanguageSwitcherProps {
  locale: string;
}

export default function LanguageSwitcher({ locale }: LanguageSwitcherProps) {
  const router = useRouter();
  const pathname = usePathname();
  const currentLocale = locale;

  const handleSwitch = (locale: string) => {
    if (locale === currentLocale) return;
    // Replace the first segment of the path with the new locale
    const segments = pathname.split("/");
    segments[1] = locale;
    router.push(segments.join("/"));
  };

  return (
    <div className="flex gap-2 items-center">
      {locales.map(({ code, label }) => (
        <button
          key={code}
          onClick={() => handleSwitch(code)}
          className={`text-2xl focus:outline-none ${code === currentLocale ? "opacity-100" : "opacity-50 hover:opacity-80"}`}
          aria-label={code === "en" ? "Switch to English" : "Passer en français"}
        >
          {label}
        </button>
      ))}
    </div>
  );
} 