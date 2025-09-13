import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navbar from "@/components/Navbar";
import { Search, MapPin, Calendar, Star, Users, Filter } from "lucide-react";
import destinationsImage from "@/assets/destinations.jpg";
import Footer from "@/components/Footer";

const Discover = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const destinations = [
    {
      name: "Tokyo, Japan",
      image: "https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=400&h=300&fit=crop",
      rating: 4.8,
      price: "$$$",
      duration: "5-7 days",
      highlights: ["Culture", "Food", "Technology", "Shopping"],
      description: "Experience the perfect blend of ancient traditions and cutting-edge innovation."
    },
    {
      name: "Santorini, Greece",
      image: "https://images.unsplash.com/photo-1570077188670-e3a8d69ac5ff?w=400&h=300&fit=crop",
      rating: 4.9,
      price: "$$",
      duration: "3-5 days", 
      highlights: ["Beaches", "Romance", "Architecture", "Sunsets"],
      description: "Breathtaking sunsets and iconic blue-domed churches overlooking the Aegean Sea."
    },
    {
      name: "Machu Picchu, Peru",
      image: "https://images.unsplash.com/photo-1587595431973-160d0d94add1?w=400&h=300&fit=crop",
      rating: 4.7,
      price: "$$",
      duration: "4-6 days",
      highlights: ["Adventure", "History", "Nature", "Hiking"],
      description: "Ancient Inca citadel high in the Andes mountains, a true wonder of the world."
    },
    {
      name: "Dubai, UAE",
      image: "https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=400&h=300&fit=crop",
      rating: 4.6,
      price: "$$$",
      duration: "4-7 days",
      highlights: ["Luxury", "Shopping", "Architecture", "Desert"],
      description: "Ultra-modern city with stunning architecture, luxury shopping, and desert adventures."
    },
    {
      name: "Reykjavik, Iceland",
      image: "https://images.unsplash.com/photo-1539635278303-d4002c07eae3?w=400&h=300&fit=crop",
      rating: 4.8,
      price: "$$$",
      duration: "5-8 days",
      highlights: ["Nature", "Northern Lights", "Geysers", "Adventure"],
      description: "Land of fire and ice with incredible natural phenomena and outdoor adventures."
    },
    {
      name: "Bali, Indonesia",
      image: "https://images.unsplash.com/photo-1537953773345-d172ccf13cf1?w=400&h=300&fit=crop",
      rating: 4.7,
      price: "$",
      duration: "7-10 days",
      highlights: ["Beaches", "Culture", "Wellness", "Temples"],
      description: "Tropical paradise with beautiful beaches, ancient temples, and spiritual wellness."
    }
  ];

  const categories = [
    { name: "Beach", icon: "🏖️" },
    { name: "City", icon: "🏙️" },
    { name: "Nature", icon: "🌲" },
    { name: "Culture", icon: "🏛️" },
    { name: "Adventure", icon: "🏔️" },
    { name: "Food", icon: "🍜" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <section className="pt-24 pb-12 bg-gradient-to-b from-primary/5 to-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
              Discover Your Next
              <br />
              <span className="bg-gradient-ocean bg-clip-text text-transparent">Adventure</span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
              Explore handpicked destinations with AI-powered insights, local recommendations, 
              and personalized travel guides.
            </p>

            {/* Search Bar */}
            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5" />
              <Input
                placeholder="Where do you want to go? (e.g., Paris, Tokyo, Bali)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-6 text-lg rounded-2xl border-2 border-border focus:border-primary"
              />
              <Button 
                variant="travel" 
                size="lg" 
                className="absolute right-2 top-1/2 transform -translate-y-1/2 rounded-xl"
              >
                Search
              </Button>
            </div>
          </div>

          {/* Categories */}
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, index) => (
              <Button
                key={index}
                variant="outline"
                className="rounded-full hover:border-primary hover:text-primary"
              >
                <span className="mr-2">{category.icon}</span>
                {category.name}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Destinations */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">Featured Destinations</h2>
              <p className="text-muted-foreground">Curated by our AI and travel experts</p>
            </div>
            <Button variant="outline">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </Button>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {destinations.map((destination, index) => (
              <Card 
                key={index} 
                className="overflow-hidden hover:shadow-travel transition-all duration-300 hover:scale-105 cursor-pointer group"
              >
                <div className="relative h-48 overflow-hidden">
                  <img 
                    src={destination.image} 
                    alt={destination.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="secondary" className="bg-white/90 text-foreground">
                      {destination.price}
                    </Badge>
                  </div>
                  <div className="absolute bottom-4 left-4 flex items-center text-white">
                    <Star className="w-4 h-4 mr-1 fill-current text-accent" />
                    <span className="font-medium">{destination.rating}</span>
                  </div>
                </div>

                <div className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-xl font-semibold text-foreground">{destination.name}</h3>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="w-4 h-4 mr-1" />
                      {destination.duration}
                    </div>
                  </div>

                  <p className="text-muted-foreground mb-4 text-sm leading-relaxed">
                    {destination.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-4">
                    {destination.highlights.map((highlight, idx) => (
                      <Badge key={idx} variant="outline" className="text-xs">
                        {highlight}
                      </Badge>
                    ))}
                  </div>

                  <Button variant="travel" className="w-full">
                    <MapPin className="w-4 h-4 mr-2" />
                    Plan Trip Here
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* AI Destination Guide */}
      <section className="py-16 bg-gradient-to-r from-primary/5 to-accent/5">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-3xl font-bold text-foreground mb-6">
                AI-Powered Destination Insights
              </h3>
              <p className="text-lg text-muted-foreground mb-6">
                Get personalized recommendations based on your travel style, budget, and interests. 
                Our AI analyzes weather patterns, local events, and crowd data to suggest the perfect time to visit.
              </p>
              <ul className="space-y-3 text-foreground mb-8">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Best time to visit based on weather and events
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Local insights from verified travelers
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Budget breakdown with cost-saving tips
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Hidden gems off the beaten path
                </li>
              </ul>
              <Button variant="hero" size="lg">
                Try AI Travel Guide
              </Button>
            </div>
            <div className="relative">
              <img 
                src={destinationsImage} 
                alt="AI destination insights" 
                className="w-full rounded-xl shadow-travel"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent rounded-xl"></div>
            </div>
          </div>
        </div>
      </section>
      <Footer />
    </div>
    
  );
};

export default Discover;