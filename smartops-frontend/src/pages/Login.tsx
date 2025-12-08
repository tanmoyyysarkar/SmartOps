import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import purpleMountain from "../assets/purple-mountain.png";

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    // Main Container: Centered, dark background
    <div className="min-h-screen bg-[#2d2d39] flex items-center justify-center p-4">
      {/* Card Container: Limited width, flex layout for split screen */}
      <div className="bg-[#1f1f2b] w-full max-w-6xl h-[85vh] rounded-3xl shadow-2xl overflow-hidden flex">
        {/* --- LEFT SIDE: IMAGE & BRANDING --- */}
        <div className="hidden md:flex w-1/2 relative bg-purple-900 flex-col justify-between p-8 text-white">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={purpleMountain}
              alt="purple mountain"
              className="w-full h-full object-cover opacity-60 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-linear-to-b from-purple-900/40 to-[#1f1f2b] opacity-90"></div>
          </div>

          {/* Top Content (Logo & Back Button) */}
          <div className="relative z-10 flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-wider font-sans">
              SmartOps
            </h1>
          </div>

          {/* Bottom Content (Text & Indicators) */}
          <div className="relative z-10 space-y-6 mb-8">
            <h2 className="text-center text-4xl font-medium leading-tight">
              Your Hassle,
              <br />
              Our Solution
            </h2>
          </div>
        </div>

        {/* --- RIGHT SIDE: FORM --- */}
        <div className="w-full md:w-1/2 p-8 md:p-12 flex flex-col justify-center bg-[#1f1f2b] text-gray-200">
          <div className="max-w-md mx-auto w-full">
            <h2 className="text-3xl font-semibold mb-2">Login</h2>
            <p className="text-gray-400 mb-8 text-sm">
              Don't have an account?{" "}
              <a href="#" className="text-purple-400 hover:underline">
                Register
              </a>
            </p>

            <form className="space-y-4">
              {/* Username / Email */}
              <input
                type="text"
                placeholder="Username/Email"
                className="w-full bg-[#2b2b36] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-sm"
              />

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full bg-[#2b2b36] border border-gray-700 rounded-lg px-4 py-3 focus:outline-none focus:border-purple-500 text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3.5 text-gray-400 hover:text-white"
                >
                  {showPassword ? (
                    <AiOutlineEyeInvisible size={20} />
                  ) : (
                    <AiOutlineEye size={20} />
                  )}
                </button>
              </div>

              {/* Submit Button */}
              <button className="w-full bg-[#6d54cd] hover:bg-[#5b46b1] text-white py-3 rounded-lg font-medium transition duration-200 mt-2">
                Login
              </button>
            </form>

            {/* Divider */}
            <div className="relative my-8">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-700"></div>
              </div>
              <div className="relative flex justify-center text-xs">
                <span className="bg-[#1f1f2b] px-2 text-gray-500">
                  Or Login with
                </span>
              </div>
            </div>

            {/* Social Buttons */}
            <div className="flex gap-4">
              <button className="flex-1 flex items-center justify-center gap-2 border border-gray-600 rounded-lg py-2.5 hover:bg-gray-800 transition">
                <FcGoogle size={20} /> <span className="text-sm">Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
