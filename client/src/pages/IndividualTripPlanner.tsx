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
import { Plus, Clock, Calendar } from "lucide-react";
import { parse, ParseResult } from "papaparse";

interface City {
  id: string;
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
  rating: string;
  reviews: string;
}

interface Hotel {
  HotelName: string;
  CleanedAttractions: string;
  Address: string;
  HotelRating: string;
  HotelWebsiteUrl: string;
}

interface TripDay {
  day: number;
  date: string;
  activities: number;
  hotels: Hotel[];
}

interface TripPlan {
  destination: string;
  startDate: string;
  endDate: string;
  budget: string;
}

interface ItineraryResponse {
  best_time_to_visit: string;
  days: {
    day: number;
    activities: {
      time: string;
      activity: string;
      location: string;
      description: string;
      category: string;
      rating: string;
      reviews: string;
    }[];
    hotels: Hotel[];
  }[];
}

const mockItinerary: ItineraryResponse = {
  best_time_to_visit: "Spring",
  days: [
    {
      day: 1,
      activities: [
        {
          time: "10:00 AM",
          activity: "Visit Museum",
          location: "City Museum",
          description: "Explore local history and art. Rated 4.5 with 1200 reviews.",
          category: "Culture",
          rating: "4.5",
          reviews: "1200",
        },
        {
          time: "2:00 PM",
          activity: "City Tour",
          location: "Downtown",
          description: "Guided tour of city landmarks. Rated 4.2 with 800 reviews.",
          category: "Culture",
          rating: "4.2",
          reviews: "800",
        },
      ],
      hotels: [
        {
          HotelName: "Grand Hotel",
          CleanedAttractions: "Monument",
          Address: "123 Main St, Sample City",
          HotelRating: "4.5",
          HotelWebsiteUrl: "http://grandhotel.com",
        },
        {
          HotelName: "City Lodge",
          CleanedAttractions: "Temple",
          Address: "456 Central Ave, Sample City",
          HotelRating: "4.0",
          HotelWebsiteUrl: "http://citylodge.com",
        },
        {
          HotelName: "Heritage Inn",
          CleanedAttractions: "Museum",
          Address: "789 Old Town Rd, Sample City",
          HotelRating: "4.2",
          HotelWebsiteUrl: "http://heritageinn.com",
        },
      ],
    },
    {
      day: 2,
      activities: [
        {
          time: "9:00 AM",
          activity: "Beach Visit",
          location: "City Beach",
          description: "Relax by the shore. Rated 4.7 with 1500 reviews.",
          category: "Leisure",
          rating: "4.7",
          reviews: "1500",
        },
      ],
      hotels: [
        {
          HotelName: "Seaside Resort",
          CleanedAttractions: "Beach",
          Address: "101 Coastal Rd, Sample City",
          HotelRating: "4.7",
          HotelWebsiteUrl: "http://seasideresort.com",
        },
        {
          HotelName: "Downtown Suites",
          CleanedAttractions: "Mall",
          Address: "202 City Center, Sample City",
          HotelRating: "4.3",
          HotelWebsiteUrl: "http://downtownsuites.com",
        },
        {
          HotelName: "Riverside Hotel",
          CleanedAttractions: "River",
          Address: "303 River Rd, Sample City",
          HotelRating: "4.1",
          HotelWebsiteUrl: "http://riversidehotel.com",
        },
      ],
    },
  ],
};

