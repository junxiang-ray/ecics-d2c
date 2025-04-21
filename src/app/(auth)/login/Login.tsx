'use client';

import CouponIcon from "@/components/ui/icons/CouponIcon";
import MButton from "@/components/ui/button/MButton";
import { Checkbox } from "antd";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Login = () => {
    const router = useRouter();

    const handleContinueWithoutMyinfo = () => {
        router.push('/review-info-detail');
    };

    return (
        <div className="relative min-h-screen">
            {/*<div*/}
            {/*    className="absolute top-0 left-0 w-full h-[100vh] bg-cover bg-center -z-10"*/}
            {/*    style={{*/}
            {/*        backgroundImage: "url('/login_background.svg')",*/}
            {/*        backgroundSize: 'cover',*/}
            {/*        backgroundRepeat: "no-repeat",*/}
            {/*    }}*/}
            {/*/>*/}
            <Image
                // src="/login_background.svg"
                src="/login_bg.svg"
                alt="Logo"
                width={100}
                height={100}
            />

            <div className="relative z-10 p-6">
                <div className="text-primaryBlue justify-self-center">
                    {"Get an instant quote with Myinfo login"}
                </div>

                <div className="bg-white rounded-lg shadow-lg shadow-black/20 p-4 mb-6 mt-6">
                    <div className="flex items-center justify-center">
                        <h1 className="font-bold mr-[12px] mb-[4px]">
                            {"Retrieve Myinfo with"}
                        </h1>
                        <Image
                            src="/singpass.svg"
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </div>
                </div>

                <div className="flex items-center justify-center">
                    <div className="mr-[4px]">{"or,"}</div>
                    <MButton type="link" className="pl-0" onClick={handleContinueWithoutMyinfo}>{"continue without Myinfo login"}</MButton>
                </div>

                <div className="flex items-center justify-center mt-4">
                    <Checkbox className="custom-checkbox mr-[4px]" />
                    <div className="mr-[4px]">
                        {"By using this platform, you agree to our"}
                    </div>
                    <MButton type="link" className="pl-0">Disclaimer</MButton>
                </div>

                <div className="bg-white border-2 border-secondaryBlue rounded-lg p-4 mt-6">
                    <div className="text-lg font-bold">{"Limited period offer"}</div>
                    <div>
                        {"Flash Sale: Special discount available for the next 50 customers!"}
                    </div>
                    <div className="text-base font-bold mt-2">{"15% discount on Car Insurance"}</div>
                    <div
                        className="w-2/3 text-left flex items-center justify-between text-secondaryBlue bg-white border-2 border-secondaryBlue rounded-lg p-2 mt-2">
                        <CouponIcon size={32} />
                        <div className="text-base font-bold">{"Coupon Code CARS15"}</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;
