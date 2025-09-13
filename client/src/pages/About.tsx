import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Instagram,
  Twitter,
  Facebook,
  Mail,
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { Link } from "react-router-dom";

const About: React.FC = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Sarah Johnson",
      photo: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=150",
      destination: "Tokyo, Japan",
      rating: 4.8,
      text: "TravelAI made my trip to Tokyo seamless! The safety alerts and itinerary suggestions were spot-on."
    },
    {
      name: "Michael Chen",
      photo: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150",
      destination: "Paris, France",
      rating: 4.9,
      text: "The AI itinerary builder saved me hours of planning. Loved the real-time map features!"
    },
    {
      name: "Priya Sharma",
      photo: "https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150",
      destination: "New York, USA",
      rating: 4.7,
      text: "Transparent pricing and accessibility filters made booking so easy. Highly recommend!"
    },
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [testimonials.length]);

  const handlePrevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const handleNextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Hero Section */}
        <div
          className="relative bg-cover bg-center py-16 md:py-24 animate-pulse-slow"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/2432299/pexels-photo-2432299.jpeg?auto=compress&cs=tinysrgb&w=1920')"
          }}
        >
          <div className="absolute inset-0 bg-black/60" />
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-4 tracking-tight"
              initial={{ opacity: 0, y: -30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
            >
              Make Travel Smarter, Safer, and Unforgettable
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Discover the world with TravelAI’s intelligent planning tools and safety-focused features.
            </motion.p>
            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Button
                variant="hero"
                size="lg"
                className="bg-gradient-ocean text-white hover:opacity-90 text-lg px-8 py-3"
                asChild
              >
                <Link to="/planner">Start Planning</Link>
              </Button>
              <Button
                variant="outline"
                size="lg"
                className="bg-white/90 text-foreground hover:bg-white text-lg px-8 py-3"
                asChild
              >
                <Link to="/discover">Explore Trips</Link>
              </Button>
            </motion.div>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          {/* Our Vision */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Our Vision</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="order-2 md:order-1"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-gray-600 text-base sm:text-lg mb-4">
                  At TravelAI, we simplify travel with cutting-edge AI technology, helping you save time and reduce stress. Our platform crafts personalized experiences, from curated hotel recommendations to tailored itineraries, ensuring every journey is unforgettable.
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                  We’re here to make travel planning effortless, safe, and exciting for everyone, whether you’re a solo adventurer or a family on vacation.
                </p>
              </motion.div>
              <motion.div
                className="order-1 md:order-2 w-full h-64 sm:h-80 rounded-xl overflow-hidden shadow-lg"
                whileHover={{ scale: 1.03, rotate: -1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <img
                  src="https://images.pexels.com/photos/3467149/pexels-photo-3467149.jpeg?auto=compress&cs=tinysrgb&w=600"
                  alt="Travel planning"
                  className="w-full h-full object-cover"
                />
              </motion.div>
            </div>
          </motion.section>

          {/* The TripFactory Difference */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">The TripFactory Difference</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {[
                {
                  image: "https://images.pexels.com/photos/3183183/pexels-photo-3183183.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Smart Suggestions",
                  description: "AI-powered recommendations for flights, hotels, and itineraries tailored to your preferences."
                },
                {
                  image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Safety-First Planning",
                  description: "Verified accommodations with detailed safety features and real-time alerts."
                },
                {
                  image: "https://images.pexels.com/photos/3467152/pexels-photo-3467152.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Real-Time Alerts & Local Insights",
                  description: "Stay informed with live updates on weather, safety, and local events."
                },
                {
                  image: "https://images.pexels.com/photos/386009/pexels-photo-386009.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Unified Platform",
                  description: "Book hotels, flights, visas, and more in one seamless experience."
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: "spring", bounce: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl">
                    <motion.div
                      className="flex items-center mb-4"
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    </motion.div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* What Sets Us Apart */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">What Sets Us Apart</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {[
                {
                  image: "https://images.pexels.com/photos/3184297/pexels-photo-3184297.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "AI Itinerary Builder",
                  description: "Create personalized travel plans with smart suggestions in minutes."
                },
                {
                  image: "https://images.pexels.com/photos/3467150/pexels-photo-3467150.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Real-Time Maps & Safety Alerts",
                  description: "Navigate confidently with live maps and safety notifications."
                },
                {
                  image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Currency Converter & Language Switcher",
                  description: "Seamless tools for global travel with real-time conversions."
                },
                {
                  image: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Transparent Pricing & Booking",
                  description: "No hidden fees, clear policies, and easy booking process."
                },
                {
                  image: "https://images.pexels.com/photos/3467147/pexels-photo-3467147.jpeg?auto=compress&cs=tinysrgb&w=150",
                  title: "Global Travel Resources",
                  description: "Access visa guides, travel tips, and local insights worldwide."
                },
              ].map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: "spring", bounce: 0.3 }}
                >
                  <Card className="p-6 hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl">
                    <motion.div
                      className="flex items-center mb-4"
                      whileHover={{ scale: 1.05, rotate: 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <img
                        src={feature.image}
                        alt={feature.title}
                        className="w-12 h-12 rounded-full object-cover mr-3"
                      />
                      <h3 className="text-lg font-semibold text-gray-800">{feature.title}</h3>
                    </motion.div>
                    <p className="text-gray-600 text-sm">{feature.description}</p>
                  </Card>
                </motion.div>
              ))}
            </div>
          </motion.section>

          {/* Our Team & Story */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Our Team & Story</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <motion.div
                className="order-2 md:order-1"
                whileHover={{ scale: 1.03, rotate: 1 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                <p className="text-gray-600 text-base sm:text-lg mb-4">
                  Founded by a team of passionate travelers and tech enthusiasts, TravelAI was born to make travel planning effortless and secure. Our mission is to empower every traveler with AI-driven tools and reliable information.
                </p>
                <p className="text-gray-600 text-base sm:text-lg">
                  From solo adventurers to family vacations, we’re here to ensure your journey is as memorable as the destination.
                </p>
              </motion.div>
              <motion.div
                className="order-1 md:order-2 flex flex-wrap gap-4 justify-center"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 200 }}
              >
                {[
                  "https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=100",
                  "https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=100",
                  "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=100",
                ].map((src, index) => (
                  <motion.img
                    key={index}
                    src={src}
                    alt={`Team member ${index + 1}`}
                    className="w-20 h-20 sm:w-24 sm:h-24 rounded-full object-cover border-2 border-blue-600 shadow-md"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  />
                ))}
              </motion.div>
            </div>
          </motion.section>

          {/* User Testimonials */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">What Travelers Say</h2>
            <Card className="p-6 sm:p-8 bg-white/90 backdrop-blur-sm border border-gray-100 rounded-xl relative shadow-lg">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentTestimonial}
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -30 }}
                  transition={{ duration: 0.5, type: "spring" }}
                  className="flex flex-col md:flex-row items-center gap-6"
                >
                  <img
                    src={testimonials[currentTestimonial].photo}
                    alt={testimonials[currentTestimonial].name}
                    className="w-24 h-24 sm:w-32 sm:h-32 rounded-full object-cover border-2 border-blue-600 shadow-md"
                  />
                  <div className="text-center md:text-left">
                    <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
                      {testimonials[currentTestimonial].name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base mb-2">
                      {testimonials[currentTestimonial].destination} • {testimonials[currentTestimonial].rating}/5
                    </p>
                    <p className="text-gray-600 italic text-sm sm:text-base">"{testimonials[currentTestimonial].text}"</p>
                  </div>
                </motion.div>
              </AnimatePresence>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                onClick={handlePrevTestimonial}
              >
                <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-white/80 hover:bg-white shadow-md"
                onClick={handleNextTestimonial}
              >
                <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5" />
              </Button>
            </Card>
          </motion.section>

          {/* FAQ Section */}
          <motion.section
            className="mb-16 sm:mb-20"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6 text-center">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="max-w-3xl mx-auto">
              {[
                {
                  image: "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=100",
                  question: "How do I apply for a visa with TravelAI?",
                  answer: "TravelAI provides comprehensive visa guides for over 200 countries. Simply visit the 'Global Travel Resources' section, select your destination, and follow the step-by-step instructions. We also offer real-time updates on visa requirements."
                },
                {
                  image: "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=100",
                  question: "What safety features does TravelAI offer?",
                  answer: "We prioritize safety with verified accommodations, real-time safety alerts, and proximity details to hospitals and police stations. Our AI also highlights safe travel routes and local safety tips."
                },
                {
                  image: "https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg?auto=compress&cs=tinysrgb&w=100",
                  question: "What is your refund policy?",
                  answer: "Our transparent refund policy ensures clarity. Most bookings offer flexible cancellations with full refunds up to 48 hours before check-in. Check specific hotel or flight policies during booking for details."
                },
                {
                  image: "https://images.pexels.com/photos/3183186/pexels-photo-3183186.jpeg?auto=compress&cs=tinysrgb&w=100",
                  question: "What documents do I need for travel?",
                  answer: "Required documents vary by destination. TravelAI’s platform provides a checklist for each country, including passports, visas, and health certificates. Access these in the 'Plan Trip' section."
                },
              ].map((faq, index) => (
                <motion.div
                  key={faq.question}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.15, type: "spring", bounce: 0.3 }}
                >
                  <AccordionItem value={`item-${index}`}>
                    <AccordionTrigger className="hover:bg-gray-100/50 rounded-lg px-4 py-3">
                      <div className="flex items-center gap-3">
                        <img
                          src={faq.image}
                          alt={faq.question}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <span className="text-base sm:text-lg font-medium text-gray-800">{faq.question}</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 py-3 text-gray-600 text-sm sm:text-base">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </motion.section>

          {/* Join Us */}
          {/* <motion.section
            className="mb-16 sm:mb-20 text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, type: "spring", bounce: 0.3 }}
          >
            <h2 className="text-3xl sm:text-4xl font-bold text-gray-800 mb-6">Join Our Community</h2>
            <Card className="p-8 bg-white/95 backdrop-blur-sm shadow-xl max-w-md mx-auto rounded-xl">
              <p className="text-gray-600 text-base sm:text-lg mb-6">
                Stay connected for travel tips, exclusive offers, and community updates.
              </p>
              <motion.div
                className="flex gap-4 justify-center mb-6"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                    <Instagram className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
                    <Twitter className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                  </a>
                </Button>
                <Button variant="ghost" size="icon" asChild>
                  <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                    <Facebook className="w-6 h-6 text-foreground hover:text-primary transition-colors" />
                  </a>
                </Button>
              </motion.div>
              <motion.div
                className="flex flex-col sm:flex-row gap-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Input placeholder="Enter your email" className="focus:ring-2 focus:ring-blue-500" />
                <Button variant="hero" className="bg-gradient-ocean text-white hover:opacity-90">
                  Subscribe
                </Button>
              </motion.div>
            </Card>
          </motion.section> */}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
};

export default About;