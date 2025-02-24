import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
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
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md bg-white p-6 m-5 rounded-lg shadow-xl">
                <h2 className="text-2xl font-bold text-center text-[#0077B6] mb-4">Create an Account</h2>
                {error && <p className="text-red-500 text-center">{error}</p>}
                {success && <p className="text-green-500 text-center">{success}</p>}
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <input 
                        type="text" 
                        name="username" 
                        placeholder="Username" 
                        value={formData.username} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0077B6]"
                        required
                    />
                    <input 
                        type="email" 
                        name="email" 
                        placeholder="Email" 
                        value={formData.email} 
                        onChange={handleChange} 
                        className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0077B6]"
                        required
                    />
                    <div className="relative">
                        <input 
                            type={showPassword ? "text" : "password"} 
                            name="password" 
                            placeholder="Password" 
                            value={formData.password} 
                            onChange={handleChange} 
                            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-[#0077B6] pr-10"
                            required
                        />
                        <button 
                            type="button" 
                            className="absolute inset-y-0 right-3 flex items-center text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    <button 
                        type="submit" 
                        className="w-full bg-[#0077B6] text-white py-2 rounded-md font-semibold hover:bg-[#005F91] transition">
                        Register
                    </button>
                </form>

                <p className="text-sm text-center mt-4 text-gray-600">
                    Already have an account? 
                    <Link to="/login" className="text-[#0077B6] font-bold hover:underline ml-1">
                        Log in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
