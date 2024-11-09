import React, { useState } from "react";

function Visualization() {
  const [options, setOptions] = useState({
    style: "",
    geometry: "",
    type: "",
    floors: "",
    windows: "",
    view: "",
    background: "",
    timeOfDay: "",
    quality: "",
  });

  const generateSentence = () => {
    const {
      style,
      geometry,
      type,
      floors,
      windows,
      view,
      background,
      timeOfDay,
    } = options;

    // const sentence = `A ${style ? style : "undefined"}, ${
    //   geometry ? geometry : "undefined"
    // } shaped,  ${floors ? floors : "undefined"} story ${type ? type : "undefined"} with a  facade and ${windows} exterior with ${materials.join(
    //   ", "
    // )} materials and ${colors.join(
    //   ", "
    // )} colors. From a ${view} view with a ${background} background. Picture taken at ${timeOfDay} time. ${quality}, architecture photography.`;

    const sentence = ` A ${style ? style : "undefined"}, ${
      geometry ? geometry : "undefined"
    } shaped, ${floors ? floors : "undefined"} story ${
      type ? type : "undefined"
    } with a undefined facade and undefined exterior with ${
      windows ? windows : "undefined"
    } windows. From a ${view ? view : "undefined"} view with a ${
      background ? background : "undefined"
    } background. Picture taken at ${
      timeOfDay ? timeOfDay : "undefined"
    } time. 8K, architecture photography.`;

    return sentence;
  };

  const handleOptionChange = (field, value) => {
    setOptions((prevOptions) => ({
      ...prevOptions,
      [field]: value,
    }));
  };

  return (
    <div className="px-20 mt-5 cursor-pointer">
      <div className="grid grid-cols-5 gap-4">
        <div className="">
          <div className="space-y-1 mt-3">
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Style :
              </label>
              <select
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
                onChange={(e) => handleOptionChange("style", e.target.value)}
                value={options.style}
              >
                <option>Select...</option>
                <option value="contemporary">Contemporary</option>
                <option value="futuristic">Futuristic</option>
                <option value="Industrial">Industrial</option>
                <option value="luxurious">Luxurious</option>
                <option value="modern">Modern</option>
                <option value="mountaincabin">Mountain Cabin</option>
                <option value="neoclassical">Neoclassical</option>
                <option value="scandinavian">Scandinavian</option>
                <option value="traditional">Traditional</option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Geometry :
              </label>
              <select
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
                onChange={(e) => handleOptionChange("geometry", e.target.value)}
                value={options.geometry}
              >
                <option>Select...</option>
                <option value="square">Square</option>
                <option value="rectangular">Rectangular</option>
                <option value="angular">Angular</option>
                <option value="round">Round</option>
                <option value="organic">Organic</option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Type :
              </label>
              <select
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
                onChange={(e) => handleOptionChange("type", e.target.value)}
                value={options.type}
              >
                <option>Select...</option>
                <option value="cabin">Cabin</option>
                <option value="house">House </option>
                <option value="villa">Villa </option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Floors :
              </label>
              <select
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
                onChange={(e) => handleOptionChange("floors", e.target.value)}
                value={options.floors}
              >
                <option>Select...</option>
                <option value="1">One Floor</option>
                <option value="2">Two Floors</option>
                <option value="3">Three Floors</option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Windows :
              </label>
              <select
                className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
                onChange={(e) => handleOptionChange("windows", e.target.value)}
                value={options.windows}
              >
                <option>Select...</option>
                <option value="small">Small</option>
                <option value="medium">Medium</option>
                <option value="large">Large</option>
                <option value="huge">Huge </option>
                <option value="round">Round</option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Material(s) :
              </label>
              <select className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm ">
                <option>Select...</option>
                <option>hello</option>
                <option>hello</option>
              </select>
            </div>
            <div>
              <label className=" block text-blue-900 text-md font-semibold leading-loose">
                Color(s) :
              </label>
              <select className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm ">
                <option>Select...</option>
                <option>hello</option>
                <option>hello</option>
              </select>
            </div>
          </div>
        </div>
        <div className="bg-white border border-primary col-span-3  h-[70vh] rounded-md  flex justify-center items-center">
          <div className="w-52 text-primary text-center font-semibold">
            Drag and drop an image or click to upload an image or click Generate
          </div>
        </div>

        <div className="space-y-1 mt-3">
          <div>
            <label className=" block text-blue-900 text-md font-semibold leading-loose">
              View :
            </label>
            <select
              className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
              onChange={(e) => handleOptionChange("view", e.target.value)}
              value={options.view}
            >
              <option>Select...</option>
              <option value="front">Front</option>
              <option value="birdseye">Bird's Eye</option>
              <option value="perspective">Perspective</option>
            </select>
          </div>
          <div>
            <label className=" block text-blue-900 text-md font-semibold leading-loose">
              Background :
            </label>
            <select
              className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
              onChange={(e) => handleOptionChange("background", e.target.value)}
              value={options.background}
            >
              <option>Select...</option>
              <option value="forest">Forest</option>
              <option value="mountain">Mountain</option>
              <option value="ocean">Ocean</option>
              <option value="city">City</option>
              <option value="desert">Desert</option>
              <option value="river">River</option>
              <option value="lake">Lake</option>
              <option value="field">Field</option>
              <option value="beach">Beach</option>
            </select>
          </div>
          <div>
            <label className=" block text-blue-900 text-md font-semibold leading-loose">
              Time of Day :
            </label>
            <select
              className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
              onChange={(e) => handleOptionChange("timeOfDay", e.target.value)}
              value={options.timeOfDay}
            >
              <option>Select...</option>
              <option value="day">Day</option>
              <option value="Golden Hour">Golden Hour</option>
              <option value="night">Night</option>
            </select>
          </div>
          <div>
            <label className=" block text-blue-900 text-md font-semibold leading-loose">
              Quality:
            </label>
            <select
              className=" placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 shadow-md rounded-md py-2 pl-3 pr-3 sm:text-sm "
              onChange={(e) => handleOptionChange("quality", e.target.value)}
              value={options.quality}
            >
              <option>Select...</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="ultra">Ultra</option>
            </select>
          </div>
        </div>
      </div>

      <div className="mt-5 rounded-lg flex items-stretch">
        <div className="w-full flex-1 font-semibold border border-primary rounded-l-lg bg-white p-3 tracking-[0.050rem] ">
          {generateSentence()}
        </div>
        <button className="flex-shrink-0 p-3 text-white bg-primary w-36 flex justify-center items-center rounded-r-lg">
          <div>Generate</div>
        </button>
      </div>
    </div>
  );
}

export default Visualization;
