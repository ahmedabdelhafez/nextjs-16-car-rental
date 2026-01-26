"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Search, MapPin, Car } from "lucide-react";
import { motion } from "framer-motion";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";

interface HeroSearchProps {
  lng: string;
}

export function HeroSearch({ lng }: HeroSearchProps) {
  const router = useRouter();
  const [date, setDate] = useState<Date>();
  const [returnDate, setReturnDate] = useState<Date>();
  const [location, setLocation] = useState("");

  // Buy Filters
  const [make, setMake] = useState("");
  const [priceRange, setPriceRange] = useState([0, 100000]);

  const handleRentSearch = () => {
    const params = new URLSearchParams();
    params.set("type", "rent");
    if (location) params.set("location", location);
    if (date) params.set("from", date.toISOString());
    if (returnDate) params.set("to", returnDate.toISOString());
    router.push(`/${lng}/cars?${params.toString()}`);
  };

  const handleBuySearch = () => {
    const params = new URLSearchParams();
    params.set("type", "buy");
    if (make) params.set("make", make);
    params.set("minPrice", priceRange[0].toString());
    params.set("maxPrice", priceRange[1].toString());
    router.push(`/${lng}/cars?${params.toString()}`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto"
    >
      <div className="bg-white/80 dark:bg-black/80 backdrop-blur-md rounded-3xl p-6 shadow-2xl border border-white/20">
        <Tabs defaultValue="rent" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 h-12 bg-gray-100/50 dark:bg-gray-800/50 p-1 rounded-xl">
            <TabsTrigger
              value="rent"
              className="rounded-lg text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              Rent a Car
            </TabsTrigger>
            <TabsTrigger
              value="buy"
              className="rounded-lg text-base font-medium data-[state=active]:bg-white dark:data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm transition-all"
            >
              Buy a Car
            </TabsTrigger>
          </TabsList>

          <TabsContent value="rent" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Location
                </label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select onValueChange={setLocation}>
                    <SelectTrigger className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-primary/20">
                      <SelectValue placeholder="Pick-up Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="ny">New York</SelectItem>
                      <SelectItem value="la">Los Angeles</SelectItem>
                      <SelectItem value="mi">Miami</SelectItem>
                      <SelectItem value="sf">San Francisco</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Pick-up Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50",
                        !date && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {date ? format(date, "PPP") : <span>Pick a date</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={date}
                      onSelect={setDate}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Return Date
                </label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full h-12 justify-start text-left font-normal border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50",
                        !returnDate && "text-muted-foreground",
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {returnDate ? (
                        format(returnDate, "PPP")
                      ) : (
                        <span>Return date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={returnDate}
                      onSelect={setReturnDate}
                      initialFocus
                      disabled={(date: Date) =>
                        date < (returnDate || new Date())
                      }
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 mt-4"
              onClick={handleRentSearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Rental Cars
            </Button>
          </TabsContent>

          <TabsContent value="buy" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium text-muted-foreground ml-1">
                  Make & Model
                </label>
                <div className="relative">
                  <Car className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Select onValueChange={setMake}>
                    <SelectTrigger className="pl-10 h-12 border-gray-200 dark:border-gray-800 bg-white/50 dark:bg-gray-900/50 focus:ring-primary/20">
                      <SelectValue placeholder="Select Brand" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="bmw">BMW</SelectItem>
                      <SelectItem value="mercedes">Mercedes-Benz</SelectItem>
                      <SelectItem value="tesla">Tesla</SelectItem>
                      <SelectItem value="porsche">Porsche</SelectItem>
                      <SelectItem value="audi">Audi</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <label className="text-sm font-medium text-muted-foreground ml-1">
                    Price Range
                  </label>
                  <span className="text-sm font-medium text-primary">
                    ${priceRange[0].toLocaleString()} - $
                    {priceRange[1].toLocaleString()}
                  </span>
                </div>
                <div className="h-12 flex items-center px-2 border border-transparent">
                  <Slider
                    defaultValue={[0, 100000]}
                    max={200000}
                    step={1000}
                    onValueChange={setPriceRange}
                    className="py-4"
                  />
                </div>
              </div>
            </div>

            <Button
              className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg shadow-primary/25 mt-4"
              onClick={handleBuySearch}
            >
              <Search className="mr-2 h-5 w-5" />
              Find Cars for Sale
            </Button>
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
}
