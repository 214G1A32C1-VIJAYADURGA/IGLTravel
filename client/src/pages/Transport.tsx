 {/*import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Bike,
  Clock, 
  DollarSign, 
  Shield,
  Wifi,
  Coffee,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Users,
  Star,
  Armchair,
  Luggage,
  AlertCircle
} from "lucide-react";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { toast } from "@/components/ui/sonner";

// Define TypeScript interfaces for data structures
interface Departure {
  time: string;
  airport?: string;
  station?: string;
  pickup?: string;
  delay?: number;
  terminal?: string;
  platform?: string;
}

interface Arrival {
  time: string;
  airport?: string;
  station?: string;
  dropoff?: string;
  delay?: number;
  terminal?: string;
  platform?: string;
}

interface Safety {
  rating: number;
  covid?: string;
  maskRequired?: boolean;
  cleanliness?: string;
  condition?: string;
  nightSafety?: string;
}

interface Seats {
  available: number;
  layout: string;
  windowAvailable: boolean;
}

interface OperatorDetails {
  verified: boolean;
  rating: number;
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  baggage: string;
  status: string;
  refundable: boolean;
  facilities: string[];
  safety: Safety;
  seats: Seats;
  highlights: string[];
}

interface Train {
  operator: string;
  trainNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  facilities: string[];
  seatType: string;
  refundable: boolean;
  safety: Safety;
  operatorDetails: OperatorDetails;
  highlights: string[];
}

interface Bus {
  operator: string;
  busNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  facilities: string[];
  seatType: string;
  refundable: boolean;
  safety: Safety;
  operatorDetails: OperatorDetails;
  highlights: string[];
}

interface TransportType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
}

const Transport: React.FC = () => {
  const [selectedTransport, setSelectedTransport] = useState<string>("flights");
  const [searchFrom, setSearchFrom] = useState<string>("");
  const [searchTo, setSearchTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price");
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check authentication status
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
      if (!user) {
        toast.error("Please sign in to access the Transport page", {
          description: "Redirecting to home page...",
          action: {
            label: "Sign In",
            onClick: () => window.location.href = "/signin",
          },
        });
      }
    });
    return () => unsubscribe();
  }, []);

  const transportTypes: TransportType[] = [
    { id: "flights", label: "Flights", icon: Plane, bg: "bg-blue-100" },
    { id: "trains", label: "Trains", icon: Train, bg: "bg-green-100" },
    { id: "buses", label: "Buses", icon: Bus, bg: "bg-purple-100" },
    { id: "taxis", label: "Taxis", icon: Car, bg: "bg-yellow-100" },
    { id: "bikes", label: "Bike Rentals", icon: Bike, bg: "bg-orange-100" }
  ];

  const flightResults: Flight[] = [
    {
      airline: "ANA Airways",
      flightNumber: "NH 123",
      departure: { time: "09:15", airport: "NRT", delay: 0, terminal: "T1" },
      arrival: { time: "11:45", airport: "KIX", delay: 15, terminal: "T2" },
      price: 289,
      duration: "2h 30m",
      class: "Economy",
      baggage: "23kg checked + 7kg cabin",
      status: "On Time",
      refundable: true,
      facilities: ["Wifi", "Entertainment", "Meals"],
      safety: { rating: 4.8, covid: "Compliant", maskRequired: true },
      seats: { available: 24, layout: "3-3", windowAvailable: true },
      highlights: ["Cheapest"]
    },
    {
      airline: "JAL Express",
      flightNumber: "JL 456",
      departure: { time: "14:20", airport: "NRT", delay: 0, terminal: "T1" },
      arrival: { time: "16:55", airport: "KIX", delay: 0, terminal: "T2" },
      price: 325,
      duration: "2h 35m",
      class: "Economy",
      baggage: "20kg checked + 7kg cabin",
      status: "Boarding",
      refundable: false,
      facilities: ["Wifi", "Entertainment"],
      safety: { rating: 4.9, covid: "Enhanced Safety", maskRequired: false },
      seats: { available: 12, layout: "3-3", windowAvailable: false },
      highlights: ["Safest", "Fastest"]
    }
  ];

  const trainResults: Train[] = [
    {
      operator: "JR Central",
      trainNumber: "Shinkansen 701",
      departure: { time: "08:30", station: "Tokyo", platform: "14" },
      arrival: { time: "11:45", station: "Osaka", platform: "23" },
      price: 160,
      duration: "3h 15m",
      class: "Reserved",
      facilities: ["AC", "Charging Ports", "Wifi", "Food Service"],
      seatType: "Window seat available",
      refundable: true,
      safety: { rating: 4.9, cleanliness: "Excellent", condition: "New" },
      operatorDetails: { verified: true, rating: 4.8 },
      highlights: ["Cheapest", "Safest"]
    }
  ];

  const busResults: Bus[] = [
    {
      operator: "Willer Express",
      busNumber: "WX 301",
      departure: { time: "07:00", station: "Tokyo Station", pickup: "Yaesu Exit" },
      arrival: { time: "15:30", station: "Osaka Umeda", dropoff: "Main Terminal" },
      price: 85,
      duration: "8h 30m",
      class: "Standard",
      facilities: ["AC", "Wifi", "Reclining Seats"],
      seatType: "Aisle seat available",
      refundable: true,
      safety: { rating: 4.5, cleanliness: "Good", nightSafety: "High" },
      operatorDetails: { verified: true, rating: 4.6 },
      highlights: ["Cheapest"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const sortResults = <T extends { price: number; duration: string; safety: { rating: number } }>(results: T[] = []): T[] => {
    return [...results].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") {
        const timeA = parseInt(a.duration.split("h")[0]) * 60 + parseInt(a.duration.split("m")[0].split("h")[1] || "0");
        const timeB = parseInt(b.duration.split("h")[0]) * 60 + parseInt(b.duration.split("m")[0].split("h")[1] || "0");
        return timeA - timeB;
      }
      if (sortBy === "safety") return b.safety.rating - a.safety.rating;
      return 0;
    });
  };

  const renderFlightCard = (flight: Flight, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={flight.flightNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Plane className="w-6 h-6 mr-2 text-blue-600" />
              <span className="font-bold text-xl">{flight.airline}</span>
              <Badge variant="outline" className="border-blue-200">{flight.flightNumber}</Badge>
              <Badge 
                variant={flight.status === "On Time" ? "default" : "destructive"} 
                className="ml-2"
              >
                {flight.status}
              </Badge>
              {flight.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-blue-100 text-blue-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{flight.departure.time}</div>
                <div className="text-sm text-gray-500">{flight.departure.airport} - Terminal {flight.departure.terminal}</div>
                {flight.departure.delay > 0 && (
                  <div className="text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    +{flight.departure.delay}min delay
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{flight.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-blue-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Plane className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-blue-600" />
                </div>
                <div className="text-xs text-gray-500 mt-1">Direct</div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{flight.arrival.time}</div>
                <div className="text-sm text-gray-500">{flight.arrival.airport} - Terminal {flight.arrival.terminal}</div>
                {flight.arrival.delay > 0 && (
                  <div className="text-xs text-red-500 flex items-center justify-end">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    +{flight.arrival.delay}min delay
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Flight Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {flight.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Luggage className="w-4 h-4 mr-2" /> Baggage: {flight.baggage}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> Seats: {flight.seats.available} available ({flight.seats.layout})
                </div>
                <div className="flex items-center text-gray-600">
                  {flight.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {flight.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Entertainment" && <Coffee className="w-3 h-3 mr-1" />}
                      {facility === "Meals" && <Coffee className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {flight.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {flight.safety.covid} {flight.safety.maskRequired && "(Mask Required)"}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-blue-600">${flight.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-blue-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  const renderTrainCard = (train: Train, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={train.trainNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Train className="w-6 h-6 mr-2 text-green-600" />
              <span className="font-bold text-xl">{train.operator}</span>
              <Badge variant="outline" className="border-green-200">{train.trainNumber}</Badge>
              {train.operatorDetails.verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              {train.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-green-100 text-green-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{train.departure.time}</div>
                <div className="text-sm text-gray-500">{train.departure.station}</div>
                <div className="text-xs text-gray-500">Platform {train.departure.platform}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{train.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-green-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Train className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-green-600" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{train.arrival.time}</div>
                <div className="text-sm text-gray-500">{train.arrival.station}</div>
                <div className="text-xs text-gray-500">Platform {train.arrival.platform}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Train Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {train.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> {train.seatType}
                </div>
                <div className="flex items-center text-gray-600">
                  {train.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {train.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-green-50 text-green-700">
                      {facility === "AC" && <Zap className="w-3 h-3 mr-1" />}
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Charging Ports" && <Zap className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {train.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  Condition: {train.safety.condition}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-green-600">${train.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-green-600 hover:bg-green-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-green-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  const renderBusCard = (bus: Bus, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={bus.busNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Bus className="w-6 h-6 mr-2 text-purple-600" />
              <span className="font-bold text-xl">{bus.operator}</span>
              <Badge variant="outline" className="border-purple-200">{bus.busNumber}</Badge>
              {bus.operatorDetails.verified && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              {bus.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-purple-100 text-purple-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{bus.departure.time}</div>
                <div className="text-sm text-gray-500">{bus.departure.station}</div>
                <div className="text-xs text-gray-500">Pickup: {bus.departure.pickup}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{bus.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-purple-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Bus className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-purple-600" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{bus.arrival.time}</div>
                <div className="text-sm text-gray-500">{bus.arrival.station}</div>
                <div className="text-xs text-gray-500">Dropoff: {bus.arrival.dropoff}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Bus Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {bus.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> {bus.seatType}
                </div>
                <div className="flex items-center text-gray-600">
                  {bus.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {bus.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      {facility === "AC" && <Zap className="w-3 h-3 mr-1" />}
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Reclining Seats" && <Armchair className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {bus.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  Night Safety: {bus.safety.nightSafety}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-purple-600">${bus.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-purple-600 hover:bg-purple-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-purple-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

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
        //Header with Background Image 
        <div
          className="relative bg-cover bg-center py-16"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Find Your Perfect Journey
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Compare flights, trains, buses and more with real-time data
            </motion.p>
            
            // Search Form 
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/95 backdrop-blur-lg shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                    <Input 
                      placeholder="Departure city" 
                      value={searchFrom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFrom(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                    <Input 
                      placeholder="Destination city"
                      value={searchTo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTo(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Departure</label>
                    <Input type="date" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Passengers</label>
                    <Select onValueChange={(value: string) => setPassengerCount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="1 Adult" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4 Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Search Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        // Transport Tabs 
        <div className="container mx-auto px-4 py-12">
          <Tabs value={selectedTransport} onValueChange={setSelectedTransport}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8 h-[50px]">
              {transportTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id} 
                  className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-50"
                >
                  <type.icon className="w-5 h-5 mr-2" />
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-8">
              // Filter Bar 
              <motion.div 
                className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <Button 
                    variant={sortBy === "price" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("price")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Price
                  </Button>
                  <Button 
                    variant={sortBy === "duration" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("duration")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Duration
                  </Button>
                  <Button 
                    variant={sortBy === "safety" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("safety")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Safety
                  </Button>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <RefreshCw className="w-4 h-4 text-gray-500 animate-[spin_3s_linear_infinite]" />
                  <span className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>

              <AnimatePresence>
                <TabsContent value="flights" className="space-y-6">
                  {sortResults(flightResults).map((flight, index) => renderFlightCard(flight, index))}
                </TabsContent>

                <TabsContent value="trains" className="space-y-6">
                  {sortResults(trainResults).map((train, index) => renderTrainCard(train, index))}
                </TabsContent>

                <TabsContent value="buses" className="space-y-6">
                  {sortResults(busResults).map((bus, index) => renderBusCard(bus, index))}
                </TabsContent>

                <TabsContent value="taxis" className="space-y-6">
                  <motion.div 
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Taxi booking coming soon</p>
                  </motion.div>
                </TabsContent>

                <TabsContent value="bikes" className="space-y-6">
                  <motion.div 
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Bike rentals coming soon</p>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Transport;*/}


