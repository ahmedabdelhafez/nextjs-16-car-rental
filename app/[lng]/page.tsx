import { Hero } from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarPreviewGrid } from "@/components/landing/CarPreviewGrid";
import { LatestUpdates } from "@/components/landing/LatestUpdates";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { getAllPosts, Post } from "@/lib/actions/posts";
import { getTranslation } from "@/app/i18n/server";
import { BrandsCarousel } from "@/components/landing/BrandsCarousel";

export default async function Home({
  params,
}: {
  params: Promise<{ lng: string }>;
}) {
  const { lng } = await params;
  const { t } = await getTranslation(lng, "common");

  const allPosts = await getAllPosts();
  const latestPosts = allPosts
    .filter((post: Post) => post.status === "published")
    .slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen">
      <Hero lng={lng} />

      {/* Brands Section */}
      <section className="py-2 bg-gray-50 dark:bg-black/20 border-y border-gray-100 dark:border-gray-800">
        <div className="w-full">
          <BrandsCarousel />
        </div>
      </section>

      {/* Featured Cars Section Placeholder */}
      <section className="py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-bold tracking-tighter md:text-4xl">
              Featured Vehicles
            </h2>
            <Link href={`/${lng}/cars`}>
              <Button variant="outline" className="gap-2">
                View All <span aria-hidden="true">&rarr;</span>
              </Button>
            </Link>
          </div>

          <div className="mt-8">
            <CarPreviewGrid lng={lng} />
          </div>
        </div>
      </section>

      <FeaturesSection />

      <LatestUpdates posts={latestPosts} lng={lng} />
      <div className="flex justify-center mt-8 pb-12">
        <Link href={`/${lng}/blog`}>
          <Button size="lg" variant="secondary">
            {t("common.showMore")}
          </Button>
        </Link>
      </div>
    </div>
  );
}
