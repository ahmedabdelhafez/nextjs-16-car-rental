import { ShieldCheck, Clock, Star, HeartHandshake } from "lucide-react";

interface FeatureCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
}

function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="flex flex-col items-center text-center p-6 bg-white dark:bg-gray-800/50 rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 border border-gray-100 dark:border-gray-800">
      <div className="p-4 bg-primary/10 rounded-full text-primary mb-4">
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground">{description}</p>
    </div>
  );
}

export async function FeaturesSection() {
  const features = [
    {
      icon: <ShieldCheck className="w-8 h-8" />,
      title: "Secure & Reliable",
      description:
        "Every booking is insured and our partners are vetted for your safety.",
    },
    {
      icon: <Clock className="w-8 h-8" />,
      title: "24/7 Support",
      description:
        "Our dedicated team is available around the clock to assist you.",
    },
    {
      icon: <Star className="w-8 h-8" />,
      title: "Premium Fleet",
      description:
        "Choose from a wide range of luxury, sports, and economy vehicles.",
    },
    {
      icon: <HeartHandshake className="w-8 h-8" />,
      title: "Best Price Guarantee",
      description:
        "We offer competitive rates and transparent pricing with no hidden fees.",
    },
  ];

  return (
    <section className="py-24 bg-gray-50 dark:bg-black/50">
      <div className="container px-4 md:px-6">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl mb-4">
            Why Choose Us?
          </h2>
          <p className="text-muted-foreground text-lg">
            We provide the best car rental and buying experience with top-notch
            services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <FeatureCard
              key={index}
              icon={feature.icon}
              title={feature.title}
              description={feature.description}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
