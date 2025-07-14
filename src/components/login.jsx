import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import config from "../url.js";

const Login = ({ setUser }) => {
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess("");

        try {
            const response = await fetch(`${config.API_BASE_URL}/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            const data = await response.json();

            if (response.ok) {
                setUser(data.user);
                localStorage.setItem("token", data.token);
                localStorage.setItem("user", JSON.stringify(data.user));
                setSuccess("Login successful! Redirecting...");
                setTimeout(() => {
                    window.location.href = "/profile";
                }, 2000);
            } else {
                setError(data.message || "Login failed.");
            }
        } catch (err) {
            setError("Server error. Try again later.");
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-blue-100 via-blue-50 to-white">
            <div className="w-full max-w-md bg-white p-8 m-5 rounded-2xl shadow-2xl border-t-8 border-[#0096C7] flex flex-col items-center">
                <div className="bg-[#0096C7] rounded-full p-4 mb-4 shadow-lg">
                    <FaUserCircle className="text-white text-5xl" />
                </div>
                <h2 className="text-3xl font-extrabold text-center text-[#0077B6] mb-4">Login</h2>
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                {success && <p className="text-green-500 text-center mb-2">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0096C7] bg-gray-50 text-gray-700"
                        required
                    />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0096C7] bg-gray-50 text-gray-700 pr-10"
                            required
                        />
                        <button 
                            type="button" 
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400 hover:text-[#0096C7]"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-gradient-to-r from-[#0096C7] to-[#0077B6] text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:from-[#0077B6] hover:to-[#0096C7] transition">
                        Login
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Don't have an account? 
                    <Link to="/register" className="text-[#0096C7] font-bold hover:underline ml-1">
                        Register here
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
