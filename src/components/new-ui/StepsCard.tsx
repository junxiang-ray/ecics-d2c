import { CheckCircleFilled, RightOutlined } from '@ant-design/icons';
import { memo, useCallback } from 'react';

import { StepIndicatorProps } from '../../libs/types/homeContents';
import { cn } from '../../libs/utils/utils';
import { CheckCircle } from 'lucide-react';

interface StepItemProps {
  step: number;
  title: string;
  description: string;
  isActive: boolean;
  isCompleted: boolean;
  isClickable: boolean;
  isDisabled: boolean;
  isLast: boolean;
  onClick: (step: number) => void;
}

const StepItem = memo<StepItemProps>(
  ({
    step,
    title,
    description,
    isActive,
    isCompleted,
    isClickable,
    isDisabled,
    isLast,
    onClick,
  }) => {
    const handleClick = useCallback(() => {
      if (isClickable && !isDisabled) {
        onClick(step);
      }
    }, [step, isClickable, isDisabled, onClick]);

    const getStepStyles = () => {
      if (isCompleted) {
        return 'bg-[#52c41a] text-white border-[#52c41a]';
      }
      if (isActive) {
        return 'bg-[#02ADEF] text-white border-[#02ADEF] ring-4 ring-[#02ADEF]/20';
      }
      if (isDisabled) {
        return 'bg-gray-100 text-gray-400 border-gray-200';
      }
      return 'bg-white text-gray-600 border-gray-300 hover:border-[#02ADEF]/50';
    };

    const getTextStyles = () => {
      if (isActive) return 'text-[#02ADEF]';
      if (isCompleted) return 'text-[#52c41a]';
      if (isDisabled) return 'text-gray-400';
      return 'text-gray-600';
    };

    return (
      <>
        {/* Desktop/Tablet Step Item */}
        <div className='hidden flex-col items-center sm:flex'>
          <div
            className={cn(
              'group flex cursor-pointer flex-col items-center transition-all duration-300',
              isClickable && !isDisabled ? 'hover:scale-105' : '',
            )}
            onClick={handleClick}
          >
            {/* Step Circle */}
            <div
              className={cn(
                'relative mb-3 flex h-12 w-12 items-center justify-center rounded-full border-2 transition-all duration-300',
                getStepStyles(),
              )}
            >
              {isCompleted ? (
                <CheckCircle className='h-6 w-6' />
              ) : (
                <span className='text-lg font-bold'>{step}</span>
              )}
            </div>

            {/* Step Content */}
            <div className='max-w-[200px] text-center'>
              <h3
                className={cn(
                  'mb-1 text-base font-bold transition-colors sm:text-lg',
                  getTextStyles(),
                )}
              >
                {title}
              </h3>
              <p
                className={cn(
                  'text-xs leading-tight sm:text-sm',
                  getTextStyles(),
                )}
              >
                {description}
              </p>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Step Item */}
        <div className='flex-shrink-0 sm:hidden'>
          <div
            className={cn(
              'flex min-w-[100px] cursor-pointer flex-col items-center px-3 py-2 transition-all duration-300',
              isClickable && !isDisabled ? 'active:scale-95' : '',
            )}
            onClick={handleClick}
          >
            {/* Step Circle */}
            <div
              className={cn(
                'relative mb-2 flex h-10 w-10 items-center justify-center rounded-full border-2 transition-all duration-300',
                getStepStyles(),
              )}
            >
              {isCompleted ? (
                <CheckCircle className='h-6 w-6' />
              ) : (
                <span className='text-sm font-bold'>{step}</span>
              )}
            </div>

            {/* Step Content */}
            <div className='text-center'>
              <h3
                className={cn(
                  'mb-1 text-sm font-bold leading-tight transition-colors',
                  getTextStyles(),
                )}
              >
                {title}
              </h3>
              <p className={cn('text-xs leading-tight', getTextStyles())}>
                {description}
              </p>
            </div>
          </div>
        </div>
      </>
    );
  },
);

StepItem.displayName = 'StepItem';

