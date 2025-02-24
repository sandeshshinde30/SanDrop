    import bcrypt from 'bcryptjs';
    import jwt from 'jsonwebtoken';
    import User from '../models/userModel.js';

    export const registerUser = async (req, res) => {
        try {
            const { username, email, password } = req.body;
            const existingUser = await User.findOne({ email });

            if (existingUser) return res.status(400).json({ message: "Email already in use." });

            const hashedPassword = await bcrypt.hash(password, 10);
            const newUser = new User({ username, email, password: hashedPassword });

            await newUser.save();
            res.status(201).json({ message: "User registered successfully." });
        } catch (error) {
            res.status(500).json({ message: "Server error." });
        }
    };

    export const loginUser = async (req, res) => {
        try {
            console.log("Request body:", req.body); // 🔍 Debugging step
    
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({ message: "Email and password are required." });
            }
    
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: "Invalid credentials." });
            }
    
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                return res.status(400).json({ message: "Invalid credentials." });
            }
    
            const token = jwt.sign({ userId: user._id }, "secretKey", { expiresIn: "1h" });
    
            res.json({ message: "Login successful.", user, token });
        } catch (error) {
            console.error("Login error:", error); // 🔍 Log error
            res.status(500).json({ message: "Server error." });
        }
    };
    