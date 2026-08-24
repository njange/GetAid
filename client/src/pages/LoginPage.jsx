import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GoogleLogin } from "@react-oauth/google";
import { useAuth } from "../context/AuthContext";
import "./auth.css";

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
    <section className="auth-page">
      <h1>First Aid</h1>
      <p>Sign in to continue</p>

      {error && <p className="auth-error">{error}</p>}

      <GoogleLogin
        text="continue_with"
        onSuccess={handleGoogleSuccess}
        onError={() => setError("Google sign-in failed")}
      />

      <div className="auth-divider">or</div>

      <button
        type="button"
        className="auth-button"
        onClick={() => navigate("/register")}
      >
        Continue with email
      </button>
    </section>
  );
}
