import { Steps } from "antd";
import type { StepsProps } from "antd";

interface ProcessBarProps {
    currentStep: number;
}

const stepTitles = [
    "Policy Details",
    "Select Plan",
    "Select Add On",
    "Complete Purchase",
];

export default function ProcessBar({currentStep}: ProcessBarProps) {
    const steps: StepsProps["items"] = stepTitles.map((title, index) => {
        const isWaiting = index > currentStep;

        return {
            title: (
                <div className="step-title">
                    {title.split(" ").map((word, i) => (
                        <span key={i} className={i > 0 ? "new-line" : ""}>
                            {word}
                            {i !== title.split(" ").length - 1 && " "}
                        </span>
                    ))}
                </div>
            ),
            icon: isWaiting ? <div className="custom-step-wait"/> : undefined,
        };
    });

    return (
        <div>
            <Steps current={currentStep} labelPlacement="vertical" items={steps}/>
        </div>
    );
}
