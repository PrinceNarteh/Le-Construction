import React from "react";

function OnBoardLayout({ image, children }) {
  return (
    <div className="h-screen grid justify-center items-center">
      <div className="bg-gray-50 max-h-min grid place-content-start md:place-content-center rounded-xl">
        <div className="w-10/12 md:w-11/12 mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 py-5">
          <div>
            <div className="flex">
              <img src="/images/nailed_logo.jpg" alt="" className="w-24 h-24" />
              <h3 className="ml-4 mb-4 text-2xl font-bold text-gray-900 dark:text-orange">
                <span className="md:text-3xl text-transparent bg-clip-text bg-gradient-to-r to-emerald-600 from-sky-400">
                  Nailed:
                  <span className="bg-blue-100 text-blue-800 text-lg font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800 ml-2">
                    PRO
                  </span>
                  <br />
                </span>{" "}
                <span className="lg:text-lg">
                  The job Is Under Your Control!
                </span>
              </h3>
            </div>
            <div className="">{children}</div>
          </div>

          <div
            className={`bg-cover hidden rounded-xl overflow-hidden md:block w-full`}
            style={{ backgroundImage: `url('${image}')` }}
          ></div>
        </div>
      </div>
    </div>
  );
}

export default OnBoardLayout;
