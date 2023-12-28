"use client";
import signIn from "@/firebase/auth/signin";
import hidePassword from "@/app/assets//hidePassword.svg";
import showPasswordIcon from "@/app/assets//showPassword.svg";
import singUp from "@/app/assets/singUp.svg";
import { Card } from "primereact/card";
import { InputText } from "primereact/inputtext";
import { Toast } from "primereact/toast";
import { useRef, useState } from "react";
import Image from "next/image";
import { Button } from "primereact/button";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SignInForm() {
  const toastRef = useRef<Toast>(null);
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const toogleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleForm = async (e: React.FormEvent) => {
    e.preventDefault();

    const { result, error } = await signIn(email, password);

    if (result) console.log("Succesfully logged in");
    if (error) {
      if (toastRef.current) {
        toastRef.current.show({
          severity: "error",
          summary: "Something went wrong",
          detail:
            "We couldn't sign you in to your account, check if email and password are correct and try again.",
        });
      }
      return console.error(error);
    }
    router.push("/tracker");
  };

  return (
    <>
      <Card className={"bg-[#F9F9FD] shadow-none p-2"}>
        <form onSubmit={handleForm} className="form">
          <div className="flex align-items-center justify-content-center ">
            <div className="surface-card p-4 shadow-2 border-round w-full  w-100">
              <div className="text-center mb-5">
                <div className="text-[24px] text-[#0c0d25] font-bold mb-3 nunito">
                  Login
                </div>
              </div>

              <div>
                <InputText
                  onChange={(e) => setEmail(e.target.value)}
                  id="email"
                  type="text"
                  placeholder="Email address"
                  className="w-full mb-3 border-none mt-5"
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
                  label="Login"
                  className="w-full bg-[#FF5722] border-none mt-3 nunito"
                />
              </div>
            </div>
          </div>
        </form>
      </Card>

      <div className="flex bg-[#F9F9FD] nunito mt-5 h-[92px] p-2">
        <Image src={singUp} alt="singup" className="-mb-2 mr-6" />
        <div className="flex flex-col w-full h-full align-center justify-center">
          <span className="text-[18px]  font-semibold line-height-3 text-[#5F6B8A]">
            Need an account?
          </span>
          <Link
            href={"signup"}
            className="text-[14px] font-bold ml-2 cursor-pointer text-[#FF5722] underline ms-0"
          >
            Register here
          </Link>
        </div>
      </div>

      <Toast ref={toastRef} />
    </>
  );
}
