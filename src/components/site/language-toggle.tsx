import { useTranslation } from "react-i18next";

export function LanguageToggle({ className = "" }: { className?: string }) {
  const { i18n } = useTranslation();
  const current = i18n.resolvedLanguage?.startsWith("es") ? "es" : "en";

  const set = (lng: "en" | "es") => {
    void i18n.changeLanguage(lng);
  };

  return (
    <div
      className={`inline-flex items-center gap-1 text-xs font-semibold tracking-widest uppercase ${className}`}
      role="group"
      aria-label="Language"
    >
      <button
        type="button"
        onClick={() => set("en")}
        className={
          current === "en"
            ? "text-terracotta"
            : "text-foreground/40 hover:text-foreground transition-colors"
        }
        aria-pressed={current === "en"}
      >
        EN
      </button>
      <span className="text-foreground/20">/</span>
      <button
        type="button"
        onClick={() => set("es")}
        className={
          current === "es"
            ? "text-terracotta"
            : "text-foreground/40 hover:text-foreground transition-colors"
        }
        aria-pressed={current === "es"}
      >
        ES
      </button>
    </div>
  );
}
