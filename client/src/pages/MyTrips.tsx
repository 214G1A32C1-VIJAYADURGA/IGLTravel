import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";
import { Link, Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Trip {
  _id: string;
  tripName: string;
  destination: string;
  startDate: string;
  endDate: string;
  numberOfPersons: number;
  members: { user: { _id: string; name: string }; role: string; status: string }[];
  itinerary: {
    days: {
      day: number;
      activities: {
        activity: string;
        time: string;
        location: string;
        description: string;
        category: string;
        image: string;
        reactions: { user: { name: string; _id: string }; type: string }[];
      }[];
      hotels: {
        HotelName: string;
        CleanedAttractions: string;
        Address: string;
        HotelRating: string;
        HotelWebsiteUrl: string;
        reactions: { user: { name: string; _id: string }; type: string }[];
      }[];
    }[];
  };
  expenses: { description: string; amount: number; paidBy: { name: string }; createdAt: string }[];
  chatMessages: { user: { name: string }; message: string; timestamp: string }[];
}

const MyTrips = () => {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTrips = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/trips/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setTrips(data.trips);
          setIsAuthenticated(true);
        } else {
          setError(data.message || "Failed to fetch trips. You may have pending invitations.");
          setIsAuthenticated(true);
        }
      } catch (err) {
        console.error("Fetch trips error:", err);
        setError("Failed to fetch trips. Check your connection or visit the Invites page for pending invitations.");
        setIsAuthenticated(true);
      } finally {
        setIsLoading(false);
      }
    };
    fetchTrips();
  }, []);

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
          <h1 className="text-3xl font-bold mb-2">My Trips</h1>
          <p className="text-lg max-w-2xl mx-auto">View all your planned trips, members, and interactions.</p>
          <div className="mt-4 flex gap-4 justify-center">
            <Link to="/group-trip-planner">
              <Button className="bg-white text-blue-500 hover:bg-gray-100" aria-label="Plan a new trip">
                Plan a New Trip
              </Button>
            </Link>
            <Link to="/invites">
              <Button className="bg-white text-blue-500 hover:bg-gray-100" aria-label="View invites">
                View Invites
              </Button>
            </Link>
          </div>
        </div>
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center" role="alert">
              {error}
              <div className="mt-2">
                <Link to="/invites">
                  <Button variant="link" className="text-red-800 underline" aria-label="Go to Invites page">
                    Check Pending Invites
                  </Button>
                </Link>
              </div>
            </div>
          )}
          {trips.length === 0 && (
            <p className="text-center text-gray-600">No trips found. Start planning a new trip or check your invites!</p>
          )}
          <div className="grid gap-6">
            {trips.map((trip) => (
              <Card key={trip._id} className="p-6">
                <h2 className="text-xl font-bold mb-2">{trip.tripName}</h2>
                <p className="text-sm text-gray-600 mb-2">
                  {trip.destination} • {new Date(trip.startDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} -{" "}
                  {new Date(trip.endDate).toLocaleDateString("en-US", { month: "short", day: "numeric" })} • {trip.numberOfPersons} persons
                </p>
                <h3 className="font-semibold mb-2">Members</h3>
                <div className="flex flex-wrap gap-2 mb-4">
                  {trip.members.map((member) => (
                    <Badge key={member.user._id} className="bg-blue-100 text-blue-800">
                      {member.user.name} ({member.role})
                    </Badge>
                  ))}
                </div>
                <h3 className="font-semibold mb-2">Itinerary</h3>
                {trip.itinerary.days.map((day) => (
                  <div key={day.day} className="mb-4">
                    <h4 className="font-medium">Day {day.day}</h4>
                    <div className="ml-4">
                      <h5 className="font-semibold mb-1">Activities</h5>
                      {day.activities.map((activity, idx) => (
                        <div key={idx} className="mb-2">
                          <div className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>{activity.time}</span>
                            <Badge>{activity.category}</Badge>
                          </div>
                          <p className="font-medium">{activity.activity}</p>
                          <p className="text-sm text-gray-600">{activity.description}</p>
                          {activity.reactions.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Reactions: {activity.reactions.map((r, i) => (
                                <span key={i}>
                                  {r.user.name} ({r.type}){i < activity.reactions.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      ))}
                      <h5 className="font-semibold mb-1">Hotels</h5>
                      {day.hotels.map((hotel, idx) => (
                        <div key={idx} className="mb-2">
                          <p className="font-medium">{hotel.HotelName}</p>
                          <p className="text-sm text-gray-600">Rating: {hotel.HotelRating} ★</p>
                          <p className="text-sm text-gray-600">Address: {hotel.Address}</p>
                          {hotel.reactions.length > 0 && (
                            <p className="text-sm text-gray-600">
                              Reactions: {hotel.reactions.map((r, i) => (
                                <span key={i}>
                                  {r.user.name} ({r.type}){i < hotel.reactions.length - 1 ? ", " : ""}
                                </span>
                              ))}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
                <h3 className="font-semibold mb-2">Expenses</h3>
                {trip.expenses.map((expense, idx) => (
                  <div key={idx} className="flex justify-between mb-2">
                    <div>
                      <p className="text-sm font-medium">{expense.description}</p>
                      <p className="text-sm text-gray-600">Paid by {expense.paidBy.name}</p>
                    </div>
                    <p className="text-sm font-medium">${expense.amount}</p>
                  </div>
                ))}
                <h3 className="font-semibold mb-2">Chat Messages</h3>
                {trip.chatMessages.map((msg, idx) => (
                  <div key={idx} className="mb-2">
                    <p className="text-sm font-medium">
                      {msg.user.name} <span className="text-xs text-gray-600">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                    </p>
                    <p className="text-sm">{msg.message}</p>
                  </div>
                ))}
                <Link to={`/group-trip-planner/${trip._id}`}>
                  <Button className="mt-4 bg-blue-500 text-white hover:bg-blue-600" aria-label={`View ${trip.tripName}`}>
                    View Trip
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default MyTrips;