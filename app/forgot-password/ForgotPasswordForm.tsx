"use client";

import { FormEvent, useState } from "react";
import {
  AuthError,
  hasFirebaseConfig,
  isValidEmail,
  sendPasswordReset,
} from "../lib/auth";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (loading) return;
    setMessage("");
    setSuccess(false);

    if (!isValidEmail(email)) {
      setMessage("Enter a valid email address.");
      return;
    }

    setLoading(true);
    try {
      await sendPasswordReset(email.trim());
      setSuccess(true);
      setMessage("If an account exists for that email, a reset link has been sent.");
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
          Password reset is available to invited early-access businesses once their
          account access has been confirmed.
        </p>
      )}

      <label className="field-label" htmlFor="reset-email">
        Email address
      </label>
      <input
        id="reset-email"
        name="email"
        type="email"
        autoComplete="email"
        value={email}
        onChange={(event) => setEmail(event.target.value)}
        required
      />

      {message && (
        <p className={success ? "form-success" : "form-error"} role={success ? "status" : "alert"}>
          {message}
        </p>
      )}

      <button className="button button-primary form-submit" type="submit" disabled={loading}>
        {loading ? "Sending..." : "Send reset link"}
      </button>

      <a className="text-link" href="/sign-in">
        Back to Sign In
      </a>
    </form>
  );
}
