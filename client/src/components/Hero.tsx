import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, MapPin, Clock } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import heroImage from "@/assets/hero-travel.jpg";

const Hero = () => {
  const [userName, setUserName] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCurrentUser = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setUserName(null);
        return;
      }

      try {
        const res = await fetch("http://localhost:4000/api/users/me", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          setUserName(null);
          localStorage.removeItem("token"); // token might be invalid/expired
          return;
        }

        const data = await res.json();
        // Assuming your backend sends user info as { name: string, email: string, ... }
        setUserName(data.name || data.email?.split("@")[0] || "Traveler");
      } catch (error) {
        setUserName(null);
        localStorage.removeItem("token");
      }
    };

    fetchCurrentUser();
  }, []);

  const handleStartPlanning = () => {
    if (!userName) {
      toast.error("Please log in to start planning your trip");
      navigate("/signin");
    } else {
      navigate("/planner");
    }
  };

  return (
    <section className="relative pt-16 pb-20 overflow-hidden">
      {/* Background with gradient overlay */}
      <div className="absolute inset-0">
        <img
          src={heroImage}
          alt="Beautiful travel destination"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 via-primary/70 to-transparent" />
      </div>

      {/* Content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
        <div className="max-w-3xl">
          {userName && (
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-4 animate-fade-in">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Welcome back, {userName}!</span>
            </div>
          )}
          <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 text-white mb-8 animate-fade-in">
            <Sparkles className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">AI-Powered Trip Planning</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight animate-fade-in">
            Plan Smarter.
            <br />
            <span className="bg-gradient-sunset bg-clip-text text-transparent">
              Travel Better.
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed animate-fade-in">
            Create personalized itineraries, discover hidden gems, and book everything in one place.
            Let AI craft your perfect adventure.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mb-12 animate-fade-in">
            <Button
              variant="hero"
              size="xl"
              className="group"
              onClick={handleStartPlanning}
            >
              Start Planning Your Trip
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button
              variant="outline"
              size="xl"
              className="bg-white/10 border-white/30 text-white hover:bg-white/20"
            >
              Watch Demo
            </Button>
          </div>

          <div className="grid grid-cols-3 gap-8 text-white/90 animate-fade-in">
            <div>
              <div className="text-2xl font-bold text-white">1M+</div>
              <div className="text-sm">Trips Planned</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">150+</div>
              <div className="text-sm">Countries</div>
            </div>
            <div>
              <div className="text-2xl font-bold text-white">4.9★</div>
              <div className="text-sm">User Rating</div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute top-1/4 right-8 hidden lg:block animate-float">
        <div className="w-16 h-16 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center border border-white/30">
          <MapPin className="w-8 h-8 text-white" />
        </div>
      </div>
      <div
        className="absolute top-1/2 right-24 hidden lg:block animate-float"
        style={{ animationDelay: "1s" }}
      >
        <div className="w-12 h-12 bg-gradient-sunset rounded-full flex items-center justify-center">
          <Clock className="w-6 h-6 text-white" />
        </div>
      </div>
    </section>
  );
};

export default Hero;
