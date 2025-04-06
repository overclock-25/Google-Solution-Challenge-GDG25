import React from "react";
import Image from "next/image";

const SimpleRiceLoader = () => {
  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative animate-bounce m-3">
        <Image src={`/riceIconColor.svg`} alt="" width={100} height={100} />
      </div>

      <div className="flex space-x-2 mt-6">
        {[...Array(3)].map((_, i) => (
          <div
            key={i}
            className="w-3 h-3 bg-green-600 rounded-full animate-bounce"
            style={{ animationDelay: `${i * 0.15}s` }}
          ></div>
        ))}
      </div>
    </div>
  );
};

export default SimpleRiceLoader;
