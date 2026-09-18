import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";
import { register } from "../lib/api";
import { toast } from "../hooks/use-toast";
import GoogleAuthButton from "../components/GoogleAuthButton";

const SignUp = () => {
  const navigate = useNavigate();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName || !email || !password) {
      toast({
        title: "Error",
        description: "Please fill in all details.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    try {
      const result = await register({ full_name: fullName, email, password });
      localStorage.setItem("user_id", result.user_id);
      localStorage.setItem("full_name", fullName);
      toast({
        title: "Success",
        description: "Account created successfully!",
      });
      navigate("/capture");
    } catch (error: any) {
      toast({
        title: "Registration Failed",
        description: error.message || "Something went wrong.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0a0f0a] flex flex-col items-center justify-center px-4 py-8 relative overflow-hidden">
      {/* Background Ambience */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-primary/5 rounded-full blur-[140px] pointer-events-none" />

      {/* Logo Section */}
      <div className="flex flex-col items-center mb-8 animate-fade-in">
        <div className="w-14 h-14 rounded-full bg-[#b4f43c] flex items-center justify-center mb-4 shadow-[0_0_20px_rgba(180,244,60,0.3)] relative">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center">
            <div className="w-3 h-3 bg-white rounded-full mb-2" />
            <div className="absolute top-[55%] w-5 h-3 bg-white rounded-t-full" />
          </div>
        </div>
        <h1 className="text-2xl font-bold text-white tracking-tight">NutriLink</h1>
      </div>

      {/* Card */}
      <div className="w-full max-w-sm bg-black/40 backdrop-blur-2xl border border-white/10 rounded-[40px] p-8 shadow-3xl animate-slide-up">
        <div className="mb-8">
          <h2 className="text-xl font-bold text-white mb-1">Create Account</h2>
          <p className="text-white/40 text-sm">Join the community of health enthusiasts.</p>
        </div>

        <form onSubmit={handleSignUp} className="space-y-4">
          <div className="relative group">
            <User size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#b4f43c] transition-colors" />
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name"
              className="w-full bg-[#1a1f1a]/80 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#b4f43c]/30 focus:bg-[#1a1f1a] transition-all"
            />
          </div>

          <div className="relative group">
            <Mail size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#b4f43c] transition-colors" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="name@example.com"
              className="w-full bg-[#1a1f1a]/80 border border-white/5 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-white/20 focus:outline-none focus:border-[#b4f43c]/30 focus:bg-[#1a1f1a] transition-all"
            />
          </div>

          <div className="relative group">
            <Lock size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#b4f43c] transition-colors" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a password"
              className="w-full bg-[#1a1f1a]/80 border border-white/5 rounded-2xl py-4 pl-12 pr-11 text-white placeholder:text-white/20 focus:outline-none focus:border-[#b4f43c]/30 focus:bg-[#1a1f1a] transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-white/20 hover:text-white p-1"
            >
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#b4f43c] text-black font-bold py-4 rounded-full shadow-[0_0_15px_rgba(180,244,60,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 mt-2"
          >
            {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Create Account"}
          </button>
        </form>

        {/* Social Login */}
        <div className="mt-6 flex flex-col items-center">
          <div className="relative w-full mb-4 flex items-center justify-center px-4">
            <div className="absolute inset-0 flex items-center px-4">
              <span className="w-full border-t border-white/5" />
            </div>
            <span className="relative bg-[#0d120d] px-4 text-[10px] uppercase tracking-widest text-white/20 font-bold">
              Or sign up with
            </span>
          </div>

          <GoogleAuthButton label="Sign up with Google" />
        </div>

        <p className="text-center text-sm text-white/40 mt-8">
          Already have an account?{" "}
          <button onClick={() => navigate("/signin")} className="text-[#b4f43c] hover:underline font-bold">
            Sign In
          </button>
        </p>

        <div className="flex justify-center gap-4 mt-8 text-[9px] text-white/20 font-bold tracking-widest uppercase">
          <button className="hover:text-white transition-colors">TERMS</button>
          <button className="hover:text-white transition-colors">PRIVACY</button>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