import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { 
  Plane, 
  Train, 
  Bus, 
  Car, 
  Bike,
  Clock, 
  DollarSign, 
  Shield,
  Wifi,
  Coffee,
  Zap,
  AlertTriangle,
  CheckCircle,
  RefreshCw,
  MapPin,
  Users,
  Star,
  Armchair,
  Luggage,
  AlertCircle
} from "lucide-react";

// Define TypeScript interfaces for data structures
interface Departure {
  time: string;
  airport?: string;
  station?: string;
  pickup?: string;
  delay?: number;
  terminal?: string;
  platform?: string;
}

interface Arrival {
  time: string;
  airport?: string;
  station?: string;
  dropoff?: string;
  delay?: number;
  terminal?: string;
  platform?: string;
}

interface Safety {
  rating: number;
  covid?: string;
  maskRequired?: boolean;
  cleanliness?: string;
  condition?: string;
  nightSafety?: string;
}

interface Seats {
  available: number;
  layout: string;
  windowAvailable: boolean;
}

interface OperatorDetails {
  verified: boolean;
  rating: number;
}

interface Flight {
  airline: string;
  flightNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  baggage: string;
  status: string;
  refundable: boolean;
  facilities: string[];
  safety: Safety;
  seats: Seats;
  highlights: string[];
}

