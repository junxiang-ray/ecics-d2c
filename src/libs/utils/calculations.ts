import { ADD_ONS } from '@/constants/home.content.addon.constants';
import {
  COVERAGE_PRICING,
  PROMO_CODES,
} from '@/constants/home.content.constants';

import {
  CustomizationData,
  InsurancePlan,
  PromoCodeStatus,
  SelectedAddOn,
} from '../types/homeContents';

// Helper function to calculate expiry date
// Insurance policies end 1 day before the anniversary date
// E.g., Start: 15/10/2025 → End: 14/10/2026 (for 1-year policy)
export const calculateExpiryDate = (
  startDate: string,
  duration: string,
): string => {
  if (!startDate) return '';

  const start = new Date(startDate);
  const months = parseInt(duration);

  // Add months to the start date
  const expiry = new Date(start);
  expiry.setMonth(expiry.getMonth() + months);

  // Subtract 1 day to follow insurance convention
  // Policy ends the day before the anniversary
  expiry.setDate(expiry.getDate() - 1);

  return expiry.toISOString().split('T')[0];
};

// Helper function to format date for display
export const formatDateForDisplay = (dateString: string): string => {
  if (!dateString) return '';

  const date = new Date(dateString);
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  });
};

// Helper function to adjust premium based on policy duration (3-year gets discount)
export const adjustPremiumForDuration = (
  basePremium: number,
  duration: string,
): number => {
  if (duration === '36') {
    // 3-year policy gets 10% discount
    return basePremium * 0.9;
  }
  return basePremium;
};

// Calculate premium based on coverage amounts selected
export const calculateCoveragePremium = (
  customizationData?: CustomizationData,
): number => {
  if (!customizationData) return 0;

  let coveragePremium = 0;

  // Building coverage (only if HDB Fire Insurance is 'no')
  if (
    customizationData.hdbFireInsurance === 'no' &&
    customizationData.building
  ) {
    const buildingAmount = parseFloat(customizationData.building);
    coveragePremium +=
      (buildingAmount / 1000) * COVERAGE_PRICING.BUILDING_RATE_PER_1000;
  }

  // Home content coverage (required)
  if (customizationData.homeContentCoverageValue) {
    const homeContentAmount = parseFloat(
      customizationData.homeContentCoverageValue,
    );
    coveragePremium +=
      (homeContentAmount / 1000) * COVERAGE_PRICING.HOME_CONTENT_RATE_PER_1000;
  }

  // Renovation coverage (optional)
  if (customizationData.renovationCoverageValue) {
    const renovationAmount = parseFloat(
      customizationData.renovationCoverageValue,
    );
    coveragePremium +=
      (renovationAmount / 1000) * COVERAGE_PRICING.RENOVATION_RATE_PER_1000;
  }

  return coveragePremium;
};

// Get base plan price based on promo status and policy duration
export const getBasePlanPrice = (
  plan: InsurancePlan,
  promoStatus: PromoCodeStatus,
  policyDuration?: string,
): number => {
  if (!plan) return 0;

  let basePrice = plan.originalPrice;

  // Apply duration discount for 3-year policies
  if (policyDuration) {
    basePrice = adjustPremiumForDuration(basePrice, policyDuration);
  }

  const hasValidPromo =
    promoStatus?.status === 'applied' && promoStatus.discount;

  if (hasValidPromo) {
    // Apply promo discount to already adjusted price
    const discountPercentage = promoStatus.discount || 0;
    return basePrice * (1 - discountPercentage / 100);
  } else {
    // No promo applied, use adjusted price
    return basePrice;
  }
};

// Calculate total premium including coverage, add-ons and promo discounts
export const calculateTotalPremium = (
  selectedPlan: InsurancePlan | null,
  selectedAddOns: SelectedAddOn[],
  promoStatus: PromoCodeStatus,
  policyDuration?: string,
  customizationData?: CustomizationData,
): number => {
  if (!selectedPlan) return 0;

  // Get base plan price (original price with duration and promo discounts if applicable)
  // Policy duration will be determined by plan structure in the future
  let total = getBasePlanPrice(selectedPlan, promoStatus, policyDuration);

  // Add coverage-based premium
  const coveragePremium = calculateCoveragePremium(customizationData);
  total += coveragePremium;

  if (ADD_ONS && Array.isArray(ADD_ONS)) {
    selectedAddOns.forEach((selectedAddOn) => {
      const addOn = ADD_ONS.find((a: any) => a.id === selectedAddOn.id);
      if (addOn) {
        if (addOn.hasOptions && selectedAddOn.selectedOption) {
          const option = addOn.options?.find(
            (o: any) => o.value === selectedAddOn.selectedOption,
          );
          total += option?.price || addOn.price;
        } else {
          total += addOn.price;
        }
      }
    });
  }

  return total;
};

// Calculate original total (without any discounts but with add-ons)
export const calculateOriginalTotal = (
  selectedPlan: InsurancePlan | null,
  selectedAddOns: SelectedAddOn[],
): number => {
  if (!selectedPlan) return 0;

  let total = selectedPlan.originalPrice;

  if (ADD_ONS && Array.isArray(ADD_ONS)) {
    selectedAddOns.forEach((selectedAddOn) => {
      const addOn = ADD_ONS.find((a: any) => a.id === selectedAddOn.id);
      if (addOn) {
        if (addOn.hasOptions && selectedAddOn.selectedOption) {
          const option = addOn.options?.find(
            (o: any) => o.value === selectedAddOn.selectedOption,
          );
          total += option?.price || addOn.price;
        } else {
          total += addOn.price;
        }
      }
    });
  }

  return total;
};

