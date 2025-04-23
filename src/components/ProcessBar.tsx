import { Steps } from 'antd';
import type { StepsProps } from 'antd';
import { StepProcessBar } from '@/enums/processBarEnums';

interface ProcessBarProps {
  currentStep: StepProcessBar;
}

const stepsData = [
  { step: StepProcessBar.POLICY_DETAILS, title: 'Policy Details' },
  { step: StepProcessBar.SELECT_PLAN, title: 'Select Plan' },
  { step: StepProcessBar.SELECT_ADD_ON, title: 'Select Add On' },
  { step: StepProcessBar.COMPLETE_PURCHASE, title: 'Complete Purchase' },
];

export default function ProcessBar({ currentStep }: ProcessBarProps) {
  const steps: StepsProps['items'] = stepsData.map(({ title, step }) => {
    const isWaiting = step > currentStep;

    // Check if the title is "Select Add On"
    const isSelectAddOn = title === 'Select Add On';

    return {
      title: (
        <div className='step-title'>
          {isSelectAddOn ? (
            <>
              <span className='new-line'>Select</span>
              <span className='new-line -mt-[7px]'>Add On</span>
            </>
          ) : (
            title.split(' ').map((word, i) => (
              <span key={i} className={i > 0 ? 'new-line leading-[1.1]' : ''}>
                {word}
                {i !== title.split(' ').length - 1 && ' '}
              </span>
            ))
          )}
        </div>
      ),
      icon: isWaiting ? <div className='custom-step-wait' /> : undefined,
    };
  });

  return (
    <div className='w-full overflow-auto'>
      <Steps
        current={currentStep}
        labelPlacement='vertical'
        direction='horizontal'
        responsive={false}
        items={steps}
      />
    </div>
  );
}
