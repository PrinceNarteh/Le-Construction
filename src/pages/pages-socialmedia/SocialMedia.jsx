import { Icon } from "@iconify/react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import Heading from "../../components/layout/Heading";
import useMutate from "../../hooks/useMutate";
import { useCompanySelector } from "../../hooks/useCompanySelector";

function SocialMedia() {
  const { company } = useCompanySelector();
  const [state, setState] = useState({
    company_id: company?._id,
    name: "",
    link: "",
  });
  const { mutate } = useMutate(["add-social-media-link"]);
  const handleSubmit = (e) => {
    e.preventDefault();
    const toastId = toast.loading(`Adding ${state.name} Link`);

    mutate(
      {
        url: "/website/socialmedia/links",
        method: "PATCH",
        data: state,
      },
      {
        onSuccess(data) {
          toast.dismiss(toastId);
          toast.success(`${state.name} added successfully`);
        },
        onError(error) {
          toast.dismiss(toastId);
          toast.error(error.response.data.message);
        },
      }
    );
  };
  return (
    <div className="cursor-pointer">
      <div className="">
        <div className="ml-12 mb-4">
          <Heading label="Social Media" />
        </div>

        <div className="pl-12 pr-12">
          <div className="bg-white h-48 w-full rounded-xl">
            <form onSubmit={handleSubmit}>
              <div className="p-6">
                <div className="">
                  <div className="flex  w-full gap-6 ">
                    <div className="w-1/2">
                      <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                        Name
                      </label>
                      <select
                        name="name"
                        className="cursor-pointer placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                        onChange={(e) =>
                          setState((prevState) => ({
                            ...prevState,
                            name: e.target.value,
                          }))
                        }
                      >
                        <option value="">----Select----</option>
                        <option value="Facebook">Facebook</option>
                        <option value="Instagram">Instagram</option>
                        <option value="Twitter">Twitter</option>
                      </select>
                    </div>

                    <div className="w-1/2">
                      <label className="mb-1 block text-blue-900 text-md font-semibold leading-loose">
                        Social Media Url
                      </label>
                      <input
                        name="link"
                        type="text"
                        placeholder="Social Media Url"
                        className="placeholder:text-slate-400 block bg-white w-full outline-none border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm"
                        onChange={(e) =>
                          setState((prevState) => ({
                            ...prevState,
                            link: e.target.value,
                          }))
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="w-48 mt-5 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex">
                <button className="text-white text-md font-bold leading-loose">
                  Save
                </button>
              </div>
            </form>
          </div>

          <div className="bg-white rounded-lg p-5 mt-14">
            <div className="flex pl-3 pr-3  text-slate-400 text-[14px] font-bold leading-tight">
              <div className="w-20">SL</div>
              <div className="w-64">Name</div>
              <div className="w-[27rem]">Link</div>
              <div className="w-60">Status</div>
              <div className="w-24">Actions</div>
            </div>

            <div className="border-b p-3 w-[100%] flex justify-center border-slate-100"></div>

            <div className="flex items-center px-2 pb-4 text-slate-400 text-[14px] font-bold leading-tight mt-3 border-b border-slate-100">
              <div className="flex items-center w-20">
                <div className=" text-blue-900 text-[15px] font-bold leading-snug">
                  1
                </div>
              </div>
              <div className="w-64 text-blue-900 text-[15px] font-bold leading-snug line-clamp-1 text-ellipsis">
                Facebook
              </div>
              <div className="w-[27rem] text-blue-900 text-[15px] font-bold leading-snug">
                http://localhost:3000/social-media
              </div>

              <div className="w-60 text-blue-900 text-[15px] font-bold leading-snug line-clamp-1">
                <label className="relative inline-flex items-center cursor-pointer ">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200  rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all dark:border-gray-600 peer-checked:bg-orange-700"></div>
                </label>
              </div>

              <div className="flex gap-5 items-center cursor-pointer w-24">
                <Link to="">
                  <Icon icon="iconamoon:edit-light" className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SocialMedia;
