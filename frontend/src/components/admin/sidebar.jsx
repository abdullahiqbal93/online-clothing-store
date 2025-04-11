import { useEffect, useRef, useState } from "react";
import { Home, Settings, User, Menu, Box, ShoppingCart, ChevronDown, LogOut, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { logoutUser } from "@/lib/store/features/user/userSlice";
import { useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const Sidebar = ({ isOpen, setIsOpen }) => {
  const [openDropdown, setOpenDropdown] = useState(null);
  const [isProfileHovered, setIsProfileHovered] = useState(false);
  const [hoveredMenuItem, setHoveredMenuItem] = useState(null);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const sidebarRef = useRef(null);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
    setOpenDropdown(null);
  };

  const toggleDropdown = (itemName) => {
    if (openDropdown === itemName) {
      setOpenDropdown(null);
    } else {
      setOpenDropdown(itemName);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
    toast.success('You have successfully logged out');
    navigate('/login');
  };

  const handleNavigation = (link) => {
    navigate(link);
  };

  const handleClickOutside = (event) => {
    if (sidebarRef.current && !sidebarRef.current.contains(event.target)) {
      setOpenDropdown(null);
    }
  };

  useEffect(() => {
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const menuItems = [
    { name: "Home", icon: <Home size={24} />, link: "/admin/dashboard" },
    {
      name: "Product",
      icon: <Box size={24} />,
      children: [
        { name: "Add Product", link: "/admin/product" },
        { name: "Product List", link: "/admin/productList" },
      ],
    },
    {
      name: "User",
      icon: <User size={24} />,
      children: [
        { name: "User List", link: "/admin/userList" },
      ],
    },
    { name: "Order", icon: <ShoppingCart size={24} />, link: "/admin/order" },
    { name: "Newsletter", icon: <Mail size={24} />, link: "/admin/newsletter" },

  ];

  return (
    <motion.div
      ref={sidebarRef}
      animate={{ width: isOpen ? 220 : 70 }}
      className="h-screen bg-gray-900 text-white p-4 flex flex-col justify-between shadow-lg sticky top-0 left-0 z-30"
    >
      <div>
        <div className="flex items-center justify-between mb-10">
          <h1
            className={`text-xl font-bold transition-all ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
              }`}
          >
            Flexxy
          </h1>
          <button onClick={toggleSidebar} className="p-2 rounded-lg hover:bg-gray-800">
            <Menu size={24} />
          </button>
        </div>
        <ul className="flex flex-col gap-4">
          {menuItems.map((item, index) => (
            <li
              key={index}
              className="flex flex-col"
              onMouseEnter={() => setHoveredMenuItem(item.name)}
              onMouseLeave={() => setHoveredMenuItem(null)}
            >
              <div className="relative">
                <div
                  className="flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-all"
                  onClick={() => (item.children ? toggleDropdown(item.name) : handleNavigation(item.link))}
                >
                  <div className="w-10 flex justify-center items-center">{item.icon}</div>
                  <span
                    className={`whitespace-nowrap transition-all mr-2 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
                      }`}
                  >
                    {item.name}
                  </span>
                  {item.children && isOpen && (
                    <ChevronDown
                      size={18}
                      className={`transition-transform ${openDropdown === item.name ? "rotate-180" : ""}`}
                    />
                  )}
                </div>
                {!isOpen && hoveredMenuItem === item.name && (
                  <div className="absolute left-full top-0 ml-2 bg-gray-800 text-white px-3 py-2 rounded-lg shadow-lg z-10 whitespace-nowrap">
                    {item.name}
                  </div>
                )}
                {item.children && openDropdown === item.name && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className={`flex flex-col gap-1 ${isOpen
                        ? "ml-8"
                        : "absolute left-full top-0 ml-2 bg-gray-900 w-48 rounded-lg shadow-lg z-10"
                      }`}
                  >
                    {item.children.map((subItem, subIndex) => (
                      <li
                        key={subIndex}
                        className="p-2 hover:bg-gray-700 rounded-lg cursor-pointer"
                        onClick={() => handleNavigation(subItem.link)}
                      >
                        <span className="pl-2">{subItem.name}</span>
                      </li>
                    ))}
                  </motion.ul>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>
      <div
        className="relative flex items-center p-2 hover:bg-gray-800 rounded-lg cursor-pointer transition-all"
        onMouseEnter={() => setIsProfileHovered(true)}
        onMouseLeave={() => setIsProfileHovered(false)}
      >
        <div className="w-10 flex justify-center items-center">
          <User size={24} />
        </div>
        <span
          className={`whitespace-nowrap transition-all mr-2 ${isOpen ? "opacity-100" : "opacity-0 w-0 overflow-hidden"
            }`}
        >
          Profile
        </span>

        {isProfileHovered && (
          <div
            className="absolute left-0  bottom-0 mb-10 bg-gray-800 text-white p-4 rounded-lg shadow-lg flex flex-col gap-3 w-48 z-50"
            style={{ zIndex: 50 }}
          >
            <div className="flex flex-row items-center gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
              <Link to="/admin/settings" className="flex flex-row items-center gap-2">
                <Settings size={20} />
                <span>Settings</span>
              </Link>
            </div>
            <div className="flex items-center gap-2 p-2 hover:bg-gray-700 rounded-lg cursor-pointer">
              <LogOut size={20} /> <span onClick={handleLogout}>Logout</span>
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default Sidebar;