import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import {
  Building,
  Star,
  Shield,
  Clock,
  DollarSign,
  Users,
  Wifi,
  Car,
  Coffee,
  Utensils,
  MapPin,
  CheckCircle,
  AlertTriangle,
  Camera,
  Eye,
  UserCheck,
  Accessibility,
  Sparkles,
  Dog,
  Baby,
  Bed,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// TypeScript interfaces
interface Safety {
  cctv: boolean;
  femaleFriendly: boolean;
  security24x7: boolean;
  cleanliness: number;
  nearPolice: string;
  nearHospital: string;
  nearTransport: string;
}

interface Policies {
  idRequired: boolean;
  ageRestriction: string;
  pets: boolean;
  smoking: string;
}

interface Hotel {
  name: string;
  rating: number;
  reviews: number;
  price: number;
  originalPrice: number;
  location: string;
  distance: string;
  checkin: string;
  checkout: string;
  images: string[];
  amenities: string[];
  roomType: string;
  roomSize: string;
  bedType: string;
  capacity: string;
  cancellation: string;
  safety: Safety;
  verified: boolean;
  policies: Policies;
  type: string;
  accessibility: string[];
  availableRooms: number;
  reviewHighlights: string[];
}

const Hotels: React.FC = () => {
  const [searchLocation, setSearchLocation] = useState<string>("");
  const [safetyFilters, setSafetyFilters] = useState({
    cctv: false,
    femaleFriendly: false,
    security24x7: false,
    nearPolice: false,
    nearHospital: false,
    nearTransport: false,
  });
  const [accommodationType, setAccommodationType] = useState<string>("all");
  const [featureFilters, setFeatureFilters] = useState({
    pool: false,
    spa: false,
    gym: false,
    pets: false,
    kidsClub: false,
    wifi: false,
    minibar: false,
  });
  const [accessibilityFilters, setAccessibilityFilters] = useState({
    wheelchair: false,
    knockLight: false,
    hearingSupport: false,
  });
  const [bedsFilter, setBedsFilter] = useState<string>("any");
  const [currency, setCurrency] = useState<string>("USD");
  const [sortBy, setSortBy] = useState<string>("price");
  const [imageIndices, setImageIndices] = useState<{ [key: string]: number }>({});
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string; email: string; mobile?: string } | null>(null);

  const currencyRates: { [key: string]: number } = {
    USD: 1,
    EUR: 0.92,
    JPY: 149.5,
    GBP: 0.78,
    INR: 83.1,
  };

  const currencySymbols: { [key: string]: string } = {
    USD: "$",
    EUR: "€",
    JPY: "¥",
    GBP: "£",
    INR: "₹",
  };

  const hotelResults: Hotel[] = [
    {
      name: "Grand Tokyo Bay Hotel",
      rating: 4.8,
      reviews: 2847,
      price: 185,
      originalPrice: 220,
      location: "Shibuya, Tokyo",
      distance: "0.3km from Shibuya Station",
      checkin: "3:00 PM",
      checkout: "11:00 AM",
      images: [
        "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/271639/pexels-photo-271639.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
      amenities: ["Wifi", "Parking", "Restaurant", "Gym", "Spa", "Pool", "Minibar"],
      roomType: "Deluxe King Room",
      roomSize: "32 m²",
      bedType: "1 King Bed",
      capacity: "2 Adults",
      cancellation: "Free cancellation until 6:00 PM on March 14",
      safety: {
        cctv: true,
        femaleFriendly: true,
        security24x7: true,
        cleanliness: 4.9,
        nearPolice: "200m",
        nearHospital: "500m",
        nearTransport: "300m",
      },
      verified: true,
      policies: {
        idRequired: true,
        ageRestriction: "18+",
        pets: false,
        smoking: "Non-smoking rooms available",
      },
      type: "Hotel",
      accessibility: ["Wheelchair access", "Hearing support"],
      availableRooms: 15,
      reviewHighlights: ["Excellent Service", "Great Location", "Clean Rooms"],
    },
    {
      name: "Sakura Business Hotel",
      rating: 4.5,
      reviews: 1234,
      price: 125,
      originalPrice: 125,
      location: "Asakusa, Tokyo",
      distance: "0.1km from Asakusa Station",
      checkin: "2:00 PM",
      checkout: "10:00 AM",
      images: [
        "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/271617/pexels-photo-271617.jpeg?auto=compress&cs=tinysrgb&w=600",
        "https://images.pexels.com/photos/261388/pexels-photo-261388.jpeg?auto=compress&cs=tinysrgb&w=600",
      ],
      amenities: ["Wifi", "Restaurant", "Laundry", "Kids Club"],
      roomType: "Standard Double Room",
      roomSize: "18 m²",
      bedType: "1 Double Bed, 1 Single Bed",
      capacity: "3 Adults",
      cancellation: "Free cancellation until 12:00 PM on March 14",
      safety: {
        cctv: true,
        femaleFriendly: true,
        security24x7: false,
        cleanliness: 4.6,
        nearPolice: "150m",
        nearHospital: "800m",
        nearTransport: "100m",
      },
      verified: true,
      policies: {
        idRequired: true,
        ageRestriction: "20+",
        pets: false,
        smoking: "Smoking rooms available",
      },
      type: "Hotel",
      accessibility: ["Knock light"],
      availableRooms: 8,
      reviewHighlights: ["Friendly Staff", "Convenient Transport", "Value for Money"],
    },
  ];

  // Check authentication status
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/users/me", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok && data._id) {
          setCurrentUser(data);
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token"); // Clear invalid token
        }
      } catch (err) {
        console.error("Authentication check failed:", err);
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  const getBedCount = (bedType: string): number => {
    const beds = bedType.match(/\d+/g)?.map(Number) || [];
    return beds.reduce((sum, num) => sum + num, 0);
  };

  const filteredResults = hotelResults.filter((hotel) => {
    const matchesSearch = searchLocation
      ? hotel.location.toLowerCase().includes(searchLocation.toLowerCase()) ||
        hotel.name.toLowerCase().includes(searchLocation.toLowerCase())
      : true;
    const matchesSafety = Object.keys(safetyFilters).every(
      (key) => !safetyFilters[key as keyof typeof safetyFilters] || hotel.safety[key as keyof Safety]
    );
    const matchesType = accommodationType === "all" || hotel.type === accommodationType;
    const matchesFeatures = Object.keys(featureFilters).every(
      (key) =>
        !featureFilters[key as keyof typeof featureFilters] ||
        hotel.amenities.includes(key.charAt(0).toUpperCase() + key.slice(1))
    );
    const matchesAccessibility = Object.keys(accessibilityFilters).every(
      (key) =>
        !accessibilityFilters[key as keyof typeof accessibilityFilters] ||
        hotel.accessibility.includes(key.charAt(0).toUpperCase() + key.slice(1))
    );
    const bedCount = getBedCount(hotel.bedType);
    const matchesBeds =
      bedsFilter === "any" ||
      (bedsFilter === "2+" && bedCount >= 2) ||
      (bedsFilter === "3+" && bedCount >= 3) ||
      (bedsFilter === "4+" && bedCount >= 4);
    return matchesSearch && matchesSafety && matchesType && matchesFeatures && matchesAccessibility && matchesBeds;
  });

  const sortedResults = [...filteredResults].sort((a, b) => {
    if (sortBy === "price") return a.price - b.price;
    if (sortBy === "rating") return b.rating - a.rating;
    if (sortBy === "safety") return b.safety.cleanliness - a.safety.cleanliness;
    return 0;
  });

  const convertPrice = (price: number): number => {
    return Math.round(price * currencyRates[currency]);
  };

  const handleImageChange = (hotelName: string, direction: "next" | "prev") => {
    setImageIndices((prev) => {
      const currentIndex = prev[hotelName] || 0;
      const hotel = hotelResults.find((h) => h.name === hotelName);
      const maxIndex = hotel ? hotel.images.length - 1 : 0;
      let newIndex = direction === "next" ? currentIndex + 1 : currentIndex - 1;
      if (newIndex > maxIndex) newIndex = 0;
      if (newIndex < 0) newIndex = maxIndex;
      return { ...prev, [hotelName]: newIndex };
    });
  };

  const renderHotelCard = (hotel: Hotel, index: number) => {
    const currentImageIndex = imageIndices[hotel.name] || 0;
    const savings =
      hotel.originalPrice > hotel.price
        ? Math.round(((hotel.originalPrice - hotel.price) / hotel.originalPrice) * 100)
        : 0;
    const convertedPrice = convertPrice(hotel.price);
    const convertedOriginalPrice = convertPrice(hotel.originalPrice);

    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        transition={{ delay: index * 0.1 }}
        key={hotel.name}
      >
        <Card className="p-6 hover:shadow-2xl hover:scale-105 transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100 relative overflow-hidden">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Hotel Image Carousel */}
            <motion.div
              className="w-full md:w-64 h-48 rounded-lg overflow-hidden relative"
              whileHover={{ scale: 1.05, rotate: 1 }}
              transition={{ type: "spring", stiffness: 300 }}
            >
              <AnimatePresence>
                <motion.img
                  key={currentImageIndex}
                  src={hotel.images[currentImageIndex]}
                  alt={`${hotel.name} - Image ${currentImageIndex + 1}`}
                  className="w-full h-full object-cover"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.3 }}
                />
              </AnimatePresence>
              <div className="absolute inset-0 bg-gradient-ocean/20" />
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 left-2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 transition-transform duration-300"
                onClick={() => handleImageChange(hotel.name, "prev")}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                className="absolute top-1/2 right-2 transform -translate-y-1/2 bg-white/80 hover:bg-white hover:scale-110 transition-transform duration-300"
                onClick={() => handleImageChange(hotel.name, "next")}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded flex items-center">
                <Camera className="w-3 h-3 mr-1" />
                {hotel.images.length}
              </div>
              {hotel.verified && (
                <div className="absolute bottom-2 left-2 bg-green-500 text-white text-xs px-2 py-1 rounded flex items-center">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Verified
                </div>
              )}
            </motion.div>

            {/* Hotel Details */}
            <div className="flex-1">
              <div className="flex flex-col md:flex-row justify-between items-start mb-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{hotel.name}</h3>
                  <div className="flex items-center mb-2">
                    <div className="flex items-center mr-4">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-4 h-4 ${i < Math.floor(hotel.rating) ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                        />
                      ))}
                      <span className="ml-2 font-medium">{hotel.rating}</span>
                      <span className="ml-1 text-gray-500">({hotel.reviews} reviews)</span>
                    </div>
                  </div>
                  <div className="flex items-center text-gray-500 mb-4">
                    <MapPin className="w-4 h-4 mr-1" />
                    <span className="text-sm">{hotel.location} • {hotel.distance}</span>
                  </div>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {hotel.reviewHighlights.map((highlight) => (
                      <Badge key={highlight} variant="secondary" className="bg-blue-100 text-blue-800">
                        {highlight}
                      </Badge>
                    ))}
                  </div>
                </div>

                <motion.div
                  className="text-right"
                  whileHover={{ scale: 1.05 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <div className="flex items-center justify-end mb-1">
                    {savings > 0 && (
                      <span className="text-sm text-gray-500 line-through mr-2">
                        {currencySymbols[currency]}
                        {convertedOriginalPrice}
                      </span>
                    )}
                    <span className="text-3xl font-bold text-blue-600">
                      {currencySymbols[currency]}
                      {convertedPrice}
                    </span>
                  </div>
                  <div className="text-sm text-gray-500 mb-2">per night</div>
                  {savings > 0 && (
                    <Badge variant="default" className="bg-green-500 text-white">
                      Save {savings}%
                    </Badge>
                  )}
                </motion.div>
              </div>

              {/* Room Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <div className="font-semibold text-sm mb-2 text-gray-700">Room Details</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div>{hotel.roomType}</div>
                    <div>{hotel.roomSize} • {hotel.bedType}</div>
                    <div className="flex items-center">
                      <Users className="w-4 h-4 mr-1" />
                      {hotel.capacity}
                    </div>
                    <div className="flex items-center">
                      <Bed className="w-4 h-4 mr-1" />
                      {hotel.availableRooms} rooms available
                    </div>
                  </div>
                </div>

                <div>
                  <div className="font-semibold text-sm mb-2 text-gray-700">Check-in/out</div>
                  <div className="text-sm text-gray-600 space-y-1">
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Check-in: {hotel.checkin}
                    </div>
                    <div className="flex items-center">
                      <Clock className="w-4 h-4 mr-1" />
                      Check-out: {hotel.checkout}
                    </div>
                  </div>
                </div>
              </div>

              {/* Amenities */}
              <div className="mb-4">
                <div className="font-semibold text-sm mb-2 text-gray-700">Amenities</div>
                <div className="flex flex-wrap gap-2">
                  {hotel.amenities.map((amenity) => (
                    <Badge key={amenity} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {amenity === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {amenity === "Parking" && <Car className="w-3 h-3 mr-1" />}
                      {amenity === "Restaurant" && <Utensils className="w-3 h-3 mr-1" />}
                      {amenity === "Gym" && <Sparkles className="w-3 h-3 mr-1" />}
                      {amenity === "Spa" && <Sparkles className="w-3 h-3 mr-1" />}
                      {amenity === "Pool" && <Sparkles className="w-3 h-3 mr-1" />}
                      {amenity === "Minibar" && <Coffee className="w-3 h-3 mr-1" />}
                      {amenity === "Kids Club" && <Baby className="w-3 h-3 mr-1" />}
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Safety Features */}
              <div className="mb-4">
                <div className="font-semibold text-sm mb-2 flex items-center text-gray-700">
                  <Shield className="w-4 h-4 mr-1 text-green-500" />
                  Safety & Security
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-xs">
                  {hotel.safety.cctv && (
                    <div className="flex items-center text-green-600">
                      <Eye className="w-3 h-3 mr-1" />
                      CCTV Monitored
                    </div>
                  )}
                  {hotel.safety.femaleFriendly && (
                    <div className="flex items-center text-green-600">
                      <UserCheck className="w-3 h-3 mr-1" />
                      Female-Friendly
                    </div>
                  )}
                  {hotel.safety.security24x7 && (
                    <div className="flex items-center text-green-600">
                      <Shield className="w-3 h-3 mr-1" />
                      24/7 Security
                    </div>
                  )}
                  <div className="text-gray-600">Police: {hotel.safety.nearPolice}</div>
                  <div className="text-gray-600">Hospital: {hotel.safety.nearHospital}</div>
                  <div className="text-gray-600">Transport: {hotel.safety.nearTransport}</div>
                  <div className="text-gray-600 flex items-center">
                    <Star className="w-3 h-3 mr-1" />
                    Cleanliness: {hotel.safety.cleanliness}/5
                  </div>
                </div>
              </div>

              {/* Accessibility */}
              <div className="mb-4">
                <div className="font-semibold text-sm mb-2 flex items-center text-gray-700">
                  <Accessibility className="w-4 h-4 mr-1 text-blue-500" />
                  Accessibility
                </div>
                <div className="flex flex-wrap gap-2">
                  {hotel.accessibility.map((access) => (
                    <Badge key={access} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {access}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Policies */}
              <div className="mb-4">
                <div className="font-semibold text-sm mb-2 text-gray-700">Policies</div>
                <div className="text-sm text-gray-600 space-y-1">
                  <div className="flex items-center">
                    {hotel.policies.idRequired ? (
                      <CheckCircle className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                    )}
                    ID {hotel.policies.idRequired ? "Required" : "Not Required"}
                  </div>
                  <div>Age Restriction: {hotel.policies.ageRestriction}</div>
                  <div className="flex items-center">
                    {hotel.policies.pets ? (
                      <Dog className="w-4 h-4 mr-1 text-green-500" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 mr-1 text-red-500" />
                    )}
                    Pets {hotel.policies.pets ? "Allowed" : "Not Allowed"}
                  </div>
                  <div>{hotel.policies.smoking}</div>
                </div>
              </div>

              {/* Cancellation Policy */}
              <div className="mb-4">
                <div className="text-sm text-green-600 flex items-center">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  {hotel.cancellation}
                </div>
              </div>

              {/* Action Buttons */}
              <motion.div
                className="flex gap-2"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Button variant="hero" className="flex-1 bg-gradient-ocean hover:opacity-90">
                  Book Now
                </Button>
                <Button variant="outline" className="hover:bg-blue-50">
                  View Details
                </Button>
                <Button variant="outline" size="icon" className="hover:bg-blue-50">
                  <Eye className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header with Background Image and Animation */}
        <div
          className="relative bg-cover bg-center py-12 sm:py-16 animate-pulse-slow"
          style={{
            backgroundImage:
              "url('https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg?auto=compress&cs=tinysrgb&w=1920')",
          }}
        >
          <div className="absolute inset-0 bg-gradient-ocean/50" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1
              className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white mb-4 drop-shadow-lg"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              Discover Your Perfect Hotel
            </motion.h1>
            <motion.p
              className="text-lg sm:text-xl md:text-2xl text-white/90 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Book verified accommodations with top amenities and safety features
            </motion.p>

            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-4 sm:p-6 bg-white/95 backdrop-blur-lg shadow-xl">
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Location</label>
                    <Input
                      placeholder="City or hotel name"
                      value={searchLocation}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchLocation(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Check-in</label>
                    <Input type="date" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Check-out</label>
                    <Input type="date" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Guests</label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="2 Adults, 0 Children" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="2-0">2 Adults, 0 Children</SelectItem>
                        <SelectItem value="1-0">1 Adult, 0 Children</SelectItem>
                        <SelectItem value="2-1">2 Adults, 1 Child</SelectItem>
                        <SelectItem value="4-0">4 Adults, 0 Children</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button
                      variant="hero"
                      size="lg"
                      className="w-full bg-gradient-ocean hover:opacity-90 hover:scale-105 transition-transform duration-300"
                    >
                      Search
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row gap-8">
            {/* Filters Sidebar */}
            <motion.div
              className="w-full md:w-80"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="p-6 sticky top-24 bg-white/95 backdrop-blur-sm shadow-xl">
                <h3 className="font-semibold text-lg mb-4 flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-green-500 animate-float" />
                  Filters
                </h3>

                {/* Currency Selector */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <h4 className="font-medium mb-3">Currency</h4>
                  <Select value={currency} onValueChange={setCurrency}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select Currency" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="USD">
                        <span className="flex items-center">
                          🇺🇸 USD
                        </span>
                      </SelectItem>
                      <SelectItem value="EUR">
                        <span className="flex items-center">
                          🇪🇺 EUR
                        </span>
                      </SelectItem>
                      <SelectItem value="JPY">
                        <span className="flex items-center">
                          🇯🇵 JPY
                        </span>
                      </SelectItem>
                      <SelectItem value="GBP">
                        <span className="flex items-center">
                          🇬🇧 GBP
                        </span>
                      </SelectItem>
                      <SelectItem value="INR">
                        <span className="flex items-center">
                          🇮🇳 INR
                        </span>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Beds per Room */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.1 }}
                >
                  <h4 className="font-medium mb-3">Beds per Room</h4>
                  <Select value={bedsFilter} onValueChange={setBedsFilter}>
                    <SelectTrigger className="focus:ring-2 focus:ring-blue-500">
                      <SelectValue placeholder="Select Beds" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="any">Any</SelectItem>
                      <SelectItem value="2+">2+</SelectItem>
                      <SelectItem value="3+">3+</SelectItem>
                      <SelectItem value="4+">4+</SelectItem>
                    </SelectContent>
                  </Select>
                </motion.div>

                {/* Safety Filters */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                >
                  <h4 className="font-medium mb-3">Safety</h4>
                  <div className="space-y-3">
                    {[
                      { id: "cctv", label: "CCTV Surveillance" },
                      { id: "femaleFriendly", label: "Female-Friendly" },
                      { id: "security24x7", label: "24/7 Security" },
                      { id: "nearPolice", label: "Near Police Station" },
                      { id: "nearHospital", label: "Near Hospital" },
                      { id: "nearTransport", label: "Near Public Transport" },
                    ].map((filter) => (
                      <motion.div
                        key={filter.id}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Checkbox
                          id={filter.id}
                          checked={safetyFilters[filter.id as keyof typeof safetyFilters]}
                          onCheckedChange={(checked) =>
                            setSafetyFilters((prev) => ({ ...prev, [filter.id]: checked as boolean }))
                          }
                        />
                        <label htmlFor={filter.id} className="text-sm">{filter.label}</label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Accommodation Type */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h4 className="font-medium mb-3">Accommodation Type</h4>
                  <div className="space-y-3">
                    {[
                      { id: "all", label: "All" },
                      { id: "Hotel", label: "Hotel" },
                      { id: "Resort", label: "Resort" },
                      { id: "Hostel", label: "Hostel" },
                    ].map((type) => (
                      <motion.div
                        key={type.id}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <input
                          type="radio"
                          id={type.id}
                          name="accommodationType"
                          checked={accommodationType === type.id}
                          onChange={() => setAccommodationType(type.id)}
                          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor={type.id} className="text-sm">{type.label}</label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Features */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                >
                  <h4 className="font-medium mb-3">Features</h4>
                  <div className="space-y-3">
                    {[
                      { id: "pool", label: "Pool" },
                      { id: "spa", label: "Spa" },
                      { id: "gym", label: "Gym" },
                      { id: "pets", label: "Pets Allowed" },
                      { id: "kidsClub", label: "Kids Club" },
                      { id: "wifi", label: "Wi-Fi" },
                      { id: "minibar", label: "Minibar" },
                    ].map((feature) => (
                      <motion.div
                        key={feature.id}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Checkbox
                          id={feature.id}
                          checked={featureFilters[feature.id as keyof typeof featureFilters]}
                          onCheckedChange={(checked) =>
                            setFeatureFilters((prev) => ({ ...prev, [feature.id]: checked as boolean }))
                          }
                        />
                        <label htmlFor={feature.id} className="text-sm">{feature.label}</label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Accessibility */}
                <motion.div
                  className="mb-6"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                >
                  <h4 className="font-medium mb-3">Accessibility</h4>
                  <div className="space-y-3">
                    {[
                      { id: "wheelchair", label: "Wheelchair Access" },
                      { id: "knockLight", label: "Knock Light" },
                      { id: "hearingSupport", label: "Hearing Support" },
                    ].map((access) => (
                      <motion.div
                        key={access.id}
                        className="flex items-center space-x-2"
                        whileHover={{ scale: 1.02 }}
                      >
                        <Checkbox
                          id={access.id}
                          checked={accessibilityFilters[access.id as keyof typeof accessibilityFilters]}
                          onCheckedChange={(checked) =>
                            setAccessibilityFilters((prev) => ({ ...prev, [access.id]: checked as boolean }))
                          }
                        />
                        <label htmlFor={access.id} className="text-sm">{access.label}</label>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                {/* Price Range */}
                <motion.div
                  className="pt-4 border-t"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  transition={{ duration: 0.3, delay: 0.6 }}
                >
                  <h4 className="font-medium mb-3">Price Range</h4>
                  <div className="space-y-2">
                    <Input placeholder="Min price" type="number" className="focus:ring-2 focus:ring-blue-500" />
                    <Input placeholder="Max price" type="number" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                </motion.div>

                <Button
                  variant="hero"
                  className="w-full mt-4 bg-gradient-ocean hover:opacity-90 hover:scale-105 transition-transform duration-300"
                >
                  Apply Filters
                </Button>
              </Card>
            </motion.div>

            {/* Hotel Results */}
            <div className="flex-1">
              <motion.div
                className="flex items-center justify-between mb-6"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Available Hotels</h2>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-500">Sort by:</span>
                  <Button
                    variant={sortBy === "price" ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("price")}
                    className="hover:bg-blue-50 hover:scale-105 transition-transform duration-300"
                  >
                    Price
                  </Button>
                  <Button
                    variant={sortBy === "rating" ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("rating")}
                    className="hover:bg-blue-50 hover:scale-105 transition-transform duration-300"
                  >
                    Rating
                  </Button>
                  <Button
                    variant={sortBy === "safety" ? "hero" : "outline"}
                    size="sm"
                    onClick={() => setSortBy("safety")}
                    className="hover:bg-blue-50 hover:scale-105 transition-transform duration-300"
                  >
                    Safety
                  </Button>
                </div>
              </motion.div>

              <AnimatePresence>
                {sortedResults.length > 0 ? (
                  <div className="space-y-6">
                    {sortedResults.map((hotel, index) => renderHotelCard(hotel, index))}
                  </div>
                ) : (
                  <motion.div
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Building className="w-16 h-16 text-gray-400 mx-auto mb-4 animate-float" />
                    <p className="text-gray-500">No hotels found matching your criteria</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Hotels;