// Calculate subtotal with promo applied (for premium breakdown)
export const calculateSubtotal = (
  selectedPlan: InsurancePlan | null,
  selectedAddOns: SelectedAddOn[],
  promoStatus: PromoCodeStatus,
): number => {
  if (!selectedPlan) return 0;

  let subtotal = selectedPlan.originalPrice;

  if (ADD_ONS && Array.isArray(ADD_ONS)) {
    selectedAddOns.forEach((selectedAddOn) => {
      const addOn = ADD_ONS.find((a: any) => a.id === selectedAddOn.id);
      if (addOn) {
        if (addOn.hasOptions && selectedAddOn.selectedOption) {
          const option = addOn.options?.find(
            (o: any) => o.value === selectedAddOn.selectedOption,
          );
          subtotal += option?.price || addOn.price;
        } else {
          subtotal += addOn.price;
        }
      }
    });
  }

  // Apply promo discount if valid
  if (promoStatus.status === 'applied' && promoStatus.discount) {
    subtotal = subtotal * (1 - promoStatus.discount / 100);
  }

  return subtotal;
};

// Validate promo code
export const validatePromoCode = (code: string): PromoCodeStatus => {
  if (!code.trim()) {
    return {
      status: 'invalid',
      message: 'Please enter a promo code',
    };
  }

  // Add null check for PROMO_CODES
  if (!PROMO_CODES || typeof PROMO_CODES.VALID_CODE !== 'string') {
    return {
      status: 'invalid',
      message: 'Promo code validation unavailable. Please try again.',
    };
  }

  const trimmedCode = code.trim();

  if (trimmedCode === PROMO_CODES.VALID_CODE) {
    return {
      status: 'applied',
      code: trimmedCode,
      discount: PROMO_CODES.DISCOUNT_PERCENTAGE,
      message: `Promo code applied successfully! ${PROMO_CODES.DISCOUNT_PERCENTAGE}% discount added.`,
    };
  } else {
    // Provide more specific error messages
    if (trimmedCode.length < 3) {
      return {
        status: 'invalid',
        message: 'Promo code must be at least 3 characters long.',
      };
    } else if (trimmedCode.length > 20) {
      return {
        status: 'invalid',
        message: 'Promo code cannot exceed 20 characters.',
      };
    } else {
      return {
        status: 'invalid',
        message:
          'Invalid promo code. Please check and try again. (For testing, use "123")',
      };
    }
  }
};

// Get selected add-on details for display
export const getSelectedAddOnDetails = (selectedAddOns: SelectedAddOn[]) => {
  if (!ADD_ONS || !Array.isArray(ADD_ONS)) {
    return [];
  }

  return selectedAddOns
    .map((selectedAddOn) => {
      const addOn = ADD_ONS.find((a: any) => a.id === selectedAddOn.id);
      if (!addOn) return null;

      let price = addOn.price;
      let name = addOn.name;

      if (addOn.hasOptions && selectedAddOn.selectedOption) {
        const option = addOn.options?.find(
          (o: any) => o.value === selectedAddOn.selectedOption,
        );
        if (option) {
          price = option.price;
          name = `${addOn.name} (${option.label})`;
        }
      }

      return { name, price };
    })
    .filter(Boolean);
};

// Calculate base total (original price with add-ons, before any discounts)
export const calculateBaseTotal = (
  selectedPlan: InsurancePlan | null,
  selectedAddOns: SelectedAddOn[],
): number => {
  return calculateOriginalTotal(selectedPlan, selectedAddOns);
};

// Get pricing display info for plan cards
export const getPlanPricingInfo = (
  plan: InsurancePlan,
  promoStatus: PromoCodeStatus,
  policyDuration?: string,
) => {
  if (!plan)
    return {
      displayPrice: 0,
      originalPrice: 0,
      showDiscount: false,
      discountPercentage: 0,
    };

  let basePrice = plan.originalPrice;
  let showDurationDiscount = false;

  // Apply duration discount for 3-year policies
  if (policyDuration === '36') {
    basePrice = adjustPremiumForDuration(basePrice, policyDuration);
    showDurationDiscount = true;
  }

  const hasValidPromo =
    promoStatus?.status === 'applied' && promoStatus.discount;

  if (hasValidPromo) {
    // Show promo discounted price
    const discountPercentage = promoStatus.discount || 0;
    const discountedPrice = basePrice * (1 - discountPercentage / 100);

    return {
      displayPrice: discountedPrice,
      originalPrice: plan.originalPrice,
      showDiscount: true,
      discountPercentage,
      showDurationDiscount,
    };
  } else {
    // Show base price (with duration discount if applicable)
    return {
      displayPrice: basePrice,
      originalPrice: plan.originalPrice,
      showDiscount: showDurationDiscount,
      discountPercentage: showDurationDiscount ? 10 : 0,
      showDurationDiscount,
    };
  }
};
