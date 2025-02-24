import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa";
const Navbar = ({user,userName}) => {

  const navigate = useNavigate('')

  const handleLoginBtn = () => {
    navigate('/login')
  }

  const homePageRoute = () => {
    navigate('/')
  }

  const profilePageRoute = () => {
    navigate('/profile')
  }

  return (
    <nav className="flex justify-between items-center shadow-sm border-b-1 border-blue-400 py-3 lg:pl-20 pl-10 pr-5 bg-white relative z-10">

      <h1 className="text-2xl cursor-pointer font-extrabold text-[#0077B6] tracking-wider"
      onClick={homePageRoute}>SANDROP</h1>
      <div>
        {user ?(
         <div className="flex gap-2 items-center text-gray-600 text-sm cursor-pointer"
         onClick={profilePageRoute}
         >
         <h1>{userName}</h1>
         <FaUserCircle className="h-6 w-6 text-gray-400 " />
       </div>
       
         )
        : <button 
        onClick={handleLoginBtn}
        className="bg-[#0077B6] text-white py-1 px-4 font-bold rounded-md cursor-pointer shadow-2xl ">Login
        </button>}
      </div>
    </nav>
  );
};

export default Navbar;
