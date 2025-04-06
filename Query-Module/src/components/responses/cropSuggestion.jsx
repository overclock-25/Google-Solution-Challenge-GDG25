import React, { useState } from "react";
import { motion } from "framer-motion";

const CropSuggestions = ({ cropSuggestions }) => {
  const [selectedCrop, setSelectedCrop] = useState(null);
  // console.log(cropSuggestions);
  return (
    <div className="container mx-auto p-4 max-w-4xl">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {cropSuggestions?.map((cropName) => (
          <motion.div
            key={cropName}
            onClick={() => setSelectedCrop(cropName)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
              flex items-center justify-center 
              p-4 rounded-lg cursor-pointer transition-all
              text-center font-medium
              ${
                selectedCrop === cropName
                  ? "bg-green-600 text-white shadow-lg"
                  : "bg-gray-100 text-gray-800 hover:bg-green-100 hover:shadow-md"
              }
            `}
          >
            <span className="text-sm">{cropName}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default CropSuggestions;
