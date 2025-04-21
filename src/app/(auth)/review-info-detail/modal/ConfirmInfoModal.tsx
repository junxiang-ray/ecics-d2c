import MButton from "@/components/ui/button/MButton";

const ConfirmInfoModal = ({ onSave }: { onSave: () => void }) => {
    return (
        <div className="flex flex-col justify-between h-full p-6">
            <div>
                <div className="text-lg font-bold text-center">{"Save Your Progress"}</div>
                <div className="mt-4 text-sm text-center">
                    {"We can email you a link to continue later from where you left off."}
                </div>
            </div>

            <div className="flex justify-center gap-4">
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
