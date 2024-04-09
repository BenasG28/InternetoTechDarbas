import React from "react";
import itemPageHTML from "./ItemPage"; // Import the HTML file

const ItemPage = () => {
  return <div dangerouslySetInnerHTML={{ __html: itemPageHTML }} />; // Render the HTML content
};

export default ItemPage;
