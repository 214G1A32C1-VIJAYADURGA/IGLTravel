import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Phone, 
  MapPin,
  Globe,
  CreditCard
} from "lucide-react";

interface SafetyAlert {
  type: "info" | "warning";
  title: string;
  message: string;
  priority: "low" | "medium" | "high";
}

interface Document {
  name: string;
  required: boolean;
  expires?: string;
  coverage?: string;
  note?: string;
}

interface EmergencyContact {
  service: string;
  number: string;
  type: "emergency" | "support";
}

interface SafetyDashboardProps {
  tripDestination?: string;
}

const SafetyDashboard = ({ tripDestination = "Unknown Destination" }: SafetyDashboardProps) => {
  const [safetyAlerts, setSafetyAlerts] = useState<SafetyAlert[]>([]);
  const [requiredDocuments, setRequiredDocuments] = useState<Document[]>([]);
  const [emergencyContacts, setEmergencyContacts] = useState<EmergencyContact[]>([]);
  const [culturalTips, setCulturalTips] = useState<string[]>([]);
  const [safetyTips, setSafetyTips] = useState<string[]>([]);
  const [safetyRating, setSafetyRating] = useState<string>("N/A");
  const [crimeRate, setCrimeRate] = useState<string>("Unknown");
  const [error, setError] = useState<string | null>(null);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;

  // Fallback data if API call fails
  const fallbackData = {
    safetyAlerts: [
      {
        type: "info" as const,
        title: "General Advisory",
        message: "Check local guidelines before traveling.",
        priority: "medium" as const,
      },
    ],
    requiredDocuments: [
      { name: "Passport", required: true },
      { name: "Travel Insurance", required: true },
      { name: "Visa", required: false, note: "Check visa requirements for your nationality." },
    ],
    emergencyContacts: [
      { service: "Emergency Services", number: "911", type: "emergency" as const },
      { service: "Tourist Assistance", number: "Unknown", type: "support" as const },
    ],
    culturalTips: ["Respect local customs and traditions."],
    safetyTips: ["Keep emergency contacts saved offline.", "Share your itinerary with family/friends."],
    safetyRating: "N/A",
    crimeRate: "Unknown",
  };

  // Fetch safety information from Gemini API
  useEffect(() => {
    const fetchSafetyInfo = async () => {
      if (!GEMINI_API_KEY) {
        setError("Gemini API key not found. Please set VITE_GEMINI_API_KEY in .env.");
        setSafetyAlerts(fallbackData.safetyAlerts);
        setRequiredDocuments(fallbackData.requiredDocuments);
        setEmergencyContacts(fallbackData.emergencyContacts);
        setCulturalTips(fallbackData.culturalTips);
        setSafetyTips(fallbackData.safetyTips);
        setSafetyRating(fallbackData.safetyRating);
        setCrimeRate(fallbackData.crimeRate);
        return;
      }

      const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;
      const prompt = `
        Provide safety information for traveling to ${tripDestination} as of July 31, 2025. Include:
        - 'safety_alerts': List of current safety alerts (e.g., health, weather, security) with 'type' ("info" or "warning"), 'title', 'message', and 'priority' ("low", "medium", "high").
        - 'required_documents': List of travel documents with 'name', 'required' (boolean), and optional 'expires', 'coverage', or 'note' fields.
        - 'emergency_contacts': List of emergency contacts with 'service', 'number', and 'type' ("emergency" or "support").
        - 'cultural_tips': List of cultural etiquette tips as strings.
        - 'safety_tips': List of safety precautions as strings.
        - 'safety_rating': Safety rating out of 10 (e.g., "8.5/10").
        - 'crime_rate': Crime rate level ("Low", "Medium", "High").

        Return in JSON format like:
        {
          "safety_alerts": [
            {
              "type": "info",
              "title": "string",
              "message": "string",
              "priority": "medium"
            },
            ...
          ],
          "required_documents": [
            {
              "name": "string",
              "required": boolean,
              "expires": "string" | null,
              "coverage": "string" | null,
              "note": "string" | null
            },
            ...
          ],
          "emergency_contacts": [
            {
              "service": "string",
              "number": "string",
              "type": "emergency" | "support"
            },
            ...
          ],
          "cultural_tips": ["string", ...],
          "safety_tips": ["string", ...],
          "safety_rating": "string",
          "crime_rate": "string"
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
        const safetyInfoText = result.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!safetyInfoText) throw new Error("Invalid response from Gemini API.");

        const safetyInfo = JSON.parse(safetyInfoText);

        setSafetyAlerts(safetyInfo.safety_alerts || fallbackData.safetyAlerts);
        setRequiredDocuments(safetyInfo.required_documents || fallbackData.requiredDocuments);
        setEmergencyContacts(safetyInfo.emergency_contacts || fallbackData.emergencyContacts);
        setCulturalTips(safetyInfo.cultural_tips || fallbackData.culturalTips);
        setSafetyTips(safetyInfo.safety_tips || fallbackData.safetyTips);
        setSafetyRating(safetyInfo.safety_rating || fallbackData.safetyRating);
        setCrimeRate(safetyInfo.crime_rate || fallbackData.crimeRate);
      } catch (err) {
        setError(`Failed to fetch safety information: ${err.message}`);
        setSafetyAlerts(fallbackData.safetyAlerts);
        setRequiredDocuments(fallbackData.requiredDocuments);
        setEmergencyContacts(fallbackData.emergencyContacts);
        setCulturalTips(fallbackData.culturalTips);
        setSafetyTips(fallbackData.safetyTips);
        setSafetyRating(fallbackData.safetyRating);
        setCrimeRate(fallbackData.crimeRate);
      }
    };

    if (tripDestination !== "Unknown Destination") {
      fetchSafetyInfo();
    }
  }, [tripDestination, GEMINI_API_KEY]);

  return (
    <div className="space-y-6">
      {/* Safety Overview */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Safety Dashboard - {tripDestination}
          </h2>
          <Badge variant="default" className="bg-green-500">
            <CheckCircle className="w-3 h-3 mr-1" />
            Safe to Travel
          </Badge>
        </div>
        
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="text-center p-3 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">{safetyRating}</div>
            <div className="text-sm text-green-700">Safety Rating</div>
          </div>
          <div className="text-center p-3 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">{crimeRate}</div>
            <div className="text-sm text-blue-700">Crime Rate</div>
          </div>
          <div className="text-center p-3 bg-yellow-50 rounded-lg">
            <div className="text-2xl font-bold text-yellow-600">{safetyAlerts.length}</div>
            <div className="text-sm text-yellow-700">Active Alerts</div>
          </div>
        </div>
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg">
            {error}
          </div>
        )}
      </Card>

      {/* Active Alerts */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4 flex items-center">
          <AlertTriangle className="w-5 h-5 mr-2 text-yellow-500" />
          Active Alerts & Updates
        </h3>
        <div className="space-y-3">
          {safetyAlerts.map((alert, index) => (
            <div key={index} className={`p-4 rounded-lg border-l-4 ${
              alert.priority === 'high' ? 'bg-red-50 border-red-500' : 'bg-yellow-50 border-yellow-500'
            }`}>
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-medium">{alert.title}</h4>
                  <p className="text-sm text-muted-foreground mt-1">{alert.message}</p>
                </div>
                <Badge variant={alert.priority === 'high' ? 'destructive' : 'secondary'}>
                  {alert.priority}
                </Badge>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Document Checklist */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-blue-500" />
            Travel Documents
          </h3>
          <div className="space-y-3">
            {requiredDocuments.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div className="flex items-center">
                  <CheckCircle className="w-4 h-4 mr-2 text-green-500" />
                  <div>
                    <div className="font-medium">{doc.name}</div>
                    {doc.expires && (
                      <div className="text-xs text-muted-foreground">Expires: {doc.expires}</div>
                    )}
                    {doc.coverage && (
                      <div className="text-xs text-muted-foreground">Coverage: {doc.coverage}</div>
                    )}
                    {doc.note && (
                      <div className="text-xs text-muted-foreground">{doc.note}</div>
                    )}
                  </div>
                </div>
                <Badge variant={doc.required ? "default" : "secondary"}>
                  {doc.required ? "Required" : "Optional"}
                </Badge>
              </div>
            ))}
          </div>
        </Card>

        {/* Emergency Contacts */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Phone className="w-5 h-5 mr-2 text-red-500" />
            Emergency Contacts
          </h3>
          <div className="space-y-3">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-secondary rounded-lg">
                <div>
                  <div className="font-medium">{contact.service}</div>
                  <div className="text-sm text-muted-foreground">{contact.number}</div>
                </div>
                <Badge variant={contact.type === 'emergency' ? 'destructive' : 'outline'}>
                  {contact.type}
                </Badge>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4">
            <Phone className="w-4 h-4 mr-2" />
            Save All Contacts
          </Button>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cultural Tips */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Globe className="w-5 h-5 mr-2 text-purple-500" />
            Cultural Etiquette
          </h3>
          <div className="space-y-2">
            {culturalTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-purple-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Safety Tips */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4 flex items-center">
            <Shield className="w-5 h-5 mr-2 text-green-500" />
            Safety Precautions
          </h3>
          <div className="space-y-2">
            {safetyTips.map((tip, index) => (
              <div key={index} className="flex items-start">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2 mr-3 flex-shrink-0"></div>
                <span className="text-sm">{tip}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="p-6">
        <h3 className="text-lg font-semibold mb-4">Quick Safety Actions</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <MapPin className="w-6 h-6 mb-2" />
            <span className="text-sm">Share Location</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <Phone className="w-6 h-6 mb-2" />
            <span className="text-sm">Emergency Call</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <FileText className="w-6 h-6 mb-2" />
            <span className="text-sm">View Policies</span>
          </Button>
          <Button variant="outline" className="flex flex-col items-center p-4 h-auto">
            <CreditCard className="w-6 h-6 mb-2" />
            <span className="text-sm">Travel Insurance</span>
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default SafetyDashboard;