import { createContext, useState, useContext, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";

const UserContext = createContext();
const DEFAULT_IMAGE =
  "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGKGnXv2LMZtskkE5pcH7PFYz6ps1pIYQ4pQ&s";

export const UserProvider = ({ children }) => {
  const user = useSelector((state) => state.user);
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || DEFAULT_IMAGE
  );

  // Update image and persist to localStorage
  const updateProfileImage = (newImage) => {
    setProfileImage(newImage);
    localStorage.setItem("profileImage", newImage);
  };

  // Load user image from API
  useEffect(() => {
    const fetchUserData = async () => {


      try {
        const response = await fetch(`http://localhost:5000/user?email=${encodeURIComponent(user.email)}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        const userData = data.user;

        if (userData) {
          const img = userData.image || DEFAULT_IMAGE;
          setProfileImage(img);
          localStorage.setItem("profileImage", img);
        }
      } catch (error) {
        console.error("Error fetching user info:", error);
        setProfileImage(DEFAULT_IMAGE);
      }
    };

    fetchUserData();
  }, []);

  return (
    <UserContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
