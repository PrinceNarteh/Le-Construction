import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../../services/api/httpClient";
import Spinner from "../../components/Spinner";

const modules = [
  "Dashboard",
  "Projects",
  "Tasks",
  "Ar Measuring",
  "Cost and payments",
  "Messaging",
  "Design",
  "Gallery",
  "Company",
  "Employees",
];

export default function Employees() {
  const [data, setData] = useState({
    name: "",
    permissions: [],
  });

  const navigate = useNavigate();

  const [isSubmitting, setIsSubmitting] = useState(false);

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handlePermissionChange = (e) => {
    setData({ ...data, permissions: [...data.permissions, e.target.value] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const res = await httpClient.post(`/role/new`, data);

      navigate("/all-employee-roles");
    } catch {
      setError(error.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="cursor-pointer p-8 min-h-screen">
      <Spinner isSubmitting={isSubmitting} />

      <div className="text-blue-900 text-3xl font-bold mb-2">
        <h3>Employee Role & Permission</h3>
      </div>

      <div className=" text-slate-400 text-[16px] font-normal mt-2 mb-7">
        Add permissions to create role below.
      </div>

      <div className="h-[70vh] bg-white rounded-lg">
        <div className="employees ">
          <div className="emcontainer">
            <div className="min-h-[60vh] space-y-10 flex flex-col justify-center items-center p-10">
              <div className="max-w-4xl w-full shadow-custom rounded">
                <form onSubmit={handleSubmit}>
                  <div className=" space-y-5">
                    <div className="mb-9">
                      <label className=" text-blue-900 text-md font-semibold leading-loose">
                        Role Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        onChange={handleChange}
                        name="name"
                        placeholder="role"
                        className="placeholder:italic placeholder:text-slate-400 block bg-white w-full border border-slate-200 rounded-md py-3 pl-9 pr-3 sm:text-sm outline-none"
                      />
                    </div>
                    <div>
                      <label className="text-blue-900 text-md font-semibold leading-loose ">
                        System Module Permission:
                      </label>
                      <div className="flex flex-wrap gap-5 mt-2">
                        {modules.map((module, index) => (
                          <div className="basis-60">
                            <label
                              key={index}
                              className="space-x-2 text-md font-normal text-slate-400"
                            >
                              <input
                                type="checkbox"
                                id="permissions"
                                name="permissions"
                                onChange={handlePermissionChange}
                                className="cursor-pointer accent-orange-700"
                                value={module}
                              />
                              <span>{module}</span>
                            </label>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="w-60 h-12 py-5 bg-gradient-to-r from-primary to-secondary rounded-lg shadow justify-center items-center gap-2.5 flex mt-6">
                      <button className="text-white text-md font-bold leading-loose">
                        Add role
                      </button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
