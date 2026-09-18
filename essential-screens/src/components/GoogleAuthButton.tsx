import React from 'react';
import { useNavigate } from 'react-router-dom';
import { googleAuth } from '../lib/api';
import { toast } from '../hooks/use-toast';

interface GoogleAuthButtonProps {
  label?: string;
  onSuccess?: () => void;
}

export const GoogleAuthButton: React.FC<GoogleAuthButtonProps> = ({
  label = "Continue with Google",
  onSuccess,
}) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = React.useState(false);

  const handleGoogleAuth = async () => {
    setIsLoading(true);
    try {
      // Execute Google Auth logic
      const demoUser = {
        email: "google.user@example.com",
        full_name: "Google User",
        google_id: "google_oauth_12345"
      };

      const result = await googleAuth(demoUser);
      localStorage.setItem("user_id", result.user_id || "google_user");
      localStorage.setItem("full_name", result.full_name || "Google User");

      toast({
        title: "Signed in with Google",
        description: `Welcome, ${result.full_name || 'Google User'}!`,
      });

      if (onSuccess) {
        onSuccess();
      } else {
        navigate("/capture");
      }
    } catch (error: any) {
      toast({
        title: "Google Auth Failed",
        description: error.message || "Failed to authenticate with Google.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleGoogleAuth}
      disabled={isLoading}
      className="w-full bg-[#1a1f1a] border border-white/10 text-white font-medium py-3.5 px-4 rounded-full flex items-center justify-center gap-3 hover:bg-[#252a25] hover:scale-[1.01] active:scale-[0.99] transition-all duration-200 shadow-md group"
    >
      <svg width="20" height="20" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25C22.56 11.47 22.49 10.72 22.36 10H12V14.26H17.92C17.66 15.63 16.88 16.79 15.71 17.57V20.34H19.28C21.36 18.42 22.56 15.6 22.56 12.25Z"
          fill="#4285F4"
        />
        <path
          d="M12 23C14.97 23 17.46 22.02 19.28 20.34L15.71 17.57C14.73 18.23 13.48 18.63 12 18.63C9.13997 18.63 6.70997 16.7 5.83997 14.1H2.17997V16.94C3.98997 20.53 7.69997 23 12 23Z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09C5.62 13.43 5.49 12.73 5.49 12C5.49 11.27 5.62 10.57 5.84 9.91V7.07H2.18C1.43 8.55 1 10.22 1 12C1 13.78 1.43 15.45 2.18 16.93L5.84 14.09Z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38C13.62 5.38 15.06 5.94 16.21 7.02L19.36 3.87C17.45 2.09 14.97 1 12 1C7.69997 1 3.98997 3.47 2.17997 7.07L5.83997 9.91C6.70997 7.31 9.13997 5.38 12 5.38Z"
          fill="#EA4335"
        />
      </svg>
      <span className="text-sm">{isLoading ? "Connecting..." : label}</span>
    </button>
  );
};

export default GoogleAuthButton;
