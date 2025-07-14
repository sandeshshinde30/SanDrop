import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUserCircle } from "react-icons/fa";
import config from "../url.js";
const Register = ({ setUser, user }) => {
    const navigate = useNavigate();

    
    useEffect(() => {
        if (user) {
            navigate("/");
        }
    }, [user, navigate]);

    const [formData, setFormData] = useState({
        username: "",
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
            const response = await fetch(`${config.API_BASE_URL}/register`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData)
            });

            const data = await response.json();
            if (response.ok) {
                setSuccess("Registration successful! Redirecting...");
                setTimeout(() => {
                    setUser(data.user);
                    navigate("/");
                }, 1500);
            } else {
                setError(data.message || "Registration failed.");
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
                <h2 className="text-3xl font-extrabold text-center text-[#0077B6] mb-4">Create an Account</h2>
                {error && <p className="text-red-500 text-center mb-2">{error}</p>}
                {success && <p className="text-green-500 text-center mb-2">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-5 w-full">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-[#0096C7] bg-gray-50 text-gray-700"
                        required
                    />
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
                        Register
                    </button>
                </form>

                <p className="text-sm text-center mt-6 text-gray-600">
                    Already have an account? 
                    <Link to="/login" className="text-[#0096C7] font-bold hover:underline ml-1">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
