import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";

const Navbar = ({ user, userName }) => {
  const navigate = useNavigate();

  const handleLoginBtn = () => {
    navigate('/login');
  };

  const homePageRoute = () => {
    navigate('/');
  };

  const profilePageRoute = () => {
    navigate('/profile');
  };

  return (
    <nav className="backdrop-blur-md bg-white/70 shadow-lg border-b border-blue-100 py-3 px-4 md:px-10 flex justify-between items-center sticky top-0 z-20">
      <h1
        className="text-2xl md:text-3xl font-extrabold text-[#0077B6] tracking-wider cursor-pointer transition-transform duration-200 hover:scale-105 hover:text-blue-500"
        onClick={homePageRoute}
      >
        SANDROP
      </h1>
      <div>
        {user ? (
          <div
            className="flex gap-2 items-center text-gray-700 text-base font-medium cursor-pointer bg-blue-50 px-4 py-2 rounded-full shadow hover:bg-blue-100 transition"
            onClick={profilePageRoute}
          >
            <span className="hidden sm:inline">{userName}</span>
            <FaUserCircle className="h-7 w-7 text-blue-400" />
          </div>
        ) : (
          <button
            onClick={handleLoginBtn}
            className="bg-gradient-to-r from-[#0096C7] to-[#0077B6] text-white py-2 px-6 font-bold rounded-full shadow-lg hover:from-[#0077B6] hover:to-[#0096C7] transition"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
