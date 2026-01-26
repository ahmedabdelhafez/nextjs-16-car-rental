"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent } from "@/components/ui/card";
import { useRef } from "react";

const brands = [
  "Toyota",
  "BMW",
  "Mercedes",
  "Audi",
  "Honda",
  "Tesla",
  "Ford",
  "Chevrolet",
  "Porsche",
  "Lexus",
];

export function BrandsCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="w-full relative px-12">
      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-5xl mx-auto"
        opts={{
          align: "start",
          loop: true,
          dragThreshold: 1,
          active: true,
        }}
        onMouseEnter={plugin.current.stop}
        onMouseLeave={plugin.current.reset}
      >
        <CarouselContent className="-ml-4">
          {brands.map((brand, index) => (
            <CarouselItem
              key={index}
              className="pl-4 basis-1/2 md:basis-1/4 lg:basis-1/6"
            >
              <div className="p-1">
                <Card className="border-none shadow-none bg-transparent">
                  <CardContent className="flex items-center justify-center p-6 bg-card/50 rounded-lg hover:bg-card/80 transition-colors cursor-pointer">
                    <span className="text-xl font-semibold opacity-70 hover:opacity-100 transition-opacity">
                      {brand}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
}
