import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Navigate } from "react-router-dom";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

interface Invite {
  _id: string;
  trip: { _id: string; tripName: string; destination: string } | null; // Allow trip to be null
  invitedBy: { name: string };
  status: string;
}

const Invites = () => {
  const [invites, setInvites] = useState<Invite[]>([]);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchInvites = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setIsAuthenticated(false);
        setIsLoading(false);
        return;
      }

      try {
        const response = await fetch("http://localhost:4000/api/trips/invites/my", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
        const data = await response.json();
        if (response.ok) {
          setInvites(data.invites);
          setIsAuthenticated(true);
        } else {
          setError(data.message || "Failed to fetch invites.");
          setIsAuthenticated(false);
          localStorage.removeItem("token");
        }
      } catch (err) {
        console.error("Fetch invites error:", err);
        setError("Failed to fetch invites.");
        setIsAuthenticated(false);
        localStorage.removeItem("token");
      } finally {
        setIsLoading(false);
      }
    };
    fetchInvites();
  }, []);

  const handleAcceptInvite = async (inviteId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/trips/invites/${inviteId}/accept`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
        setError(null);
      } else {
        setError(data.message || "Failed to accept invite.");
      }
    } catch (err) {
      console.error("Accept invite error:", err);
      setError("Failed to accept invite.");
    }
  };

  const handleDeclineInvite = async (inviteId: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://localhost:4000/api/trips/invites/${inviteId}/decline`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setInvites((prev) => prev.filter((invite) => invite._id !== inviteId));
        setError(null);
      } else {
        setError(data.message || "Failed to decline invite.");
      }
    } catch (err) {
      console.error("Decline invite error:", err);
      setError("Failed to decline invite.");
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
          <h1 className="text-3xl font-bold mb-2">My Invites</h1>
          <p className="text-lg max-w-2xl mx-auto">View and manage your trip invitations.</p>
        </div>
        <div className="container mx-auto px-4 py-8">
          {error && (
            <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4 text-center" role="alert">
              {error}
            </div>
          )}
          {invites.length === 0 && (
            <p className="text-center text-gray-600">No pending invitations.</p>
          )}
          <div className="grid gap-6">
            {invites.map((invite) => (
              <Card key={invite._id} className="p-6">
                {invite.trip ? (
                  <>
                    <h2 className="text-xl font-bold mb-2">{invite.trip.tripName}</h2>
                    <p className="text-sm text-gray-600 mb-2">Destination: {invite.trip.destination}</p>
                  </>
                ) : (
                  <>
                    <h2 className="text-xl font-bold mb-2 text-red-600">Trip Not Found</h2>
                    <p className="text-sm text-gray-600 mb-2">This trip may have been deleted.</p>
                  </>
                )}
                <p className="text-sm text-gray-600 mb-4">Invited by: {invite.invitedBy.name}</p>
                <div className="flex gap-4">
                  <Button
                    className="bg-blue-500 text-white hover:bg-blue-600"
                    onClick={() => handleAcceptInvite(invite._id)}
                    aria-label={`Accept invite to ${invite.trip?.tripName || "unknown trip"}`}
                    disabled={!invite.trip} // Disable if trip is null
                  >
                    Accept
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleDeclineInvite(invite._id)}
                    aria-label={`Decline invite to ${invite.trip?.tripName || "unknown trip"}`}
                  >
                    Decline
                  </Button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Invites;