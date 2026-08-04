"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import {
  AuthError,
  hasFirebaseConfig,
  isValidEmail,
  restoreAuthSession,
  safeRedirectTarget,
  signInWithEmail,
} from "../lib/auth";

export function SignInForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [redirectTo] = useState(() =>
    typeof window === "undefined"
      ? "/dashboard"
      : safeRedirectTarget(new URLSearchParams(window.location.search).get("redirect")),
  );

  useEffect(() => {
    restoreAuthSession().then((session) => {
      if (session) window.location.replace(redirectTo);
    });
  }, [redirectTo]);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setMessage("");

    if (!isValidEmail(email)) {
      setMessage("Enter a valid email address.");
      return;
    }
    if (!password) {
      setMessage("Enter your password to continue.");
      return;
    }

    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password, remember);
      window.location.assign(redirectTo);
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
          Firebase Authentication needs your public web API key before real
          sign-in can complete.
        </p>
      )}

      <label className="field-label" htmlFor="email">
        Email address
      </label>
      <input
        id="email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      <label className="field-label" htmlFor="password">
        Password
      </label>
      <div className="password-field">
        <input
          id="password"
          name="password"
          type={showPassword ? "text" : "password"}
          autoComplete="current-password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />
        <button
          type="button"
          onClick={() => setShowPassword((value) => !value)}
          aria-label={showPassword ? "Hide password" : "Show password"}
        >
          {showPassword ? "Hide" : "Show"}
        </button>
      </div>

      <div className="form-row">
        <label className="checkbox-label">
          <input
            type="checkbox"
            checked={remember}
            onChange={(event) => setRemember(event.target.checked)}
          />
          Remember me
        </label>
        <a href="/forgot-password">Forgotten password?</a>
      </div>

      {message && (
        <p className="form-error" role="alert">
          {message}
        </p>
      )}

      <button className="button button-primary form-submit" type="submit" disabled={loading}>
        {loading ? "Signing in..." : "Sign In"}
      </button>

      <p className="form-switch">
        New to ScheduleLoop? <a href="/sign-up">Create an account</a>
      </p>
      <Link className="text-link" href="/">
        Back to main website
      </Link>
    </form>
  );
}
