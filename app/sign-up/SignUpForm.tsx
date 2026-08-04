"use client";

import { FormEvent, useState } from "react";
import {
  AuthError,
  createAccount,
  hasFirebaseConfig,
  isValidEmail,
} from "../lib/auth";

const businessTypes = ["Cafe", "Restaurant", "Gym", "Retail store", "Other"];

export function SignUpForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [businessName, setBusinessName] = useState("");
  const [businessType, setBusinessType] = useState(businessTypes[0]);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setMessage("");

    if (!name.trim() || !businessName.trim()) {
      setMessage("Add your name and business name to continue.");
      return;
    }
    if (!isValidEmail(email)) {
      setMessage("Enter a valid business email address.");
      return;
    }
    if (password.length < 6) {
      setMessage("Use a password with at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("The passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      await createAccount({
        name,
        email: email.trim(),
        password,
        businessName,
        businessType,
      });
      window.location.assign("/setup");
    } catch (error) {
      setMessage(
        error instanceof AuthError
          ? error.message
          : "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="auth-form" onSubmit={handleSubmit} noValidate>
      {!hasFirebaseConfig() && (
        <p className="form-note" role="status">
          Add Firebase Authentication settings before account creation can be completed.
        </p>
      )}

      <label className="field-label" htmlFor="name">
        Name
      </label>
      <input
        id="name"
        name="name"
        type="text"
        autoComplete="name"
        value={name}
        onChange={(event) => setName(event.target.value)}
        required
      />

      <label className="field-label" htmlFor="signup-email">
        Business email
      </label>
      <input
        id="signup-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <div className="form-grid">
        <div>
          <label className="field-label" htmlFor="business-name">
            Business name
          </label>
          <input
            id="business-name"
            name="businessName"
            type="text"
            autoComplete="organization"
            value={businessName}
            onChange={(event) => setBusinessName(event.target.value)}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="business-type">
            Business type
          </label>
          <select
            id="business-type"
            name="businessType"
            value={businessType}
            onChange={(event) => setBusinessType(event.target.value)}
          >
            {businessTypes.map((type) => (
              <option key={type}>{type}</option>
            ))}
          </select>
        </div>
      </div>

      <label className="field-label" htmlFor="new-password">
        Password
      </label>
      <div className="password-field">
        <input
          id="new-password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="new-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
          minLength={6}
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <label className="field-label" htmlFor="confirm-password">
        Confirm password
      </label>
      <input
        id="confirm-password"
        name="confirmPassword"
        type={showPassword ? "text" : "password"}
        autoComplete="new-password"
        value={confirmPassword}
        onChange={(event) => setConfirmPassword(event.target.value)}
        required
        minLength={6}
      />

      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}

      <button className="button button-primary form-submit" type="submit" disabled={loading}>
        {loading ? "Creating account..." : "Create Account"}
      </button>

      <p className="fine-print">
        By creating an account, you agree to the <a href="/terms">Terms</a> and
        <a href="/privacy"> Privacy Policy</a>.
      </p>
      <p className="form-switch">
        Already have an account? <a href="/sign-in">Sign In</a>
      </p>
    </form>
  );
}
