'use client';

import { Input } from "antd";
import MButton from "@/components/ui/button/MButton";
import { useState } from "react";
import ConfirmInfoModalWrapper from "@/app/(auth)/review-info-detail/modal/ConfirmInfoModalWrapper";
import Image from "next/image";

const ReviewInfoDetail = () => {
    const [showConfirmModal, setShowConfirmModal] = useState(false);

    const handleContinue = () => {
        setShowConfirmModal(true);
    };

    const handleCloseModal = () => {
        setShowConfirmModal(false);
    };

    return (
        <div className="flex flex-col min-h-screen">
            <div className="flex-grow relative z-10 p-6">
                <div className="flex items-center justify-between">
                    <Image
                        src="/ecics.svg"
                        alt="Logo"
                        width={100}
                        height={100}
                    />
                    <Image
                        src="/singpass.svg"
                        alt="Logo"
                        width={170}
                        height={170}
                    />
                </div>
                <div className="text-lg font-bold mt-6">{"Review your Myinfo details"}</div>
                <div className="mt-4">
                    <div className="text-sm font-bold">{"Email Address"}</div>
                    <Input placeholder="abc@gmail.com" className="mt-2" />
                </div>
                <div className="mt-4">
                    <div className="text-sm font-bold">{"Phone Number"}</div>
                    <Input placeholder="+65 98888888" className="mt-2" />
                </div>
                <div className="mt-4">
                    <div className="text-base font-bold underline underline-offset-4">{"Personal Info"}</div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-sm font-bold">{"Name as per NRIC"}</div>
                            <div className="text-sm">{"Sayan Chakraborty"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">{"NRIC"}</div>
                            <div className="text-sm">{"ABC1234"}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-sm font-bold">{"Gender"}</div>
                            <div className="text-sm">{"Male"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">{"Marital Status"}</div>
                            <div className="text-sm">{"Married"}</div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-sm font-bold">{"Date of Birth"}</div>
                            <div className="text-sm">{"29/12/1990"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">{"Address"}</div>
                            <div className="text-sm">{"10 Eunos Road Singapore 400087"}</div>
                        </div>
                    </div>
                </div>

                <div className="mt-4">
                    <div className="text-base font-bold underline underline-offset-4">{"Vehicle Details"}</div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <div className="text-sm font-bold">{"Vehicle Make"}</div>
                            <div className="text-sm">{"BMW i5 2.5"}</div>
                        </div>
                        <div>
                            <div className="text-sm font-bold">{"Year of Registration"}</div>
                            <div className="text-sm">{"2024"}</div>
                        </div>
                    </div>

                    <div className="mt-2">
                        <div className="text-sm font-bold">{"Chassis Number"}</div>
                        <div className="text-sm">{"SGT1818T"}</div>
                    </div>
                </div>
            </div>
            <div className="bg-white p-4 border-t flex justify-center gap-4">
                <MButton
                    className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 transition"
                    onClick={handleCloseModal}
                >
                    Cancel
                </MButton>
                <MButton
                    onClick={handleContinue}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Continue
                </MButton>
            </div>
            {showConfirmModal && <ConfirmInfoModalWrapper/>}
        </div>
    );
};

export default ReviewInfoDetail;
