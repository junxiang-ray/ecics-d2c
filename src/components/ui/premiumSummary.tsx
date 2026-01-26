import { ChevronLeft, ChevronUp } from 'lucide-react';
import { memo, useEffect, useState } from 'react';

import {
  CustomizationData,
  InsurancePlan,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import { calculateOriginalTotal } from '@/libs/utils/calculations';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import { PremiumBreakdownDrawer } from './premiumBreakdownDrawer';

interface PremiumSummaryProps {
  disableBtn: boolean;
  selectedPlan: InsurancePlan;
  selectedAddOns: SelectedAddOn[];
  totalPremium: number;
  promoStatus: PromoCodeStatus;
  currentStep: number;
  onNext: () => void;
  onBack?: () => void;
  formData: QuoteForm;
  customizationData?: CustomizationData;
  hasViewedCustomization?: boolean;
  showAddOns?: boolean;
}

export const PremiumSummary = memo<PremiumSummaryProps>(
  ({
    disableBtn,
    selectedPlan,
    selectedAddOns,
    totalPremium,
    promoStatus,
    currentStep,
    onNext,
    onBack,
    formData,
    customizationData,
    showAddOns = true, // Default to true for non-step-1 usage
  }) => {
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [hasAddOnsSectionBeenVisible, setHasAddOnsSectionBeenVisible] =
      useState(false);

    // Track visibility of add-ons section for Step 1
    useEffect(() => {
      // Only track on Step 1 and when showAddOns is true
      if (currentStep !== 1 || !showAddOns) {
        setHasAddOnsSectionBeenVisible(true); // Auto-enable for other steps
        return;
      }

      const addOnsSection = document.getElementById('addons-section');
      if (!addOnsSection) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Mark as visible when at least 20% of the section is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.2) {
              setHasAddOnsSectionBeenVisible(true);
            }
          });
        },
        {
          threshold: 0.2, // Trigger when 20% of the element is visible
          rootMargin: '0px',
        },
      );

      observer.observe(addOnsSection);

      return () => {
        observer.disconnect();
      };
    }, [currentStep, showAddOns]);
    console.log(
      `[DEBUG] formData quoteStep check ${JSON.stringify(formData, null, 2)}`,
    );

    // Calculate if we should show original price
    const originalTotal = calculateOriginalTotal(selectedPlan, selectedAddOns);
    const showOriginalPrice =
      promoStatus.status === 'applied' && originalTotal > totalPremium;

    // Dynamic button text based on current step and sub-step state
    const getButtonText = () => {
      if (currentStep === 1) {
        // Step 1 always shows "Continue"
        return 'Continue';
      } else if (currentStep === 3) {
        return 'Make Payment';
      }
      return 'Continue';
    };

    // Dynamic button styling based on current step
    const getButtonStyles = () => {
      return currentStep === 3
        ? 'bg-[#52c41a] hover:bg-[#45a615] text-white'
        : 'bg-[#02ADEF] hover:bg-[#0198d4] text-white';
    };

    return (
      <>
        {console.log(
          'PARENT render disabled {disableBtn from premiumSummary}=',
          disableBtn,
        )}
        <div className='premium-summary-backdrop fixed bottom-0 left-0 right-0 z-50 border-t border-gray-200 bg-white'>
          <div className='mx-auto max-w-7xl'>
            {/* Mobile Optimized Layout - ONLY SHOW ON MOBILE */}
            <div className='block px-3 py-3 sm:hidden'>
              <div className='flex items-center gap-2'>
                {/* Back Button Area - Fixed Width */}
                <div className='w-9 flex-shrink-0'>
                  {currentStep > 1 && onBack && (
                    <Button
                      onClick={onBack}
                      variant='ghost'
                      size='sm'
                      className='h-9 w-9 p-0 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    >
                      <ChevronLeft className='size-4' />
                    </Button>
                  )}
                </div>

                {/* Content Area - Flexible */}
                <div className='min-w-0 flex-1'>
                  <div className='flex items-center justify-between gap-3'>
                    {/* Left Content */}
                    <div className='min-w-0 flex-1'>
                      {/* Plan Name & Badge */}
                      <div className='mb-1 flex items-center gap-2'>
                        <h3 className='truncate text-sm font-bold leading-tight text-gray-800'>
                          {selectedPlan.name}
                        </h3>
                        {promoStatus.status === 'applied' && (
                          <Badge className='bg-green-100 px-1.5 py-0.5 text-xs font-medium text-green-700'>
                            {promoStatus.discount}% OFF
                          </Badge>
                        )}
                      </div>

                      {/* Premium Breakdown Link */}
                      <button
                        onClick={() => setIsDrawerOpen(true)}
                        className='group flex items-center gap-1 text-xs font-medium
                               text-[#02ADEF] transition-colors hover:text-[#0198d4]'
                        aria-label='View premium breakdown'
                      >
                        <span>View breakdown</span>
                        <ChevronUp className='size-3 transition-transform group-hover:-translate-y-0.5' />
                      </button>
                    </div>

                    {/* Price Display */}
                    <div className='flex flex-shrink-0 flex-col items-end'>
                      {showOriginalPrice && (
                        <span className='text-xs leading-tight text-gray-400 line-through'>
                          ${originalTotal.toFixed(2)}
                        </span>
                      )}
                      <div className='text-lg font-bold leading-tight text-gray-800'>
                        ${totalPremium.toFixed(2)}
                        {/* Ara Change - Show original total straight from selected plan/ISP */}
                        {/* ${selectedPlan.totalPricePlan.toFixed(2)} */}
                      </div>
                      <div className='text-xs leading-tight text-gray-500'>
                        Net Premium
                      </div>
                    </div>
                  </div>
                </div>

                {/* Continue Button - Fixed Width */}
                <div className='flex-shrink-0'>
                  <Button
                    onClick={onNext}
                    disabled={
                      (currentStep == 1 || (currentStep == 3 && showAddOns)) &&
                      disableBtn
                    }
                    // disabled={
                    //   currentStep === 1 &&
                    //   showAddOns &&
                    //   hasAddOnsSectionBeenVisible
                    // }
                    size='sm'
                    className={`${getButtonStyles()} h-9 min-w-[80px] px-4 text-sm
                           font-semibold shadow-md transition-all duration-200 hover:shadow-lg`}
                  >
                    {getButtonText()}
                  </Button>
                </div>
              </div>
            </div>

            {/* Desktop Layout - ONLY SHOW ON DESKTOP */}
            <div className='hidden px-4 py-4 sm:block'>
              <div className='flex items-center justify-between gap-6'>
                {/* Left Side - Back Button (Step 2+) or Plan Info */}
                <div className='flex min-w-0 flex-1 items-center gap-4'>
                  {currentStep > 1 && onBack && (
                    <Button
                      onClick={onBack}
                      variant='ghost'
                      className='h-10 p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                    >
                      <ChevronLeft className='size-5' />
                    </Button>
                  )}

                  <div className='min-w-0 flex-1'>
                    {/* Plan Info */}
                    <div className='mb-1 flex items-center gap-3'>
                      <h3 className='truncate text-lg font-bold text-[#323743]'>
                        {selectedPlan.name}
                      </h3>
                      {promoStatus.status === 'applied' && (
                        <Badge className='bg-green-100 px-2 py-0.5 text-xs text-green-700'>
                          {promoStatus.discount}% OFF
                        </Badge>
                      )}
                    </div>

                    {/* Premium Breakdown Button */}
                    <button
                      onClick={() => setIsDrawerOpen(true)}
                      className='touch-target group flex items-center gap-1 text-sm 
                             font-semibold text-[#02ADEF] transition-colors hover:text-[#0198d4]'
                      aria-label='View premium breakdown'
                    >
                      <span>Premium Breakdown</span>
                      <ChevronUp className='size-3 transition-transform group-hover:-translate-y-0.5' />
                    </button>
                  </div>
                </div>

                {/* Price Display */}
                <div className='flex flex-shrink-0 flex-col items-end'>
                  {showOriginalPrice && (
                    <div className='mb-1 flex items-center gap-2'>
                      <span className='text-sm text-gray-400 line-through'>
                        ${originalTotal.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <div className='text-right'>
                    <div className='text-xl font-bold text-[#323743]'>
                      ${totalPremium.toFixed(2)}
                      {/* Ara Change - Show original total straight from selected plan/ISP */}
                      {/* ${selectedPlan.totalPricePlan.toFixed(2)}{' '} */}
                    </div>
                    <div className='text-xs text-[#666]'>Net Premium</div>
                  </div>
                </div>

                {/* Continue Button */}
                <Button
                  onClick={onNext}
                  disabled={
                    (currentStep == 1 || (currentStep == 3 && showAddOns)) &&
                    disableBtn
                  }
                  // disabled={
                  //   currentStep === 1 &&
                  //   showAddOns &&
                  //   !hasAddOnsSectionBeenVisible
                  // }
                  className={`${getButtonStyles()} touch-target h-12 flex-shrink-0
                         px-6 font-semibold shadow-lg transition-all duration-200 hover:shadow-xl`}
                >
                  {getButtonText()}
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Premium Breakdown Drawer */}
        <PremiumBreakdownDrawer
          isOpen={isDrawerOpen}
          onClose={() => setIsDrawerOpen(false)}
          selectedPlan={selectedPlan}
          selectedAddOns={selectedAddOns}
          promoStatus={promoStatus}
          formData={formData}
          customizationData={customizationData}
        />
      </>
    );
  },
);

PremiumSummary.displayName = 'PremiumSummary';
