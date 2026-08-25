import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import { AuthLayout } from "../components/AuthLayout";

export function LoginPage() {
  const { loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState("");

  async function handleGoogleSuccess(credentialResponse) {
    setError("");
    try {
      await loginWithGoogle(credentialResponse.credential);
      navigate("/");
    } catch (err) {
      setError(err.message);
    }
  }

  return (
    <AuthLayout
      eyebrow="First Aid"
      title="Welcome back!"
      subtitle="Sign in to keep building the skills and confidence to help when it counts."
    >
      {error && <p className="auth-error">{error}</p>}

      <div className="auth-social">
        <GoogleLogin
          text="continue_with"
          shape="pill"
          onSuccess={handleGoogleSuccess}
          onError={() => setError("Google sign-in failed")}
        />
      </div>

      <div className="auth-divider">or</div>

      <button
        type="button"
        className="auth-button"
        onClick={() => navigate("/register")}
      >
        Continue with email
      </button>

      <p className="auth-links">
        Already have an account? <Link to="/login/email">Log in with email</Link>
      </p>
    </AuthLayout>
  );
}
