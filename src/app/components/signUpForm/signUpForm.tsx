"use client";
import React, { useEffect, useState } from "react";
import signUp from "@/firebase/auth/signup";
import showPasswordIcon from "@/app/assets//showPassword.svg";
import hidePassword from "@/app/assets//hidePassword.svg";
import login from "@/app/assets/singUp.svg";
import { useRouter } from "next/navigation";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import Image from "next/image";
import { Button } from "primereact/button";
import Link from "next/link";

function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toogleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const router = useRouter();

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const { result, error } = await signUp(email, password);
    if (result) {
      console.log("Successfully logged in!");
    }

    if (error) {
      return console.error(error);
    }

    return router.push("/tracker");
  };

  return (
    <>
      <Card className={"bg-[#F9F9FD] shadow-none p-2"}>
        <form onSubmit={handleForm} className="form">
          <div className="flex align-items-center justify-content-center ">
            <div className="surface-card p-4 shadow-2 border-round w-full  w-100">
              <div className="text-center mb-5">
                <div className="text-[24px] text-[#0c0d25] font-bold mb-3 nunito">
                  Sing Up
                </div>
              </div>

              <div>
                <InputText
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="text"
                  placeholder="Email address"
                  className="w-full mb-3 border-none mt-5"
                  validateOnly
                />
                <div className="w-full flex items-center bg-white rounded-[3px] passwordInput ">
                  <InputText
                    onChange={(e) => setPassword(e.target.value)}
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="Password"
                    className="w-full border-none shadow-none"
                  />
                  <Image
                    src={showPassword ? hidePassword : showPasswordIcon}
                    priority
                    alt="tooglePassword"
                    width={20}
                    height={20}
                    className="rounded-[12px] cursor-pointer mr-3"
                    onClick={toogleShowPassword}
                  />
                </div>

                <Button
                  label="Sign up"
                  className="w-full bg-[#FF5722] border-none mt-3 nunito"
                />
              </div>
            </div>
          </div>
        </form>
      </Card>

      <div className="flex bg-[#F9F9FD] nunito mt-5 h-[92px] p-2">
        <Image src={login} alt="singup" className="-mb-2 mr-6" />
        <div className="flex flex-col w-full h-full align-center justify-center">
          <span className="text-[18px]  font-semibold line-height-3 text-[#5F6B8A]">
            Already have an account?
          </span>
          <Link
            href={"/"}
            className="text-[14px] font-bold ml-2 cursor-pointer text-[#FF5722] underline ms-0"
          >
            Login here
          </Link>
        </div>
      </div>
    </>
  );
}

export default SignUpForm;
