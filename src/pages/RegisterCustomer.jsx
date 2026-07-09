import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import GoogleIcon from "@/components/GoogleIcon";
import { toast } from "@/components/ui/use-toast";
import { UserPlus, Mail, Lock, Loader2, Phone, User, ShoppingBag } from "lucide-react";

export default function RegisterCustomer() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await base44.auth.register({ email, password });
      setShowOtp(true);
    } catch (err) {
      setError(err.message || "Registration failed");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    setError("");
    setLoading(true);
    try {
      const result = await base44.auth.verifyOtp({ email, otpCode });
      if (result?.access_token) {
        base44.auth.setToken(result.access_token);
        try {
          await base44.auth.updateMe({ full_name: fullName, phone });
        } catch (e) {
          console.error("Failed to save profile info", e);
        }
      }
      window.location.href = "/";
    } catch (err) {
      setError(err.message || "Invalid verification code");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setError("");
    try {
      await base44.auth.resendOtp(email);
      toast({ title: "Code sent", description: "Check your email for the new code." });
    } catch (err) {
      setError(err.message || "Failed to resend code");
    }
  };

  const handleGoogle = () => {
    base44.auth.loginWithProvider("google", "/");
  };

  if (showOtp) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] px-4 py-12">
        <div className="max-w-md w-full">
          <Link to="/" className="flex items-center gap-1 justify-center mb-8">
            <span className="font-heading text-3xl font-bold text-[#1A1612]">Sierra Market</span>
            <span className="font-heading text-3xl font-bold text-[#00A0E3]">Glow</span>
          </Link>

          <div className="bg-white border border-[#E8E2D5] rounded-lg p-8">
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0EBE0] mb-4">
                <Mail className="w-6 h-6 text-[#00A0E3]" />
              </div>
              <h1 className="font-heading text-2xl font-bold text-[#1A1612] mb-1">Verify your email</h1>
              <p className="text-sm text-[#1A1612]/60">We sent a code to {email}</p>
            </div>

            {error && (
              <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
            )}

            <div className="flex justify-center mb-6">
              <InputOTP maxLength={6} value={otpCode} onChange={setOtpCode} autoFocus autoComplete="one-time-code">
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>

            <Button
              className="w-full h-12 bg-[#00A0E3] hover:bg-[#0086C0] font-medium"
              onClick={handleVerify}
              disabled={loading || otpCode.length < 6}
            >
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Verifying...</>
              ) : (
                "Verify & Start Shopping"
              )}
            </Button>

            <p className="text-center text-sm text-[#1A1612]/60 mt-4">
              Didn't receive the code?{" "}
              <button onClick={handleResend} className="text-[#00A0E3] font-medium hover:underline">
                Resend
              </button>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F9F7F2] px-4 py-12">
      <div className="max-w-md w-full">
        <Link to="/" className="flex items-center gap-1 justify-center mb-8">
          <span className="font-heading text-3xl font-bold text-[#1A1612]">Sierra Market</span>
          <span className="font-heading text-3xl font-bold text-[#00A0E3]">Glow</span>
        </Link>

        <div className="bg-white border border-[#E8E2D5] rounded-lg p-8">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-[#F0EBE0] mb-4">
              <ShoppingBag className="w-6 h-6 text-[#00A0E3]" />
            </div>
            <h1 className="font-heading text-2xl font-bold text-[#1A1612] mb-1">Join as a Customer</h1>
            <p className="text-sm text-[#1A1612]/60">Start shopping fresh produce from local women entrepreneurs.</p>
          </div>

          <Button
            variant="outline"
            className="w-full h-12 text-sm font-medium mb-4 border-[#E8E2D5]"
            onClick={handleGoogle}
          >
            <GoogleIcon className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="relative mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#E8E2D5]" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-3 text-[#1A1612]/50">or</span>
            </div>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="fullName" className="text-[#1A1612]">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="fullName"
                  type="text"
                  placeholder="Aminata Kamara"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1A1612]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#1A1612]">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="phone"
                  type="tel"
                  placeholder="+232 76 123 456"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-[#1A1612]">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm" className="text-[#1A1612]">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="confirm"
                  type="password"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-[#00A0E3] hover:bg-[#0086C0] font-medium" disabled={loading}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                <>
                  <UserPlus className="w-4 h-4 mr-2" /> Start Shopping
                </>
              )}
            </Button>
          </form>

          <p className="text-center text-sm text-[#1A1612]/60 mt-6">
            Already have an account?{" "}
            <Link to="/login" className="text-[#00A0E3] font-medium hover:underline">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}