const IndividualTripPlanner = () => {
  const [selectedDay, setSelectedDay] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: "",
    startDate: "",
    endDate: "",
    budget: "Medium",
  });
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [dayActivities, setDayActivities] = useState<{ [key: number]: Activity[] }>({});
  const [aiSuggestions, setAiSuggestions] = useState<Activity[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingItinerary, setIsFetchingItinerary] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string; email: string; mobile?: string } | null>(null);

  const UNSPLASH_ACCESS_KEY = import.meta.env.VITE_UNSPLASH_ACCESS_KEY;
  const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === "true";

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
        setError("Failed to verify authentication. Please log in again.");
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (tripPlan.destination.length >= 3) {
      parse("/datasets/places_india.csv", {
        download: true,
        header: true,
        complete: (result: ParseResult<any>) => {
          const data = result.data;
          if (!data || data.length === 0) {
            setError("No data found in places_india.csv. Please check the file.");
            return;
          }
          const uniqueCities = Array.from(
            new Set(data.map((place: any) => `${place.city}, ${place.country}`))
          ).map((cityCountry, index) => ({
            id: `city-${index}`,
            name: cityCountry.split(", ")[0],
            country: cityCountry.split(", ")[1] || "India",
          }));
          setCities(
            uniqueCities.filter((city) =>
              city.name.toLowerCase().includes(tripPlan.destination.toLowerCase())
            )
          );
        },
        error: (err) => {
          console.error("Error fetching places_india.csv:", err);
          setError("Failed to fetch city suggestions. Ensure places_india.csv is in public/datasets/.");
        },
      });
    } else {
      setCities([]);
    }
  }, [tripPlan.destination]);

  const fetchUnsplashImage = async (query: string): Promise<string | null> => {
    if (!UNSPLASH_ACCESS_KEY) {
      console.warn("Unsplash API key missing. Using fallback image.");
      return null;
    }
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
          query
        )}&per_page=1&orientation=landscape&client_id=${UNSPLASH_ACCESS_KEY}`
      );
      if (!response.ok) throw new Error(`Unsplash API request failed: ${response.statusText}`);
      const data = await response.json();
      return data.results?.[0]?.urls?.regular || null;
    } catch (err) {
      console.warn("Unsplash image fetch failed:", err);
      return null;
    }
  };

  const fetchDatasetData = async (destination: string): Promise<ItineraryResponse> => {
    try {
      const [placesResult, hotelsResult] = await Promise.all([
        new Promise<ParseResult<any>>((resolve, reject) => {
          parse("/datasets/places_india.csv", {
            download: true,
            header: true,
            complete: (result) => resolve(result),
            error: (err) => reject(new Error(`Failed to fetch places_india.csv: ${err.message}`)),
          });
        }),
        new Promise<ParseResult<any>>((resolve, reject) => {
          parse("/datasets/india.csv", {
            download: true,
            header: true,
            complete: (result) => resolve(result),
            error: (err) => reject(new Error(`Failed to fetch india.csv: ${err.message}`)),
          });
        }),
      ]);

      const placesData = placesResult.data;
      const hotelsData = hotelsResult.data;

      if (!placesData.length) throw new Error("No data found in places_india.csv");
      if (!hotelsData.length) console.warn("No data found in india.csv");

      const filteredPlaces = placesData.filter(
        (place: any) => place.city && place.city.toLowerCase().includes(destination.toLowerCase())
      );
      const filteredHotels = hotelsData
        .filter((hotel: any) => hotel.cityName && hotel.cityName.toLowerCase().includes(destination.toLowerCase()))
        .sort((a: any, b: any) => parseFloat(b.HotelRating) - parseFloat(a.HotelRating));

      if (!filteredPlaces.length) {
        throw new Error(`No activities found for ${destination}. Try another city.`);
      }

      const itinerary: ItineraryResponse = {
        best_time_to_visit: "Year-round",
        days: [],
      };

      const start = new Date(tripPlan.startDate);
      const end = new Date(tripPlan.endDate);
      const duration = Math.max(Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)), 1);

      const hotelsPerDay = 3;
      const totalHotelsNeeded = duration * hotelsPerDay;
      const availableHotels = filteredHotels.map((hotel: any) => ({
        HotelName: hotel.HotelName,
        CleanedAttractions: hotel.CleanedAttractions || "No attractions listed",
        Address: hotel.Address,
        HotelRating: hotel.HotelRating,
        HotelWebsiteUrl: hotel.HotelWebsiteUrl || "No website available",
      }));

      let selectedHotels: Hotel[] = [];
      if (availableHotels.length < totalHotelsNeeded) {
        for (let i = 0; i < totalHotelsNeeded; i++) {
          selectedHotels.push(availableHotels[i % availableHotels.length] || {
            HotelName: `Placeholder Hotel ${i + 1}`,
            CleanedAttractions: "None",
            Address: "Unknown",
            HotelRating: "N/A",
            HotelWebsiteUrl: "No website available",
          });
        }
      } else {
        selectedHotels = availableHotels
          .sort(() => Math.random() - 0.5)
          .slice(0, totalHotelsNeeded);
      }

      const activitiesPerDay = Math.min(Math.ceil(filteredPlaces.length / duration) || 3, 5);
      for (let day = 1; day <= duration; day++) {
        const startIdx = (day - 1) * activitiesPerDay;
        const dayActivities = filteredPlaces
          .slice(startIdx, startIdx + activitiesPerDay)
          .map((place: any, idx: number) => {
            const time = `${10 + idx * 2}:00 ${idx < 2 ? "AM" : "PM"}`;
            return {
              time,
              activity: place.name,
              location: place.address || place.city,
              description: `Explore ${place.name}, a ${place.main_category} spot. Rated ${place.rating} with ${place.reviews} reviews.`,
              category: place.main_category,
              rating: place.rating,
              reviews: place.reviews,
            };
          });

        const dayHotels = selectedHotels.slice((day - 1) * hotelsPerDay, day * hotelsPerDay);

        itinerary.days.push({
          day,
          activities: dayActivities,
          hotels: dayHotels,
        });
      }

      return itinerary;
    } catch (err: any) {
      console.error("Dataset fetch error:", err.message);
      throw new Error(`Couldn’t create itinerary: ${err.message}. Ensure CSV files are in public/datasets/.`);
    }
  };

  const fetchItinerary = async () => {
    if (!tripPlan.destination || !tripPlan.startDate || !tripPlan.endDate) {
      setError("Please enter a destination city, start date, and end date.");
      return;
    }

    const start = new Date(tripPlan.startDate);
    const end = new Date(tripPlan.endDate);
    if (end < start) {
      setError("End date must be after start date.");
      return;
    }

    setIsFetchingItinerary(true);
    setError(null);

    if (USE_MOCK_DATA) {
      try {
        const itinerary = mockItinerary;
        const startDate = new Date(tripPlan.startDate);
        const endDate = new Date(tripPlan.endDate);
        const duration = Math.max(Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 1);
        const newTripDays: TripDay[] = [];
        for (let i = 0; i < duration; i++) {
          const date = new Date(startDate);
          date.setDate(startDate.getDate() + i);
          const dayHotels = i < itinerary.days.length ? itinerary.days[i].hotels : itinerary.days[0].hotels;
          newTripDays.push({
            day: i + 1,
            date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
            activities: itinerary.days[i]?.activities.length || 0,
            hotels: dayHotels,
          });
        }
        setTripDays(newTripDays);

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
                duration: "2 hours",
                cost: tripPlan.budget === "Low" ? "$" : tripPlan.budget === "Medium" ? "$$" : "$$$",
                description: act.description,
                image: image || "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg",
                rating: act.rating,
                reviews: act.reviews,
              };
            })
          );
          newDayActivities[day.day] = activitiesWithImages;
        }
        setDayActivities(newDayActivities);
        setAiSuggestions(newDayActivities[1]?.slice(0, 3) || []);
        localStorage.setItem(`itinerary-${tripPlan.destination}-${duration}`, JSON.stringify(newDayActivities));
      } catch (err: any) {
        console.error("Mock itinerary error:", err);
        setError("Failed to process mock itinerary. Please try again.");
      } finally {
        setIsFetchingItinerary(false);
      }
      return;
    }

    try {
      const itinerary = await fetchDatasetData(tripPlan.destination);

      const startDate = new Date(tripPlan.startDate);
      const endDate = new Date(tripPlan.endDate);
      const duration = Math.max(Math.ceil((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)), 1);
      const newTripDays: TripDay[] = [];
      for (let i = 0; i < duration; i++) {
        const date = new Date(startDate);
        date.setDate(startDate.getDate() + i);
        newTripDays.push({
          day: i + 1,
          date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
          activities: itinerary.days.find((d) => d.day === i + 1)?.activities.length || 0,
          hotels: itinerary.days.find((d) => d.day === i + 1)?.hotels || [],
        });
      }
      setTripDays(newTripDays);

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
              duration: "2 hours",
              cost: tripPlan.budget === "Low" ? "$" : tripPlan.budget === "Medium" ? "$$" : "$$$",
              description: act.description,
              image: image || "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg",
              rating: act.rating,
              reviews: act.reviews,
            };
          })
        );
        newDayActivities[day.day] = activitiesWithImages;
      }
      setDayActivities(newDayActivities);
      setAiSuggestions(newDayActivities[1]?.slice(0, 3) || []);
      localStorage.setItem(`itinerary-${tripPlan.destination}-${duration}`, JSON.stringify(newDayActivities));
    } catch (err: any) {
      console.error("Itinerary fetch error:", err.message);
      setError(err.message);
    } finally {
      setIsFetchingItinerary(false);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsFormOpen(false);
    await fetchItinerary();
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/" />;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-16">
        <div className="bg-blue-500 text-white py-12 text-center">
          <h1 className="text-3xl font-bold mb-2">Plan Your Solo Trip to {tripPlan.destination || "Anywhere"}</h1>
          <p className="text-lg max-w-2xl mx-auto">Create a perfect itinerary just for you!</p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 bg-white text-blue-500 hover:bg-gray-100" aria-label="Start solo trip">
                Start Solo Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle>Start Your Solo Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="destination">Where are you going?</Label>
                  <Input
                    id="destination"
                    value={tripPlan.destination}
                    onChange={(e) => setTripPlan({ ...tripPlan, destination: e.target.value })}
                    placeholder="Enter a city (e.g., Hyderabad)"
                    list="cities"
                    aria-describedby="destination-help"
                  />
                  <p id="destination-help" className="text-sm text-gray-500">Enter a city, like 'Hyderabad' or 'Mumbai'.</p>
                  <datalist id="cities">
                    {cities.map((city) => (
                      <option key={city.id} value={`${city.name}, ${city.country}`} />
                    ))}
                  </datalist>
                </div>
                <div>
                  <Label htmlFor="startDate">Start Date</Label>
                  <Input
                    id="startDate"
                    type="date"
                    value={tripPlan.startDate}
                    onChange={(e) => setTripPlan({ ...tripPlan, startDate: e.target.value })}
                    aria-describedby="start-date-help"
                  />
                  <p id="start-date-help" className="text-sm text-gray-500">Select the start date of your trip.</p>
                </div>
                <div>
                  <Label htmlFor="endDate">End Date</Label>
                  <Input
                    id="endDate"
                    type="date"
                    value={tripPlan.endDate}
                    onChange={(e) => setTripPlan({ ...tripPlan, endDate: e.target.value })}
                    aria-describedby="end-date-help"
                  />
                  <p id="end-date-help" className="text-sm text-gray-500">Select the end date of your trip.</p>
                </div>
                <div>
                  <Label htmlFor="budget">Your budget</Label>
                  <Select
                    value={tripPlan.budget}
                    onValueChange={(value) => setTripPlan({ ...tripPlan, budget: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Choose budget" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Low">Low ($)</SelectItem>
                      <SelectItem value="Medium">Medium ($$)</SelectItem>
                      <SelectItem value="High">High ($$$)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-500 text-white hover:bg-blue-600"
                  aria-label="Create trip plan"
                  disabled={isFetchingItinerary}
                >
                  {isFetchingItinerary ? (
                    <span className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                      Creating...
                    </span>
                  ) : (
                    "Create Trip Plan"
                  )}
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center" role="alert">
              {error}
              <div className="mt-2 flex gap-2 justify-center">
                <Button
                  variant="link"
                  className="text-red-800 underline"
                  onClick={fetchItinerary}
                  aria-label="Retry creating itinerary"
                >
                  Retry
                </Button>
                <Button
                  variant="link"
                  className="text-red-800 underline"
                  onClick={() => {
                    localStorage.setItem(`itinerary-${tripPlan.destination}-1`, JSON.stringify(mockItinerary));
                    setTripPlan({ ...tripPlan, destination: "Sample City" });
                    fetchItinerary();
                  }}
                  aria-label="Use mock data"
                >
                  Use Sample Data
                </Button>
              </div>
            </div>
          )}
          {isFetchingItinerary && (
            <div className="bg-blue-100 text-blue-800 p-4 rounded-lg mb-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-blue-500 inline-block mr-2"></div>
              Generating your itinerary...
            </div>
          )}
          <div className="flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-80 bg-white rounded-lg shadow p-4">
              <h2 className="text-xl font-bold mb-4">Your Solo Trip</h2>
              <p className="text-sm text-gray-600 mb-4">
                {tripDays.length > 0
                  ? `${tripDays[0].date} - ${tripDays[tripDays.length - 1].date}`
                  : "Start planning to see details"}
              </p>
              <h3 className="font-semibold mb-2">Trip Days</h3>
              {tripDays.map((day) => (
                <button
                  key={day.day}
                  onClick={() => setSelectedDay(day.day)}
                  className={`w-full p-3 rounded-lg text-left mb-2 ${
                    selectedDay === day.day ? "bg-blue-100 text-blue-800" : "bg-gray-100"
                  }`}
                  aria-label={`Select Day ${day.day} (${day.date})`}
                >
                  <div className="flex justify-between">
                    <span>Day {day.day} ({day.date})</span>
                    <Badge>{day.activities} activities</Badge>
                  </div>
                </button>
              ))}
              <Button variant="outline" className="w-full mt-4" aria-label="Add to calendar">
                <Calendar className="w-4 h-4 mr-2" />
                Add to Calendar
              </Button>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="itinerary">
                <TabsList className="grid grid-cols-2 mb-4">
                  <TabsTrigger value="itinerary">Plan</TabsTrigger>
                  <TabsTrigger value="safety">Safety</TabsTrigger>
                </TabsList>
                <TabsContent value="itinerary">
                  <h2 className="text-lg font-semibold mb-4">
                    Day {selectedDay} - {tripDays.find((d) => d.day === selectedDay)?.date || "Pick a day"}
                  </h2>
                  <Button className="mb-4 bg-blue-500 text-white hover:bg-blue-600" aria-label="Add activity">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Activity
                  </Button>
                  {tripDays.find((d) => d.day === selectedDay)?.hotels.length > 0 && (
                    <div className="mb-4">
                      <h3 className="font-semibold mb-2">Recommended Hotels</h3>
                      {tripDays.find((d) => d.day === selectedDay)?.hotels.map((hotel, index) => (
                        <Card key={index} className="p-4 mb-4">
                          <h4 className="font-medium">{hotel.HotelName}</h4>
                          <p className="text-sm text-gray-600">Rating: {hotel.HotelRating} ★</p>
                          <p className="text-sm text-gray-600">Address: {hotel.Address}</p>
                          <p className="text-sm text-gray-600">Attractions: {hotel.CleanedAttractions}</p>
                          {hotel.HotelWebsiteUrl !== "No website available" && (
                            <a
                              href={hotel.HotelWebsiteUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-500 text-sm hover:underline"
                            >
                              Visit Website
                            </a>
                          )}
                        </Card>
                      ))}
                    </div>
                  )}
                  {dayActivities[selectedDay]?.map((activity, index) => (
                    <Card key={index} className="p-4 mb-4">
                      <div className="flex items-start gap-4">
                        <img
                          src={activity.image}
                          alt={activity.title}
                          className="w-16 h-16 rounded-lg object-cover"
                        />
                        <div className="flex-1">
                          <div className="flex items-center mb-2">
                            <Clock className="w-4 h-4 mr-2 text-blue-500" />
                            <span>{activity.time}</span>
                            <Badge className="ml-2">{activity.type}</Badge>
                          </div>
                          <h3 className="font-semibold">{activity.title}</h3>
                          <p className="text-sm text-gray-600">Rating: {activity.rating} ★</p>
                          <p className="text-sm text-gray-600">Reviews: {activity.reviews}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="safety">
                  <SafetyDashboard tripDestination={tripPlan.destination || "Your Destination"} />
                </TabsContent>
              </Tabs>
            </div>

            <div className="w-full md:w-80 bg-white rounded-lg shadow p-4">
              <h3 className="font-semibold mb-4">Fun Suggestions</h3>
              {aiSuggestions.map((suggestion, index) => (
                <Card key={index} className="p-4 mb-4">
                  <div className="flex items-start gap-4">
                    <img
                      src={suggestion.image}
                      alt={suggestion.title}
                      className="w-16 h-16 rounded-lg object-cover"
                    />
                    <div>
                      <h4 className="font-medium">{suggestion.title}</h4>
                      <Badge className="my-1">{suggestion.type}</Badge>
                      <p className="text-xs text-gray-600">Rating: {suggestion.rating} ★</p>
                      <p className="text-xs text-gray-600">Reviews: {suggestion.reviews}</p>
                      <p className="text-xs text-gray-600">{suggestion.description}</p>
                      <Button
                        size="sm"
                        className="mt-2 bg-blue-500 text-white hover:bg-blue-600"
                        aria-label={`Add ${suggestion.title} to plan`}
                      >
                        Add to Plan
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default IndividualTripPlanner;