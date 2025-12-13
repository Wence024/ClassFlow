import {
  Activity,
  Calendar,
  ClipboardList,
  FileText,
  Hospital,
  Pill,
  Shield,
  Stethoscope,
  Users,
  ArrowRight,
  CheckCircle2,
} from "lucide-react";
import { Link } from "react-router-dom";

import { ThemeToggle } from "@/components/ThemeToggle";
import { Button } from "@/components/ui/button";

const features = [
  {
    icon: Users,
    title: "Patient Management",
    description: "Complete patient registration, admission, discharge, and queue management.",
  },
  {
    icon: Stethoscope,
    title: "Doctor & Nurse Management",
    description: "Scheduling, assignments, daily rounds, and medical notes tracking.",
  },
  {
    icon: Pill,
    title: "Pharmacy Management",
    description: "Inventory tracking, medicine dispensing, and prescription verification.",
  },
  {
    icon: ClipboardList,
    title: "Billing & Accounting",
    description: "Automated billing, insurance claims, and payment tracking.",
  },
  {
    icon: Activity,
    title: "Laboratory Management",
    description: "Test requests, diagnostic results, and report generation.",
  },
  {
    icon: FileText,
    title: "Electronic Medical Records",
    description: "Full patient history, lab results, treatments, and doctor notes.",
  },
];

const benefits = [
  "Secure role-based access control",
  "Real-time data synchronization",
  "Comprehensive audit trails",
  "HIPAA compliant infrastructure",
];

/**
 *
 */
const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 glass-effect-strong">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-glow">
                <Hospital className="h-6 w-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-foreground">MediCare HMIS</h1>
                <p className="text-xs text-muted-foreground">Hospital Management System</p>
              </div>
            </div>
            <nav className="hidden items-center gap-6 md:flex">
              <a href="#features" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                Features
              </a>
              <a href="#about" className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground">
                About
              </a>
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>
              <Link to="/register">
                <Button size="sm">Get Started</Button>
              </Link>
            </nav>
            {/* Mobile menu button */}
            <div className="flex items-center gap-2 md:hidden">
              <ThemeToggle />
              <Link to="/login">
                <Button variant="outline" size="sm">Sign In</Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-background to-accent/20" />
        <div className="absolute right-0 top-1/4 h-96 w-96 rounded-full bg-primary/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-64 rounded-full bg-info/10 blur-3xl" />
        
        <div className="container relative mx-auto px-4">
          <div className="mx-auto max-w-3xl text-center">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-border bg-card/80 px-4 py-2 text-sm backdrop-blur-sm">
              <Shield className="h-4 w-4 text-primary" />
              <span className="text-muted-foreground">Enterprise-grade Healthcare Solution</span>
            </div>
            
            <h1 className="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              Modern Hospital{" "}
              <span className="bg-gradient-to-r from-primary to-info bg-clip-text text-transparent">
                Management System
              </span>
            </h1>
            
            <p className="mb-8 text-lg text-muted-foreground lg:text-xl">
              Streamline your hospital operations with our comprehensive HMIS solution. 
              From patient care to billing, manage everything in one secure platform.
            </p>
            
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" className="gap-2 shadow-glow">
                  Start Free Trial
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button variant="outline" size="lg">
                  Sign In to Dashboard
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground lg:text-4xl">
              Complete Hospital Management
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              Everything you need to manage your healthcare facility efficiently and securely.
            </p>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group rounded-xl border border-border bg-card p-6 shadow-card transition-all duration-300 hover:shadow-card-hover hover:border-primary/20"
              >
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                  <feature.icon className="h-6 w-6" />
                </div>
                <h3 className="mb-2 text-lg font-semibold text-card-foreground">
                  {feature.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="border-y border-border bg-muted/30 py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <h2 className="mb-6 text-3xl font-bold text-foreground lg:text-4xl">
                Built for Healthcare Excellence
              </h2>
              <p className="mb-8 text-muted-foreground">
                Our HMIS is designed with security, compliance, and usability at its core. 
                Every feature is crafted to meet the demanding requirements of modern healthcare facilities.
              </p>
              <ul className="space-y-4">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <CheckCircle2 className="h-5 w-5 flex-shrink-0 text-success" />
                    <span className="text-foreground">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="relative">
              <div className="aspect-square rounded-2xl bg-gradient-to-br from-primary/20 via-info/10 to-accent/20 p-8">
                <div className="flex h-full flex-col items-center justify-center rounded-xl border border-border bg-card/80 backdrop-blur-sm">
                  <Calendar className="mb-4 h-16 w-16 text-primary" />
                  <p className="text-center text-lg font-medium text-card-foreground">
                    Trusted by Healthcare Providers
                  </p>
                  <p className="mt-2 text-center text-sm text-muted-foreground">
                    Managing patient care with precision
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 lg:py-28">
        <div className="container mx-auto px-4">
          <div className="mx-auto max-w-3xl rounded-2xl bg-gradient-to-br from-primary to-primary/80 p-8 text-center shadow-glow lg:p-12">
            <h2 className="mb-4 text-2xl font-bold text-primary-foreground lg:text-3xl">
              Ready to Transform Your Hospital?
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              Join healthcare providers who trust MediCare HMIS to streamline their operations.
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link to="/register">
                <Button size="lg" variant="secondary" className="gap-2">
                  Get Started Now
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/login">
                <Button size="lg" variant="outline" className="border-primary-foreground/20 text-primary-foreground hover:bg-primary-foreground/10">
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Hospital className="h-5 w-5 text-primary" />
              <span className="font-semibold text-card-foreground">MediCare HMIS</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © 2024 MediCare Hospital Management System. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
