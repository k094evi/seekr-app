import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Mail, Lock, Unlock } from "lucide-react";
import logo from "../assets/seekr-logo.png";
import { BackgroundGradientAnimation } from "../components/BackgroundGradientAnimation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      setLoading(false);

      if (!response.ok || !data.success) {
        alert(data.error || "Login failed");
        return;
      }

      // ✅ Save ALL user data that backend returns (including Fname and Lname)
      localStorage.setItem(
        "user",
        JSON.stringify({
          user_id: data.user_id,
          email: data.email,
          role: data.role,
          Fname: data.Fname,        // ✅ First name
          Lname: data.Lname,        // ✅ Last name
          contact: data.contact,    // ✅ Contact number
          program: data.program,    // ✅ Program (for students)
        })
      );

      console.log("✅ User logged in:", data.Fname, data.Lname, `(${data.role})`);

      // ✅ Role-based redirect
      if (data.role === "admin") {
        navigate("/admin_sidebar");
      } else {
        navigate("/User_Sidebar");
      }
    } catch (error) {
      console.error("❌ Connection error:", error);
      alert("Connection error. Check your server and console for details.");
      setLoading(false);
    }
  };

  return (
    <BackgroundGradientAnimation>
      <form
        onSubmit={handleLogin}
        className="bg-[#DCD6F7] backdrop-blur-md p-8 rounded-2xl [box-shadow:-18px_-18px_20px_0px_rgba(0,0,0,0.25),18px_18px_20px_0px_rgba(0,0,0,0.25)] w-100 h-100 flex flex-col space-y-4"
      >
        <div className="flex flex-col justify-center items-center mb-4">
          <img src={logo} alt="Seekr Logo" className="w-20 h-20 object-contain" />
          <h1 className="font-spartan font-semibold text-3xl text-[#3A0CA3]">
            Log in to your account
          </h1>
        </div>

        <div className="relative">
          <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7209B7] w-5 h-5" />
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            placeholder="Email"
            required
            className="bg-white w-full pl-12 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-purple-500 outline-none placeholder-[#7209B7] text-1xl text-[#3A0CA3] font-spartan [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.25),inset_1px_1px_2px_0px_rgba(0,0,0,0.25),18px_18px_50px_0px_rgba(199,199,199,0.90)]"
          />
        </div>

        <div className="relative">
          {showPassword ? (
            <Unlock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7209B7] w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(false)}
            />
          ) : (
            <Lock
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-[#7209B7] w-5 h-5 cursor-pointer"
              onClick={() => setShowPassword(true)}
            />
          )}
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            required
            className="bg-white w-full pl-12 pr-4 py-3 rounded-full border focus:ring-2 focus:ring-purple-500 outline-none placeholder-[#7209B7] text-1xl text-[#3A0CA3] font-spartan [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.25),inset_1px_1px_2px_0px_rgba(0,0,0,0.25),18px_18px_50px_0px_rgba(199,199,199,0.90)]"
          />
        </div>

        <div className="flex justify-center mt-4">
          <button
            type="submit"
            disabled={loading}
            className="w-32 text-white p-2 rounded-full bg-[#3A0CA3] hover:bg-gradient-to-r hover:from-[#7209B7] hover:to-[#3A0CA3] transition-all duration-300 [box-shadow:inset_-1px_-1px_2px_0px_rgba(0,0,0,0.25),inset_1px_1px_2px_0px_rgba(0,0,0,0.25),18px_18px_50px_0px_rgba(199,199,199,0.90)]"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </div>
      </form>
    </BackgroundGradientAnimation>
  );
}