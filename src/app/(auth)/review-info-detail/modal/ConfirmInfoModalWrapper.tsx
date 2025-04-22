import { useState } from "react";
import ConfirmInfoModal from "./ConfirmInfoModal";
import ConfirmInfoCompletedModal from "./ConfirmInfoCompletedModal";

const ConfirmInfoModalWrapper = () => {
    const [isSaved, setIsSaved] = useState(false);

    return (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black bg-opacity-50">
            <div className="w-full sm:w-[480px] h-1/3 animate-slide-up bg-white rounded-t-lg shadow-lg flex flex-col">
                {isSaved ? (
                    <ConfirmInfoCompletedModal />
                ) : (
                    <ConfirmInfoModal onSave={() => setIsSaved(true)} />
                )}
            </div>
        </div>
    );
};

export default ConfirmInfoModalWrapper;