export const ProgressStepper = memo<StepIndicatorProps>(
  ({ currentStep, visitedSteps, selectedPlan, onStepClick }) => {
    const steps = [
      {
        step: 1,
        title: 'Quote Details',
        description: 'Home Info',
      },
      {
        step: 2,
        title: 'Personal Info',
        description: "Policyholder's Detail",
      },
      {
        step: 3,
        title: 'Review & Pay',
        description: 'Confirm & checkout',
      },
    ];

    const isStepCompleted = useCallback(
      (step: number): boolean => {
        return visitedSteps.has(step) && step < currentStep;
      },
      [visitedSteps, currentStep],
    );

    const isStepClickable = useCallback(
      (step: number): boolean => {
        return visitedSteps.has(step) || step === currentStep + 1;
      },
      [visitedSteps, currentStep],
    );

    const isStepDisabled = useCallback(
      (step: number): boolean => {
        if (step === 2) {
          return !selectedPlan || !visitedSteps.has(1);
        }
        if (step === 3) {
          return !selectedPlan || !visitedSteps.has(2);
        }
        return false;
      },
      [selectedPlan, visitedSteps],
    );

    const handleStepClick = useCallback(
      (step: number) => {
        onStepClick(step);
      },
      [onStepClick],
    );

    return (
      <div className='mb-6 w-full sm:mb-8'>
        {/* Page Title */}
        <div className='mb-4 text-center sm:mb-6'>
          <span
            className='text-xl font-bold text-gray-900 sm:text-2xl'
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            Home Content Insurance Quotation
          </span>
        </div>

        {/* Main Step Indicator */}
        <div className='rounded-2xl border border-white/60 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50 p-3 shadow-md backdrop-blur-sm sm:p-6'>
          {/* Desktop/Tablet Horizontal Layout */}
          <div className='hidden items-center justify-center gap-8 sm:flex'>
            {steps.map((stepInfo, index) => (
              <div key={stepInfo.step} className='flex items-center'>
                <StepItem
                  step={stepInfo.step}
                  title={stepInfo.title}
                  description={stepInfo.description}
                  isActive={stepInfo.step === currentStep}
                  isCompleted={isStepCompleted(stepInfo.step)}
                  isClickable={isStepClickable(stepInfo.step)}
                  isDisabled={isStepDisabled(stepInfo.step)}
                  isLast={true}
                  onClick={handleStepClick}
                />

                {/* Connector Line */}
                {index < steps.length - 1 && (
                  <div className='mx-6'>
                    <div className='relative h-0.5 w-16 overflow-hidden bg-gradient-to-r from-gray-300 to-gray-200'>
                      <div
                        className={cn(
                          'h-full bg-gradient-to-r from-[#02ADEF] to-[#52c41a] transition-all duration-700',
                          isStepCompleted(stepInfo.step) ? 'w-full' : 'w-0',
                        )}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Mobile Horizontal Scrolling Layout */}
          <div className='sm:hidden'>
            {/* Horizontal Scrolling Steps */}
            <div className='scrollbar-hide overflow-x-auto'>
              <div
                className='flex items-center gap-2 pb-2'
                style={{ minWidth: 'fit-content' }}
              >
                {steps.map((stepInfo, index) => (
                  <div key={stepInfo.step} className='flex items-center'>
                    <StepItem
                      step={stepInfo.step}
                      title={stepInfo.title}
                      description={stepInfo.description}
                      isActive={stepInfo.step === currentStep}
                      isCompleted={isStepCompleted(stepInfo.step)}
                      isClickable={isStepClickable(stepInfo.step)}
                      isDisabled={isStepDisabled(stepInfo.step)}
                      isLast={true} // No connector lines in mobile horizontal
                      onClick={handleStepClick}
                    />

                    {/* Horizontal Connector */}
                    {index < steps.length - 1 && (
                      <div className='mx-2 flex-shrink-0'>
                        <RightOutlined
                          className={cn(
                            'h-4 w-4 transition-colors',
                            isStepCompleted(stepInfo.step)
                              ? 'text-[#52c41a]'
                              : stepInfo.step === currentStep
                                ? 'text-[#02ADEF]'
                                : 'text-gray-300',
                          )}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

ProgressStepper.displayName = 'ProgressStepper';
