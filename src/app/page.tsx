import logo from "@/assets/logo.svg";
import resumePreview from "@/assets/resume-preview.png";
import ThemeToggle from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const features = [
  {
    title: "AI-Powered Resume Building",
    description:
      "Create professional resumes with the help of advanced AI technology",
  },
  {
    title: "Multiple Resume Versions",
    description:
      "Create and manage up to 3 different versions of your resume with our Premium plan",
  },
  {
    title: "Custom Design Options",
    description:
      "Personalize your resume with custom colors and styling options",
  },
  {
    title: "Real-Time Preview",
    description: "See changes to your resume in real-time as you make them",
  },
];

const pricingPlans = [
  {
    name: "Free",
    price: "0 €",
    features: ["1 resume", "Basic templates", "Standard export options"],
  },
  {
    name: "Premium",
    price: "1.99 €/month",
    features: ["AI tools", "Up to 3 resumes", "Priority support"],
  },
  {
    name: "Premium Plus",
    price: "7.99 €/month",
    features: [
      "Infinite resumes",
      "Design customizations",
      "All Premium features",
    ],
  },
];

export default function Home() {
  return (
    <>
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between p-4">
          <div className="flex items-center gap-2">
            <Image src={logo} alt="Logo" width={35} height={35} />
            <span className="text-xl font-bold">Boring Resume</span>
          </div>
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-sm hover:text-primary">
              Features
            </a>
            <a href="#pricing" className="text-sm hover:text-primary">
              Pricing
            </a>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button asChild>
              <Link href="/resumes">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      <main className="space-y-24 pt-16">
        {/* Hero Section */}
        <section className="flex min-h-[calc(100vh-4rem)] flex-col items-center justify-center gap-6 bg-accent px-5 py-12 text-center md:flex-row md:text-start lg:gap-12">
          <div className="max-w-prose space-y-3">
            <Image
              src={logo}
              alt="Logo"
              width={150}
              height={150}
              className="mx-auto md:ms-0"
            />
            <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Create the{" "}
              <span className="inline-block bg-gradient-to-r from-green-600 to-green-400 bg-clip-text text-transparent">
                Perfect Resume
              </span>{" "}
              in Minutes
            </h1>
            <p className="text-lg text-gray-500">
              Our <span className="font-bold">AI resume builder</span> helps you
              design a professional resume, even if you&apos;re not very smart.
            </p>
            <Button asChild size="lg" variant="premium">
              <Link href="/resumes">Get started</Link>
            </Button>
          </div>
          <div>
            <Image
              src={resumePreview}
              alt="Resume preview"
              width={600}
              className="shadow-md lg:rotate-[1.5deg]"
            />
          </div>
        </section>

        {/* Features Section */}
        <section id="features" className="mx-auto max-w-7xl px-4 py-12">
          <h2 className="mb-12 text-center text-3xl font-bold">
            Powerful Features
          </h2>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => (
              <div
                key={feature.title}
                className="space-y-3 rounded-lg border bg-card p-6"
              >
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="bg-accent">
          <div className="mx-auto max-w-7xl px-4 py-12">
            <h2 className="mb-12 text-center text-3xl font-bold">
              Simple Pricing
            </h2>
            <div className="grid gap-8 md:grid-cols-3">
              {pricingPlans.map((plan) => (
                <div key={plan.name} className="rounded-lg border bg-card p-6">
                  <h3 className="text-xl font-semibold">{plan.name}</h3>
                  <p className="mt-2 text-3xl font-bold">{plan.price}</p>
                  <ul className="mt-6 space-y-3">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2">
                        <Check className="h-4 w-4 text-green-500" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    className="mt-6 w-full"
                    variant={plan.name === "Free" ? "outline" : "premium"}
                  >
                    <Link href="/resumes">Get Started</Link>
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t bg-background">
        <div className="mx-auto max-w-7xl px-4 py-12">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <Image src={logo} alt="Logo" width={35} height={35} />
                <span className="text-xl font-bold">Boring Resume</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Create professional resumes with ease using our AI-powered
                platform.
              </p>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Product</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#features">Features</a>
                </li>
                <li>
                  <a href="#pricing">Pricing</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <Link href="/tos">Terms of Service</Link>
                </li>
                <li>
                  <a href="#">Privacy Policy</a>
                </li>
              </ul>
            </div>
            <div>
              <h4 className="mb-3 font-semibold">Support</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>
                  <a href="#">Contact</a>
                </li>
                <li>
                  <a href="#">Documentation</a>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t pt-8 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Boring Resume. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
