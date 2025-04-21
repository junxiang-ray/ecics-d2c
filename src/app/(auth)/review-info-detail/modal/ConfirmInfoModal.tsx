import MButton from "@/components/ui/button/MButton";

const ConfirmInfoModal = ({ onSave }: { onSave: () => void }) => {
    return (
        <div className="relative z-10 p-6">
            <div className="text-lg font-bold justify-self-center ">{"Save Your Progress"}</div>
            <div className="mt-4 text-sm text-center">
                {"We can email you a link to continue later from where you left off."}
            </div>

            <div className="sticky bottom-0 bg-white p-4 border-t mt-6 flex justify-center gap-4">
                <MButton
                    className="px-4 py-2 border border-blue-600 text-blue-600 bg-white rounded-md hover:bg-blue-50 transition"
                >
                    Exit without saving
                </MButton>
                <MButton
                    onClick={onSave}
                    className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
                >
                    Save my progress
                </MButton>
            </div>
        </div>
    );
};

export default ConfirmInfoModal;
