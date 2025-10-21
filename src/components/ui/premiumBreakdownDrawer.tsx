import { X } from 'lucide-react';
import React, { useEffect } from 'react';

import {
  CustomizationData,
  InsurancePlan,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import { calculateCoveragePremium } from '@/libs/utils/calculations';

import { ADD_ONS } from '@/constants/home.content.addon.constants';

import {
  BUILDING_COVERAGE_OPTIONS,
  HOME_CONTENT_COVERAGE_OPTIONS,
  HOME_TYPES,
  OWNERSHIP_TYPES,
  RENOVATION_COVERAGE_OPTIONS,
  UNIT_TYPES,
} from '@/constants/home.content.constants';

interface PremiumBreakdownDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: InsurancePlan | null;
  selectedAddOns: SelectedAddOn[];
  totalPremium: number;
  promoStatus: PromoCodeStatus;
  formData: QuoteForm;
  customizationData?: CustomizationData;
}

export const PremiumBreakdownDrawer: React.FC<PremiumBreakdownDrawerProps> = ({
  isOpen,
  onClose,
  selectedPlan,
  selectedAddOns,
  totalPremium,
  promoStatus,
  formData,
  customizationData,
}) => {
  // Handle body scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('drawer-open');
      // Prevent scroll on iOS safari
      document.body.style.overflow = 'hidden';
      document.body.style.height = '100%';
    } else {
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
      document.body.style.height = '';
    }

    return () => {
      document.body.classList.remove('drawer-open');
      document.body.style.overflow = '';
      document.body.style.height = '';
    };
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleEscape);
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen, onClose]);

  if (!selectedPlan) return null;

  // Get display labels for form data
  const ownershipLabel =
    OWNERSHIP_TYPES.find((o) => o.value === formData.ownership)?.label ||
    formData.ownership;
  const homeTypeLabel =
    HOME_TYPES.find((h) => h.value === formData.homeType)?.label ||
    formData.homeType;
  const unitTypeLabel =
    UNIT_TYPES.find((u) => u.value === formData.unitType)?.label ||
    formData.unitType;

  // Format policy start date
  const formatDate = (dateString: string): string => {
    if (!dateString) return 'Not selected';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-SG', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  // Calculate breakdown values using original pricing logic
  const planPrice = selectedPlan.originalPrice;

  // Calculate coverage premium
  const coveragePremium = calculateCoveragePremium(customizationData);

  const addOnTotal = selectedAddOns.reduce((total, selectedAddOn) => {
    const addOn = ADD_ONS.find((a) => a.id === selectedAddOn.id);
    if (!addOn) return total;

    if (addOn.hasOptions && selectedAddOn.selectedOption && addOn.options) {
      const selectedOption = addOn.options.find(
        (opt) => opt.value === selectedAddOn.selectedOption,
      );
      return total + (selectedOption?.price || addOn.price);
    }
    return total + addOn.price;
  }, 0);

  const subtotalBeforePromo = planPrice + coveragePremium + addOnTotal;
  const promoDiscount =
    promoStatus.status === 'applied'
      ? (subtotalBeforePromo * (promoStatus.discount || 0)) / 100
      : 0;
  const subtotalAfterPromo = subtotalBeforePromo - promoDiscount;
  const gst = subtotalAfterPromo * 0.09; // 9% GST
  const netPremium = subtotalAfterPromo + gst;

  // Get coverage labels
  const getBuildingCoverageLabel = () => {
    if (!customizationData?.building) return null;
    return (
      BUILDING_COVERAGE_OPTIONS.find(
        (o) => o.value === customizationData.building,
      )?.label || customizationData.building
    );
  };

  const getHomeContentCoverageLabel = () => {
    if (!customizationData?.homeContent) return null;
    return (
      HOME_CONTENT_COVERAGE_OPTIONS.find(
        (o) => o.value === customizationData.homeContent,
      )?.label || customizationData.homeContent
    );
  };

  const getRenovationCoverageLabel = () => {
    if (!customizationData?.renovation) return null;
    return (
      RENOVATION_COVERAGE_OPTIONS.find(
        (o) => o.value === customizationData.renovation,
      )?.label || customizationData.renovation
    );
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className={`
            fixed inset-0 z-40 bg-black/40 transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
          onClick={onClose}
          aria-hidden='true'
        />
      )}

      {/* Drawer */}
      <div
        className={`
          drawer-content fixed bottom-0 left-0 right-0 z-50 mx-auto max-w-md rounded-t-[20px]
          bg-white shadow-2xl transition-transform duration-300 ease-out
          ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        `}
        role='dialog'
        aria-modal='true'
        aria-labelledby='drawer-title'
        style={{
          maxHeight: '90vh',
          minHeight: '50vh',
        }}
      >
        {/* Drag Handle */}
        <div className='flex justify-center pb-1 pt-3'>
          <div className='h-1 w-12 rounded-full bg-gray-300' />
        </div>

        {/* Header */}
        <div className='rounded-t-[20px] border-b border-[#02ADEF]/20 bg-[#f4fbfd] px-4 py-4'>
          <div className='flex items-center justify-between'>
            <h2 id='drawer-title' className='text-xl font-bold text-[#171a1f]'>
              Premium Breakdown
            </h2>
            <button
              onClick={onClose}
              className='touch-target focus-ring rounded-full p-2 transition-colors hover:bg-white/80'
              aria-label='Close premium breakdown'
            >
              <X className='size-5 text-gray-600' />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className='flex-1 overflow-y-auto px-4 py-6'>
          {/* Policy Details Section */}
          <div className='mb-6 rounded-lg border border-blue-100 bg-blue-50/50 p-4'>
            <h3 className='mb-3 text-base font-bold text-[#303030]'>
              Policy Details
            </h3>
            <div className='space-y-2.5'>
              <div className='flex items-start justify-between'>
                <span className='text-sm text-gray-600'>
                  Ownership of your home
                </span>
                <span className='text-right text-sm font-medium text-[#303030]'>
                  {ownershipLabel}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-sm text-gray-600'>Type of Home</span>
                <span className='text-right text-sm font-medium text-[#303030]'>
                  {homeTypeLabel}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-sm text-gray-600'>Unit Type</span>
                <span className='text-right text-sm font-medium text-[#303030]'>
                  {unitTypeLabel}
                </span>
              </div>
              <div className='flex items-start justify-between'>
                <span className='text-sm text-gray-600'>Policy Start Date</span>
                <span className='text-right text-sm font-medium text-[#303030]'>
                  {formatDate(formData.policyStartDate)}
                </span>
              </div>
            </div>
          </div>

          {/* Plan Section */}
          <div className='mb-6'>
            <h3 className='mb-3 text-base font-bold text-[#303030]'>Plan</h3>
            <div className='mb-2 flex items-center justify-between'>
              <span className='text-sm text-[#303030]'>
                {selectedPlan.name} Plan
              </span>
              <span className='text-sm text-[#303030]'>
                SGD {planPrice.toFixed(2)}
              </span>
            </div>
          </div>

          {/* Coverage Section */}
          {coveragePremium > 0 && (
            <div className='mb-6'>
              <h3 className='mb-3 text-base font-bold text-[#303030]'>
                Coverage
              </h3>
              <div className='space-y-3'>
                {/* Building Coverage */}
                {customizationData?.hdbFireInsurance === 'no' &&
                  customizationData?.building && (
                    <div className='flex items-start justify-between'>
                      <div className='flex-1 pr-4'>
                        <div className='mb-1 text-sm leading-tight text-[#303030]'>
                          Building Coverage
                        </div>
                        <div className='text-xs text-gray-500'>
                          {getBuildingCoverageLabel()}
                        </div>
                      </div>
                      <span className='text-sm font-medium text-[#080808]'>
                        SGD{' '}
                        {(
                          (parseFloat(customizationData.building) / 1000) *
                          0.5
                        ).toFixed(2)}
                      </span>
                    </div>
                  )}

                {/* Home Content Coverage */}
                {customizationData?.homeContent && (
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 pr-4'>
                      <div className='mb-1 text-sm leading-tight text-[#303030]'>
                        Home Content Coverage
                      </div>
                      <div className='text-xs text-gray-500'>
                        {getHomeContentCoverageLabel()}
                      </div>
                    </div>
                    <span className='text-sm font-medium text-[#080808]'>
                      SGD{' '}
                      {(
                        (parseFloat(customizationData.homeContent) / 1000) *
                        0.8
                      ).toFixed(2)}
                    </span>
                  </div>
                )}

                {/* Renovation Coverage */}
                {customizationData?.renovation && (
                  <div className='flex items-start justify-between'>
                    <div className='flex-1 pr-4'>
                      <div className='mb-1 text-sm leading-tight text-[#303030]'>
                        Renovation Coverage
                      </div>
                      <div className='text-xs text-gray-500'>
                        {getRenovationCoverageLabel()}
                      </div>
                    </div>
                    <span className='text-sm font-medium text-[#080808]'>
                      SGD{' '}
                      {(
                        (parseFloat(customizationData.renovation) / 1000) *
                        0.6
                      ).toFixed(2)}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Add-ons Section */}
          {selectedAddOns.length > 0 && (
            <div className='mb-6'>
              <h3 className='mb-3 text-base font-bold text-[#303030]'>
                Add-ons
              </h3>
              <div className='space-y-3'>
                {selectedAddOns.map((selectedAddOn) => {
                  const addOn = ADD_ONS.find((a) => a.id === selectedAddOn.id);
                  if (!addOn) return null;

                  let price = addOn.price;
                  let displayName = addOn.name;

                  if (
                    addOn.hasOptions &&
                    selectedAddOn.selectedOption &&
                    addOn.options
                  ) {
                    const selectedOption = addOn.options.find(
                      (opt) => opt.value === selectedAddOn.selectedOption,
                    );
                    if (selectedOption) {
                      price = selectedOption.price;
                      displayName = `${addOn.name}`;
                    }
                  }

                  return (
                    <div
                      key={selectedAddOn.id}
                      className='flex items-start justify-between'
                    >
                      <div className='flex-1 pr-4'>
                        <div className='mb-1 text-sm leading-tight text-[#303030]'>
                          {displayName}
                        </div>
                        {addOn.hasOptions && selectedAddOn.selectedOption && (
                          <div className='text-xs text-gray-500'>
                            ${selectedAddOn.selectedOption} Coverage
                          </div>
                        )}
                      </div>
                      <span className='text-sm font-medium text-[#080808]'>
                        SGD {price.toFixed(2)}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Separator */}
          <div className='my-6 border-t border-gray-200' />

          {/* Totals */}
          <div className='space-y-4'>
            {/* Promo Discount */}
            {promoStatus.status === 'applied' && promoDiscount > 0 && (
              <div className='flex items-center justify-between text-green-600'>
                <span className='text-sm font-semibold'>
                  Promo Discount ({promoStatus.discount}%)
                </span>
                <span className='text-sm font-semibold'>
                  -SGD {promoDiscount.toFixed(2)}
                </span>
              </div>
            )}

            <div className='flex items-center justify-between'>
              <span className='text-base font-bold text-[#303030]'>
                Sub-Total
              </span>
              <span className='text-base font-bold text-[#303030]'>
                SGD {subtotalAfterPromo.toFixed(2)}
              </span>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-sm text-[#303030]'>GST (9%)</span>
              <span className='text-sm text-[#303030]'>
                SGD {gst.toFixed(2)}
              </span>
            </div>

            <div className='border-t border-gray-200 pt-4'>
              <div className='flex items-center justify-between'>
                <span className='text-lg font-bold text-[#303030]'>
                  Net Premium (Total)
                </span>
                <span className='text-lg font-bold text-[#303030]'>
                  SGD {netPremium.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Close Button */}
        <div className='border-t border-gray-100 px-4 pb-6 pt-2'>
          <button
            onClick={onClose}
            className='touch-target focus-ring h-12 w-full rounded-lg border border-[#02ADEF] bg-transparent text-center text-base font-bold text-[#02ADEF] transition-colors hover:bg-[#02ADEF]/5'
          >
            Close Breakdown
          </button>
        </div>
      </div>
    </>
  );
};
