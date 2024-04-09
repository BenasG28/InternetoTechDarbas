import React from "react";
import itemPageHTML from "./item_page"; // Import the HTML file

const ItemPage = () => {
  return <div dangerouslySetInnerHTML={{ __html: itemPageHTML }} />; // Render the HTML content
};

export default ItemPage;
