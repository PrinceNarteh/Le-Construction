import React, { useState } from "react";

function OtpField({ setValue }) {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  setValue("otp", otp.join(""));

  return (
    <div>
      {otp.map((data, index) => {
        return (
          <input
            disabled={otp.second <= 0 ? true : false}
            type="text"
            name="otp"
            maxLength="1"
            className="border-black border-b w-10 p-3 outline-none space-x-4 ml-3"
            key={index}
            value={data}
            onChange={(e) => handleChange(e.target, index)}
            onFocus={(e) => e.target.select()}
            autoFocus={index === 0}
          />
        );
      })}
    </div>
  );
}

export default OtpField;
