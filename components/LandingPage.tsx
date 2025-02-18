"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signIn } from "next-auth/react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Loader2 } from "lucide-react";
import Image from "next/image";

interface Feature {
  title: string;
  description: string;
  image: string;
}

interface InfoCard extends Feature {
  direction: "left" | "right";
}

// Features data
const features: Feature[] = [
  {
    title: "Track Progress",
    description:
      "Monitor student performance across multiple coding platforms in one place",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Hackathon Management",
    description:
      "Organize and track participation in hackathons and coding competitions",
    image: "/placeholder.svg?height=200&width=400",
  },
  {
    title: "Analytics Dashboard",
    description: "Get detailed insights into student performance and progress",
    image: "/placeholder.svg?height=200&width=400",
  },
];

// Cards data
const cards: InfoCard[] = [
  {
    title: "Unified Platform",
    description:
      "Connect with LeetCode, CodeChef, and CodeForces to track progress in one place",
    image: "/placeholder.svg?height=300&width=500",
    direction: "left",
  },
  {
    title: "Real-time Updates",
    description:
      "Get instant updates on student achievements and contest participation",
    image: "/placeholder.svg?height=300&width=500",
    direction: "right",
  },
  {
    title: "Performance Analytics",
    description:
      "Detailed insights and statistics to help improve student performance",
    image: "/placeholder.svg?height=300&width=500",
    direction: "left",
  },
];

export default function LandingPage() {
  // State and hooks
  const { data: session, status, update } = useSession();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const [registrationComplete, setRegistrationComplete] = useState(false);

  useEffect(() => {
    if (session && status === "authenticated" && !registrationComplete) {
      fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/users/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          mail: session.user.email,
        }),
      })
        .then((res) => res.json())
        .then(async (data) => {
          if (update) {
            await update({ ...session.user, ...data.data });
          }
          localStorage.setItem("profile", JSON.stringify(data.data));
          if ("role" in data.data && data.data.role === "student") {
            router.push("/student-dashboard");
          } else if ("role" in data.data && data.data.role === "staff") {
            router.push("/staff-dashboard");
          }
          setRegistrationComplete(true);
        })
        .catch((error) => {
          console.error("Registration error:", error);
          router.push("/404");
        });
    }
  }, [session, status, registrationComplete, router, update]);

  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "50%"]);

  // Removed auto-open useEffect; modal is now shown only on click

  // Handlers
  const handleSignIn = async () => {
    try {
      setIsLoading(true);
      await signIn("google");
    } catch (error) {
      console.error("Sign in error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleModalClose = () => {
    setShowAuthModal(false);
  };

  // Auth modal content renderer (only for sign in and loading state)
  const renderAuthContent = () => {
    if (status === "loading" || isLoading) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[90%] max-w-md p-6">
            <CardContent className="flex justify-center items-center min-h-[200px]">
              <Loader2 className="h-8 w-8 animate-spin" />
            </CardContent>
          </Card>
        </div>
      );
    }

    if (
      (!session || !localStorage.getItem("profile") === undefined) &&
      showAuthModal
    ) {
      return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <Card className="w-[90%] max-w-md p-6">
            <CardHeader>
              <CardTitle className="text-center">Welcome to X-Helios</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-center text-muted-foreground">
                Sign in to start tracking your progress and managing
                competitions
              </p>
              <Button
                className="w-full"
                onClick={handleSignIn}
                disabled={isLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : null}
                Sign in with Google
              </Button>
              <Button
                variant="outline"
                className="w-full"
                onClick={handleModalClose}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </CardContent>
          </Card>
        </div>
      );
    }

    return null;
  };

  // Main render
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <motion.div
        ref={ref}
        style={{ y }}
        className="h-screen flex flex-col items-center justify-center text-center relative overflow-hidden"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-6xl md:text-8xl font-bold tracking-tighter mb-4"
        >
          X-Helios
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto px-4"
        >
          A unified contest - competition tracking and management system for
          universities
        </motion.p>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mt-8"
        >
          {/* Modified button to directly trigger sign-in on click */}
          <Button size="lg" className="rounded-full" onClick={handleSignIn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 48 48"
              className="mr-2"
            >
              <path
                fill="#EA4335"
                d="M24 9.5c3.9 0 6.7 1.7 8.3 3.2l5.9-5.9C34.2 3.7 29.8 1.5 24 1.5 14.9 1.5 7.1 6.8 3.3 14.1l6.9 5.3C12.6 12.7 17.9 9.5 24 9.5z"
              />
              <path
                fill="#4285F4"
                d="M46.5 24c0-1.7-.2-3.4-.7-5H24v9.5h12.7c-.5 3-2.1 5.5-4.6 7.2l7.2 5.6C44.5 36.1 46.5 30.3 46.5 24z"
              />
              <path
                fill="#FBBC05"
                d="M10.3 28.3c-1.3-3.4-1.3-7.1 0-10.5L3.4 12.5C-1.2 18 0 25.4 3.4 31l6.9-5.3z"
              />
              <path
                fill="#34A853"
                d="M24 46.5c6.5 0 12.1-2.2 16.1-6L34 34.8c-2 1.4-4.5 2.3-10 2.3-6.1 0-11.4-3.2-13.1-7.9L3.3 33.9C7.1 41.2 14.9 46.5 24 46.5z"
              />
              <path fill="none" d="M0 0h48v48H0z" />
            </svg>
            Sign In With Google <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </motion.div>
      </motion.div>

      {/* Features Carousel */}
      <section className="py-20 px-4">
        <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
        <Carousel className="max-w-5xl mx-auto">
          <CarouselContent>
            {features.map((feature, index) => (
              <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                <Card>
                  <CardHeader>
                    <Image
                      src={feature.image}
                      alt={feature.title}
                      width={400}
                      height={200}
                      className="rounded-lg object-cover"
                    />
                  </CardHeader>
                  <CardContent>
                    <CardTitle className="mb-2">{feature.title}</CardTitle>
                    <p className="text-muted-foreground">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              </CarouselItem>
            ))}
          </CarouselContent>
          <CarouselPrevious />
          <CarouselNext />
        </Carousel>
      </section>

      {/* Scrolling Cards */}
      <section className="py-20">
        {cards.map((card, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: card.direction === "left" ? -100 : 100 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="max-w-5xl mx-auto mb-20 px-4"
          >
            <Card
              className={`flex flex-col ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              } overflow-hidden`}
            >
              <div className="md:w-1/2">
                <Image
                  src={card.image}
                  alt={card.title}
                  width={500}
                  height={300}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 flex flex-col justify-center">
                <h3 className="text-2xl font-bold mb-4">{card.title}</h3>
                <p className="text-muted-foreground">{card.description}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </section>

      {/* Auth Modal */}
      {showAuthModal && renderAuthContent()}
    </div>
  );
}
