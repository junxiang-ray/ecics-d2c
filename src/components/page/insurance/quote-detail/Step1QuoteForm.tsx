import {
  AlertCircle,
  Building,
  CalendarCheck,
  CheckCircle,
  Home,
  X,
} from 'lucide-react';
import { Briefcase, Shield } from 'lucide-react';
import { memo, useCallback, useEffect, useMemo, useRef } from 'react';

import {
  CustomizationData,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import {
  calculateExpiryDate,
  calculateTotalPremium,
  validatePromoCode,
} from '@/libs/utils/calculations';
import { cn } from '@/libs/utils/utils';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { AddOnCard } from '@/components/ui/addOnCard';
import { Card, CardContent, CardHeader } from '@/components/ui/cardNew';
import { DateInput } from '@/components/ui/dateInput';
import { Label } from '@/components/ui/label';
import { PlanCard } from '@/components/ui/planCard';
import { PremiumSummary } from '@/components/ui/premiumSummary';
import { Select } from '@/components/ui/select';

import {
  BUILDING_COVERAGE_OPTIONS,
  HOME_CONTENT_COVERAGE_OPTIONS,
  HOME_TYPES,
  OWNERSHIP_TYPES,
  PLANS,
  RENOVATION_COVERAGE_OPTIONS,
  UNIT_TYPES,
} from '@/constants/home.content.constants';

import { ADD_ONS } from '@/constants/home.content.addon.constants';

import { Button } from '../../../ui/button';

interface Step1Props {
  formData: QuoteForm;
  updateFormData: (field: keyof QuoteForm, value: string) => void;
  errors: Partial<QuoteForm>;
  promoStatus: PromoCodeStatus;
  setPromoStatus: (status: PromoCodeStatus) => void;
  showPlans: boolean;
  showCustomization: boolean;
  showAddOns: boolean;
  selectedPlan: string;
  selectedAddOns: SelectedAddOn[];
  customizationData: CustomizationData;
  updateCustomizationData: (
    field: keyof CustomizationData,
    value: string,
  ) => void;
  isLoading: boolean;
  onCalculateQuote: () => void;
  onPlanSelect: (planId: string) => void;
  onCustomizationComplete: () => void;
  onAddOnToggle: (addOnId: string) => void;
  onAddOnOptionChange: (addOnId: string, option: string) => void;
  onNext: () => void;
  onBack: () => void;
  currentStep: number;
  hasViewedCustomization: boolean;
  setHasViewedCustomization: (viewed: boolean) => void;
}

const Step1QuoteForm = memo<Step1Props>(
  ({
    formData,
    updateFormData,
    errors,
    promoStatus,
    setPromoStatus,
    showPlans,
    showCustomization,
    showAddOns,
    selectedPlan,
    selectedAddOns,
    customizationData,
    updateCustomizationData,
    isLoading,
    onCalculateQuote,
    onPlanSelect,
    onCustomizationComplete,
    onAddOnToggle,
    onAddOnOptionChange,
    onNext,
    onBack,
    currentStep,
    hasViewedCustomization,
    setHasViewedCustomization,
  }) => {
    // Ref for the customization section
    const customizationRef = useRef<HTMLDivElement>(null);

    // Intersection Observer to detect when customization section is viewed
    useEffect(() => {
      if (!showCustomization || hasViewedCustomization) return;

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            // Mark as viewed when at least 50% of the section is visible
            if (entry.isIntersecting && entry.intersectionRatio >= 0.5) {
              setHasViewedCustomization(true);
            }
          });
        },
        {
          threshold: 0.5, // Trigger when 50% of the element is visible
          rootMargin: '0px',
        },
      );

      if (customizationRef.current) {
        observer.observe(customizationRef.current);
      }

      return () => {
        observer.disconnect();
      };
    }, [showCustomization, hasViewedCustomization, setHasViewedCustomization]);

    // Memoized calculations
    const policyExpiryDate = useMemo(() => {
      // Default to 1 year for expiry date calculation since duration is now plan-based
      return calculateExpiryDate(formData.policyStartDate, '12');
    }, [formData.policyStartDate]);

    const currentPlan = useMemo(() => {
      if (!PLANS || !Array.isArray(PLANS) || !selectedPlan) return null;
      return PLANS.find((p) => p.id === selectedPlan) || null;
    }, [selectedPlan]);

    const totalPremium = useMemo(() => {
      return calculateTotalPremium(
        currentPlan || null,
        selectedAddOns,
        promoStatus,
        undefined,
        customizationData,
      );
    }, [currentPlan, selectedAddOns, promoStatus, customizationData]);

    const isCalculateQuoteDisabled = useMemo(() => {
      return isLoading;
    }, [isLoading]);

    const availableUnitTypes = useMemo(() => {
      return UNIT_TYPES.filter((unit) =>
        unit.homeTypes.includes(formData.homeType),
      );
    }, [formData.homeType]);

    // Memoized handlers
    const handleApplyPromo = useCallback(() => {
      const result = validatePromoCode(formData.promoCode);
      setPromoStatus(result);
    }, [formData.promoCode, setPromoStatus]);

    const handlePromoCodeClear = useCallback(() => {
      setPromoStatus({ status: 'none' });
      updateFormData('promoCode', '');
    }, [setPromoStatus, updateFormData]);

    // Early return if constants aren't loaded
    if (
      !PLANS ||
      !Array.isArray(PLANS) ||
      !ADD_ONS ||
      !Array.isArray(ADD_ONS) ||
      !OWNERSHIP_TYPES ||
      !Array.isArray(OWNERSHIP_TYPES)
    ) {
      return (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-[#02ADEF]'></div>
        </div>
      );
    }

    const labelToValueMap = Object.fromEntries(
      availableUnitTypes.map(({ label, value }) => [label, value]),
    );

    return (
      <>
        {/* Quote Form */}
        <Card className='mb-8 overflow-hidden border-0 shadow-xl'>
          <CardHeader className='from-[#02ADEF]/8 border-b border-gray-100 bg-gradient-to-r via-blue-50/80 to-indigo-50/50 p-8'>
            <div className='mb-3 flex items-center gap-4'>
              <div className='rounded-xl bg-[#02ADEF]/10 p-3'>
                <Home className='size-6 text-[#02ADEF]' />
              </div>
              <div>
                <h2 className='m-0 mb-1 text-[28px] font-bold text-gray-800'>
                  Calculate Your Quote
                </h2>
                <p className='m-0 text-base text-gray-600'>
                  Fill in the details below to get your personalized home
                  content insurance quote
                </p>
              </div>
            </div>
          </CardHeader>

          <CardContent className='p-8 sm:p-10'>
            <div className='grid grid-cols-1 gap-8 sm:gap-10 lg:grid-cols-2'>
              {/* Ownership of your home - Full Width Row */}
              <div className='col-span-1 space-y-4 lg:col-span-2'>
                <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                  <Building className='size-5 text-[#02ADEF]' />
                  Ownership of your home <span className='text-red-500'>*</span>
                </Label>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {OWNERSHIP_TYPES.map((type) => {
                    // Extract main label and sub-text
                    const getDisplayText = (label: string) => {
                      switch (type.value) {
                        case 'owner-living-in':
                          return { main: 'Owner', sub: 'Living in' };
                        case 'landlord-renting-out':
                          return {
                            main: 'Landlord',
                            sub: 'Renting out partially/fully',
                          };
                        case 'tenant':
                          return {
                            main: 'Tenant',
                            sub: 'Renting from landlord',
                          };
                        default:
                          return { main: label, sub: '' };
                      }
                    };

                    const { main, sub } = getDisplayText(type.label);

                    return (
                      <button
                        key={type.value}
                        type='button'
                        onClick={() => updateFormData('ownership', type.value)}
                        className={cn(
                          'rounded-xl border-2 px-6 py-4 text-center shadow-sm transition-all duration-300',
                          'hover:scale-105 hover:shadow-md',
                          formData.ownership === type.value
                            ? 'scale-105 border-[#02ADEF] bg-[#02ADEF] text-white shadow-lg'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50',
                        )}
                      >
                        <div className='flex flex-col items-center gap-1'>
                          <span className='text-lg font-semibold'>{main}</span>
                          <span
                            className={cn(
                              'text-sm',
                              formData.ownership === type.value
                                ? 'text-blue-100'
                                : 'text-gray-500',
                            )}
                          >
                            {sub}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
                {errors.ownership && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {errors.ownership}
                  </p>
                )}
              </div>

              {/* Type of Home - Full Width Row */}
              <div className='col-span-1 space-y-4 lg:col-span-2'>
                <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                  <Home className='size-5 text-[#02ADEF]' />
                  Type of Home <span className='text-red-500'>*</span>
                </Label>
                <div className='grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3'>
                  {HOME_TYPES.map((type) => (
                    <button
                      key={type.value}
                      type='button'
                      onClick={() => updateFormData('homeType', type.value)}
                      className={cn(
                        'rounded-xl border-2 px-6 py-4 text-center text-lg font-semibold shadow-sm transition-all duration-300',
                        'hover:scale-105 hover:shadow-md',
                        formData.homeType === type.value
                          ? 'scale-105 border-[#02ADEF] bg-[#02ADEF] text-white shadow-lg'
                          : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50',
                      )}
                    >
                      <div>
                        <p className='font-semibold'>{type.label}</p>
                        <p
                          className={cn(
                            'mt-1 text-sm',
                            formData.homeType === type.value
                              ? 'text-blue-100'
                              : 'text-gray-500',
                          )}
                        >
                          {type.description}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
                {errors.homeType && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {errors.homeType}
                  </p>
                )}
              </div>

              {/* Unit Type - Only show for non-landed properties */}
              {formData.homeType !== 'landed' && (
                <div className='space-y-4'>
                  <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                    <Building className='size-5 text-[#02ADEF]' />
                    Unit Type <span className='text-red-500'>*</span>
                  </Label>

                  <Select
                    defaultValue={
                      availableUnitTypes.find(
                        (u) => u.value === formData.unitType,
                      )?.label
                    }
                    placeholder='Select unit type'
                    onChange={(label) => {
                      // Map the label back to the corresponding value
                      const selectedUnit = availableUnitTypes.find(
                        (u) => u.label === label,
                      );
                      if (selectedUnit) {
                        updateFormData('unitType', selectedUnit.value);
                      }
                    }}
                    options={availableUnitTypes.map((unit) => unit.label)}
                    className='h-14 px-6 text-lg'
                  />

                  {errors.unitType && (
                    <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                      <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                        !
                      </span>
                      {errors.unitType}
                    </p>
                  )}
                </div>
              )}

              {/* Policy Start Date */}
              <div className='space-y-4'>
                <Label className='flex items-center gap-2 text-lg font-semibold text-gray-700'>
                  <CalendarCheck className='size-5 text-[#02ADEF]' />
                  Policy Start Date <span className='text-red-500'>*</span>
                </Label>
                <DateInput
                  value={formData.policyStartDate}
                  onChange={(value: string) =>
                    updateFormData('policyStartDate', value)
                  }
                  error={!!errors.policyStartDate}
                />
                {errors.policyStartDate && (
                  <p className='mt-2 flex items-center gap-2 text-sm text-red-500'>
                    <span className='flex size-4 items-center justify-center rounded-full bg-red-500 text-xs text-white'>
                      !
                    </span>
                    {errors.policyStartDate}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Promo Code Section */}
        <Card className='mb-10 overflow-hidden border-0 shadow-xl'>
          <CardContent className='p-8 sm:p-10'>
            <div className='flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between'>
              <div className='flex-1'>
                <h3 className='mb-2 text-2xl font-bold text-gray-800'>
                  Have a Promo Code?
                </h3>
                <p className='m-0 text-base text-gray-600'>
                  Apply your promo code to get additional discounts on your
                  insurance premium (For testing, use 123 for the valid promo
                  code)
                </p>
              </div>
              <div className='flex flex-col gap-4 sm:flex-row'>
                <div className='min-w-0 flex-1'>
                  <input
                    type='text'
                    placeholder='Enter promo code'
                    value={formData.promoCode}
                    onChange={(e) =>
                      updateFormData('promoCode', e.target.value)
                    }
                    className={cn(
                      'h-12 w-full rounded-xl border-2 px-4 transition-all duration-200 sm:h-14 sm:px-6',
                      'text-base font-medium leading-normal sm:text-lg',
                      'bg-white hover:border-[#02ADEF]/60 hover:shadow-sm',
                      'focus:border-[#02ADEF] focus:outline-none focus:ring-4 focus:ring-[#02ADEF]/10',
                      'placeholder:text-gray-500',
                      promoStatus.status === 'applied'
                        ? 'border-green-500'
                        : promoStatus.status === 'invalid'
                          ? 'border-red-500'
                          : 'border-gray-200',
                    )}
                    style={{ fontSize: '16px' }}
                  />
                </div>
                <div className='flex-shrink-0'>
                  <Button
                    onClick={handleApplyPromo}
                    variant='outline'
                    className='h-12 w-full border-2 border-[#02ADEF] px-6 text-base font-semibold text-[#02ADEF] shadow-sm transition-all duration-200 hover:scale-105 hover:bg-[#02ADEF] hover:text-white hover:shadow-md sm:h-14 sm:w-auto sm:px-8 sm:text-lg'
                  >
                    Apply Code
                  </Button>
                </div>
              </div>
            </div>

            {/* Promo Status Messages */}
            {promoStatus.status !== 'none' && (
              <div className='mt-6'>
                {promoStatus.status === 'applied' && (
                  <div className='flex items-center gap-3 rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-emerald-50 p-4'>
                    <CheckCircle className='size-5 flex-shrink-0 text-[#52c41a]' />
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-[#45a615]'>
                        Promo Code Applied!
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-[#52c41a]'>
                        Code "{promoStatus.code}" - {promoStatus.discount}%
                        discount applied to your premium
                      </p>
                    </div>
                    <Button
                      variant='ghost'
                      size='sm'
                      onClick={handlePromoCodeClear}
                      className='mobile-touch-target text-[#52c41a] hover:bg-green-100 hover:text-[#45a615]'
                      aria-label='Remove promo code'
                    >
                      <X className='size-4' />
                    </Button>
                  </div>
                )}

                {promoStatus.status === 'invalid' && (
                  <div className='flex items-center gap-3 rounded-xl border border-red-200 bg-gradient-to-r from-red-50 to-pink-50 p-4'>
                    <AlertCircle className='size-5 flex-shrink-0 text-red-600' />
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-red-700'>
                        Invalid Promo Code
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-red-600'>
                        {promoStatus.message ||
                          'Please check your promo code and try again.'}
                      </p>
                    </div>
                  </div>
                )}

                {promoStatus.status === 'applying' && (
                  <div className='flex items-center gap-3 rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                    <div className='h-5 w-5 flex-shrink-0 animate-spin rounded-full border-b-2 border-blue-600'></div>
                    <div className='flex-1'>
                      <p className='m-0 text-sm font-semibold leading-tight text-blue-700'>
                        Validating Promo Code...
                      </p>
                      <p className='m-0 mt-1 text-sm leading-tight text-blue-600'>
                        Please wait while we verify your promo code.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Calculate Quote Button */}
        <div className='mb-12 text-center'>
          <Button
            onClick={onCalculateQuote}
            disabled={isCalculateQuoteDisabled}
            className={cn(
              'h-16 min-w-[250px] px-12 py-6 text-lg font-bold shadow-xl transition-all duration-300',
              isCalculateQuoteDisabled
                ? 'cursor-not-allowed bg-gray-400 text-gray-600 hover:bg-gray-400'
                : 'bg-[#52c41a] text-white hover:scale-105 hover:bg-[#45a615] hover:shadow-2xl',
            )}
          >
            {isLoading ? (
              <>
                <div className='mr-3 h-5 w-5 animate-spin rounded-full border-b-2 border-white'></div>
                Calculating...
              </>
            ) : (
              'Calculate Quote'
            )}
          </Button>
        </div>

        {/* Plans Section */}
        {showPlans && (
          <div id='plans-section' className='animate-in fade-in duration-500'>
            <div className='mb-8 text-center'>
              <h2 className='mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-[clamp(32px,5vw,48px)] font-bold text-gray-800 text-transparent'>
                Choose Your Plan
              </h2>
              <p className='mx-auto max-w-[800px] text-xl leading-relaxed text-gray-600'>
                Select your preferred policy duration. Both plans offer the same
                comprehensive coverage for your home contents. Terms &
                Conditions Apply.
              </p>
            </div>

            <div className='mb-16 pt-4'>
              <div className='mx-auto grid max-w-4xl grid-cols-1 items-start gap-8 md:grid-cols-2 md:gap-6 xl:gap-8'>
                {PLANS.map((plan) => (
                  <PlanCard
                    key={plan.id}
                    plan={plan}
                    onSelect={() => onPlanSelect(plan.id)}
                    isSelected={selectedPlan === plan.id}
                    promoStatus={promoStatus}
                    customizationData={customizationData}
                  />
                ))}
              </div>
            </div>

            {/* What's Included in All Plans Section - Accordion */}
            <div className='mb-16'>
              <Accordion type='single' collapsible className='w-full'>
                <AccordionItem
                  value='coverage-benefits'
                  className='rounded-lg border shadow-sm'
                >
                  <AccordionTrigger className='rounded-t-lg bg-gradient-to-r from-blue-50/50 to-indigo-50/30 px-6 py-4 transition-colors hover:bg-gradient-to-r hover:from-blue-100/50 hover:to-indigo-100/40 hover:no-underline [&>svg]:hidden'>
                    <div className='flex w-full items-center justify-between gap-4'>
                      <div className='flex items-center gap-3'>
                        <div className='rounded-lg bg-[#02ADEF]/10 p-2'>
                          <Shield className='size-5 text-[#02ADEF]' />
                        </div>
                        <span className='font-bold text-gray-800'>
                          Standard Coverage Features
                        </span>
                      </div>
                      <span className='pointer-events-none whitespace-nowrap rounded-lg bg-[#02ADEF] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#0291CC]'>
                        View Benefits
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className='px-6 pb-6 pt-4'>
                    <div className='overflow-x-auto'>
                      <table className='w-full table-fixed border-collapse'>
                        <thead>
                          <tr className='border-b-2 border-gray-200'>
                            <th className='w-1/4 px-2 py-3 text-left font-semibold text-gray-800'>
                              Coverage
                            </th>
                            <th className='w-1/2 px-2 py-3 text-left font-semibold text-gray-800'>
                              What's Covered
                            </th>
                            <th className='w-1/4 px-2 py-3 text-left font-semibold text-gray-800'>
                              Maximum Benefit Limit
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Emergency Cash Allowance
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Pay for basic necessities (food, clothes,
                              transport), alternative accommodation, replace
                              locks and keys of your damaged home, and more
                            </td>
                            <td className='px-2 py-3 text-gray-800'>
                              <div className='space-y-1'>
                                <div>
                                  100% Uninhabitable:{' '}
                                  <span className='font-semibold'>$5,000</span>
                                </div>
                                <div>
                                  50% Uninhabitable:{' '}
                                  <span className='font-semibold'>$2,500</span>
                                </div>
                              </div>
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Emergency Home Assistance
                              <div className='mt-1 text-xs text-gray-500'>
                                (Applicable for plans of 3 years or more)
                              </div>
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Emergency assistance for urgent home repairs and
                              services
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $200 per event, up to 4 times per year
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Personal Legal Liability
                              <div className='mt-1 text-xs text-gray-500'>
                                (Worldwide)
                              </div>
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Legal liability coverage for personal accidents
                              and property damage
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $500,000
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Valuables
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Coverage for jewelry, watches, art, and other
                              valuable items
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              30% of Content Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Removal of Debris
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Cost of removing debris following damage to
                              renovated areas
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              10% of Renovation Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Professional Fees
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Architect, surveyor, and legal fees for rebuilding
                              or renovation
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              10% of Building and/or Renovation Sum Insured
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Conservancy Charge
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Monthly maintenance fees during alternative
                              accommodation period
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $500
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Unauthorised Transactions
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Fraudulent use of stolen ATM or credit cards
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $1,000
                            </td>
                          </tr>

                          <tr className='border-b border-gray-100'>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Accidental Breakage
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Mirrors and fixed glass breakage due to accidents
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $1,000
                            </td>
                          </tr>

                          <tr>
                            <td className='px-2 py-3 font-medium text-gray-800'>
                              Money
                            </td>
                            <td className='px-2 py-3 text-gray-600'>
                              Cash, cheques, and monetary instruments
                            </td>
                            <td className='px-2 py-3 font-semibold text-gray-800'>
                              $750
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        )}

        {/* Customization Section */}
        {showCustomization && (
          <div
            ref={customizationRef}
            id='customization-section'
            className='animate-in fade-in duration-500'
          >
            <div className='mb-16 text-center'>
              <h2 className='mb-6 bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 bg-clip-text text-[clamp(32px,5vw,48px)] font-bold text-gray-800 text-transparent'>
                Customise Your Plan
              </h2>
              <p className='mx-auto max-w-[800px] text-xl leading-relaxed text-gray-600'>
                Adjust your coverage amounts to match your specific needs and
                get a personalized quote.
              </p>
            </div>

            <Card className='mb-16 overflow-hidden border-0 shadow-xl'>
              <CardHeader className='from-[#02ADEF]/8 border-b border-gray-100 bg-gradient-to-r via-blue-50/80 to-indigo-50/50 p-8'>
                <div className='mb-3 flex items-center gap-4'>
                  <div className='rounded-xl bg-[#02ADEF]/10 p-3'>
                    <Building className='size-6 text-[#02ADEF]' />
                  </div>
                  <div>
                    <h3 className='m-0 mb-1 text-[28px] font-bold text-gray-800'>
                      Coverage Amounts
                    </h3>
                    <p className='m-0 text-base text-gray-600'>
                      Select the coverage amounts that best suit your home and
                      belongings
                    </p>
                  </div>
                </div>
              </CardHeader>

              <CardContent className='p-8 sm:p-10'>
                {/* HDB Fire Insurance Question */}
                <div className='mb-6 rounded-xl border border-blue-100 bg-gradient-to-br from-blue-50 to-indigo-50/50 p-3 sm:mb-8 sm:p-4 md:p-6 lg:mb-12'>
                  <div className='mb-3 sm:mb-4 md:mb-6'>
                    <Label className='mb-2 flex items-start gap-2 text-sm font-semibold text-gray-700 sm:mb-3 sm:items-center sm:gap-3 sm:text-base lg:text-lg'>
                      <Shield className='mt-0.5 size-4 flex-shrink-0 text-[#02ADEF] sm:mt-0 sm:size-5' />
                      <span className='text-[14px] leading-tight'>
                        Are you currently insured under HDB Fire Insurance?{' '}
                        <span className='text-red-500'>*</span>
                      </span>
                    </Label>
                    <p className='mb-3 pl-6 text-[12px] leading-snug text-gray-600 sm:mb-4 sm:pl-8 sm:text-sm'>
                      Please indicate if you currently have HDB Fire Insurance
                      coverage before customizing your coverage amounts.
                    </p>

                    <div className='grid grid-cols-2 gap-2.5 sm:gap-3 lg:gap-4'>
                      <Button
                        type='button'
                        variant={
                          customizationData.hdbFireInsurance === 'yes'
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'h-11 px-2.5 text-xs font-semibold leading-tight transition-all duration-200 sm:h-12 sm:px-3 sm:text-sm lg:h-14 lg:px-4 lg:text-lg',
                          'touch-target min-h-[44px]', // Ensure 44px touch target for accessibility
                          customizationData.hdbFireInsurance === 'yes'
                            ? 'border-[#52c41a] bg-[#52c41a] text-white shadow-lg hover:bg-[#52c41a]/90'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50 hover:bg-blue-50/50',
                        )}
                        onClick={() =>
                          updateCustomizationData('hdbFireInsurance', 'yes')
                        }
                      >
                        <CheckCircle
                          className={cn(
                            'mr-1 size-3.5 flex-shrink-0 sm:mr-1.5 sm:size-4 lg:mr-2 lg:size-5',
                            customizationData.hdbFireInsurance === 'yes'
                              ? 'text-white'
                              : 'text-gray-400',
                          )}
                        />
                        <span className='text-left text-xs sm:text-sm lg:text-base'>
                          Yes
                        </span>
                      </Button>

                      <Button
                        type='button'
                        variant={
                          customizationData.hdbFireInsurance === 'no'
                            ? 'default'
                            : 'outline'
                        }
                        className={cn(
                          'h-11 px-2.5 text-xs font-semibold leading-tight transition-all duration-200 sm:h-12 sm:px-3 sm:text-sm lg:h-14 lg:px-4 lg:text-lg',
                          'touch-target min-h-[44px]', // Ensure 44px touch target for accessibility
                          customizationData.hdbFireInsurance === 'no'
                            ? 'border-[#52c41a] bg-[#52c41a] text-white shadow-lg hover:bg-[#52c41a]/90'
                            : 'border-gray-200 bg-white text-gray-700 hover:border-[#02ADEF]/50 hover:bg-blue-50/50',
                        )}
                        onClick={() =>
                          updateCustomizationData('hdbFireInsurance', 'no')
                        }
                      >
                        <X
                          className={cn(
                            'mr-1 size-3.5 flex-shrink-0 sm:mr-1.5 sm:size-4 lg:mr-2 lg:size-5',
                            customizationData.hdbFireInsurance === 'no'
                              ? 'text-white'
                              : 'text-gray-400',
                          )}
                        />
                        <span className='text-left text-xs sm:text-sm lg:text-base'>
                          No
                        </span>
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Coverage Selection - disabled until HDB Fire insurance is answered */}
                {!customizationData.hdbFireInsurance && (
                  <div className='mb-6 rounded-lg border border-yellow-200 bg-yellow-50 p-4'>
                    <div className='flex items-center gap-2 text-yellow-800'>
                      <AlertCircle className='size-5' />
                      <p className='font-medium'>
                        Please answer the HDB Fire Insurance question above to
                        continue with coverage selection.
                      </p>
                    </div>
                  </div>
                )}

                <div
                  className={cn(
                    'grid grid-cols-1 gap-8 transition-all duration-300',
                    customizationData.hdbFireInsurance === 'yes'
                      ? 'lg:grid-cols-2'
                      : 'lg:grid-cols-3',
                    !customizationData.hdbFireInsurance &&
                      'pointer-events-none opacity-50',
                  )}
                >
                  {/* Building Coverage - Hidden when HDB Fire Insurance is 'yes' */}
                  {customizationData.hdbFireInsurance !== 'yes' && (
                    <div className='space-y-4'>
                      <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                        <Home className='size-5 text-[#02ADEF]' />
                        Building Coverage{' '}
                        <span className='text-red-500'>*</span>
                      </Label>
                      <p className='mb-3 text-sm text-gray-600'>
                        Cover repair or reconstruction costs of any part of your
                        building damaged by unforeseen events
                      </p>
                      <Select
                        options={BUILDING_COVERAGE_OPTIONS.map(
                          (opt) => opt.label,
                        )}
                        defaultValue={
                          BUILDING_COVERAGE_OPTIONS.find(
                            (opt) => opt.value === customizationData.building,
                          )?.label
                        }
                        onChange={(label) => {
                          const selected = BUILDING_COVERAGE_OPTIONS.find(
                            (opt) => opt.label === label,
                          );
                          if (selected) {
                            updateCustomizationData('building', selected.value);
                          }
                        }}
                        className='h-14 px-6 text-lg'
                        disabled={!customizationData.hdbFireInsurance}
                      />
                    </div>
                  )}

                  {/* Home Content Coverage */}
                  <div className='space-y-4'>
                    <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                      <Shield className='size-5 text-[#02ADEF]' />
                      Home Content Coverage{' '}
                      <span className='text-red-500'>*</span>
                    </Label>
                    <p className='mb-3 text-sm text-gray-600'>
                      Cover loss or damage to your home contents including the
                      cost of removing debris
                    </p>
                    <Select
                      options={HOME_CONTENT_COVERAGE_OPTIONS.map(
                        (option) => option.label,
                      )}
                      defaultValue={
                        HOME_CONTENT_COVERAGE_OPTIONS.find(
                          (option) =>
                            option.value === customizationData.homeContent,
                        )?.label
                      }
                      onChange={(label) => {
                        const selected = HOME_CONTENT_COVERAGE_OPTIONS.find(
                          (option) => option.label === label,
                        );
                        if (selected)
                          updateCustomizationData(
                            'homeContent',
                            selected.value,
                          );
                      }}
                      className='h-14 px-6 text-lg'
                      disabled={!customizationData.hdbFireInsurance}
                    />
                  </div>

                  {/* Renovation Coverage */}
                  <div className='space-y-4'>
                    <Label className='flex items-center gap-3 text-lg font-semibold text-gray-700'>
                      <Briefcase className='size-5 text-[#02ADEF]' />
                      Renovation Coverage
                    </Label>
                    <p className='mb-3 text-sm text-gray-600'>
                      Cover repair costs of renovation in case of damage due to
                      insured perils
                    </p>
                    <Select
                      options={RENOVATION_COVERAGE_OPTIONS.map(
                        (option) => option.label,
                      )}
                      defaultValue={
                        RENOVATION_COVERAGE_OPTIONS.find(
                          (option) =>
                            option.value === customizationData.renovation,
                        )?.label
                      }
                      onChange={(label) => {
                        const selected = RENOVATION_COVERAGE_OPTIONS.find(
                          (option) => option.label === label,
                        );
                        if (selected)
                          updateCustomizationData('renovation', selected.value);
                      }}
                      className='h-14 px-6 text-lg'
                      disabled={!customizationData.hdbFireInsurance}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Common Benefits Section */}
            {/* Continue Button */}
          </div>
        )}

        {/* Add-ons Section */}
        {showAddOns && (
          <div id='addons-section' className='animate-in fade-in duration-500'>
            <div className='mb-12 text-center'>
              <h2 className='mb-6 text-[clamp(28px,5vw,40px)] font-bold text-gray-800'>
                Enhance Your Coverage
              </h2>
              <p className='mx-auto max-w-[600px] text-lg leading-relaxed text-gray-600'>
                Choose from our additional coverage options to protect what
                matters most
              </p>
            </div>

            <div className='mb-12 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2'>
              {ADD_ONS.map((addOn) => {
                const isSelected = selectedAddOns.some(
                  (item) => item.id === addOn.id,
                );
                const selectedOption = selectedAddOns.find(
                  (item) => item.id === addOn.id,
                )?.selectedOption;

                return (
                  <AddOnCard
                    key={addOn.id}
                    addOn={addOn}
                    isSelected={isSelected}
                    selectedOption={selectedOption}
                    onToggle={() => onAddOnToggle(addOn.id)}
                    onOptionChange={(option) =>
                      onAddOnOptionChange(addOn.id, option)
                    }
                  />
                );
              })}
            </div>
          </div>
        )}

        {/* Premium Summary - Show when plan is selected */}
        {currentPlan && (
          <PremiumSummary
            selectedPlan={currentPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            currentStep={currentStep}
            onNext={onNext}
            onBack={onBack}
            formData={formData}
            customizationData={customizationData}
            hasViewedCustomization={hasViewedCustomization}
            showAddOns={showAddOns}
          />
        )}
      </>
    );
  },
);

Step1QuoteForm.displayName = 'Step1QuoteForm';
export default Step1QuoteForm;
