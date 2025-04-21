import ArrowBackIcon from "@/components/ui/icons/ArrowBackIcon";
import MButton from "@/components/ui/button/MButton";

interface BusinessPartnerBarProps {
    businessName?: string;
    companyName?: string;
    onBackClick?: () => void;
    onSaveClick?: () => void;
}

export default function BusinessPartnerBar({
                                businessName = "Business Partner Name",
                                companyName = "Leo Management Consultancy Pte Ltd",
                                onBackClick,
                                onSaveClick,
                            }: BusinessPartnerBarProps) {
    return (
        <div
            className="fixed top-0 left-0 w-full bg-white shadow-md z-50 py-3 flex flex-row items-center justify-between px-8">
            <MButton type="text" shape="circle" icon={<ArrowBackIcon/>} onClick={onBackClick}/>
            <div className="text-left">
                <div className="text-base">{businessName}</div>
                <div className="text-sm font-semibold truncate md:max-w-none max-w-[200px]">
                    {companyName}
                </div>
            </div>
            <MButton color="primary" variant="outlined" onClick={onSaveClick} className="rounded-none link">
                Save
            </MButton>
        </div>
    );
}
