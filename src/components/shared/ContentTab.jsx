import React from 'react'

function ContentTab({ active, id, children }) {
  return (
    <div
      className={`w-full  ${
        id === active ? "block" : "hidden"
      } duration-500`}
    >
      {children}
    </div>
  );
}

export default ContentTab