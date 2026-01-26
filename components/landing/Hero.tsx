import { getTranslation } from "@/app/i18n/server";
import { HeroSearch } from "./HeroSearch";
import { Badge } from "@/components/ui/badge";

export async function Hero({ lng }: { lng: string }) {
  const { t } = await getTranslation(lng, "common");

  return (
    <section className="relative w-full min-h-[85vh] flex items-center justify-center overflow-hidden bg-white dark:bg-black">
      {/* Background Gradients */}
      <div className="absolute inset-0 w-full h-full">
        <div className="absolute top-0 left-0 w-full h-[500px] bg-gradient-to-br from-primary/10 via-transparent to-transparent blur-3xl" />
        <div className="absolute bottom-0 right-0 w-full h-[500px] bg-gradient-to-tl from-blue-500/10 via-transparent to-transparent blur-3xl opacity-50" />
        <div className="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-[0.03]" />
      </div>

      <div className="container relative z-10 px-4 md:px-6 py-20">
        <div className="flex flex-col items-center space-y-8 text-center">
          <div className="space-y-4 max-w-3xl mx-auto">
            <Badge
              variant="secondary"
              className="px-4 py-2 text-sm md:text-base bg-primary/10 text-primary hover:bg-primary/20 transition-colors border-none"
            >
              ✨ Premium Car Rental & Sales Experience
            </Badge>

            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
              <span className="block text-foreground">{t("hero.title")}</span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 mt-2">
                Without Limits
              </span>
            </h1>

            <p className="mx-auto max-w-[700px] text-gray-500 md:text-xl dark:text-gray-400 leading-relaxed">
              {t("hero.subtitle")} - Experience the thrill of driving the
              world&apos;s finest machines. Book your dream car today or find
              your next vehicle to own.
            </p>
          </div>

          <div className="w-full mt-12">
            <HeroSearch lng={lng} />
          </div>

          <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-4 text-sm text-muted-foreground mt-8">
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Instant Booking</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>Insured Rides</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-primary" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
