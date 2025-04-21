import MButton from "@/components/ui/button/MButton";
import TickCircleIcon from "@/components/ui/icons/TickCircleIcon";

const ConfirmInfoCompletedModal = () => {
    return (
        <div className="relative z-10 p-6 text-center">
            <TickCircleIcon size={32} className=""/>
            <div className="text-lg font-bold">{"Progress Saved!"}</div>
            <div className="mt-4 text-sm">{"A link has been sent to your email. Use it anytime to continue your car insurance journey."}</div>

            <div className="sticky bottom-0 bg-white p-4 border-t mt-6 flex justify-center gap-4">
                <MButton type="link">
                    Go Back to Home
                </MButton>
            </div>
        </div>
    );
};

export default ConfirmInfoCompletedModal;
