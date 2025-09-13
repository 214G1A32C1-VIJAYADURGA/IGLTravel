import { useState, useEffect } from "react";
import { MapPin, Twitter, Facebook, Instagram, Mail } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useInView } from "react-intersection-observer";

const Footer = () => {
  const [showTopText, setShowTopText] = useState(false);
  const [currency, setCurrency] = useState("INR");
  const [language, setLanguage] = useState("English");
  const [email, setEmail] = useState("");
  const controls = useAnimation();
  const [ref, inView] = useInView({ triggerOnce: false, threshold: 0.1 });

  // Scroll effect for top text
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 100) {
        setShowTopText(true);
      } else {
        setShowTopText(false);
      }
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Animation for footer text
  useEffect(() => {
    if (inView) {
      controls.start("visible");
    } else {
      controls.start("hidden");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const textVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3 },
    },
  };

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription logic here
    setEmail("");
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={showTopText ? "visible" : "hidden"}
        variants={{
          visible: { opacity: 1, y: 0 },
          hidden: { opacity: 0, y: -20 },
        }}
        transition={{ duration: 0.5 }}
        className="text-center py-2 text-sm bg-background text-foreground sticky top-0 z-50"
      >
        Ready to explore the world with AI? ✈️ Start your journey now.
      </motion.div>

      <footer className="bg-foreground text-background relative overflow-hidden">
        {/* Background gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-transparent opacity-50" />

        <motion.div
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 relative z-10"
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          ref={ref}
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
            {/* Brand Section */}
            <motion.div variants={textVariants} className="col-span-1">
              <Link to="/" className="flex items-center space-x-2 mb-4">
                <motion.div
                  className="w-10 h-10 bg-gradient-ocean rounded-lg flex items-center justify-center"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <MapPin className="w-6 h-6 text-white" />
                </motion.div>
                <motion.div variants={textVariants} className="flex">
                  {"TravelAI".split("").map((letter, i) => (
                    <motion.span key={i} variants={textVariants}>
                      {letter}
                    </motion.span>
                  ))}
                </motion.div>
              </Link>
              <motion.p variants={textVariants} className="text-background/80 mb-6 text-sm">
                The smartest way to plan your perfect trip with AI-powered recommendations and seamless booking.
              </motion.p>
              {/* Social Icons */}
              <motion.div variants={textVariants} className="flex space-x-4">
                {[
                  { Icon: Twitter, link: "https://twitter.com" },
                  { Icon: Facebook, link: "https://facebook.com" },
                  { Icon: Instagram, link: "https://instagram.com" },
                  { Icon: Mail, link: "mailto:support@travelai.com" },
                ].map(({ Icon, link }, index) => (
                  <motion.a
                    key={index}
                    href={link}
                    target="_blank"
                    rel="noopener noreferrer"
                    whileHover={{ scale: 1.2, rotate: 10 }}
                    whileTap={{ scale: 0.9 }}
                    className="w-5 h-5 hover:text-primary cursor-pointer transition-colors"
                  >
                    <Icon />
                  </motion.a>
                ))}
              </motion.div>
            </motion.div>

            {/* Product Section */}
            <motion.div variants={textVariants}>
              <motion.h3 variants={textVariants} className="font-semibold mb-4 text-lg">
                Product
              </motion.h3>
              <motion.ul variants={textVariants} className="space-y-3 text-background/80">
                {[
                  { to: "/planner", text: "Trip Planner" },
                  { to: "/discover", text: "Destinations" },
                  { to: "/transport", text: "Flights & Hotels" },
                  { to: "/mobile", text: "Mobile App" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={textVariants}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to={item.to} className="hover:text-background transition-colors">
                      {item.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Company Section */}
            <motion.div variants={textVariants}>
              <motion.h3 variants={textVariants} className="font-semibold mb-4 text-lg">
                Company
              </motion.h3>
              <motion.ul variants={textVariants} className="space-y-3 text-background/80">
                {[
                  { to: "/about", text: "About Us" },
                  { to: "/careers", text: "Careers" },
                  { to: "/press", text: "Press" },
                  { to: "/contact", text: "Contact" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={textVariants}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to={item.to} className="hover:text-background transition-colors">
                      {item.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>

            {/* Support Section */}
            <motion.div variants={textVariants}>
              <motion.h3 variants={textVariants} className="font-semibold mb-4 text-lg">
                Support
              </motion.h3>
              <motion.ul variants={textVariants} className="space-y-3 text-background/80">
                {[
                  { to: "/help", text: "Help Center" },
                  { to: "/privacy", text: "Privacy Policy" },
                  { to: "/terms", text: "Terms of Service" },
                  { to: "/cancellation", text: "Cancellation Policy" },
                  { to: "/api", text: "API" },
                ].map((item, index) => (
                  <motion.li
                    key={index}
                    variants={textVariants}
                    whileHover={{ x: 5, color: "#ffffff" }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <Link to={item.to} className="hover:text-background transition-colors">
                      {item.text}
                    </Link>
                  </motion.li>
                ))}
              </motion.ul>
            </motion.div>
          </div>

          {/* Currency and Language Switcher */}
          <motion.div
            variants={textVariants}
            className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4"
          >
            <motion.div variants={textVariants} className="flex gap-4">
              <motion.div variants={textVariants}>
                <motion.label variants={textVariants} className="text-sm font-semibold mr-2">
                  Currency:
                </motion.label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="bg-background/10 text-background rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                </select>
              </motion.div>
              <motion.div variants={textVariants}>
                <motion.label variants={textVariants} className="text-sm font-semibold mr-2">
                  Language:
                </motion.label>
                <select
                  value={language}
                  onChange={(e) => setLanguage(e.target.value)}
                  className="bg-background/10 text-background rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="English">English</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                </select>
              </motion.div>
            </motion.div>

            {/* Contact Form */}
            <motion.form
              variants={textVariants}
              onSubmit={handleEmailSubmit}
              className="flex w-full sm:w-auto"
            >
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Subscribe to our newsletter"
                className="bg-background/10 text-background placeholder-background/50 rounded-l-md px-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <motion.button
                type="submit"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-primary text-background px-4 py-2 rounded-r-md"
              >
                Subscribe
              </motion.button>
            </motion.form>
          </motion.div>

          {/* Footer Bottom */}
          <motion.div
            variants={textVariants}
            className="border-t border-background/20 mt-6 pt-9 text-center text-background/60"
          >
            <motion.p variants={textVariants}>
              &copy; 2025 TravelAI. All rights reserved. Built with 💙 for travelers worldwide.
            </motion.p>
          </motion.div>
        </motion.div>
      </footer>
    </>
  );
};

export default Footer;