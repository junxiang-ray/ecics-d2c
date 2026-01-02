'use client';
import { useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { v4 as uuid } from 'uuid';
import { DataFromSingpass } from '@/libs/types/quote';

import {
  CustomizationData,
  HomeContentQuoteSavePayload,
  InsurancePlan,
  MyInfoData,
  PersonalInfoForm,
  PromoCodeStatus,
  QuoteForm,
  SelectedAddOn,
} from '@/libs/types/homeContents';
import { calculateTotalPremium } from '@/libs/utils/calculations';
import {
  isFormValid,
  validatePersonalInfoForm,
  validateQuoteForm,
} from '@/libs/utils/home-content';
import {
  generateKeyAndAttachToUrl,
  saveToLocalStorage,
  saveToSessionStorage,
} from '@/libs/utils/utils';

import QuoteDetail from '@/components/page/insurance/quote-detail/QuoteDetailPage';

import { ADD_ONS } from '@/constants/home.content.addon.constants';
import { PLANS } from '@/constants/home.content.constants';
import {
  useGenerateHomeContentsQuote,
  useGetPremiumCalc,
  usePayment,
} from '@/hook/insurance/homeContentQuote';

import Step1QuoteForm from './Step1QuoteForm';
import Step2PersonalInfo from './Step2PersonalInfo';
import Step3Summary from './Step3Summary';
import Step4Success from './Step4Success';
import {
  INITIAL_PERSONAL_INFO,
  INITIAL_PROMO_STATUS,
  INITIAL_MYINFO_DATA,
  INITIAL_FORM_DATA,
} from './initialData';
import {
  usePostPersonalInfoHomeContent,
  useRequestLoginHomeContent,
} from '@/hook/auth/login-home-content';
import { PRODUCT_NAME } from '@/app/api/constants/product';
import { useAppSelector } from '@/redux/store';
import { GetUserInfoFromSingpassService } from '@/app/api/v1/singpass/user-info/[product]/singpass-get-user-info.service';
import { DATA_FROM_SINGPASS, PRODUCT_TYPE } from '@/constants/general.constant';
import { useSaveProposal } from '@/hook/insurance/quote';
import { useRouterWithQuery } from '@/hook/useRouterWithQuery';

export default function QuoteDetailPage() {
  const router = useRouterWithQuery();
  //#region State Management
  // State management - using pre-computed initial objects
  const [currentStep, setCurrentStep] = useState<number>(() => {
    try {
      const storedData = localStorage.getItem('currentStep');
      if (storedData) {
        const step = parseInt(storedData);
        if (!isNaN(step)) {
          return step;
        }
      }
      return 1;
    } catch (e) {
      console.error('error getting step');
      return 1;
    }
  });
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([1]));
  useEffect(() => {
    localStorage.setItem('currentStep', currentStep.toString());
    setVisitedSteps((prev) => {
      const newSet = new Set(prev);
      for (let i = 2; i <= currentStep; i++) {
        newSet.add(i);
      }
      return newSet;
    });
  }, [currentStep]);

  //generate quote
  const { mutateAsync: generateHomeContentQuote } =
    useGenerateHomeContentsQuote();

  const { mutateAsync: getPremiumCalc } = useGetPremiumCalc();

  useEffect(() => {
    const keyQuote = generateKeyAndAttachToUrl(initKey);
    setKey(keyQuote);
  }, []);

  // UI state
  ///Sets plans as visible
  const [showPlans, setShowPlans] = useState(false);
  ///Gets plans stored in local storage or uses default plans.
  const [allplans, setAllPlans] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('plans');
        if (storedData) {
          const parsedData = JSON.parse(storedData);
          const newData: InsurancePlan[] = parsedData;
          return newData;
        }
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }
    return PLANS;
  });
  ///Shows customization UI
  const [showCustomization, setShowCustomization] = useState(false);
  ///Shows addons
  const [showAddOns, setShowAddOns] = useState(false);
  ///Sets Loading circle for Calculate Quote Button
  const [isLoading, setIsLoading] = useState(false);
  //Marks customization as viewed and enables next button
  const [hasViewedCustomization, setHasViewedCustomization] = useState(false);

  // Selections
  const [selectedAddOns, setSelectedAddOns] = useState<SelectedAddOn[]>([]);

  // Errors
  const [errors, setErrors] = useState<Partial<QuoteForm>>({});
  const [personalInfoErrors, setPersonalInfoErrors] = useState<
    Partial<PersonalInfoForm>
  >({});

  // Status state
  const [promoStatus, setPromoStatus] =
    useState<PromoCodeStatus>(INITIAL_PROMO_STATUS);
  const [myInfoData, setMyInfoData] = useState<MyInfoData>(INITIAL_MYINFO_DATA);

  // Success screen state
  const [policyDetailsOpen, setPolicyDetailsOpen] = useState(false);
  const [helperDetailsOpen, setHelperDetailsOpen] = useState(false);
  const [insuredInfoOpen, setInsuredInfoOpen] = useState(false);

  // Form data with memory-efficient initial values
  const [formData, setFormData] = useState<QuoteForm>(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedData = localStorage.getItem('quoteFormData');
        if (storedData) {
          const parsedData = JSON.parse(storedData);

          setSelectedAddOns(parsedData.addons || INITIAL_FORM_DATA.addons);

          return {
            ...INITIAL_FORM_DATA,
            ...parsedData,
            coverageOptions: {
              ...INITIAL_FORM_DATA.coverageOptions,
              ...(parsedData.coverageOptions || {}),
            },
            addons: parsedData.addons || INITIAL_FORM_DATA.addons,
          };
        }
      } catch (error) {
        console.error('Failed to parse saved form data:', error);
      }
    }

    return INITIAL_FORM_DATA;
  });
  ///stores updated data in local storage.
  useEffect(() => {
    console.log(`formData changed: ${JSON.stringify(formData)}`);
    saveToLocalStorage({ quoteFormData: JSON.stringify(formData) });
    if (formData.quoteStep >= 1) {
      setShowPlans(true);
    }
    if (formData.quoteStep >= 2) {
      setShowAddOns(true);
    }
    // if (formData.quoteStep >= 3) {
    //   setShowAddOns(true);
    //   // scrollToBottom();
    // }
  }, [formData]);

  const resetQuoteForm = useCallback(() => {
    console.log('Resetting');
    setShowPlans(false);
    setShowCustomization(false);
    setShowAddOns(false);
    updateFormData('quoteStep', '0'); // remember to reset the step so that the page properly resets.
    updateFormData('selectedPlan', '');
    setSelectedAddOns([]);

    // setFormData(INITIAL_FORM_DATA);
  }, [formData]);

  //#endregion

  //#region Product type code
  const searchParams = useSearchParams();
  const partnerCode = searchParams.get('partner_code') || '';
  const promoDefault = searchParams.get('promo_code') || '';

  const initKey = searchParams.get('key') || '';
  const [key, setKey] = useState(initKey);

  const homeContentsInsuranceSteps = [
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

  //#endregion

  // Memoized computed values with early returns
  const currentPlan = useMemo(() => {
    if (!formData.selectedPlan) return null;
    return allplans.find((p) => p.id === formData.selectedPlan) || null;
  }, [formData.selectedPlan, allplans]);

  const totalPremium = useMemo(() => {
    if (!currentPlan) return 0;
    // Policy duration will be determined by the selected plan instead of form data
    return calculateTotalPremium(
      currentPlan,
      selectedAddOns,
      promoStatus,
      undefined,
      formData.coverageOptions,
    );
  }, [currentPlan]);

  const updateFormData = useCallback(
    (
      field: keyof QuoteForm | keyof CustomizationData | 'addon',
      value: string,
      addOnId?: string,
      price?: number,
      remove?: boolean,
    ) => {
      setFormData((prev) => {
        //Addon case
        if (field === 'addon' && addOnId) {
          if (remove) {
            const newData: QuoteForm = {
              ...prev,
              addons: prev.addons.filter((item) => item.id !== addOnId),
            };
            return newData;
          }

          const exists = prev.addons.some((item) => item.id === addOnId);

          const newData: QuoteForm = {
            ...prev,
            addons: exists
              ? prev.addons.map((item) =>
                  item.id === addOnId
                    ? { ...item, selectedOption: value }
                    : item,
                )
              : [
                  ...prev.addons,
                  { id: addOnId, selectedOption: value, price: 0 },
                ],
          };

          return newData;
        }

        // coverage Options
        if (field in prev.coverageOptions) {
          const coverageField = field as keyof CustomizationData;
          if (prev.coverageOptions[coverageField] === value) return prev;

          const newData: QuoteForm = {
            ...prev,
            coverageOptions: {
              ...prev.coverageOptions,
              [coverageField]: value,
            },
          };
          return newData;
        }

        // QuoteForm fields
        const quoteField = field as keyof QuoteForm;
        if (prev[quoteField] === value) return prev;

        const newData: QuoteForm = { ...prev, [quoteField]: value };

        // Ownership logic
        if (quoteField === 'ownership') {
          if (value === 'tenant') {
            if (newData.homeType === 'hdb') newData.unitType = '3-room';
            else if (newData.homeType === 'condo') newData.unitType = '2-room';
          }
        }

        // Home type logic
        if (quoteField === 'homeType') {
          if (value === 'landed') newData.unitType = 'landed';
          else if (value === 'hdb') newData.unitType = '4-Room';
          else if (value === 'condo') newData.unitType = '3-Room';
        }

        if (quoteField === 'quoteStep') {
          newData.quoteStep = parseInt(value);
        }

        // Special cases
        if (quoteField === 'coverageOptions')
          newData.coverageOptions = JSON.parse(value);

        return newData;
      });

      // --- Clear errors only for top-level QuoteForm fields ---
      if (
        (Object.keys(INITIAL_FORM_DATA) as (keyof QuoteForm)[]).includes(
          field as keyof QuoteForm,
        )
      ) {
        const key = field as keyof QuoteForm;
        setErrors((prev) => {
          const { [key]: _, ...rest } = prev;
          return rest;
        });
      }

      // --- Reset promo if needed ---
      if (field === 'promoCode' && promoStatus.status !== 'none') {
        setPromoStatus(INITIAL_PROMO_STATUS);
      }
    },
    [promoStatus.status],
  );

  //#region Personal Info Handler
  const homeContentInfo = useAppSelector(
    (state) => state.ecicsUserInfo?.userInfo,
  );

  const hydratePersonalInfo = (
    base: PersonalInfoForm,
    data: any,
  ): PersonalInfoForm => ({
    ...base,
    policyHolderEmail: data?.email?.value ?? data?.policyHolderEmail ?? '',
    policyHolderMobileNumber:
      data?.mobileno?.nbr?.value ?? data?.policyHolderMobileNumber ?? '',
    addressLine1:
      data?.regadd?.block?.value && data?.regadd?.street?.value
        ? `${data.regadd.block.value} ${data.regadd.street.value}`
        : (data?.addressLine1 ?? ''),
    addressLine2: data?.regadd?.building?.value ?? data?.addressLine2 ?? '',
    policyHolderFullName: data?.name?.value ?? data?.policyHolderFullName ?? '',
    policyHolderNationality:
      data?.nationality?.desc ?? data?.policyHolderNationality ?? '',
    policyHolderNricFin: data?.uinfin?.value ?? data?.policyHolderNricFin ?? '',
    policyHolderDateOfBirth:
      data?.dob?.value ?? data?.policyHolderDateOfBirth ?? '',
    postalCode: data?.regadd?.postal?.value ?? data?.postalCode ?? '',
    policyHolderGender: data?.policyHolderGender ?? 'M',
    policayHolderMaritalStatus: data?.policayHolderMaritalStatus ?? '',
  });

  //Init
  const [personalInfoData, setPersonalInfoData] = useState<PersonalInfoForm>(
    INITIAL_PERSONAL_INFO,
  );

  ///Set Data
  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      const singpass = sessionStorage.getItem(DATA_FROM_SINGPASS);
      if (singpass) {
        setPersonalInfoData(
          hydratePersonalInfo(INITIAL_PERSONAL_INFO, JSON.parse(singpass)),
        );
        return;
      }

      const saved = sessionStorage.getItem('INFO_DATA');
      if (saved) {
        setPersonalInfoData(
          hydratePersonalInfo(INITIAL_PERSONAL_INFO, JSON.parse(saved)),
        );
      }
    } catch (err) {
      console.error('Failed to hydrate personal info', err);
    }
  }, []);

  useEffect(() => {
    console.log('Setting');
    setPersonalInfoErrors((prev) => {
      const newErrors = { ...prev };
      Object.keys(personalInfoData).forEach((key) => {
        delete newErrors[key as keyof PersonalInfoForm];
      });
      return newErrors;
    });
  }, [personalInfoData]);

  const updatePersonalInfoData = useCallback(
    <K extends keyof PersonalInfoForm>(
      field: K,
      value: PersonalInfoForm[K],
    ) => {
      setPersonalInfoData((prev) => {
        const next = { ...prev, [field]: value };

        if (field === 'mailingAddressDifferent' && value === 'no') {
          next.mailingAddressLine1 = '';
          next.mailingAddressLine2 = '';
          next.mailingAddressLine3 = '';
          next.mailingPostalCode = '';
        }

        return next;
      });

      setPersonalInfoErrors((prev) => {
        if (!prev[field]) return prev;
        const { [field]: _, ...rest } = prev;
        return rest;
      });
    },
    [],
  );
  //#endregion

  //#region Scroll
  // Optimized scroll functions
  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const scrollToBottom = useCallback(() => {
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }, []);

  const scrollToElement = useCallback((selector: string) => {
    const element = document.querySelector(selector);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, []);
  //#endregion

  // 🔒 PROTECTED - Step navigation logic with optimizations
  const handleStepClick = useCallback(
    (targetStep: number) => {
      if (targetStep === currentStep) return;

      if (visitedSteps.has(targetStep)) {
        setCurrentStep(targetStep);
        scrollToTop();
        return;
      }

      if (targetStep === currentStep + 1) {
        let canProceed = false;

        if (targetStep === 2) {
          if (!formData.selectedPlan) return;
          const newErrors = validateQuoteForm(formData);
          setErrors(newErrors);
          canProceed = isFormValid(newErrors);
        } else if (targetStep === 3) {
          if (!formData.selectedPlan || !visitedSteps.has(2)) return;
          if (currentStep === 2) {
            const newErrors = validatePersonalInfoForm(personalInfoData);
            setPersonalInfoErrors(newErrors);
            canProceed = isFormValid(newErrors);
          } else {
            canProceed = true;
          }
        }

        if (canProceed) {
          setCurrentStep(targetStep);
          setVisitedSteps((prev) => new Set(prev).add(targetStep));
          scrollToTop();
        }
      }
    },
    [currentStep, visitedSteps, formData, personalInfoData, scrollToTop],
  );

  //#region Singpass Retrieve
  const { mutate: savePersonalInfo } = usePostPersonalInfoHomeContent();

  const { mutate: requestLoginHomeContents } = useRequestLoginHomeContent(
    PRODUCT_NAME.HOME_CONTENT,
    {
      onError: () => {
        console.log('ERROR');
      },
    },
  );

  // 🔒 PROTECTED - MyInfo handler with memory cleanup
  const handleRetrieveMyInfo = () => requestLoginHomeContents();

  //#endregion

  // 🔒 PROTECTED - Build payload helper for both initial quote and add-on recalculation
  const buildPayload = useCallback(
    (addOnsOverride?: SelectedAddOn[]) => {
      const storedMap = localStorage.getItem('hc_result_map');
      const resultMap = storedMap ? JSON.parse(storedMap) : null;
      const addOnsToUse =
        addOnsOverride !== undefined ? addOnsOverride : selectedAddOns;

      const payload: any = {
        key: key,
        homeOwnership: formData.ownership,
        homeType: formData.homeType,
        unitType: formData.unitType,
        startDate: formData.policyStartDate,
        promoCode: formData.promoCode,
        renovations: formData.coverageOptions.renovationCoverageValue,
        homeContents: formData.coverageOptions.homeContentCoverageValue,
        resultMap: resultMap,
        redirectUrl: '',
        returnUrl: '',
      };

      // Add building and worldwide FPA from add-ons to payload
      addOnsToUse.forEach((addOn) => {
        if (addOn.id === 'building' && addOn.selectedOption) {
          const value =
            ADD_ONS.find((addon) => addon.id === addOn.id)?.options?.find(
              (o) => o.label === addOn.selectedOption,
            )?.value || '0';
          payload.building = `${value?.replace('$', 'SGD')}`;
        } else if (addOn.id === 'worldwide-fpa' && addOn.selectedOption) {
          payload.worldwideFpa = addOn.selectedOption;
        }
      });

      return payload;
    },
    [formData, key, selectedAddOns],
  );

  // 🔒 PROTECTED - Recalculate premium with new add-ons
  const recalculateWithAddOns = useCallback(
    async (newAddOns: SelectedAddOn[]) => {
      const payload = buildPayload(newAddOns);
      console.log(
        `recalculating with add-ons, payload = ${JSON.stringify(newAddOns)}`,
      );

      try {
        const res = await getPremiumCalc(payload);
        // console.log(`add-on recalculation response = ${JSON.stringify(res)}`);
        setAllPlans(res);
        //save to local storage
        saveToLocalStorage({ plans: JSON.stringify(res) });
      } catch (err) {
        console.log('ERROR RECALCULATING PREMIUM WITH ADD-ONS:', err);
      }
    },
    [buildPayload],
  );

  useEffect(() => {
    // Only recalc after base quote exists
    if (!showPlans) return;
    if (showAddOns) {
      recalculateWithAddOns(selectedAddOns);
    }
  }, [selectedAddOns, showPlans, recalculateWithAddOns]);

  //#region HANDLE GET QUOTE
  // 🔒 PROTECTED - Quote calculation with timeout management
  const handleCalculateQuote = useCallback(() => {
    const newErrors = validateQuoteForm(formData);
    setErrors(newErrors);

    if (!isFormValid(newErrors)) return;

    setIsLoading(true);

    const payload = buildPayload();

    getPremiumCalc(payload)
      .then((res) => {
        setShowPlans(true);
        setIsLoading(false);
        updateFormData('quoteStep', '1');
        setAllPlans(res);
        saveToLocalStorage({ plans: res });

        const timeoutId = setTimeout(() => {
          const scrollTimeoutId = setTimeout(() => {
            scrollToElement('#plans-section');
          }, 10);
          return () => clearTimeout(scrollTimeoutId);
        }, 100);
        return () => clearTimeout(timeoutId);
      })
      .catch((err) => {
        console.log('ERROR GENERATING QUOTE:', err);
      });
  }, [formData, scrollToElement, buildPayload]);
  //#endregion
  // 🔒 PROTECTED - Plan selection with customization revelation
  const handlePlanSelect = useCallback(
    (planId: string) => {
      setShowAddOns(true);
      updateFormData('selectedPlan', planId);
      updateFormData('quoteStep', '2');

      const timeoutId = setTimeout(() => {
        scrollToElement('#addons-section');
      }, 300);

      return () => clearTimeout(timeoutId);
    },
    [scrollToElement],
  );
  const maritalStatus_table: Record<string, string> = {
    Single: 'S',
    Married: 'M',
    Divorced: 'D',
    Widowed: 'W',
  };

  const gender_table: Record<string, string> = {
    Male: 'M',
    Female: 'F',
  };

  const handleSaveQuote = useCallback(
    (personalInfo: PersonalInfoForm) => {
      const payload: HomeContentQuoteSavePayload = {
        key: key,
        proposerDetails: {
          addressLine1: personalInfo.addressLine1,
          addressLine2: personalInfo.addressLine2 || '',
          addressLine3: personalInfo.addressLine3 || '',
          postCode: personalInfo.postalCode,
          name: personalInfo.policyHolderFullName,
          nric: personalInfo.policyHolderNricFin,
          dob: personalInfo.policyHolderDateOfBirth,
          gender: gender_table[personalInfo.policyHolderGender],
          maritalStatus:
            maritalStatus_table[personalInfo.policayHolderMaritalStatus],
          mobile: personalInfo.policyHolderMobileNumber,
          email: personalInfo.policyHolderEmail,
          differentMailingAddress:
            personalInfo.mailingAddressDifferent.toUpperCase(),
          mailingAddress1: personalInfo.mailingAddressLine1,
          mailingAddress2: personalInfo.mailingAddressLine2 || '',
          mailingAddress3: personalInfo.mailingAddressLine3 || '',
          mailingPostCode: personalInfo.mailingPostalCode,
        },
        planDetails: {
          homeOwnership: formData.ownership,
          homeType: formData.homeType,
          unitType: formData.unitType,
          homeContentCoverage:
            formData.coverageOptions.homeContentCoverageValue,
          renovationsCoverage: formData.coverageOptions.renovationCoverageValue,
          buildingCoverage: formData.coverageOptions.building,
          wpaCoverage: formData.coverageOptions.worldwide_fpa,
          policyPeriod: formData.selectedPlan,
          promoCode: formData.promoCode == '' ? 'NA' : formData.promoCode,
          selectedPlan: formData.selectedPlan,
          startDate: formData.policyStartDate,
        },

        __finalize: 1,
      };

      console.log(`generate quote with this ${JSON.stringify(payload)}`);

      generateHomeContentQuote(payload).then((res) => {
        console.log(`quote res = ${JSON.stringify(res)}`);
        saveToLocalStorage({ proposal_data: res.data.data });
        if (res.status === '0') {
          setCurrentStep(3);
          setVisitedSteps((prev) => new Set(prev).add(3));
          scrollToTop();
        } else {
          console.log('Quote save failed');
        }
      });
    },
    [isLoading, formData],
  );

  // Handler for continuing from customization to add-ons
  const handleCustomizationComplete = useCallback(() => {
    setShowAddOns(true);
    updateFormData('quoteStep', '3');
    const timeoutId = setTimeout(() => {
      scrollToElement('#addons-section');
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);

  // 🔒 PROTECTED - Add-on toggle - ISP recalculation
  const handleAddOnToggle = useCallback(
    (addOnId: string, price: number) => {
      console.log(`toggle with price ${price}`);
      setSelectedAddOns((prev) => {
        const existingIndex = prev.findIndex((item) => item.id === addOnId);
        let newAddOns: SelectedAddOn[];

        if (existingIndex >= 0) {
          // Remove add-on
          updateFormData('addon', '', addOnId, 0, true);
          newAddOns = prev.filter((_, index) => index !== existingIndex);
          console.log(`toggle addon newAddons = ${JSON.stringify(newAddOns)}`);
          setSelectedAddOns(newAddOns);
        } else {
          // Add add-on with default option
          const addOn = ADD_ONS.find((a) => a.id === addOnId);
          const newAddOn: SelectedAddOn = {
            id: addOnId,
            ...(addOn?.hasOptions && {
              selectedOption: '',
            }),
            price: 0,
          };
          newAddOns = [...prev, newAddOn];
          setSelectedAddOns(newAddOns);
          updateFormData('addon', '', addOnId, price, false);
        }
        return newAddOns;
      });
    },
    [updateFormData],
  );

  const handleAddOnOptionChange = useCallback(
    async (addOnId: string, option: string, price: number) => {
      setSelectedAddOns((prev) => {
        let finalPrice = 0;
        if (addOnId === 'building') {
          finalPrice = currentPlan?.buildingCoverageWithDiscount || 0;
        } else {
          finalPrice = currentPlan?.worldwideFpaWithDiscount || 0;
        }

        const newAddOns = prev.map((item) =>
          item.id === addOnId
            ? { ...item, selectedOption: option, price: finalPrice }
            : item,
        );

        return newAddOns;
      });
      updateFormData('addon', option, addOnId);
    },
    [updateFormData],
  );

  //#region HANDLE NEXT
  // 🔒 PROTECTED - Navigation handlers with progressive sub-steps
  const handleNext = useCallback(() => {
    if (currentStep === 1) {
      const newErrors = validateQuoteForm(formData);
      setErrors(newErrors);

      if (!isFormValid(newErrors)) return;

      if (!formData.selectedPlan) {
        const timeoutId = setTimeout(() => {
          scrollToElement('#plans-section');
        }, 100);
        return () => clearTimeout(timeoutId);
      }

      // Progressive sub-step navigation within Step 1
      // If customization is shown but add-ons are not, trigger add-ons
      if (showCustomization && !showAddOns) {
        handleCustomizationComplete();
        return;
      }

      // If add-ons are shown, proceed to Step 2
      if (showAddOns) {
        setCurrentStep(2);
        setVisitedSteps((prev) => new Set(prev).add(2));
        scrollToTop();
        return;
      }

      // Fallback: if somehow neither condition is met, go to Step 2
      setCurrentStep(2);
      setVisitedSteps((prev) => new Set(prev).add(2));
      scrollToTop();
    } else if (currentStep === 2) {
      const newErrors = validatePersonalInfoForm(personalInfoData);
      setPersonalInfoErrors(newErrors);
      if (isFormValid(newErrors)) {
        console.log(
          `personalInfoData on Save Quote ${JSON.stringify(personalInfoData)}`,
        );
        saveToSessionStorage({ INFO_DATA: JSON.stringify(personalInfoData) });
        handleSaveQuote(personalInfoData);
      }
    }
  }, [
    currentStep,
    formData,
    personalInfoData,
    showCustomization,
    showAddOns,
    handleCustomizationComplete,
    scrollToTop,
    scrollToElement,
  ]);
  //#endregion

  //#region Proposal & Payment
  const {
    mutate: payment,
    data: dataPayment,
    isPending: isPendingPay,
  } = usePayment();

  const {
    mutateAsync: saveProposal,
    isSuccess,
    isPending: isPendingSave,
    isError,
  } = useSaveProposal();

  useEffect(() => {
    if (isSuccess) {
      payment(key);
    }
  }, [isSuccess]);

  useEffect(() => {
    if (dataPayment?.paymentlink) {
      router.push(dataPayment.paymentlink);
    }
  }, [dataPayment]);

  const handleMakePayment = useCallback(() => {
    saveProposal({
      data: {
        key: key,
        homeContentPayload: {
          key: key,
          proposerDetails: {
            addressLine1: personalInfoData.addressLine1,
            addressLine2: personalInfoData.addressLine2,
            addressLine3: personalInfoData.addressLine3,
            postCode: personalInfoData.postalCode,
            name: personalInfoData.policyHolderFullName,
            nric: personalInfoData.policyHolderNricFin,
            dob: personalInfoData.policyHolderDateOfBirth,
            gender: gender_table[personalInfoData.policyHolderGender],
            maritalStatus:
              maritalStatus_table[personalInfoData.policayHolderMaritalStatus],
            mobile: personalInfoData.policyHolderMobileNumber,
            email: personalInfoData.policyHolderEmail,
            differentMailingAddress: personalInfoData.mailingAddressDifferent,
            mailingAddress1: personalInfoData.mailingAddressLine1,
            mailingAddress2: personalInfoData.mailingAddressLine2,
            mailingAddress3: personalInfoData.mailingAddressLine3,
            mailingPostCode: personalInfoData.mailingPostalCode,
          },
          planDetails: {
            homeOwnership: formData.ownership,
            homeType: formData.homeType,
            unitType: formData.unitType,
            homeContentCoverage:
              formData.coverageOptions.homeContentCoverageValue,
            renovationsCoverage:
              formData.coverageOptions.renovationCoverageValue,
            buildingCoverage: formData.coverageOptions.building,
            wpaCoverage: formData.coverageOptions.worldwide_fpa,
            policyPeriod: formData.selectedPlan,
            promoCode: formData.promoCode,
            selectedPlan: formData.selectedPlan,
            startDate: formData.policyStartDate,
          },
          __finalize: 1,
        },
      },
      productType: PRODUCT_NAME.HOME_CONTENT,
    }).then((res) => {
      if (res.status === 1) {
        setCurrentStep(4);
        scrollToTop();
      }
    });
  }, [scrollToTop, formData, personalInfoData]);
  //#endregion

  const handleBack = useCallback(() => {
    if (currentStep > 1 && currentStep < 4) {
      setCurrentStep(currentStep - 1);
      scrollToTop();
    }
  }, [currentStep, scrollToTop]);

  //#region Edit handlers for Step 3
  const handleEditPolicyDetails = useCallback(() => {
    setCurrentStep(1);
    scrollToTop();
  }, [scrollToTop]);

  const handleEditPolicyHolderInfo = useCallback(() => {
    setCurrentStep(2);
    const timeoutId = setTimeout(() => {
      scrollToElement('[data-section="policyholder"]');
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);

  const handleEditPropertyInfo = useCallback(() => {
    setCurrentStep(2);
    const timeoutId = setTimeout(() => {
      scrollToElement('[data-section="property"]');
    }, 100);
    return () => clearTimeout(timeoutId);
  }, [scrollToElement]);
  //#endregion

  //#region STEPS
  const steps = [
    <Step1QuoteForm
      key='Step 1'
      formData={formData}
      planData={allplans}
      updateFormData={updateFormData}
      resetFormData={resetQuoteForm}
      errors={errors}
      promoStatus={promoStatus}
      setPromoStatus={setPromoStatus}
      showPlans={showPlans}
      showCustomization={showCustomization}
      showAddOns={showAddOns}
      selectedAddOns={selectedAddOns}
      customizationData={formData.coverageOptions}
      updateCustomizationData={updateFormData}
      isLoading={isLoading}
      onCalculateQuote={handleCalculateQuote}
      onPlanSelect={handlePlanSelect}
      onCustomizationComplete={handleCustomizationComplete}
      onAddOnToggle={handleAddOnToggle}
      onNext={handleNext}
      onBack={handleBack}
      currentStep={currentStep}
      hasViewedCustomization={hasViewedCustomization}
      setHasViewedCustomization={setHasViewedCustomization}
      onAddOnOptionChange={handleAddOnOptionChange}
      totalPremium={totalPremium}
    />,
    <Step2PersonalInfo
      key='Step 2'
      personalInfoData={personalInfoData}
      updatePersonalInfoData={updatePersonalInfoData}
      personalInfoErrors={personalInfoErrors}
      myInfoData={myInfoData}
      onRetrieveMyInfo={handleRetrieveMyInfo}
      onNext={handleNext}
      onBack={handleBack}
      selectedPlan={currentPlan}
      selectedAddOns={selectedAddOns}
      totalPremium={totalPremium}
      promoStatus={promoStatus}
      currentStep={currentStep}
      formData={formData}
      customizationData={formData.coverageOptions}
    />,
    <Step3Summary
      key='Step 3'
      formData={formData}
      personalInfoData={personalInfoData}
      selectedPlan={currentPlan}
      selectedAddOns={selectedAddOns}
      totalPremium={totalPremium}
      promoStatus={promoStatus}
      myInfoData={myInfoData}
      onBack={handleBack}
      onMakePayment={handleMakePayment}
      onEditPolicyDetails={handleEditPolicyDetails}
      onEditPolicyHolderInfo={handleEditPolicyHolderInfo}
      onEditPropertyInfo={handleEditPropertyInfo}
      currentStep={currentStep}
      customizationData={formData.coverageOptions}
    />,
    <Step4Success
      key='Step 4'
      selectedPlan={currentPlan}
      selectedAddOns={selectedAddOns}
      totalPremium={totalPremium}
      formData={formData}
      personalInfoData={personalInfoData}
      policyDetailsOpen={policyDetailsOpen}
      setPolicyDetailsOpen={setPolicyDetailsOpen}
      helperDetailsOpen={helperDetailsOpen}
      setHelperDetailsOpen={setHelperDetailsOpen}
      insuredInfoOpen={insuredInfoOpen}
      setInsuredInfoOpen={setInsuredInfoOpen}
    />,
  ];
  //#endregion

  return (
    <QuoteDetail
      progressStepperData={{
        steps: homeContentsInsuranceSteps,
        title: 'Home Contents Insurance Quotation',
        currentStep: currentStep,
        onStepClick: handleStepClick,
        visitedSteps: visitedSteps,
        selectedPlan: formData.selectedPlan,
      }}
      steps={steps}
      currentStep={currentStep}
    />
  );
}
