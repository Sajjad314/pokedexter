"use client";

import { SubmitHandler, useForm } from "react-hook-form";
import { ISignupPayload } from "@/interface/auth/signupPayload.interface";
import { yupResolver } from "@hookform/resolvers/yup";
import { signUpValidationSchema } from "@/constant/auth/signupValidatinSchema";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { errorToast, successToast } from "../../utils/Toast";
import logo from "../../../public/images.png";
import Image from "next/image";
import { signIn, useSession } from "next-auth/react";
import SpinnerLoading from "../common/dataLoader";

const SignupComponent = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ISignupPayload>({
    resolver: yupResolver(signUpValidationSchema),
  });

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const router = useRouter();
  const { status: sessionStatus } = useSession();

  const handleSignup: SubmitHandler<ISignupPayload> = async (data) => {
    setIsLoading(true)
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (res.status === 400) {
        errorToast("Email already exist");
      }
      if (res.status === 200) {
        successToast("Successfully created an account");
        router.push("/");
      }
      setIsLoading(false)
    } catch (error) {
      errorToast("There was an error. Try again");
      setIsLoading(false)
    }
  };

  useEffect(() => {
    if (sessionStatus === "authenticated") {
      router.replace("/");
    }
  }, [sessionStatus, router]);

  if (sessionStatus === "loading") {
    return (
      <div className="bg-gray-300 flex flex-col w-full min-h-screen justify-center items-center gap-10">
        <SpinnerLoading />
      </div>
    );
  }

  if (sessionStatus === "unauthenticated") {
    return (
      <div className="w-full max-w-full text-center">
        <div className=" flex flex-col gap-1 bg-white shadow-md w-full mx-auto lg:flex-row lg:w-2/3 md:flex-row md:w-2/3">
          <div className=" flex items-center justify-center w-full  lg:w-1/2  md:w-1/2">
            <Image src={logo} alt="logo" />
          </div>
          <div className=" bg-[#e13d48] p-4 md:p-10 w-full lg:w-1/2 md:w-1/2">
            <form
              onSubmit={handleSubmit(handleSignup)}
              className="flex flex-col gap-3 w-full"
            >
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-semibold text-white">
                  Name <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("name")}
                  type="text"
                  placeholder="Name"
                  className="flex h-10 rounded-md border-2 border-input bg-background p-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-white placeholder:text-white"
                />
                <small className="text-red-500">{errors.name?.message}</small>
              </div>
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-semibold text-white">
                  Email <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("email")}
                  type="text"
                  placeholder="Email"
                  className="flex h-10 rounded-md border-2 border-input bg-background p-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-white placeholder:text-white"
                />
                <small className="text-red-500">{errors.email?.message}</small>
              </div>
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-semibold text-white">
                  Phone <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("phone")}
                  type="text"
                  placeholder="Phone"
                  className="flex h-10 rounded-md border-2 border-input bg-background p-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-white placeholder:text-white"
                />
                <small className="text-red-500">{errors.phone?.message}</small>
              </div>
              <div className=" flex flex-col items-start justify-start gap-2 ">
                <label className=" text-sm font-semibold text-white">
                  Password <span className=" ml-1 text-red-500">*</span>
                </label>
                <input
                  {...register("password")}
                  type="password"
                  placeholder="Password"
                  className="flex h-10 rounded-md border-2 border-input bg-background p-6 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 w-full bg-inherit text-white border-white placeholder:text-white"
                />
                <small className="text-red-500">
                  {errors.password?.message}
                </small>
              </div>

              <div className=" w-full items-center mt-5 flex flex-col gap-2">
                <button
                  type="submit"
                  className="flex items-center justify-center bg-white w-full text-black font-semibold rounded-md  border border-gray-800 px-4 py-2 hover:bg-white hover:text-black hover:border-none"
                >
                  {isLoading ? "Signing up...":"Sign Up"}
                </button>
                <button onClick={(e) => {
                    e.preventDefault();
                    signIn("github");
                  }} className=" bg-black text-white font-semibold rounded-md w-full px-4 py-2">
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

export default SignupComponent;
