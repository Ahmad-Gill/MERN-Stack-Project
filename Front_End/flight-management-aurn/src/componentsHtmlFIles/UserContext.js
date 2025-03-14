import { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [profileImage, setProfileImage] = useState(
    localStorage.getItem("profileImage") || 
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRGKGnXv2LMZtskkE5pcH7PFYz6ps1pIYQ4pQ&s"
  );

  const updateProfileImage = (newImage) => {
    setProfileImage(newImage);
    localStorage.setItem("profileImage", newImage); // Persist data
  };

  return (
    <UserContext.Provider value={{ profileImage, updateProfileImage }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
