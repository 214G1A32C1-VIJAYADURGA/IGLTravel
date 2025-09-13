import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Link, useNavigate } from "react-router-dom";
import { Eye, EyeOff, Mail, Lock } from "lucide-react";
import axios from "axios";

interface SignInResponse {
  success: boolean;
  token?: string;
  message?: string;
}

const SignIn: React.FC = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is already authenticated (token exists)
    const token = localStorage.getItem("token");
    if (token) {
      setIsAuthenticated(true);
      navigate("/"); // Redirect to home route if authenticated
    }
  }, [navigate]);

  const validateForm = () => {
    let isValid = true;
    const newErrors = { email: "", password: "" };

    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      newErrors.email = "Please enter a valid email";
      isValid = false;
    }
    if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: "" });
    setServerError("");
  };

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await axios.post<SignInResponse>("http://localhost:4000/api/users/login", {
        email: formData.email,
        password: formData.password,
      });
      const { token } = response.data;
      localStorage.setItem("token", token!);
      setIsAuthenticated(true);
      navigate("/"); // Redirect to home route
    } catch (error: any) {
      let errorMessage = "Login failed";
      if (error.response?.status === 401) {
        errorMessage = "Invalid credentials";
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      }
      setServerError(errorMessage);
    }
  };

  const handleSignOut = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/"); // Redirect to home route
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-card p-8 rounded-xl shadow-lg space-y-6"
      >
        {isAuthenticated ? (
          <div className="text-center">
            <h2 className="text-3xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
              You are signed in
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ready to plan your next adventure?
            </p>
            <Button onClick={handleSignOut} className="w-full bg-gradient-ocean mt-4">
              Sign Out
            </Button>
            <Button
              variant="outline"
              className="w-full mt-2"
              onClick={() => navigate("/")}
            >
              Go to Home
            </Button>
          </div>
        ) : (
          <>
            <div className="text-center">
              <h2 className="text-3xl font-bold bg-gradient-ocean bg-clip-text text-transparent">
                Welcome to TravelAI
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Don't have an account?{" "}
                <Link to="/signup" className="text-primary hover:underline">
                  Sign Up
                </Link>
              </p>
            </div>

            <form onSubmit={handleSignIn} className="space-y-4">
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
                  />
                </div>
                {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
              </div>
              <div>
                <Label htmlFor="password">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    value={formData.password}
                    onChange={handleInputChange}
                    className="pl-10 pr-10 mt-1"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4 text-muted-foreground" /> : <Eye className="w-4 h-4 text-muted-foreground" />}
                  </button>
                </div>
                {errors.password && <p className="text-sm text-destructive">{errors.password}</p>}
              </div>
              <div className="flex justify-end">
                <Link to="/forgot-password" className="text-sm text-primary hover:underline">
                  Forgot Password?
                </Link>
              </div>
              {serverError && <p className="text-sm text-destructive text-center">{serverError}</p>}
              <Button type="submit" className="w-full bg-gradient-ocean">
                Sign In
              </Button>
            </form>
          </>
        )}
      </motion.div>
    </div>
  );
};

export default SignIn;