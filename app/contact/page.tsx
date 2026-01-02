import { ContactForm } from "@/components/contact-form";

export default function ContactPage() {
  return (
    <div className="container py-10 max-w-3xl">
      <div className="space-y-2 mb-8 text-center">
        <h1 className="text-3xl font-bold tracking-tight">Contact Us</h1>
        <p className="text-muted-foreground">
          Have questions? We'd love to hear from you. Send us a message and
          we'll respond as soon as possible.
        </p>
      </div>
      <div className="border rounded-lg p-8 bg-card shadow-sm">
        <ContactForm />
      </div>
    </div>
  );
}
