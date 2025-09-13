import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Navigate, useParams } from "react-router-dom";
import { Plus, Clock, Share } from "lucide-react";
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
  votes: number;
  proposedBy: string;
  reactions?: { user: { name: string; _id: string }; type: string }[];
}

interface Hotel {
  HotelName: string;
  CleanedAttractions: string;
  Address: string;
  HotelRating: string;
  HotelWebsiteUrl: string;
  reactions?: { user: { name: string; _id: string }; type: string }[];
}

interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string;
}

interface TripDay {
  day: number;
  date: string;
  activities: number;
  hotels: Hotel[];
}

interface TripPlan {
  destination: string;
  members: { id: string; name: string; role: string }[];
  numberOfPersons: number;
  startDate: string;
  endDate: string;
  tripName: string;
  preferences: string[];
  _id?: string;
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
      reactions?: { user: { name: string; _id: string }; type: string }[];
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
          description: "Explore local history and art.",
          category: "Culture",
        },
        {
          time: "2:00 PM",
          activity: "City Tour",
          location: "Downtown",
          description: "Guided tour of city landmarks.",
          category: "Culture",
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
          description: "Relax by the shore.",
          category: "Leisure",
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

const tripCategories = [
  "Hindu temple",
  "Heritage museum",
  "Garden",
  "Park",
  "Museum",
  "Historical landmark",
  "Historical place museum",
  "Public beach",
  "Catholic cathedral",
  "Hill station",
  "Scenic spot",
  "Nature preserve",
  "Vista point",
  "Archaeological site",
  "Mosque",
  "Religious destination",
  "Fortress",
  "History museum",
  "Catholic church",
  "Shrine",
  "National park",
  "Jain temple",
  "Archaeological museum",
  "Ecological park",
  "Heritage building",
  "Lake",
  "Observatory",
  "Church",
  "Art museum",
  "Monastery",
  "Buddhist temple",
  "Hiking area",
  "Anglican church",
  "National forest",
  "Monument",
  "Gurudwara",
  "Castle",
  "Wax museum",
  "Wildlife refuge",
  "Wildlife and safari park",
  "Wildlife park",
  "Beach pavillion",
  "Beach",
];

const GroupTripPlanner = () => {
  const { tripId } = useParams<{ tripId?: string }>();
  const [selectedDay, setSelectedDay] = useState(1);
  const [cities, setCities] = useState<City[]>([]);
  const [tripPlan, setTripPlan] = useState<TripPlan>({
    destination: "",
    members: [],
    numberOfPersons: 1,
    startDate: "",
    endDate: "",
    tripName: "",
    preferences: [],
  });
  const [tripDays, setTripDays] = useState<TripDay[]>([]);
  const [dayActivities, setDayActivities] = useState<{ [key: number]: Activity[] }>({});
  const [aiSuggestions, setAiSuggestions] = useState<Activity[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [chatMessages, setChatMessages] = useState<{ id: string; userName: string; message: string; timestamp: string }[]>([]);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingItinerary, setIsFetchingItinerary] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ _id: string; name: string; email: string; mobile?: string } | null>(null);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");
  const [newExpenseDesc, setNewExpenseDesc] = useState("");
  const [newExpenseAmount, setNewExpenseAmount] = useState("");
  const [newExpensePaidBy, setNewExpensePaidBy] = useState("");

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
          setTripPlan((prev) => ({
            ...prev,
            members: [{ id: data._id, name: data.name, role: "Organizer" }],
          }));
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
          localStorage.removeItem("token");
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
    if (tripId) {
      const fetchTrip = async () => {
        try {
          const token = localStorage.getItem("token");
          const response = await fetch(`http://localhost:4000/api/trips/${tripId}`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          });
          const data = await response.json();
          if (response.ok && data.trip) {
            const trip = data.trip;
            setTripPlan({
              _id: trip._id,
              tripName: trip.tripName,
              destination: trip.destination,
              numberOfPersons: trip.numberOfPersons,
              startDate: new Date(trip.startDate).toISOString().split("T")[0],
              endDate: new Date(trip.endDate).toISOString().split("T")[0],
              preferences: trip.preferences,
              members: trip.members.map((m: any) => ({
                id: m.user._id,
                name: m.user.name,
                role: m.role,
              })),
            });
            const newTripDays: TripDay[] = trip.itinerary.days.map((day: any) => ({
              day: day.day,
              date: new Date(trip.startDate).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              }),
              activities: day.activities.length,
              hotels: day.hotels,
            }));
            setTripDays(newTripDays);
            const newDayActivities: { [key: number]: Activity[] } = {};
            trip.itinerary.days.forEach((day: any) => {
              newDayActivities[day.day] = day.activities.map((act: any) => ({
                time: act.time,
                title: act.activity,
                type: act.category,
                duration: "2 hours",
                cost: "$",
                description: act.description,
                image: act.image || "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg",
                votes: act.reactions.reduce((sum: number, r: any) => sum + (r.type === "like" ? 1 : -1), 0),
                proposedBy: currentUser?.name || "You",
                reactions: act.reactions,
              }));
            });
            setDayActivities(newDayActivities);
            setAiSuggestions(newDayActivities[1]?.slice(0, 3) || []);
            setExpenses(
              trip.expenses.map((exp: any) => ({
                id: exp._id,
                description: exp.description,
                amount: exp.amount,
                paidBy: exp.paidBy.name,
              }))
            );
            setChatMessages(
              trip.chatMessages.map((msg: any) => ({
                id: msg._id,
                userName: msg.user.name,
                message: msg.message,
                timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
              }))
            );
          } else {
            setError("Failed to load trip details.");
          }
        } catch (err) {
          console.error("Fetch trip error:", err);
          setError("Failed to load trip details.");
        }
      };
      fetchTrip();
    }
  }, [tripId, currentUser]);

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

  const fetchDatasetData = async (destination: string, numberOfPersons: number): Promise<ItineraryResponse> => {
    try {
      const [placesResult, hotelsResult, transportResult] = await Promise.all([
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
        new Promise<ParseResult<any>>((resolve, reject) => {
          parse("/datasets/transport.csv", {
            download: true,
            header: true,
            complete: (result) => resolve(result),
            error: (err) => reject(new Error(`Failed to fetch transport.csv: ${err.message}`)),
          });
        }),
      ]);

      const placesData = placesResult.data;
      const hotelsData = hotelsResult.data;
      const transportData = transportResult.data;

      if (!placesData.length) throw new Error("No data found in places_india.csv");
      if (!hotelsData.length) console.warn("No data found in india.csv");
      if (!transportData.length) console.warn("No data found in transport.csv");

      const filteredPlaces = placesData.filter(
        (place: any) => place.city && place.city.toLowerCase().includes(destination.toLowerCase()) &&
        (!tripPlan.preferences.length || tripPlan.preferences.includes(place.main_category))
      );
      const filteredHotels = hotelsData
        .filter((hotel: any) => hotel.cityName && hotel.cityName.toLowerCase().includes(destination.toLowerCase()))
        .sort((a: any, b: any) => parseFloat(b.HotelRating) - parseFloat(a.HotelRating));

      if (!filteredPlaces.length) {
        throw new Error(`No activities found for ${destination}. Try another city or adjust preferences.`);
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
              description: `Explore ${place.name}, a ${place.main_category} spot with a rating of ${place.rating}. Suitable for ${numberOfPersons} people.`,
              category: place.main_category,
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
    if (!tripPlan.destination || !tripPlan.startDate || !tripPlan.endDate || tripPlan.numberOfPersons < 1 || !tripPlan.tripName) {
      setError("Please enter a trip name, destination city, valid dates, and number of persons.");
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

    try {
      const itinerary = USE_MOCK_DATA ? mockItinerary : await fetchDatasetData(tripPlan.destination, tripPlan.numberOfPersons);
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
              cost: "$",
              description: act.description,
              image: image || "https://images.pexels.com/photos/1268871/pexels-photo-1268871.jpeg",
              votes: act.reactions?.reduce((sum, r) => sum + (r.type === "like" ? 1 : -1), 0) || 0,
              proposedBy: currentUser?.name || "You",
              reactions: act.reactions || [],
            };
          })
        );
        newDayActivities[day.day] = activitiesWithImages;
      }
      setDayActivities(newDayActivities);
      setAiSuggestions(newDayActivities[1]?.slice(0, 3) || []);

      if (!tripId) {
        const token = localStorage.getItem("token");
        const response = await fetch("http://localhost:4000/api/trips", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            tripName: tripPlan.tripName,
            destination: tripPlan.destination,
            numberOfPersons: tripPlan.numberOfPersons,
            startDate: tripPlan.startDate,
            endDate: tripPlan.endDate,
            preferences: tripPlan.preferences,
            itinerary: {
              best_time_to_visit: itinerary.best_time_to_visit,
              days: itinerary.days.map((day) => ({
                day: day.day,
                activities: day.activities.map((act) => ({
                  time: act.time,
                  activity: act.activity,
                  location: act.location,
                  description: act.description,
                  category: act.category,
                  image: newDayActivities[day.day].find((a) => a.title === act.activity)?.image,
                  reactions: [],
                })),
                hotels: day.hotels.map((hotel) => ({
                  ...hotel,
                  reactions: [],
                })),
              })),
            },
          }),
        });
        const data = await response.json();
        if (response.ok && data.trip) {
          setTripPlan((prev) => ({ ...prev, _id: data.trip._id }));
        } else {
          throw new Error(data.message || "Failed to save trip");
        }
      }
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

  const handleInviteFriend = async () => {
    if (!tripPlan._id) {
      setError("Please create a trip first.");
      return;
    }
    if (!inviteEmail.includes("@") || !inviteEmail.includes(".")) {
      setError("Please enter a valid email address.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/trips/${tripPlan._id}/invite`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ email: inviteEmail }),
      });
      const data = await response.json();
      if (response.ok) {
        setInviteMessage(`Invite sent to ${inviteEmail}!`);
        setInviteEmail("");
        setTimeout(() => setInviteMessage(""), 3000);
        const invitedUser = await fetch(`http://localhost:4000/api/users/check-email`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ email: inviteEmail }),
        }).then((res) => res.json());
        if (invitedUser.message === "Email exists") {
          setTripPlan((prev) => ({
            ...prev,
            members: [
              ...prev.members,
              { id: `temp-${Date.now()}`, name: inviteEmail.split("@")[0], role: "Friend" },
            ],
          }));
        }
      } else {
        setError(data.message || "Failed to send invite.");
      }
    } catch (err) {
      console.error("Invite error:", err);
      setError("Failed to send invite.");
    }
  };

  const handleVote = async (day: number, activityIndex: number, type: "like" | "dislike") => {
    if (!tripPlan._id) {
      setError("Please save the trip first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/trips/${tripPlan._id}/day/${day - 1}/activity/${activityIndex}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        }
      );
      const data = await response.json();
      if (response.ok && data.trip) {
        setDayActivities((prev) => ({
          ...prev,
          [day]: prev[day].map((act, idx) =>
            idx === activityIndex
              ? {
                  ...act,
                  votes: data.trip.itinerary.days[day - 1].activities[activityIndex].reactions.reduce(
                    (sum: number, r: any) => sum + (r.type === "like" ? 1 : -1),
                    0
                  ),
                  reactions: data.trip.itinerary.days[day - 1].activities[activityIndex].reactions,
                }
              : act
          ),
        }));
      } else {
        setError(data.message || "Failed to add reaction.");
      }
    } catch (err) {
      console.error("Vote error:", err);
      setError("Failed to add reaction.");
    }
  };

  const handleHotelVote = async (day: number, hotelIndex: number, type: "like" | "dislike") => {
    if (!tripPlan._id) {
      setError("Please save the trip first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(
        `http://localhost:4000/api/trips/${tripPlan._id}/day/${day - 1}/hotel/${hotelIndex}/react`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ type }),
        }
      );
      const data = await response.json();
      if (response.ok && data.trip) {
        setTripDays((prev) =>
          prev.map((d) =>
            d.day === day
              ? {
                  ...d,
                  hotels: d.hotels.map((h, idx) =>
                    idx === hotelIndex
                      ? {
                          ...h,
                          reactions: data.trip.itinerary.days[day - 1].hotels[hotelIndex].reactions,
                        }
                      : h
                  ),
                }
              : d
          )
        );
      } else {
        setError(data.message || "Failed to add hotel reaction.");
      }
    } catch (err) {
      console.error("Hotel vote error:", err);
      setError("Failed to add hotel reaction.");
    }
  };

  const handleAddExpense = async (description: string, amount: number, paidBy: string) => {
    if (!description || amount <= 0) {
      setError("Please enter a valid expense description and amount.");
      return;
    }
    if (!tripPlan._id) {
      setError("Please save the trip first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/trips/${tripPlan._id}/expenses`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description, amount, paidBy: paidBy || currentUser?.name || "You" }),
      });
      const data = await response.json();
      if (response.ok && data.trip) {
        setExpenses(
          data.trip.expenses.map((exp: any) => ({
            id: exp._id,
            description: exp.description,
            amount: exp.amount,
            paidBy: exp.paidBy.name,
          }))
        );
        setNewExpenseDesc("");
        setNewExpenseAmount("");
        setNewExpensePaidBy("");
      } else {
        setError(data.message || "Failed to add expense.");
      }
    } catch (err) {
      console.error("Add expense error:", err);
      setError("Failed to add expense.");
    }
  };

  const handleAddChatMessage = async (message: string) => {
    if (!message.trim()) {
      setError("Please enter a message.");
      return;
    }
    if (!tripPlan._id) {
      setError("Please save the trip first.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/trips/${tripPlan._id}/chat`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message }),
      });
      const data = await response.json();
      if (response.ok && data.trip) {
        setChatMessages(
          data.trip.chatMessages.map((msg: any) => ({
            id: msg._id,
            userName: msg.user.name,
            message: msg.message,
            timestamp: new Date(msg.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
          }))
        );
      } else {
        setError(data.message || "Failed to send message.");
      }
    } catch (err) {
      console.error("Add chat message error:", err);
      setError("Failed to send message.");
    }
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
          <h1 className="text-3xl font-bold mb-2">Plan a Fun Group Trip to {tripPlan.destination || "Anywhere"}</h1>
          <p className="text-lg max-w-2xl mx-auto">Work together with friends to plan activities, split costs, and chat!</p>
          <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
            <DialogTrigger asChild>
              <Button className="mt-4 bg-white text-blue-500 hover:bg-gray-100" aria-label="Start group trip">
                Start Group Trip
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[36rem]">
              <DialogHeader>
                <DialogTitle>Start Your Group Trip</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleFormSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="tripName">Trip Name</Label>
                  <Input
                    id="tripName"
                    value={tripPlan.tripName}
                    onChange={(e) => setTripPlan({ ...tripPlan, tripName: e.target.value })}
                    placeholder="e.g., Summer Adventure"
                    aria-describedby="trip-name-help"
                  />
                  <p id="trip-name-help" className="text-sm text-gray-500">Enter a name for your trip.</p>
                </div>
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
                  <Label htmlFor="numberOfPersons">Number of Persons</Label>
                  <Input
                    id="numberOfPersons"
                    type="number"
                    min="1"
                    value={tripPlan.numberOfPersons}
                    onChange={(e) => setTripPlan({ ...tripPlan, numberOfPersons: parseInt(e.target.value) || 1 })}
                    placeholder="e.g., 4"
                    aria-describedby="persons-help"
                  />
                  <p id="persons-help" className="text-sm text-gray-500">Enter the number of people in your group.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-4">
                  <div className="flex-1">
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
                  <div className="flex-1">
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
                </div>
                <div>
                  <Label htmlFor="preferences">Trip Preferences</Label>
                  <Select
                    onValueChange={(value) => {
                      setTripPlan((prev) => ({
                        ...prev,
                        preferences: prev.preferences.includes(value)
                          ? prev.preferences
                          : [...prev.preferences, value],
                      }));
                    }}
                    aria-describedby="preferences-help"
                  >
                    <SelectTrigger id="preferences">
                      <SelectValue placeholder="Select preferences" />
                    </SelectTrigger>
                    <SelectContent className="max-h-60 overflow-y-auto">
                      {tripCategories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <p id="preferences-help" className="text-sm text-gray-500">Select preferred activity types.</p>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {tripPlan.preferences.map((pref, index) => (
                      <Badge
                        key={index}
                        className="cursor-pointer"
                        onClick={() =>
                          setTripPlan((prev) => ({
                            ...prev,
                            preferences: prev.preferences.filter((p) => p !== pref),
                          }))
                        }
                      >
                        {pref} ✕
                      </Badge>
                    ))}
                  </div>
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
          {inviteMessage && (
            <div className="bg-green-100 text-green-800 p-4 rounded-lg mb-4 text-center" role="alert">
              {inviteMessage}
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
              <h2 className="text-xl font-bold mb-4">Your Group Trip</h2>
              <p className="text-sm text-gray-600 mb-4">
                {tripDays.length > 0
                  ? `${tripPlan.tripName || "Unnamed Trip"} • ${tripDays[0].date} - ${tripDays[tripDays.length - 1].date} • ${tripPlan.members.length} friends • ${tripPlan.numberOfPersons} persons`
                  : "Start planning to see details"}
              </p>
              <div className="mb-4">
                <h3 className="font-semibold mb-2">Your Friends</h3>
                {tripPlan.members.map((member) => (
                  <div key={member.id} className="flex items-center justify-between mb-2">
                    <span>{member.name} {member.role === "Organizer" ? "(You)" : ""}</span>
                    {member.role !== "Organizer" && (
                      <Button variant="ghost" size="sm" aria-label={`Remove ${member.name}`}>
                        Remove
                      </Button>
                    )}
                  </div>
                ))}
                <Input
                  placeholder="Invite a friend (e.g., friend@email.com)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="mt-2"
                  aria-label="Invite a friend by email"
                />
                <Button
                  className="mt-2 w-full bg-blue-500 text-white hover:bg-blue-600"
                  onClick={handleInviteFriend}
                  aria-label="Send invite"
                >
                  Send Invite
                </Button>
              </div>
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
              <Button variant="outline" className="w-full mt-4" aria-label="Share trip">
                <Share className="w-4 h-4 mr-2" />
                Share Trip
              </Button>
            </div>

            <div className="flex-1">
              <Tabs defaultValue="itinerary">
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="itinerary">Plan</TabsTrigger>
                  <TabsTrigger value="expenses">Expenses</TabsTrigger>
                  <TabsTrigger value="chat">Chat</TabsTrigger>
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
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHotelVote(selectedDay, index, "like")}
                              aria-label={`Like ${hotel.HotelName}`}
                            >
                              Like ({hotel.reactions?.filter((r) => r.type === "like").length || 0})
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleHotelVote(selectedDay, index, "dislike")}
                              aria-label={`Dislike ${hotel.HotelName}`}
                            >
                              Dislike ({hotel.reactions?.filter((r) => r.type === "dislike").length || 0})
                            </Button>
                          </div>
                          {hotel.reactions?.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              Reactions:{" "}
                              {hotel.reactions.map((r, idx) => (
                                <span key={idx}>
                                  {r.user.name} ({r.type}){idx < hotel.reactions.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
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
                          <p className="text-sm text-gray-600">Suggested by {activity.proposedBy}</p>
                          <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
                          <div className="flex gap-2 mt-2">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(selectedDay, index, "like")}
                              aria-label={`Like ${activity.title}`}
                            >
                              Like ({activity.reactions?.filter((r) => r.type === "like").length || 0})
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleVote(selectedDay, index, "dislike")}
                              aria-label={`Dislike ${activity.title}`}
                            >
                              Dislike ({activity.reactions?.filter((r) => r.type === "dislike").length || 0})
                            </Button>
                          </div>
                          {activity.reactions?.length > 0 && (
                            <div className="mt-2 text-sm text-gray-600">
                              Reactions:{" "}
                              {activity.reactions.map((r, idx) => (
                                <span key={idx}>
                                  {r.user.name} ({r.type}){idx < activity.reactions.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="expenses">
                  <h2 className="text-lg font-semibold mb-4">Trip Expenses</h2>
                  <Card className="p-4 mb-4">
                    <div className="flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-4">
                      <div className="flex-1">
                        <Label htmlFor="expenseDescription">Expense Description</Label>
                        <Input
                          id="expenseDescription"
                          placeholder="e.g., Dinner at Cafe"
                          value={newExpenseDesc}
                          onChange={(e) => setNewExpenseDesc(e.target.value)}
                          aria-describedby="expense-desc-help"
                        />
                        <p id="expense-desc-help" className="text-sm text-gray-500">Enter what the expense was for.</p>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="expenseAmount">Amount ($)</Label>
                        <Input
                          id="expenseAmount"
                          type="number"
                          min="0"
                          step="0.01"
                          placeholder="e.g., 50.00"
                          value={newExpenseAmount}
                          onChange={(e) => setNewExpenseAmount(e.target.value)}
                          aria-describedby="expense-amount-help"
                        />
                        <p id="expense-amount-help" className="text-sm text-gray-500">Enter the expense amount in dollars.</p>
                      </div>
                      <div className="flex-1">
                        <Label htmlFor="expensePaidBy">Paid By (optional)</Label>
                        <Input
                          id="expensePaidBy"
                          placeholder="e.g., John Doe"
                          value={newExpensePaidBy}
                          onChange={(e) => setNewExpensePaidBy(e.target.value)}
                          aria-describedby="expense-paidby-help"
                        />
                        <p id="expense-paidby-help" className="text-sm text-gray-500">Enter the name of the person who paid.</p>
                      </div>
                    </div>
                    <Button
                      className="mt-4 w-full bg-blue-500 text-white hover:bg-blue-600"
                      onClick={() => handleAddExpense(newExpenseDesc, parseFloat(newExpenseAmount) || 0, newExpensePaidBy)}
                      aria-label="Add expense"
                    >
                      Add Expense
                    </Button>
                  </Card>
                  {expenses.map((expense) => (
                    <Card key={expense.id} className="p-4 mb-4">
                      <div className="flex justify-between">
                        <div>
                          <p className="font-medium">{expense.description}</p>
                          <p className="text-sm text-gray-600">Paid by {expense.paidBy}</p>
                        </div>
                        <p className="font-medium">${expense.amount.toFixed(2)}</p>
                      </div>
                    </Card>
                  ))}
                </TabsContent>
                <TabsContent value="chat">
                  <h2 className="text-lg font-semibold mb-4">Group Chat</h2>
                  <div className="h-64 overflow-y-auto border rounded-lg p-4 mb-4">
                    {chatMessages.map((msg) => (
                      <div key={msg.id} className="mb-2">
                        <p className="text-sm font-medium">
                          {msg.userName} <span className="text-xs text-gray-600">{msg.timestamp}</span>
                        </p>
                        <p className="text-sm">{msg.message}</p>
                      </div>
                    ))}
                  </div>
                  <Input
                    placeholder="Send a message..."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        handleAddChatMessage(e.currentTarget.value);
                        e.currentTarget.value = "";
                      }
                    }}
                    aria-label="Send chat message"
                  />
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

export default GroupTripPlanner;