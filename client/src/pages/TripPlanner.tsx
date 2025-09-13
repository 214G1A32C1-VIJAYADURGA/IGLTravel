import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import SafetyDashboard from "@/components/SafetyDashboard";
import Footer from "@/components/Footer";
import { Navigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { 
  Plus, 
  MapPin, 
  Clock, 
  DollarSign, 
  Users, 
  Calendar,
  Bot,
  Map,
  List,
  Share,
  Settings,
  Shield,
  Plane,
  Building
} from "lucide-react";

interface City {
  id: number;
  name: string;
  country: string;
}

interface Activity {
  time: string;
  title: string;
  type: string;
  duration: string;
  cost: string;
  description: string;
  image: string;
}

interface TripDay {
  day: number;
  date: string;
  activities: number;
}

interface TripPlan {
  destination: string;
  duration: number;
  budget: string;
  travelers: number;
  interests: string[];
}

interface ItineraryResponse {
  best_time_to_visit: string;
  overall_highlights: { place: string; categories: string[] }[];
  days: {
    day: number;
    activities: {
      time: string;
      activity: string;
      location: string;
      description: string;
      category: string;
    }[];
  }[];
}

const TripPlanner = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [viewMode, setViewMode] = useState<"itinerary" | "map">("itinerary");
  const [activeTab, setActiveTab] = useState("itinerary");
  const [cities, setCities] = useState<City[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: "",
    duration: 1,
    budget: "Medium",
    travelers: 1,
    interests: [],
  });
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [dayActivities, setDayActivities] = useState<{ [key: number]: Activity[] }>({});
  const [aiSuggestions, setAiSuggestions] = useState<Activity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bestTimeToVisit, setBestTimeToVisit] = useState<string>("");
  const [highlights, setHighlights] = useState<{ place: string; categories: string[] }[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  // Mock GeoDB API response since provided URL is invalid
  const mockCities = [
    { id: 1, name: "Paris", country: "France" },
    { id: 2, name: "Tokyo", country: "Japan" },
    { id: 3, name: "Hyderabad", country: "India" },
  ];

  // Check authentication status
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setIsAuthenticated(!!user);
      setIsLoading(false);
    });
    return () => unsubscribe();
  }, []);

  // Fetch city suggestions (mocked for now due to invalid GeoDB URL)
  useEffect(() => {
    if (tripPlan.destination && tripPlan.destination.length >= 3) {
      setCities(
        mockCities.filter((city) =>
          city.name.toLowerCase().includes(tripPlan.destination.toLowerCase())
        )
      );
    } else {
      setCities([]);
    }
  }, [tripPlan.destination]);

  // Fetch itinerary from Gemini API
  const fetchItinerary = async () => {
    if (!GEMINI_API_KEY) {
      setError("Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env.");
      return;
    }
    if (!tripPlan.destination || tripPlan.duration < 1 || !tripPlan.interests.length) {
      setError("Please fill in all fields: destination, duration, and interests.");
      return;
    }

    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `
      Create a detailed day-wise itinerary for a ${tripPlan.duration}-day trip to ${tripPlan.destination}.
      The traveler prefers ${tripPlan.interests.join(", ")} activities.

      Before the itinerary, include:
      - 'best_time_to_visit': best months/seasons with a short reason
      - 'overall_highlights': a list of key places to visit in ${tripPlan.destination} with the categories they belong to

      Then, for each day, provide a full-day travel plan from morning (~8 AM) to evening (~9 PM), including:
      - 4–6 activities with: 'time', 'activity', 'location', 'description', and 'category'

      Return in JSON format like:
      {
        "best_time_to_visit": "...",
        "overall_highlights": [{"place": "...", "categories": ["..."]}, ...],
        "days": [
          {
            "day": 1,
            "activities": [
              {
                "time": "...",
                "activity": "...",
                "location": "...",
                "description": "...",
                "category": "..."
              },
              ...
            ]
          },
          ...
        ]
      }
    `;
    const data = {
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { response_mime_type: "application/json" },
    };

    try {
      setError(null);
      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const result = await response.json();
      const itineraryText = result.candidates?.[0]?.content?.parts?.[0]?.text;
      if (!itineraryText) throw new Error("Invalid response from Gemini API.");

      const itinerary: ItineraryResponse = JSON.parse(itineraryText);

      // Set best time to visit and highlights
      setBestTimeToVisit(itinerary.best_time_to_visit || "");
      setHighlights(itinerary.overall_highlights || []);

      // Generate trip days
      const newTripDays: TripDay[] = [];
      const startDate = new Date();
      for (let i = 1; i <= tripPlan.duration; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i - 1);
        newTripDays.push({
          day: i,
          date: date.toLocaleDateString("en-US", { month: "long", day: "numeric" }),
          activities: itinerary.days.find((d) => d.day === i)?.activities.length || 0,
        });
      }
      setTripDays(newTripDays);

      // Fetch images for activities and map to Activity type
      const newDayActivities: { [key: number]: Activity[] } = {};
      for (const day of itinerary.days) {
        const activitiesWithImages = await Promise.all(
          day.activities.map(async (act) => {
            const imgQuery = `${act.location} ${act.activity}`;
            const image = await fetchUnsplashImage(imgQuery);
            return {
              time: act.time,
              title: act.activity,
              type: act.category,
              duration: "2 hours", // Placeholder; Gemini API doesn't provide duration
              cost: tripPlan.budget === "Low" ? "$" : tripPlan.budget === "Medium" ? "$$" : "$$$",
              description: act.description,
              image: image || "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=600",
            };
          })
        );
        newDayActivities[day.day] = activitiesWithImages;
      }
      setDayActivities(newDayActivities);

      // Generate AI suggestions (subset of activities or additional Gemini call if needed)
      const suggestions = await Promise.all(
        itinerary.days[0].activities.slice(0, 3).map(async (act) => {
          const imgQuery = `${act.location} ${act.activity}`;
          const image = await fetchUnsplashImage(imgQuery);
          return {
            time: act.time,
            title: act.activity,
            type: act.category,
            duration: "2 hours",
            cost: tripPlan.budget === "Low" ? "$" : tripPlan.budget === "Medium" ? "$$" : "$$$",
            description: act.description,
            image: image || "https://images.pexels.com/photos/161147/pexels-photo-161147.jpeg?auto=compress&cs=tinysrgb&w=600",
          };
        })
      );
      setAiSuggestions(suggestions);
    } catch (err) {
      setError(`Failed to generate itinerary: ${(err as Error).message}`);
    }
  };

  // Fetch image from Unsplash API
  const fetchUnsplashImage = async (query: string): Promise<string | null> => {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("Unsplash API key not found.");
      return null;
    }
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      return data.results?.[0]?.urls?.regular || null;
    } catch (err) {
      console.warn(`Unsplash error for query '${query}': ${(err as Error).message}`);
      return null;
    }
  };

  // Handle form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormOpen(false);
    await fetchItinerary();
  };

  // Update itinerary when tripPlan changes
  useEffect(() => {
    if (tripPlan.destination && tripPlan.duration > 0 && tripPlan.interests.length > 0) {
      fetchItinerary();
    }
  }, [tripPlan]);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Header Section */}
      <div
        className="relative bg-cover bg-center py-12 sm:py-16 animate-pulse-slow"
        style={{
          backgroundImage:
            "url('https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg?auto=compress&cs=tinysrgb&w=1920')"
        }}
      >
        <div className="absolute inset-0 bg-gradient-ocean/50" />
        <div className="container mx-auto px-4 pt-16 relative z-10">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white mb-4">
            Plan Your {tripPlan.destination || "Trip"} Adventure
          </h1>
          <p className="text-lg sm:text-xl text-white/90 max-w-2xl">
            Create a seamless itinerary with AI-powered suggestions and safety insights
          </p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button variant="hero" className="mt-4 bg-gradient-ocean text-white">
                Plan Your Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Plan Your Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="destination">Destination</Label>
                  <Input
                    id="destination"
                    value={tripPlan.destination}
                    onChange={(e) => setTripPlan({ ...tripPlan, destination: e.target.value })}
                    placeholder="Enter city name"
                    list="cities"
                  />
                  <datalist id="cities">
                    {cities.map((city) => (
                      <option key={city.id} value={`${city.name}, ${city.country}`} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="duration">Trip Duration (days)</Label>
                  <Input
                    id="duration"
                    type="number"
                    min="1"
                    value={tripPlan.duration}
                    onChange={(e) => setTripPlan({ ...tripPlan, duration: parseInt(e.target.value) })}
                    placeholder="Enter number of days"
                  />
                </div>
                <div>
                  <Label htmlFor="budget">Budget</Label>
                  <Select
                    value={tripPlan.budget}
                    onValueChange={(value) => setTripPlan({ ...tripPlan, budget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low ($)</SelectItem>
                      <SelectItem value="Medium">Medium ($$)</SelectItem>
                      <SelectItem value="High">High ($$$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="travelers">Number of Travelers</Label>
                  <Input
                    id="travelers"
                    type="number"
                    min="1"
                    value={tripPlan.travelers}
                    onChange={(e) => setTripPlan({ ...tripPlan, travelers: parseInt(e.target.value) })}
                    placeholder="Enter number of travelers"
                  />
                </div>
                <div>
                  <Label htmlFor="interests">Interests</Label>
                  <Select
                    onValueChange={(value) => setTripPlan({
                      ...tripPlan,
                      interests: tripPlan.interests.includes(value)
                        ? tripPlan.interests.filter((i) => i !== value)
                        : [...tripPlan.interests, value]
                    })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select interests" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Adventure">Adventure</SelectItem>
                      <SelectItem value="History">History</SelectItem>
                      <SelectItem value="Culture">Culture</SelectItem>
                      <SelectItem value="Food">Food</SelectItem>
                      <SelectItem value="Nature">Nature</SelectItem>
                      <SelectItem value="Relaxation">Relaxation</SelectItem>
                      <SelectItem value="Shopping">Shopping</SelectItem>
                      <SelectItem value="Architecture">Architecture</SelectItem>
                      <SelectItem value="Technology">Technology</SelectItem>
                      <SelectItem value="Beaches">Beaches</SelectItem>
                      <SelectItem value="Temples">Temples</SelectItem>
                      <SelectItem value="Luxury">Luxury</SelectItem>
                      <SelectItem value="Desert">Desert</SelectItem>
                      <SelectItem value="Hiking">Hiking</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tripPlan.interests.map((interest) => (
                      <Badge key={interest} variant="secondary">
                        {interest}
                        <button
                          className="ml-1"
                          onClick={() =>
                            setTripPlan({
                              ...tripPlan,
                              interests: tripPlan.interests.filter((i) => i !== interest),
                            })
                          }
                        >
                          ×
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="w-full bg-gradient-ocean text-white">
                  Generate Itinerary
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        {bestTimeToVisit && (
          <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4">
            <strong>Best time to visit {tripPlan.destination}:</strong> {bestTimeToVisit}
          </div>
        )}
        {highlights.length > 0 && (
          <div className="mb-6">
            <h3 className="font-semibold text-foreground mb-3">🌟 Key Attractions & Their Categories</h3>
            <div className="flex flex-wrap gap-4">
              {highlights.map((place, index) => (
                <div key={index} className="bg-gray-100 p-3 rounded-lg">
                  <strong>{place.place}</strong> — {place.categories.join(", ")}
                </div>
              ))}
            </div>
          </div>
        )}
        <div className="flex flex-col md:flex-row gap-4 md:gap-8 min-h-[calc(100vh-12rem)]">
          {/* Sidebar - Trip Overview & Days */}
          <div className="w-full md:w-80 bg-card border border-border rounded-lg overflow-y-auto">
            <div className="p-4 sm:p-6">
              {/* Trip Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h1 className="text-xl sm:text-2xl font-bold text-foreground">
                    {tripPlan.destination || "Your Trip"} Adventure
                  </h1>
                  <Button variant="ghost" size="icon">
                    <Settings className="w-4 h-4" />
                  </Button>
                </div>
                <p className="text-muted-foreground text-sm">
                  {tripDays.length > 0
                    ? `${tripDays[0].date} - ${tripDays[tripDays.length - 1].date} • ${tripDays.length} days`
                    : "Plan your trip to see details"}
                </p>
                <div className="flex flex-wrap gap-4 mt-2 text-sm text-muted-foreground">
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {tripPlan.travelers} traveler{tripPlan.travelers !== 1 ? "s" : ""}
                  </div>
                  <div className="flex items-center">
                    <DollarSign className="w-4 h-4 mr-1" />
                    {tripPlan.budget} budget
                  </div>
                </div>
              </div>

              {/* Trip Days */}
              <div className="space-y-2 mb-6">
                <h3 className="font-semibold text-foreground mb-3">Trip Days</h3>
                {tripDays.map((day) => (
                  <button
                    key={day.day}
                    onClick={() => setSelectedDay(day.day)}
                    className={`w-full p-3 rounded-lg text-left transition-colors ${
                      selectedDay === day.day
                        ? "bg-primary text-primary-foreground"
                        : "bg-secondary"
                    }`}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium">Day {day.day}</div>
                        <div className="text-sm opacity-80">{day.date}</div>
                      </div>
                      <Badge variant="outline" className={selectedDay === day.day ? "border-primary-foreground text-primary-foreground" : ""}>
                        {day.activities} activities
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <Button variant="travel" size="sm" className="w-full bg-blue-100 text-blue-800">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Day
                </Button>
                <Button variant="outline" size="sm" className="w-full">
                  <Share className="w-4 h-4 mr-2" />
                  Collaborate
                </Button>
              </div>
            </div>
          </div>

          {/* Main Content Area */}
          <div className="flex-1 overflow-y-auto">
            {/* Top Bar */}
            <div className="border-b border-border p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex items-center space-x-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-foreground">
                    Day {selectedDay} - {tripDays.find(d => d.day === selectedDay)?.date || "Select a day"}
                  </h2>
                  <div className="flex items-center space-x-2">
                    <Button
                      variant={viewMode === "itinerary" ? "hero" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("itinerary")}
                      className={viewMode === "itinerary" ? "bg-gradient-ocean text-white" : ""}
                    >
                      <List className="w-4 h-4 mr-2" />
                      Itinerary
                    </Button>
                    <Button
                      variant={viewMode === "map" ? "hero" : "outline"}
                      size="sm"
                      onClick={() => setViewMode("map")}
                      className={viewMode === "map" ? "bg-gradient-ocean text-white" : ""}
                    >
                      <Map className="w-4 h-4 mr-2" />
                      Map View
                    </Button>
                  </div>
                </div>
                <Button variant="hero" size="sm" className="bg-gradient-ocean text-white">
                  <Bot className="w-4 h-4 mr-2" />
                  AI Optimize Day
                </Button>
              </div>
            </div>

            <div className="p-4 sm:p-6">
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid grid-cols-2 sm:grid-cols-4 mb-6 w-full">
                  <TabsTrigger value="itinerary" className="text-sm">
                    <List className="w-4 h-4 mr-2" />
                    Itinerary
                  </TabsTrigger>
                  <TabsTrigger value="transport" className="text-sm">
                    <Plane className="w-4 h-4 mr-2" />
                    Transport
                  </TabsTrigger>
                  <TabsTrigger value="hotels" className="text-sm">
                    <Building className="w-4 h-4 mr-2" />
                    Hotels
                  </TabsTrigger>
                  <TabsTrigger value="safety" className="text-sm">
                    <Shield className="w-4 h-4 mr-2" />
                    Safety
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="itinerary">
                  {viewMode === "itinerary" ? (
                    <div className="space-y-4">
                      <Card className="p-4 border-dashed border-2 border-border cursor-pointer">
                        <div className="flex items-center justify-center text-muted-foreground">
                          <Plus className="w-5 h-5 mr-2" />
                          <span>Add activity or place</span>
                        </div>
                      </Card>

                      {dayActivities[selectedDay]?.map((activity, index) => (
                        <Card key={index} className="p-4">
                          <div className="flex flex-col sm:flex-row items-start gap-4">
                            <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                              <img
                                src={activity.image}
                                alt={activity.title}
                                className="w-full h-full object-cover"
                              />
                              <div className="absolute inset-0 bg-gradient-ocean/20" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center mb-2">
                                <Clock className="w-4 h-4 mr-2 text-primary" />
                                <span className="text-sm font-medium text-primary">{activity.time}</span>
                                <Badge variant="outline" className="ml-2 text-xs">
                                  {activity.type}
                                </Badge>
                              </div>
                              <h3 className="text-lg font-semibold text-foreground mb-1">
                                {activity.title}
                              </h3>
                              <p className="text-sm text-muted-foreground mb-3">
                                {activity.description}
                              </p>
                              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                                <div className="flex items-center">
                                  <Clock className="w-3 h-3 mr-1" />
                                  {activity.duration}
                                </div>
                                <div className="flex items-center">
                                  <DollarSign className="w-3 h-3 mr-1" />
                                  {activity.cost}
                                </div>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Button variant="outline" size="icon">
                                <MapPin className="w-4 h-4" />
                              </Button>
                              <div className="w-2 h-8 bg-border rounded-full cursor-grab"></div>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  ) : (
                    <div className="bg-muted rounded-lg flex items-center justify-center min-h-[400px]">
                      <div className="text-center">
                        <img
                          src="https://images.pexels.com/photos/261169/pexels-photo-261169.jpeg?auto=compress&cs=tinysrgb&w=600"
                          alt="Map placeholder"
                          className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                        />
                        <p className="text-muted-foreground">Interactive map view coming soon</p>
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="transport">
                  <div className="text-center py-12">
                    <img
                      src="https://images.pexels.com/photos/804463/pexels-photo-804463.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Transport placeholder"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-muted-foreground mb-4">Transport booking integration</p>
                    <Button variant="outline" onClick={() => window.open('/transport', '_blank')}>
                      Open Transport Booking
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="hotels">
                  <div className="text-center py-12">
                    <img
                      src="https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg?auto=compress&cs=tinysrgb&w=600"
                      alt="Hotel placeholder"
                      className="w-32 h-32 object-cover rounded-lg mx-auto mb-4"
                    />
                    <p className="text-muted-foreground mb-4">Hotel booking integration</p>
                    <Button variant="outline" onClick={() => window.open('/hotels', '_blank')}>
                      Open Hotel Booking
                    </Button>
                  </div>
                </TabsContent>

                <TabsContent value="safety">
                  <SafetyDashboard tripDestination={tripPlan.destination || "Your Destination"} />
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* AI Suggestions Sidebar */}
          <div className="w-full md:w-80 bg-card border border-border rounded-lg overflow-y-auto">
            <div className="p-4 sm:p-6">
              <div className="flex items-center mb-4">
                <Bot className="w-5 h-5 mr-2 text-primary" />
                <h3 className="font-semibold text-foreground">AI Suggestions</h3>
              </div>
              
              <div className="space-y-4">
                {aiSuggestions.map((suggestion, index) => (
                  <Card key={index} className="p-4">
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      <div className="w-16 h-16 rounded-lg overflow-hidden relative">
                        <img
                          src={suggestion.image}
                          alt={suggestion.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-ocean/20" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-medium text-foreground text-sm">{suggestion.title}</h4>
                          <div className="flex items-center text-xs text-muted-foreground">
                            <span>{(4.5 + Math.random() * 0.5).toFixed(1)}</span>
                            <div className="w-1 h-1 bg-accent rounded-full ml-1"></div>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs mb-2">
                          {suggestion.type}
                        </Badge>
                        <p className="text-xs text-muted-foreground mb-3">
                          {suggestion.description}
                        </p>
                        <div className="flex items-center justify-between">
                          <span className="text-xs text-muted-foreground">{suggestion.time}</span>
                          <Button size="sm" variant="outline" className="h-6 text-xs px-2">
                            Add
                          </Button>
                        </div>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>

              <Button variant="travel" size="sm" className="w-full mt-6 bg-blue-100 text-blue-800">
                Get More Suggestions
              </Button>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TripPlanner;