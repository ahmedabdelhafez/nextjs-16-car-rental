import { Hero } from "@/components/landing/Hero";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CarPreviewGrid } from "@/components/landing/CarPreviewGrid";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Hero />

      {/* Brands Section Placeholder */}
      <section className="py-12 bg-gray-50 dark:bg-gray-900/50">
        <div className="container px-4 md:px-6">
          <h2 className="text-2xl font-bold text-center mb-8">
            Popular Brands
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-8 items-center justify-items-center opacity-70">
            {/* We can use icons or text here */}
            <span className="text-xl font-semibold">Toyota</span>
            <span className="text-xl font-semibold">BMW</span>
            <span className="text-xl font-semibold">Mercedes</span>
            <span className="text-xl font-semibold">Audi</span>
            <span className="text-xl font-semibold">Honda</span>
            <span className="text-xl font-semibold">Tesla</span>
          </div>
        </div>
      </section>

      {/* Featured Cars Section Placeholder */}
      <section className="py-12 md:py-24">
        <div className="container px-4 md:px-6">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold tracking-tighter">
              Featured Vehicles
            </h2>
            <Link href="/cars/new">
              <Button variant="ghost">View All</Button>
            </Link>
          </div>

          <div className="mt-8">
            <CarPreviewGrid />
          </div>
        </div>
      </section>
    </div>
  );
}
