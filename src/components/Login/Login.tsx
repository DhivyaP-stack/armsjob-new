import loginImg from '../../assets/images/loginImg.jpg';
import armslogo from '../../assets/images/armslogo.jpg';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../Context/AuthContext';
import * as zod from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from 'react';

const loginSchema = zod.object({
  email: zod
    .string()
    .min(3, "Email ID is required")
    .regex(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, "Invalid email format"),
  password: zod
    .string()
    .min(3, "Password is required")
});

type LoginFormSchema = zod.infer<typeof loginSchema>;

export const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState("");

  //Use React Hook Form with Zod resolver
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormSchema>({
    resolver: zodResolver(loginSchema),
  });

 const onSubmit = (data: LoginFormSchema) => {
    const { email, password } = data;
    if (email === "admin@armsjob.com" && password === "admin@2025") {
      setLoginError(""); // Clear any previous errors
      login(); // Set auth to true (from context)
      navigate("/Candidate"); // Redirect to Candidate page
    } else {
      setLoginError("Invalid email or password");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-main px-4 py-5">
      <div className="flex flex-row md:flex-row max-sm:!flex-col bg-white rounded-lg shadow-lg overflow-hidden max-w-4xl w-full ">
        {/* Left Image Side */}
        <div className="w-full md:w-1/2 sm:h-auto h-64 md:h-auto">
          <img src={loginImg} alt="Login" className="h-full w-full object-cover" />
        </div>
        {/* Right Form Side */}
        <div className="w-full md:w-1/2 p-6 md:p-10">
          <div className="mb-6">
            <img
              src={armslogo} // Replace with actual logo
              alt="armslogo"
              className="h-24 max-sm:h-20 xs:h-16 max-md:h-20 w-auto mx-auto md:mx-0 mb-2  object-contain object-left"
            />
            <h2 className="text-xl font-bold text-gray-800 mb-2">Login Here!</h2>
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="block text-gray-900 mb-1">Email ID</label>
              <input
                type="text"
                {...register("email")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
              {errors.email && <p className="text-red-600 text-sm">{errors.email.message}</p>}
            </div>
            <div>
              <label className="block text-gray-900 mb-1">Password</label>
              <input
                type="password"
                {...register("password")}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none"
              />
              {errors.password && <p className="text-red-600 text-sm">{errors.password.message}</p>}
            </div>
            {loginError && <p className="text-red-600 text-sm">{loginError}</p>}

            <div className="text-right">
              <div className="text-sm text-blue-500 underline cursor-pointer">
                Forget Password?
              </div>
            </div>
            <button
              type="submit"
              className="w-full cursor-pointer bg-armsjobslightblue text-white py-2 rounded transition-colors"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}



