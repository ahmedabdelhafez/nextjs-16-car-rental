"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
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
  "Hyundai",
  "Kia",
  "Nissan",
  "Subaru",
  "Mazda",
  "Volkswagen",
  "Jaguar",
  "Land Rover",
  "Volvo",
  "Citroen",
  "Peugeot",
  "Citroen",
  "Citroen",
  "Citroen",
  "Bentley",
];

export function BrandsCarousel() {
  const plugin = useRef(Autoplay({ delay: 3000, stopOnInteraction: true }));

  return (
    <div className="w-full relative py-12 bg-transparent">
      {/* Gradient Masks */}
      <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-gray-50 to-transparent z-10 dark:from-gray-900 pointer-events-none" />
      <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-gray-50 to-transparent z-10 dark:from-gray-900 pointer-events-none" />

      <Carousel
        plugins={[plugin.current]}
        className="w-full max-w-7xl mx-auto"
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
              className="pl-4 basis-1/3 md:basis-1/4 lg:basis-1/6"
            >
              <div className="p-2">
                <Card className="border-none shadow-none bg-transparent group">
                  <CardContent className="flex items-center justify-center p-6 bg-white/50 dark:bg-gray-800/30 rounded-xl border border-gray-100 dark:border-gray-800 transition-all duration-300 group-hover:bg-white dark:group-hover:bg-gray-800 group-hover:shadow-lg group-hover:-translate-y-1 cursor-pointer backdrop-blur-sm">
                    <span className="text-lg font-bold text-muted-foreground group-hover:text-primary transition-colors">
                      {brand}
                    </span>
                  </CardContent>
                </Card>
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
        {/* Hidden controls for simpler look, can enable if needed */}
        {/* <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" /> */}
      </Carousel>
    </div>
  );
}
