import React from "react";
import "../componentCssFiles/home.css";
import data from "../componentsJsFiles/homeData.js";



function Home() {
  return (
    <div className="p-4">
      <p className="mt-2">This is the home page.</p>
      <p><strong>Name:</strong> {data.name}</p>
      <p><strong>Age:</strong> {data.age}</p>
      <p><strong>Hobbies:</strong> {data.hobbies.join(", ")}</p>
    </div>
  );
}

export default Home;