interface Train {
  operator: string;
  trainNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  facilities: string[];
  seatType: string;
  refundable: boolean;
  safety: Safety;
  operatorDetails: OperatorDetails;
  highlights: string[];
}

interface Bus {
  operator: string;
  busNumber: string;
  departure: Departure;
  arrival: Arrival;
  price: number;
  duration: string;
  class: string;
  facilities: string[];
  seatType: string;
  refundable: boolean;
  safety: Safety;
  operatorDetails: OperatorDetails;
  highlights: string[];
}

interface TransportType {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  bg: string;
}

const Transport: React.FC = () => {
  const [selectedTransport, setSelectedTransport] = useState<string>("flights");
  const [searchFrom, setSearchFrom] = useState<string>("");
  const [searchTo, setSearchTo] = useState<string>("");
  const [sortBy, setSortBy] = useState<string>("price");
  const [passengerCount, setPassengerCount] = useState<number>(1);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());

  const transportTypes: TransportType[] = [
    { id: "flights", label: "Flights", icon: Plane, bg: "bg-blue-100" },
    { id: "trains", label: "Trains", icon: Train, bg: "bg-green-100" },
    { id: "buses", label: "Buses", icon: Bus, bg: "bg-purple-100" },
    { id: "taxis", label: "Taxis", icon: Car, bg: "bg-yellow-100" },
    { id: "bikes", label: "Bike Rentals", icon: Bike, bg: "bg-orange-100" }
  ];

  const flightResults: Flight[] = [
    {
      airline: "ANA Airways",
      flightNumber: "NH 123",
      departure: { time: "09:15", airport: "NRT", delay: 0, terminal: "T1" },
      arrival: { time: "11:45", airport: "KIX", delay: 15, terminal: "T2" },
      price: 289,
      duration: "2h 30m",
      class: "Economy",
      baggage: "23kg checked + 7kg cabin",
      status: "On Time",
      refundable: true,
      facilities: ["Wifi", "Entertainment", "Meals"],
      safety: { rating: 4.8, covid: "Compliant", maskRequired: true },
      seats: { available: 24, layout: "3-3", windowAvailable: true },
      highlights: ["Cheapest"]
    },
    {
      airline: "JAL Express",
      flightNumber: "JL 456",
      departure: { time: "14:20", airport: "NRT", delay: 0, terminal: "T1" },
      arrival: { time: "16:55", airport: "KIX", delay: 0, terminal: "T2" },
      price: 325,
      duration: "2h 35m",
      class: "Economy",
      baggage: "20kg checked + 7kg cabin",
      status: "Boarding",
      refundable: false,
      facilities: ["Wifi", "Entertainment"],
      safety: { rating: 4.9, covid: "Enhanced Safety", maskRequired: false },
      seats: { available: 12, layout: "3-3", windowAvailable: false },
      highlights: ["Safest", "Fastest"]
    }
  ];

  const trainResults: Train[] = [
    {
      operator: "JR Central",
      trainNumber: "Shinkansen 701",
      departure: { time: "08:30", station: "Tokyo", platform: "14" },
      arrival: { time: "11:45", station: "Osaka", platform: "23" },
      price: 160,
      duration: "3h 15m",
      class: "Reserved",
      facilities: ["AC", "Charging Ports", "Wifi", "Food Service"],
      seatType: "Window seat available",
      refundable: true,
      safety: { rating: 4.9, cleanliness: "Excellent", condition: "New" },
      operatorDetails: { verified: true, rating: 4.8 },
      highlights: ["Cheapest", "Safest"]
    }
  ];

  const busResults: Bus[] = [
    {
      operator: "Willer Express",
      busNumber: "WX 301",
      departure: { time: "07:00", station: "Tokyo Station", pickup: "Yaesu Exit" },
      arrival: { time: "15:30", station: "Osaka Umeda", dropoff: "Main Terminal" },
      price: 85,
      duration: "8h 30m",
      class: "Standard",
      facilities: ["AC", "Wifi", "Reclining Seats"],
      seatType: "Aisle seat available",
      refundable: true,
      safety: { rating: 4.5, cleanliness: "Good", nightSafety: "High" },
      operatorDetails: { verified: true, rating: 4.6 },
      highlights: ["Cheapest"]
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 120000); // Update every 2 minutes
    return () => clearInterval(interval);
  }, []);

  const sortResults = <T extends { price: number; duration: string; safety: { rating: number } }>(results: T[] = []): T[] => {
    return [...results].sort((a, b) => {
      if (sortBy === "price") return a.price - b.price;
      if (sortBy === "duration") {
        const timeA = parseInt(a.duration.split("h")[0]) * 60 + parseInt(a.duration.split("m")[0].split("h")[1] || "0");
        const timeB = parseInt(b.duration.split("h")[0]) * 60 + parseInt(b.duration.split("m")[0].split("h")[1] || "0");
        return timeA - timeB;
      }
      if (sortBy === "safety") return b.safety.rating - a.safety.rating;
      return 0;
    });
  };

  const renderFlightCard = (flight: Flight, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={flight.flightNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Plane className="w-6 h-6 mr-2 text-blue-600" />
              <span className="font-bold text-xl">{flight.airline}</span>
              <Badge variant="outline" className="border-blue-200">{flight.flightNumber}</Badge>
              <Badge 
                variant={flight.status === "On Time" ? "default" : "destructive"} 
                className="ml-2"
              >
                {flight.status}
              </Badge>
              {flight.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-blue-100 text-blue-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{flight.departure.time}</div>
                <div className="text-sm text-gray-500">{flight.departure.airport} - Terminal {flight.departure.terminal}</div>
                {flight.departure.delay > 0 && (
                  <div className="text-xs text-red-500 flex items-center">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    +{flight.departure.delay}min delay
                  </div>
                )}
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{flight.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-blue-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Plane className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-blue-600" />
                </div>
                <div className="text-xs text-gray-500 mt-1">Direct</div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{flight.arrival.time}</div>
                <div className="text-sm text-gray-500">{flight.arrival.airport} - Terminal {flight.arrival.terminal}</div>
                {flight.arrival.delay > 0 && (
                  <div className="text-xs text-red-500 flex items-center justify-end">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    +{flight.arrival.delay}min delay
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Flight Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {flight.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Luggage className="w-4 h-4 mr-2" /> Baggage: {flight.baggage}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> Seats: {flight.seats.available} available ({flight.seats.layout})
                </div>
                <div className="flex items-center text-gray-600">
                  {flight.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {flight.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-blue-50 text-blue-700">
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Entertainment" && <Coffee className="w-3 h-3 mr-1" />}
                      {facility === "Meals" && <Coffee className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {flight.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {flight.safety.covid} {flight.safety.maskRequired && "(Mask Required)"}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-blue-600">${flight.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-blue-600 hover:bg-blue-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-blue-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  const renderTrainCard = (train: Train, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={train.trainNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Train className="w-6 h-6 mr-2 text-green-600" />
              <span className="font-bold text-xl">{train.operator}</span>
              <Badge variant="outline" className="border-green-200">{train.trainNumber}</Badge>
              {train.operatorDetails.verified && (
                <Badge variant="secondary" className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              {train.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-green-100 text-green-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{train.departure.time}</div>
                <div className="text-sm text-gray-500">{train.departure.station}</div>
                <div className="text-xs text-gray-500">Platform {train.departure.platform}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{train.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-green-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Train className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-green-600" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{train.arrival.time}</div>
                <div className="text-sm text-gray-500">{train.arrival.station}</div>
                <div className="text-xs text-gray-500">Platform {train.arrival.platform}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Train Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {train.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> {train.seatType}
                </div>
                <div className="flex items-center text-gray-600">
                  {train.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {train.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-green-50 text-green-700">
                      {facility === "AC" && <Zap className="w-3 h-3 mr-1" />}
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Charging Ports" && <Zap className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {train.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  Condition: {train.safety.condition}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-green-600">${train.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-green-600 hover:bg-green-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-green-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  const renderBusCard = (bus: Bus, index: number) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      key={bus.busNumber}
    >
      <Card className="p-6 hover:shadow-2xl transition-all duration-300 bg-white/90 backdrop-blur-sm border border-gray-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-start gap-4">
          <div className="flex-1">
            <div className="flex items-center mb-3 flex-wrap gap-2">
              <Bus className="w-6 h-6 mr-2 text-purple-600" />
              <span className="font-bold text-xl">{bus.operator}</span>
              <Badge variant="outline" className="border-purple-200">{bus.busNumber}</Badge>
              {bus.operatorDetails.verified && (
                <Badge variant="secondary" className="bg-purple-100 text-purple-800">
                  <CheckCircle className="w-3 h-3 mr-1" /> Verified
                </Badge>
              )}
              {bus.highlights.map((highlight) => (
                <Badge key={highlight} variant="secondary" className="bg-purple-100 text-purple-800">
                  {highlight}
                </Badge>
              ))}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <div className="text-2xl font-bold text-gray-800">{bus.departure.time}</div>
                <div className="text-sm text-gray-500">{bus.departure.station}</div>
                <div className="text-xs text-gray-500">Pickup: {bus.departure.pickup}</div>
              </div>
              
              <div className="text-center">
                <div className="text-sm text-gray-500 mb-1">{bus.duration}</div>
                <div className="w-full h-0.5 bg-gray-200 relative">
                  <motion.div 
                    className="absolute h-0.5 bg-purple-500" 
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: 1.5, ease: "easeInOut" }}
                  />
                  <Bus className="w-4 h-4 absolute -top-2 left-1/2 transform -translate-x-1/2 text-purple-600" />
                </div>
              </div>
              
              <div className="text-right">
                <div className="text-2xl font-bold text-gray-800">{bus.arrival.time}</div>
                <div className="text-sm text-gray-500">{bus.arrival.station}</div>
                <div className="text-xs text-gray-500">Dropoff: {bus.arrival.dropoff}</div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
              <div>
                <div className="font-semibold mb-2 text-gray-700">Bus Details</div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Armchair className="w-4 h-4 mr-2" /> Class: {bus.class}
                </div>
                <div className="text-gray-600 flex items-center mb-1">
                  <Users className="w-4 h-4 mr-2" /> {bus.seatType}
                </div>
                <div className="flex items-center text-gray-600">
                  {bus.refundable ? (
                    <><CheckCircle className="w-4 h-4 mr-2 text-green-500" /> Refundable</>
                  ) : (
                    <><AlertTriangle className="w-4 h-4 mr-2 text-red-500" /> Non-refundable</>
                  )}
                </div>
              </div>
              
              <div>
                <div className="font-semibold mb-2 text-gray-700">Facilities & Safety</div>
                <div className="flex flex-wrap gap-2 mb-2">
                  {bus.facilities.map((facility) => (
                    <Badge key={facility} variant="secondary" className="text-xs bg-purple-50 text-purple-700">
                      {facility === "AC" && <Zap className="w-3 h-3 mr-1" />}
                      {facility === "Wifi" && <Wifi className="w-3 h-3 mr-1" />}
                      {facility === "Reclining Seats" && <Armchair className="w-3 h-3 mr-1" />}
                      {facility}
                    </Badge>
                  ))}
                </div>
                <div className="flex items-center text-gray-600 mb-1">
                  <Shield className="w-4 h-4 mr-2" />
                  Safety: {bus.safety.rating}/5
                </div>
                <div className="flex items-center text-gray-600">
                  <Star className="w-4 h-4 mr-2" />
                  Night Safety: {bus.safety.nightSafety}
                </div>
              </div>
            </div>
          </div>
          
          <motion.div 
            className="w-full md:w-auto text-right"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="text-3xl font-bold text-purple-600">${bus.price}</div>
            <div className="text-sm text-gray-500 mb-4">per person</div>
            <Button variant="default" className="w-full mb-2 bg-purple-600 hover:bg-purple-700">
              Book Now
            </Button>
            <Button variant="outline" size="sm" className="w-full hover:bg-purple-200 hover:text-black">
              View Details
            </Button>
          </motion.div>
        </div>
      </Card>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        {/* Header with Background Image */}
        <div
          className="relative bg-cover bg-center py-16"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')"
          }}
        >
          <div className="absolute inset-0 bg-black/50" />
          <div className="container mx-auto px-4 relative z-10">
            <motion.h1 
              className="text-5xl font-bold text-white mb-4"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              Find Your Perfect Journey
            </motion.h1>
            <motion.p 
              className="text-xl text-white/90 mb-8"
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Compare flights, trains, buses and more with real-time data
            </motion.p>
            
            {/* Search Form */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Card className="p-6 bg-white/95 backdrop-blur-lg shadow-xl">
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">From</label>
                    <Input 
                      placeholder="Departure city" 
                      value={searchFrom}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchFrom(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">To</label>
                    <Input 
                      placeholder="Destination city"
                      value={searchTo}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchTo(e.target.value)}
                      className="focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Departure</label>
                    <Input type="date" className="focus:ring-2 focus:ring-blue-500" />
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700 mb-2 block">Passengers</label>
                    <Select onValueChange={(value: string) => setPassengerCount(parseInt(value))}>
                      <SelectTrigger>
                        <SelectValue placeholder="1 Adult" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1">1 Adult</SelectItem>
                        <SelectItem value="2">2 Adults</SelectItem>
                        <SelectItem value="3">3 Adults</SelectItem>
                        <SelectItem value="4">4 Adults</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button 
                      variant="default" 
                      size="lg" 
                      className="w-full bg-blue-600 hover:bg-blue-700"
                    >
                      Search Now
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>
        </div>

        {/* Transport Tabs */}
        <div className="container mx-auto px-4 py-12">
          <Tabs value={selectedTransport} onValueChange={setSelectedTransport}>
            <TabsList className="grid grid-cols-2 md:grid-cols-5 gap-2 mb-8 h-[50px]">
              {transportTypes.map((type) => (
                <TabsTrigger 
                  key={type.id} 
                  value={type.id} 
                  className="flex items-center py-3 px-4 rounded-lg transition-all duration-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white hover:bg-blue-50"
                >
                  <type.icon className="w-5 h-5 mr-2" />
                  {type.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <div className="mt-8">
              {/* Filter Bar */}
              <motion.div 
                className="flex items-center gap-4 mb-8 p-4 bg-white rounded-lg shadow-md"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Sort by:</span>
                  <Button 
                    variant={sortBy === "price" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("price")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Price
                  </Button>
                  <Button 
                    variant={sortBy === "duration" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("duration")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Duration
                  </Button>
                  <Button 
                    variant={sortBy === "safety" ? "default" : "outline"} 
                    size="sm" 
                    onClick={() => setSortBy("safety")}
                    className="hover:bg-blue-200 hover:text-black"
                  >
                    Safety
                  </Button>
                </div>
                <div className="flex items-center gap-2 ml-auto">
                  <RefreshCw className="w-4 h-4 text-gray-500 animate-[spin_3s_linear_infinite]" />
                  <span className="text-sm text-gray-500">
                    Last updated: {lastUpdated.toLocaleTimeString()}
                  </span>
                </div>
              </motion.div>

              <AnimatePresence>
                <TabsContent value="flights" className="space-y-6">
                  {sortResults(flightResults).map((flight, index) => renderFlightCard(flight, index))}
                </TabsContent>

                <TabsContent value="trains" className="space-y-6">
                  {sortResults(trainResults).map((train, index) => renderTrainCard(train, index))}
                </TabsContent>

                <TabsContent value="buses" className="space-y-6">
                  {sortResults(busResults).map((bus, index) => renderBusCard(bus, index))}
                </TabsContent>

                <TabsContent value="taxis" className="space-y-6">
                  <motion.div 
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Car className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Taxi booking coming soon</p>
                  </motion.div>
                </TabsContent>

                <TabsContent value="bikes" className="space-y-6">
                  <motion.div 
                    className="text-center py-12 bg-white rounded-lg shadow-md"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Bike className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <p className="text-gray-500">Bike rentals coming soon</p>
                  </motion.div>
                </TabsContent>
              </AnimatePresence>
            </div>
          </Tabs>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Transport;