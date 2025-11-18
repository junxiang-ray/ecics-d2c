import { RightOutlined } from '@ant-design/icons';
import { CheckCircle } from 'lucide-react';
import { memo, useCallback, useEffect, useRef, useState } from 'react';

import { cn } from '../../libs/utils/utils';

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
        return 'bg-brand-green text-white border-brand-green';
      }
      if (isActive) {
        return 'bg-brand-blue text-white border-brand-blue ring-4 ring-brand-blue/20';
      }
      if (isDisabled) {
        return 'bg-gray-100 text-gray-400 border-gray-200';
      }
      return 'bg-white text-gray-600 border-gray-300 hover:border-brand-blue/50';
    };

    const getTextStyles = () => {
      if (isActive) return 'text-brand-blue';
      if (isCompleted) return 'text-brand-green';
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
            <div className='max-w-48 text-center'>
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
              'flex min-w-32 origin-center transform-gpu flex-col items-center px-4 py-2 transition-all duration-300 will-change-transform',
              // bring active/completed to front so scaling doesn't visually overlap neighbors
              isActive || isCompleted ? 'z-10' : 'z-0',
              // small active press scale — reduced so it doesn't break layout
              isClickable && !isDisabled ? 'active:scale-[0.98]' : '',
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

export interface ProgressStepperProps {
  currentStep: number;
  visitedSteps: Set<number>;
  selectedPlan?: string;
  onStepClick: (step: number) => void;
  steps: { step: number; title: string; description: string }[];
  title: string;
}

export const ProgressStepper = memo<ProgressStepperProps>(
  ({ currentStep, visitedSteps, selectedPlan, onStepClick, steps, title }) => {
    const renderedSteps = steps;

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

    // Generic disable rule:
    // - step 1 always enabled
    // - other steps require selectedPlan (insurance context) and the previous step visited
    // If no selectedPlan prop is provided, ignore that rule
    const isStepDisabled = useCallback(
      (step: number): boolean => {
        // Step 1 is always enabled
        if (step === 1) return false;

        // If no 'selectedPlan' prop is passed at all -> ignore plan rule
        const hasPlanDependency = typeof selectedPlan !== 'undefined';

        if (hasPlanDependency && !selectedPlan) {
          // if this flow actually depends on plan selection and none is chosen → disable
          return true;
        }

        // otherwise, allow enabling if previous step is visited
        return !visitedSteps.has(step);
      },
      [selectedPlan, visitedSteps],
    );

    const handleStepClick = useCallback(
      (step: number) => {
        onStepClick(step);
      },
      [onStepClick],
    );

    const desktopScrollRef = useRef<HTMLDivElement | null>(null);
    const mobileScrollRef = useRef<HTMLDivElement | null>(null);
    const [desktopAlignStart, setDesktopAlignStart] = useState(false);
    const [mobileAlignStart, setMobileAlignStart] = useState(false);

    useEffect(() => {
      const checkOverflowAndReset = (
        el: HTMLDivElement | null,
        setAlign: (v: boolean) => void,
      ) => {
        if (!el) return;
        const overflowing = el.scrollWidth > el.clientWidth;
        setAlign(overflowing);
        if (overflowing) {
          // ensure initial view is at the left (step 1)
          el.scrollLeft = 0;
        }
      };

      const checkAll = () => {
        checkOverflowAndReset(desktopScrollRef.current, setDesktopAlignStart);
        checkOverflowAndReset(mobileScrollRef.current, setMobileAlignStart);
      };

      checkAll();
      window.addEventListener('resize', checkAll);
      return () => window.removeEventListener('resize', checkAll);
    }, [renderedSteps.length]);

    return (
      <div className='mb-6 w-full sm:mb-8'>
        {/* Page Title */}
        <div className='mb-4 text-center sm:mb-6'>
          <span
            className='text-xl font-bold text-gray-900 sm:text-2xl'
            style={{ fontFamily: 'Montserrat, sans-serif' }}
          >
            {title}
          </span>
        </div>

        {/* Main Step Indicator */}
        <div className='rounded-2xl border border-white/60 bg-gradient-to-r from-blue-50/50 via-indigo-50/30 to-blue-50/50  shadow-md backdrop-blur-sm sm:p-6'>
          <div className='hidden sm:block'>
            {/* horizontal scroll container for wide step lists */}
            <div
              ref={desktopScrollRef}
              className='scrollbar-hide overflow-x-auto'
            >
              {/* center when content fits, left-align when overflowing */}
              <div
                className={`flex p-3 ${desktopAlignStart ? 'justify-start' : 'justify-center'}`}
              >
                <div className='inline-flex items-center whitespace-nowrap px-3'>
                  {renderedSteps.map((stepInfo, index) => (
                    <div
                      key={stepInfo.step}
                      className='flex flex-shrink-0 items-center'
                    >
                      <StepItem
                        step={stepInfo.step}
                        title={stepInfo.title}
                        description={stepInfo.description}
                        isActive={stepInfo.step === currentStep}
                        isCompleted={isStepCompleted(stepInfo.step)}
                        isClickable={isStepClickable(stepInfo.step)}
                        isDisabled={isStepDisabled(stepInfo.step)}
                        isLast={index === renderedSteps.length - 1}
                        onClick={handleStepClick}
                      />

                      {/* Connector Line */}
                      {index < renderedSteps.length - 1 && (
                        <div className='mx-10'>
                          <div className='relative h-0.5 w-16 overflow-hidden bg-gradient-to-r from-gray-300 to-gray-200'>
                            <div
                              className={cn(
                                'h-full bg-gradient-to-r from-brand-blue to-brand-green transition-all duration-700',
                                isStepCompleted(stepInfo.step)
                                  ? 'w-full'
                                  : 'w-0',
                              )}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Mobile Horizontal Scrolling Layout */}
          <div className='sm:hidden'>
            {/* Horizontal Scrolling Steps (center when few, scroll when many) */}
            <div
              ref={mobileScrollRef}
              className='scrollbar-hide overflow-x-auto'
            >
              <div
                className={`flex ${mobileAlignStart ? 'justify-start' : 'justify-center'}`}
              >
                {/* use gap on the container and w-max to ensure consistent spacing */}
                <div className='inline-flex w-max items-center pb-2'>
                  {renderedSteps.map((stepInfo, index) => (
                    <div
                      key={stepInfo.step}
                      className='flex flex-shrink-0 items-center'
                    >
                      <StepItem
                        step={stepInfo.step}
                        title={stepInfo.title}
                        description={stepInfo.description}
                        isActive={stepInfo.step === currentStep}
                        isCompleted={isStepCompleted(stepInfo.step)}
                        isClickable={isStepClickable(stepInfo.step)}
                        isDisabled={isStepDisabled(stepInfo.step)}
                        isLast={index === renderedSteps.length - 1} // No connector lines in mobile horizontal
                        onClick={handleStepClick}
                      />

                      {/* Horizontal Connector: fixed width, no extra margins, non-interactive */}
                      {index < renderedSteps.length - 1 && (
                        <div className='pointer-events-none z-0 mx-2 flex w-6 flex-shrink-0 items-center justify-center'>
                          <RightOutlined
                            className={cn(
                              'h-4 w-4 transition-colors',
                              isStepCompleted(stepInfo.step)
                                ? 'text-brand-green'
                                : stepInfo.step === currentStep
                                  ? 'text-brand-blue'
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
      </div>
    );
  },
);

ProgressStepper.displayName = 'ProgressStepper';
