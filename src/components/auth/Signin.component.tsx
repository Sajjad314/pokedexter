"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { ILoginPayload } from "@/interface/auth/signinPayload";
import { loginValidationSchema } from "@/constant/auth/loginValidationSchema";
import { errorToast, successToast } from "../../utils/Toast";
import React, { useEffect, useState } from "react";
import logo from "../../../public/images.png";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import SpinnerLoading from "../common/dataLoader";

const SigninComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILoginPayload>({
    resolver: yupResolver(loginValidationSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { data: session, status: sessionStatus } = useSession();

  const handleLogin: SubmitHandler<ILoginPayload> = async (data) => {
    const res = await signIn("credentials", {
      redirect: false,
      email: data.email,
      password: data.password,
    });
    if (res?.error) {
      errorToast("Invalid email or password");
      if (res?.url) router.replace("/dashboard");
    } else {
      successToast("Login successful");
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <div className="bg-gray-300 flex flex-col min-h-screen justify-center items-center gap-10">
        <SpinnerLoading /> 
      </div>
    );
  }

  if(sessionStatus === "unauthenticated"){
    return (
      <div className="w-full max-w-full text-center">
        <div className=" flex flex-col gap-1 bg-white shadow-md w-full mx-auto lg:flex-row lg:w-2/3 md:flex-row md:w-2/3">
          <div className=" flex items-center justify-center w-full  lg:w-1/2  md:w-1/2">
            <Image src={logo} alt="logo" />
          </div>
          <div className="bg-gradient-to-b from-gray-600 to-gray-900 p-5  w-full lg:w-1/2 md:w-1/2">
            <form
              onSubmit={handleSubmit(handleLogin)}
              className="flex flex-col gap-3 w-full"
            >
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-medium text-white">
                  Email <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="text"
                  placeholder="Email"
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-gray-200 "
                />
                <small className="text-red-500">{errors.email?.message}</small>
              </div>
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-medium text-white">
                  Password <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="flex h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-gray-200 "
                />
                <small className="text-red-500">{errors.password?.message}</small>
              </div>
  
              <div className=" w-full items-center mt-5 flex flex-col gap-2">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-white w-full text-black font-semibold rounded-md  border border-gray-800 px-4 py-2 hover:bg-white hover:text-black hover:border-none"
                >
                  Sign In
                </button>
                <button
                  onClick={() => {
                    signIn("github");
                  }}
                  className=" bg-green-500 text-white font-semibold rounded-md w-full px-4 py-2"
                >
                  Continue with Github
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    );
  }
};

export default SigninComponent;
