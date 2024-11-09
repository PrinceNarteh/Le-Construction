import React from "react";

function Footer() {
  const year = new Date().getFullYear();
  return (
    <div className="z-10 fixed bottom-0 flex bg-[#f4f3f5] h-8 items-center w-full cursor-pointer">
      <div className="ml-64 w-[80%]">
        <span className="text-[#79808F] text-sm font-ray font-bold">
          <marquee>
            <div className="flex justify-between">
              <h3>© Powered by Nailed @ {year}</h3>
              <h3>© Powered by Nailed @ {year}</h3>
              <h3>© Powered by Nailed @ {year}</h3>
            </div>
          </marquee>
        </span>
      </div>
    </div>
  );
}

export default Footer;
