import React, { useState } from "react";
import { Link } from "react-router-dom";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { toast } from "@/components/ui/use-toast";
import { BUSINESS_TYPES, SECTORS, REGIONS } from "@/lib/constants";
import { Store, Mail, Lock, Loader2, Phone, User, Upload } from "lucide-react";

const VENDOR_IMG = "https://media.base44.com/images/public/6a4f83dffc6191b5376288ac/e30aa9e2a_generated_140002be.png";

export default function RegisterVendor() {
  const [businessName, setBusinessName] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [businessType, setBusinessType] = useState("SME");
  const [sector, setSector] = useState("Retail & Trading");
  const [region, setRegion] = useState("Western Area");
  const [description, setDescription] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [website, setWebsite] = useState("");
  const [businessImage, setBusinessImage] = useState("");
  const [uploadingImage, setUploadingImage] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showOtp, setShowOtp] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploadingImage(true);
    setError("");
    try {
      const { file_url } = await base44.integrations.Core.UploadFile({ file });
      setBusinessImage(file_url);
    } catch {
      setError("Failed to upload image. Please try again.");
    } finally {
      setUploadingImage(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    if (!businessName) {
      setError("Business name is required");
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
          await base44.auth.updateMe({ full_name: ownerName || businessName });
          await base44.entities.Vendor.create({
            business_name: businessName,
            business_type: businessType,
            sector,
            region,
            description,
            image: businessImage || "",
            owner_name: ownerName,
            phone,
            email,
            whatsapp: whatsapp,
            website: website,
          });
        } catch (e) {
          console.error("Failed to create vendor profile", e);
        }
      }
      window.location.href = "/vendors";
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

  if (showOtp) {
    return (
      <div className="min-h-screen flex bg-[#F9F7F2]">
        <div className="hidden lg:block w-1/2 relative">
          <img src={VENDOR_IMG} alt="Vendor" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612]/80 via-[#1A1612]/20 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-12">
            <h2 className="font-heading text-3xl font-bold text-[#F9F7F2] mb-3">
              Almost there.
            </h2>
            <p className="text-[#F9F7F2]/70 leading-relaxed">
              Verify your email to complete your vendor registration and start selling.
            </p>
          </div>
        </div>

        <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
          <div className="max-w-md w-full">
            <Link to="/" className="flex items-center gap-1 mb-8">
              <span className="font-heading text-2xl font-bold text-[#1A1612]">Sierra Market</span>
              <span className="font-heading text-2xl font-bold text-[#00A0E3]">Glow</span>
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
                  "Complete Registration"
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
      </div>
    );
  }

  return (
    <div className="min-h-screen flex bg-[#F9F7F2]">
      {/* Left - Image */}
      <div className="hidden lg:block w-1/2 relative">
        <img src={VENDOR_IMG} alt="Empowered vendor" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#1A1612]/80 via-[#1A1612]/20 to-transparent" />
        <div className="absolute bottom-0 left-0 right-0 p-12">
          <h2 className="font-heading text-3xl font-bold text-[#F9F7F2] mb-3">
            Grow Your Business.<br />Reach Every Home.
          </h2>
          <p className="text-[#F9F7F2]/70 leading-relaxed">
            Join Sierra Market Glow and showcase your products to customers across Sierra Leone.
          </p>
        </div>
      </div>

      {/* Right - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full">
          <Link to="/" className="flex items-center gap-1 mb-8">
            <span className="font-heading text-2xl font-bold text-[#1A1612]">Sierra Market</span>
            <span className="font-heading text-2xl font-bold text-[#00A0E3]">Glow</span>
          </Link>

          <div className="mb-6">
            <h1 className="font-heading text-2xl font-bold text-[#1A1612] mb-1">Register as a Vendor</h1>
            <p className="text-sm text-[#1A1612]/60">
              List your business and start selling to customers across Sierra Leone.
            </p>
          </div>

          {error && (
            <div className="mb-4 p-3 rounded-lg bg-red-50 text-red-600 text-sm">{error}</div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Image upload */}
            <div className="space-y-2">
              <Label className="text-[#1A1612]">Business Image</Label>
              <div className="flex items-center gap-4">
                {businessImage ? (
                  <img src={businessImage} alt="Preview" className="w-16 h-16 rounded-md object-cover border-2 border-[#00A0E3]" />
                ) : (
                  <div className="w-16 h-16 rounded-md bg-[#F0EBE0] flex items-center justify-center">
                    <Store className="w-6 h-6 text-[#1A1612]/40" />
                  </div>
                )}
                <label className="cursor-pointer flex items-center gap-2 px-4 py-2 bg-[#F0EBE0] rounded-md text-sm font-medium text-[#1A1612] hover:bg-[#E8E2D5] transition-colors">
                  <Upload className="w-4 h-4" />
                  {uploadingImage ? "Uploading..." : businessImage ? "Change Image" : "Upload Image"}
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    disabled={uploadingImage}
                  />
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="businessName" className="text-[#1A1612]">Business Name</Label>
              <div className="relative">
                <Store className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="businessName"
                  type="text"
                  placeholder="e.g. Freetown Garri Processors"
                  value={businessName}
                  onChange={(e) => setBusinessName(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="ownerName" className="text-[#1A1612]">Owner Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input
                  id="ownerName"
                  type="text"
                  placeholder="Aminata Kamara"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  className="pl-10 h-12 border-[#E8E2D5]"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Business Type</Label>
                <select
                  value={businessType}
                  onChange={(e) => setBusinessType(e.target.value)}
                  className="w-full h-12 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
                >
                  {BUSINESS_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <Label className="text-[#1A1612]">Region</Label>
                <select
                  value={region}
                  onChange={(e) => setRegion(e.target.value)}
                  className="w-full h-12 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
                >
                  {REGIONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-[#1A1612]">Sector</Label>
              <select
                value={sector}
                onChange={(e) => setSector(e.target.value)}
                className="w-full h-12 px-3 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612]"
              >
                {SECTORS.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-[#1A1612]">Description</Label>
              <textarea
                id="description"
                rows={3}
                placeholder="Tell us about your business..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-3 py-2 rounded-md border border-[#E8E2D5] bg-white text-sm text-[#1A1612] focus:outline-none focus:ring-2 focus:ring-[#00A0E3]/30 focus:border-[#00A0E3] resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-[#1A1612]">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input id="email" type="email" placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-12 border-[#E8E2D5]" required />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone" className="text-[#1A1612]">Phone</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                <Input id="phone" type="tel" placeholder="+232 76 123 456" value={phone} onChange={(e) => setPhone(e.target.value)} className="pl-10 h-12 border-[#E8E2D5]" />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="whatsapp" className="text-[#1A1612]">WhatsApp Number</Label>
              <Input id="whatsapp" type="tel" placeholder="+232 76 123 456" value={whatsapp} onChange={(e) => setWhatsapp(e.target.value)} className="h-12 border-[#E8E2D5]" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="website" className="text-[#1A1612]">Website (optional)</Label>
              <Input id="website" type="text" placeholder="www.yourbusiness.com" value={website} onChange={(e) => setWebsite(e.target.value)} className="h-12 border-[#E8E2D5]" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="password" className="text-[#1A1612]">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                  <Input id="password" type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 h-12 border-[#E8E2D5]" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm" className="text-[#1A1612]">Confirm</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-[#1A1612]/40" />
                  <Input id="confirm" type="password" placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 h-12 border-[#E8E2D5]" required />
                </div>
              </div>
            </div>
            <Button type="submit" className="w-full h-12 bg-[#00A0E3] hover:bg-[#0086C0] font-medium" disabled={loading || uploadingImage}>
              {loading ? (
                <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating account...</>
              ) : (
                <><Store className="w-4 h-4 mr-2" /> Register Vendor</>
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