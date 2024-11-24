import { useState } from "react";
import { Link } from "react-router-dom";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const LoginPage = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const queryClient = useQueryClient();

  const {
    mutate: loginMutation,
    isError,
    error,
  } = useMutation({
    mutationFn: async ({ username, password }) => {
      try {
        const res = await fetch("/api/auth/login/", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username, password }),
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Invalid Login credentials");
        // console.log(data);
        return data;
      } catch (error) {
        console.log(error);
        throw error;
      }
    },
    onSuccess: () => {
      // refetch the authUser
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    loginMutation(formData);
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <div className="hero absolute inset-0 flex justify-center">
      <div className="hero-content flex-col w-4/5">
        <div className="text-center p-3">
          <h1 className="text-4xl font-medium">Login</h1>
        </div>
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <form className="card-body" onSubmit={handleSubmit}>
            <div className="form-control">
              <input
                type="text"
                placeholder="username"
                className="input input-bordered"
                name="username"
                onChange={handleInputChange}
                value={formData.username}
                required
              />
            </div>
            <div className="form-control">
              <input
                type="password"
                placeholder="password"
                className="input input-bordered"
                name="password"
                onChange={handleInputChange}
                value={formData.password}
                required
              />
              <label className="label">
                <a href="#" className="label-text-alt link link-hover">
                  Forgot password?
                </a>
              </label>
            </div>
            <div className="form-control mt-6">
              <button className="btn btn-success">Login</button>
            </div>
          </form>
          {isError && (
            <p>
              <span className="ml-10 text-red-600">{error.message}</span>
            </p>
          )}
          <div className="label mb-3 ml-5">
            <span className="label-text-alt">
              Are you new?
              <Link to="/signup">
                <span
                  href=""
                  className=" pl-2 label-text-alt link link-hover text-primary"
                >
                  sign up
                </span>
              </Link>
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
