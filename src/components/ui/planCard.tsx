import { clsx } from 'clsx';
import { Check, Star } from 'lucide-react';
import { memo, useCallback, useMemo } from 'react';
import { twMerge } from 'tailwind-merge';

import {
  CustomizationData,
  InsurancePlan,
  PromoCodeStatus,
} from '@/libs/types/homeContents';
import { getPlanPricingInfo } from '@/libs/utils/calculations';

interface PlanCardProps {
  plan: InsurancePlan & {
    isPopular?: boolean;
    originalPrice?: number;
    discountPercentage?: number;
  };
  isSelected: boolean;
  onSelect: (planId: string) => void;
  promoStatus?: PromoCodeStatus;
  customizationData?: CustomizationData;
}

export const PlanCard = memo<PlanCardProps>(
  ({ plan, isSelected, onSelect, promoStatus, customizationData }) => {
    const { id, name, features, isPopular } = plan;

    const formatCurrency = useCallback((amount: number | undefined | null) => {
      if (typeof amount !== 'number' || isNaN(amount)) return '$0';
      return `$${amount.toLocaleString()}`;
    }, []);

    const handleSelect = useCallback(() => {
      if (id) onSelect(id);
    }, [id, onSelect]);

    const pricingInfo = useMemo(() => {
      return getPlanPricingInfo(plan, promoStatus || { status: 'none' });
    }, [plan, promoStatus]);

    const { displayPrice, originalPrice, showDiscount, discountPercentage } =
      pricingInfo;

    const savingsInfo = useMemo(() => {
      const yearMatch = id?.match(/(\d+)-year/);
      if (!yearMatch) return null;
      const years = parseInt(yearMatch[1]);
      if (years <= 1) return null;
      const oneYearPrice = 250;
      const totalIfBoughtSeparately = oneYearPrice * years;
      const actualPrice = displayPrice || 0;
      const savings = totalIfBoughtSeparately - actualPrice;
      if (savings <= 0) return null;
      return { years, savings, comparisonPrice: totalIfBoughtSeparately };
    }, [id, displayPrice]);

    if (!id) return null;

    return (
      <div
        data-plan-card
        className={twMerge(
          clsx(
            'group relative cursor-pointer rounded-2xl border-2 bg-white p-6 transition-all duration-300 hover:shadow-lg',
            isSelected
              ? 'border-[#02ADEF] shadow-lg ring-4 ring-[#02ADEF]/20'
              : 'border-gray-200 hover:border-[#02ADEF]/50',
            isPopular && !isSelected && 'ring-2 ring-[#f49d00]/30 hover:ring-0',
          ),
        )}
        onClick={handleSelect}
        role='button'
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            handleSelect();
          }
        }}
        aria-label={`Select ${name || 'plan'}`}
      >
        {/* Popular Badge */}
        {isPopular && (
          <div className='absolute -top-3 left-1/2 -translate-x-1/2 transform'>
            <div className='flex items-center gap-1 rounded-full bg-[#f49d00] px-4 py-1 text-sm font-semibold text-white shadow-lg'>
              <Star className='size-4 fill-current' />
              Best Value
            </div>
          </div>
        )}

        {/* Plan Header */}
        <div className='mb-6'>
          <h3 className='mb-2 text-xl font-bold text-gray-900'>
            {name || 'Plan'}
          </h3>

          {/* Price & Savings */}
          <div className='flex flex-wrap items-center gap-2'>
            <span className='text-3xl font-bold text-[#02ADEF]'>
              {formatCurrency(displayPrice)}
            </span>

            {promoStatus?.status === 'applied' && promoStatus.discount && (
              <span className='text-lg text-gray-400 line-through'>
                {formatCurrency(originalPrice)}
              </span>
            )}

            {savingsInfo &&
              (() => {
                const hasPromo =
                  promoStatus?.status === 'applied' && promoStatus.discount;
                let totalSavings = savingsInfo.savings;
                let totalDiscount = 10;

                if (hasPromo) {
                  const promoDiscount = promoStatus.discount || 0;
                  const oneYearPrice = 250;
                  const totalOriginalPrice = oneYearPrice * savingsInfo.years;
                  const priceAfterMultiYear =
                    displayPrice / (1 - promoDiscount / 100);
                  const promoSavings =
                    priceAfterMultiYear * (promoDiscount / 100);
                  totalSavings = savingsInfo.savings + promoSavings;
                  totalDiscount =
                    ((totalOriginalPrice - displayPrice) / totalOriginalPrice) *
                    100;
                }

                return (
                  <span className='m-[0px] whitespace-nowrap rounded-lg border border-green-200 bg-gradient-to-r from-green-100 to-emerald-100 px-3 py-1.5 text-sm font-semibold text-[#52c41a]'>
                    Save {Math.round(totalDiscount)}% (
                    {formatCurrency(totalSavings)})
                  </span>
                );
              })()}

            {showDiscount && !savingsInfo && discountPercentage > 0 && (
              <span className='rounded bg-green-100 px-2 py-1 text-sm font-semibold text-green-700'>
                {discountPercentage}% OFF
              </span>
            )}
          </div>

          <p className='mt-1 text-sm text-gray-600'>per policy term</p>

          {promoStatus?.status === 'applied' && promoStatus.code && (
            <div className='mt-3 flex items-center gap-1 text-sm font-medium text-green-600'>
              <Check className='size-4' />
              Promo code "{promoStatus.code}" applied
            </div>
          )}
        </div>

        {/* Coverage */}
        {customizationData && (
          <div className='mb-4 border-b border-gray-100 pb-4'>
            <p className='mb-2 text-sm font-semibold text-gray-700'>Covers</p>
            <div className='space-y-1'>
              <div className='flex items-center justify-between text-[14px] text-sm'>
                <span className='text-gray-600'>Home contents</span>
                <span className='font-medium text-gray-900'>
                  {formatCurrency(
                    parseFloat(customizationData.homeContent || '0'),
                  )}
                </span>
              </div>
              <div className='flex items-center justify-between text-[14px] text-sm'>
                <span className='text-gray-600'>Renovations</span>
                <span className='font-medium text-gray-900'>
                  {formatCurrency(
                    parseFloat(customizationData.renovation || '0'),
                  )}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Select Button */}
        <button
          className={twMerge(
            clsx(
              'flex w-full items-center justify-center rounded-xl px-4 py-3 text-center font-semibold transition-all duration-200',
              isSelected
                ? 'bg-[#52c41a] text-white'
                : 'bg-[#02ADEF] text-white hover:bg-[#0195d3]',
            ),
          )}
          onClick={(e) => {
            e.stopPropagation();
            handleSelect();
          }}
          disabled={!id}
        >
          {isSelected ? 'Selected' : 'Select Plan'}
        </button>
      </div>
    );
  },
);

PlanCard.displayName = 'PlanCard';
