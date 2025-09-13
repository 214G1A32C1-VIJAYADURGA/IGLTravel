import { useState } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Mail, AlertTriangle } from "lucide-react";
import { toast } from "@/components/ui/sonner";

interface ApiResponse {
  message: string;
}

const ForgotPassword: React.FC = () => {
  const [step, setStep] = useState<"email" | "otp">("email");
  const [formData, setFormData] = useState({ email: "", otp: "" });
  const [errors, setErrors] = useState({ email: "", otp: "" });
  const [serverError, setServerError] = useState("");
  const [success, setSuccess] = useState("");
  const [emailChecked, setEmailChecked] = useState(false);
  const navigate = useNavigate();

  const validateEmail = () => {
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      setErrors((prev) => ({ ...prev, email: "Please enter a valid email" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, email: "" }));
    return true;
  };

  const validateOtp = () => {
    if (!formData.otp.match(/^\d{6}$/)) {
      setErrors((prev) => ({ ...prev, otp: "Please enter a valid 6-digit OTP" }));
      return false;
    }
    setErrors((prev) => ({ ...prev, otp: "" }));
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
    setSuccess("");
  };

  const handleCheckEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateEmail()) return;

    try {
      const response = await fetch("http://localhost:4000/api/users/check-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setSuccess("Email found. Sending OTP...");
        toast.success("Email found!", {
          description: "An OTP will be sent to your email.",
        });
        await handleSendOtp();
      } else {
        setServerError(data.message);
        toast.warning(data.message, {
          description: "Please register or use a different email.",
        });
      }
    } catch (error) {
      setServerError("Failed to connect to the server. Please ensure the backend is running.");
      toast.error("Server connection failed", {
        description: "Unable to reach the server. Check if the backend is running on port 4000.",
      });
    }
  };

  const handleSendOtp = async () => {
    try {
      const response = await fetch("http://localhost:4000/api/users/send-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setSuccess("OTP sent to your email. Please check your inbox or spam folder.");
        toast.success("OTP sent!", {
          description: "Please check your inbox (and spam folder) for the OTP.",
        });
        setEmailChecked(true);
        setStep("otp");
      } else {
        setServerError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      setServerError("Failed to send OTP. Please try again.");
      toast.error("Failed to send OTP", {
        description: "Unable to connect to the server or email service.",
      });
    }
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateOtp()) return;

    try {
      const response = await fetch("http://localhost:4000/api/users/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: formData.email, otp: formData.otp }),
      });
      const data: ApiResponse = await response.json();

      if (response.ok) {
        setSuccess("OTP verified successfully. Redirecting to reset password...");
        toast.success("OTP verified!", {
          description: "You will be redirected to set a new password.",
        });
        setTimeout(() => navigate(`/reset-password?email=${encodeURIComponent(formData.email)}`), 2000);
      } else {
        setServerError(data.message);
        toast.error(data.message);
      }
    } catch (error) {
      setServerError("Failed to verify OTP. Please try again.");
      toast.error("Failed to verify OTP", {
        description: "Unable to connect to the server.",
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg space-y-6"
      >
        <div className="text-center">
          <h2 className="text-3xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
            Reset Your Password
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            {step === "email" && "Enter your email to receive an OTP."}
            {step === "otp" && "Enter the OTP sent to your email."}
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleCheckEmail} className="space-y-4">
            <div>
              <Label htmlFor="email">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="pl-10 mt-1"
                  placeholder="you@example.com"
                  disabled={emailChecked}
                />
              </div>
              {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              {serverError && (
                <p className="text-sm text-yellow-500 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4 mr-2" />
                  {serverError}
                </p>
              )}
              {success && <p className="text-sm text-green-500 text-center">{success}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-ocean">
              Check Email
            </Button>
          </form>
        )}

        {step === "otp" && (
          <form onSubmit={handleVerifyOtp} className="space-y-4">
            <div>
              <Label htmlFor="email">Email (Verified)</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  className="pl-10 mt-1 bg-gray-100 cursor-not-allowed"
                  disabled
                />
              </div>
            </div>
            <div>
              <Label htmlFor="otp">OTP</Label>
              <div className="relative">
                <Input
                  id="otp"
                  name="otp"
                  type="text"
                  value={formData.otp}
                  onChange={handleInputChange}
                  className="pl-10 mt-1"
                  placeholder="Enter 6-digit OTP"
                />
              </div>
              {errors.otp && <p className="text-sm text-destructive">{errors.otp}</p>}
              {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
              {success && <p className="text-sm text-green-500 text-center">{success}</p>}
            </div>
            <Button type="submit" className="w-full bg-gradient-ocean">
              Verify OTP
            </Button>
          </form>
        )}

        <p className="text-center text-sm text-muted-foreground">
          Back to{" "}
          <Link to="/signin" className="text-primary hover:underline">
            Sign In
          </Link>
        </p>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;