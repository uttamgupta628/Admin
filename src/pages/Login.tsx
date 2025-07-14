import React, { useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import Logo from "@/assets/logos/logo.png";
import { useNavigate } from "react-router-dom";

const emailSchema = z.object({
  email: z.string().email("Invalid email address"),
});

type EmailInputs = z.infer<typeof emailSchema>;

const otpSchema = z.object({
  email: z.string().email(),
  otp: z.string().length(6, "OTP must be 6 digits"),
});

type OtpInputs = z.infer<typeof otpSchema>;

const AdminLogin: React.FC = () => {
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register: emailRegister,
    handleSubmit: handleEmailSubmit,
    formState: { errors: emailErrors },
  } = useForm<EmailInputs>({
    resolver: zodResolver(emailSchema),
  });

  const {
    register: otpRegister,
    handleSubmit: handleOtpSubmit,
    formState: { errors: otpErrors },
  } = useForm<OtpInputs>({
    resolver: zodResolver(otpSchema),
  });

  const onSendOtp: SubmitHandler<EmailInputs> = async (data) => {
    setLoading(true);
    try {
      await axios.post(`${import.meta.env.VITE_API_URL}/api/users/admin/send-otp`, {
        email: data.email,
      });
      setEmail(data.email);
      setIsOtpSent(true);
      alert("OTP sent to admin email.");
    } catch (err: any) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to send OTP");
    } finally {
      setLoading(false);
    }
  };

  const onVerifyOtp: SubmitHandler<OtpInputs> = async (data) => {
    setLoading(true);
    try {
      const res = await axios.post(`${import.meta.env.VITE_API_URL}/api/users/admin/verify-otp`, {
        email: data.email,
        otp: data.otp,
      });

      const { token } = res.data;
      localStorage.setItem("token", token);
      alert("Admin login successful!");
      navigate("/Home");
    } catch (err: any) {
      console.error(err.response?.data);
      alert(err.response?.data?.message || "Failed to verify OTP");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-300 to-orange-500">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-xl shadow-xl border border-gray-200">
        <img src={Logo} alt="Logo" className="w-60 mx-auto" />
        <h1 className="text-3xl font-bold text-center text-orange-500">
          Admin Login
        </h1>

        {isOtpSent ? (
          <form onSubmit={handleOtpSubmit(onVerifyOtp)} className="space-y-6">
            <Input
              {...otpRegister("email")}
              value={email}
              type="hidden"
              readOnly
            />

            <div>
              <label className="block text-sm font-medium">Enter OTP</label>
              <Input
                {...otpRegister("otp")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter the 6-digit OTP"
              />
              {otpErrors.otp && (
                <p className="text-red-500 text-sm mt-1">
                  {otpErrors.otp.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Verify OTP & Login"
              )}
            </Button>
          </form>
        ) : (
          <form onSubmit={handleEmailSubmit(onSendOtp)} className="space-y-6">
            <div>
              <label className="block text-sm font-medium">Admin Email</label>
              <Input
                {...emailRegister("email")}
                className="mt-2 w-full p-3 border border-gray-300 rounded-lg"
                placeholder="Enter admin email"
              />
              {emailErrors.email && (
                <p className="text-red-500 text-sm mt-1">
                  {emailErrors.email.message}
                </p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full bg-orange-500 text-white"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="animate-spin h-5 w-5 mr-2" />
              ) : (
                "Send OTP"
              )}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminLogin;
