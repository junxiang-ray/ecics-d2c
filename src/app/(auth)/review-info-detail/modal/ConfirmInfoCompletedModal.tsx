import MButton from "@/components/ui/button/MButton";
import TickCircleIcon from "@/components/ui/icons/TickCircleIcon";

const ConfirmInfoCompletedModal = () => {
    return (
        <div className="flex flex-col justify-between h-full p-6 text-center">
            <div className="flex-grow p-6 relative z-10">
                <TickCircleIcon size={32} className="mx-auto"/>
                <div className="text-lg font-bold mt-4">{"Progress Saved!"}</div>
                <div className="mt-4 text-sm">
                    {"A link has been sent to your email. Use it anytime to continue your car insurance journey."}
                </div>
            </div>

            <div className="bg-white p-4 border-t flex justify-center gap-4">
                <MButton type="link">
                    Go Back to Home
                </MButton>
            </div>
        </div>
    );
};

export default ConfirmInfoCompletedModal;
