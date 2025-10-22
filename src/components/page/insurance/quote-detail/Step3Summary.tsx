import { memo } from 'react';
import {
  Shield,
  User,
  Home,
  DollarSign,
  ChevronLeft,
  Edit,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/cardNew';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import {
  QuoteForm,
  PersonalInfoForm,
  InsurancePlan,
  SelectedAddOn,
  PromoCodeStatus,
  MyInfoData,
  CustomizationData,
} from '@/libs/types/homeContents';
import {
  HOME_OWNERSHIP_TYPES,
  HOME_TYPES,
  UNIT_TYPES,
} from '@/constants/home.content.constants';
import {
  formatDateForDisplay,
  calculateExpiryDate,
  getSelectedAddOnDetails,
} from '@/libs/utils/calculations';
import { PremiumSummary } from '@/components/ui/premiumSummary';
import { ADD_ONS } from '@/constants/home.content.addon.constants';

interface SummarySection {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  showEdit?: boolean;
  onEdit?: () => void;
  myInfoTag?: boolean;
}

const SummarySection = memo<SummarySection>(
  ({ title, icon, children, showEdit = false, onEdit, myInfoTag = false }) => {
    return (
      <Card className='mb-6 overflow-hidden border-0 shadow-lg'>
        <CardHeader className='from-[#02ADEF]/8 border-b border-gray-100 bg-gradient-to-r via-blue-50/80 to-indigo-50/50 p-6'>
          <div className='flex items-center justify-between'>
            <div className='flex items-center gap-3'>
              <div className='rounded-lg bg-[#02ADEF]/10 p-2'>{icon}</div>
              <div className='flex items-center gap-2'>
                <h3 className='m-0 text-xl font-bold text-gray-800'>{title}</h3>
              </div>
            </div>
            {showEdit && onEdit && (
              <Button
                onClick={onEdit}
                variant='outline'
                size='sm'
                className='border-[#02ADEF] text-[#02ADEF] hover:bg-[#02ADEF]/10'
              >
                <Edit className='mr-1 size-4' />
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className='p-6'>{children}</CardContent>
      </Card>
    );
  },
);

SummarySection.displayName = 'SummarySection';

interface Step3Props {
  formData: QuoteForm;
  personalInfoData: PersonalInfoForm;
  selectedPlan: InsurancePlan | null;
  selectedAddOns: SelectedAddOn[];
  totalPremium: number;
  promoStatus: PromoCodeStatus;
  myInfoData?: MyInfoData;
  onBack: () => void;
  onMakePayment: () => void;
  onEditPolicyDetails?: () => void;
  onEditPolicyHolderInfo?: () => void;
  onEditPropertyInfo?: () => void;
  currentStep: number;
  customizationData?: CustomizationData;
}

const Step3Summary = memo<Step3Props>(
  ({
    formData,
    personalInfoData,
    selectedPlan,
    selectedAddOns,
    totalPremium,
    promoStatus,
    myInfoData,
    onBack,
    onMakePayment,
    onEditPolicyDetails,
    onEditPolicyHolderInfo,
    onEditPropertyInfo,
    currentStep,
    customizationData,
  }) => {
    // Early return if constants aren't loaded
    if (
      !HOME_OWNERSHIP_TYPES ||
      !Array.isArray(HOME_OWNERSHIP_TYPES) ||
      !ADD_ONS ||
      !Array.isArray(ADD_ONS)
    ) {
      return (
        <div className='flex items-center justify-center py-12'>
          <div className='h-8 w-8 animate-spin rounded-full border-b-2 border-[#02ADEF]'></div>
        </div>
      );
    }

    const policyExpiryDate = calculateExpiryDate(
      formData.policyStartDate,
      '12',
    ); // Default to 1 year since duration is now plan-based
    const selectedAddOnDetails = getSelectedAddOnDetails(selectedAddOns);

    // Calculate breakdown values - same as PremiumBreakdownDrawer
    const planPrice = selectedPlan?.originalPrice || 0;
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

    const subtotalBeforePromo = planPrice + addOnTotal;
    const promoDiscount =
      promoStatus.status === 'applied'
        ? (subtotalBeforePromo * (promoStatus.discount || 0)) / 100
        : 0;
    const subtotalAfterPromo = subtotalBeforePromo - promoDiscount;
    const gst = subtotalAfterPromo * 0.09; // 9% GST
    const netPremium = subtotalAfterPromo + gst;

    // Check if policy holder info is from MyInfo
    const isPolicyHolderInfoFromMyInfo =
      myInfoData?.isRetrieved && myInfoData?.data;

    // Edit handlers that navigate to specific sections
    const handleEditPolicyDetails = () => {
      // Navigate to step 1
      if (onEditPolicyDetails) onEditPolicyDetails();
    };

    const handleEditPolicyHolderInfo = () => {
      // Navigate to step 2 policy holder section
      if (onEditPolicyHolderInfo) onEditPolicyHolderInfo();
    };

    const handleEditPropertyInfo = () => {
      // Navigate to step 2 property section
      if (onEditPropertyInfo) onEditPropertyInfo();
    };

    return (
      <>
        <div className='mb-12 text-center'>
          <h2 className='mb-4 text-[clamp(28px,5vw,40px)] font-bold text-gray-800'>
            Summary & Review
          </h2>
          <p className='mx-auto max-w-[700px] text-lg leading-relaxed text-gray-600'>
            Please review your home content insurance details before proceeding
            to payment
          </p>
        </div>

        {/* Policy Details & Coverage Combined */}
        <SummarySection
          title='Policy Details & Coverage'
          icon={<Shield className='size-5 text-[#02ADEF]' />}
          showEdit={true}
          onEdit={handleEditPolicyDetails}
        >
          <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
            <div className='space-y-4'>
              <div>
                <Label className='font-semibold text-gray-700'>
                  Ownership of your home
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {
                    HOME_OWNERSHIP_TYPES.find(
                      (t) => t.value === formData.ownership,
                    )?.label
                  }
                </p>
              </div>

              <div>
                <Label className='font-semibold text-gray-700'>Home Type</Label>
                <p className='mt-1 break-words text-gray-700'>
                  {HOME_TYPES.find((t) => t.value === formData.homeType)?.label}
                </p>
              </div>

              {/* Only show unit type for non-landed properties */}
              {formData.homeType !== 'landed' && (
                <div>
                  <Label className='font-semibold text-gray-700'>
                    Unit Type
                  </Label>
                  <p className='mt-1 break-words text-gray-700'>
                    {
                      UNIT_TYPES.find((t) => t.value === formData.unitType)
                        ?.label
                    }
                  </p>
                </div>
              )}

              {/* Selected Plan - Simplified */}
              <div>
                <Label className='font-semibold text-gray-700'>
                  Selected Plan
                </Label>
                <div className='mt-2 flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-3'>
                  <span className='min-w-0 flex-1 break-words font-medium text-gray-700'>
                    {selectedPlan?.name} Plan
                  </span>
                  <span className='flex-shrink-0 whitespace-nowrap font-bold text-[#02ADEF]'>
                    ${selectedPlan?.originalPrice}
                  </span>
                </div>

                {/* Sum Insured / Coverage Amount */}
                {customizationData && (
                  <div className='mt-3 rounded-lg border border-blue-100 bg-blue-50/30 p-3'>
                    <h4 className='mb-2 text-sm font-semibold text-gray-800'>
                      Sum Insured
                    </h4>
                    <div className='space-y-1.5'>
                      {customizationData.hdbFireInsurance !== 'yes' && (
                        <div className='flex items-center justify-between text-sm'>
                          <span className='text-gray-600'>
                            Building Coverage
                          </span>
                          <span className='font-medium text-gray-800'>
                            $
                            {parseInt(
                              customizationData.building,
                            ).toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>
                          Home Content Coverage
                        </span>
                        <span className='font-medium text-gray-800'>
                          $
                          {parseInt(
                            customizationData.homeContent,
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className='flex items-center justify-between text-sm'>
                        <span className='text-gray-600'>
                          Renovation Coverage
                        </span>
                        <span className='font-medium text-gray-800'>
                          $
                          {parseInt(
                            customizationData.renovation,
                          ).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className='space-y-4'>
              <div>
                <Label className='font-semibold text-gray-700'>
                  Policy Start Date
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {formatDateForDisplay(formData.policyStartDate)}
                </p>
              </div>

              <div>
                <Label className='font-semibold text-gray-700'>
                  Policy End Date
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {formatDateForDisplay(policyExpiryDate)}
                </p>
              </div>

              {promoStatus.status === 'applied' && (
                <div>
                  <Label className='font-semibold text-gray-700'>
                    Promo Code Applied
                  </Label>
                  <p className='mt-1 break-words text-[#52c41a]'>
                    {promoStatus.code} ({promoStatus.discount}% discount)
                  </p>
                </div>
              )}

              {/* Selected Add-ons - Simplified */}
              {selectedAddOns.length > 0 && (
                <div>
                  <Label className='font-semibold text-gray-700'>Add-ons</Label>
                  <div className='mt-2 space-y-2'>
                    {selectedAddOnDetails.map(
                      (addon, index) =>
                        addon && (
                          <div
                            key={index}
                            className='flex items-start justify-between gap-3 rounded-lg bg-gray-50 p-3'
                          >
                            <span className='min-w-0 flex-1 break-words font-medium text-gray-700'>
                              {addon.name}
                            </span>
                            <span className='flex-shrink-0 whitespace-nowrap font-bold text-[#02ADEF]'>
                              ${addon.price.toFixed(2)}
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </SummarySection>

        {/* Policy Holder Details */}
        <SummarySection
          title='Policyholder Information'
          icon={<User className='size-5 text-[#02ADEF]' />}
          showEdit={true}
          onEdit={handleEditPolicyHolderInfo}
          myInfoTag={isPolicyHolderInfoFromMyInfo}
        >
          <div className='space-y-6'>
            {/* Personal Information - 2 Column Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Row 1 - Full Name | NRIC/FIN */}
              <div>
                <Label className='font-semibold text-gray-700'>Full Name</Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.policyHolderFullName}
                </p>
              </div>

              <div>
                <Label className='font-semibold text-gray-700'>
                  NRIC / FIN
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.policyHolderNricFin}
                </p>
              </div>

              {/* Row 2 - Date of Birth | Nationality */}
              <div>
                <Label className='font-semibold text-gray-700'>
                  Date of Birth
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {formatDateForDisplay(
                    personalInfoData.policyHolderDateOfBirth,
                  )}
                </p>
              </div>

              <div>
                <Label className='font-semibold text-gray-700'>
                  Nationality
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.policyHolderNationality}
                </p>
              </div>

              {/* Row 3 - Mobile Number | Email Address */}
              <div>
                <Label className='font-semibold text-gray-700'>
                  Mobile Number
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.policyHolderMobileNumber}
                </p>
              </div>

              <div>
                <Label className='font-semibold text-gray-700'>
                  Email Address
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.policyHolderEmail}
                </p>
              </div>
            </div>

            {/* Address Information - 2 Column Grid */}
            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              {/* Insured Premises Address */}
              <div>
                <Label className='font-semibold text-gray-700'>
                  Insured Premises Address
                </Label>
                <div className='mt-1 space-y-1 text-gray-700'>
                  <p className='break-words'>{personalInfoData.addressLine1}</p>
                  {personalInfoData.addressLine2 && (
                    <p className='break-words'>
                      {personalInfoData.addressLine2}
                    </p>
                  )}
                  {personalInfoData.addressLine3 && (
                    <p className='break-words'>
                      {personalInfoData.addressLine3}
                    </p>
                  )}
                  <p className='break-words'>
                    Singapore {personalInfoData.postalCode}
                  </p>
                </div>
              </div>

              {/* Mailing Address - Conditional or Empty Space */}
              {personalInfoData.mailingAddressDifferent === 'yes' ? (
                <div>
                  <Label className='font-semibold text-gray-700'>
                    Mailing Address
                  </Label>
                  <div className='mt-1 space-y-1 text-gray-700'>
                    <p className='break-words'>
                      {personalInfoData.mailingAddressLine1}
                    </p>
                    {personalInfoData.mailingAddressLine2 && (
                      <p className='break-words'>
                        {personalInfoData.mailingAddressLine2}
                      </p>
                    )}
                    {personalInfoData.mailingAddressLine3 && (
                      <p className='break-words'>
                        {personalInfoData.mailingAddressLine3}
                      </p>
                    )}
                    <p className='break-words'>
                      Singapore {personalInfoData.mailingPostalCode}
                    </p>
                  </div>
                </div>
              ) : (
                <div></div>
              )}
            </div>

            {/* Previous Insurer - Full Width if exists */}
            {personalInfoData.previousInsurerName && (
              <div>
                <Label className='font-semibold text-gray-700'>
                  Previous Insurer
                </Label>
                <p className='mt-1 break-words text-gray-700'>
                  {personalInfoData.previousInsurerName === 'Other'
                    ? personalInfoData.otherInsurerName
                    : personalInfoData.previousInsurerName}
                </p>
              </div>
            )}
          </div>
        </SummarySection>

        {/* Premium Breakdown - Updated with $ icon */}
        <SummarySection
          title='Premium Breakdown'
          icon={<DollarSign className='size-5 text-[#02ADEF]' />}
        >
          <div className='space-y-4'>
            {/* Plan Section */}
            <div className='mb-4'>
              <h5 className='mb-3 text-base font-bold text-[#303030]'>Plan</h5>
              <div className='mb-2 flex items-start justify-between gap-3'>
                <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                  {selectedPlan?.name} Plan
                </span>
                <span className='flex-shrink-0 whitespace-nowrap text-sm text-[#303030]'>
                  SGD {planPrice.toFixed(2)}
                </span>
              </div>
              {promoStatus.status === 'applied' && (
                <div className='flex items-start justify-between gap-3 text-[#02ADEF]'>
                  <span className='min-w-0 flex-1 break-words text-sm font-semibold'>
                    Coupon Discount ({promoStatus.discount}%)
                  </span>
                  <span className='flex-shrink-0 whitespace-nowrap text-sm font-semibold'>
                    -SGD {promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}
            </div>

            {/* Coverage Details Section */}
            {customizationData && (
              <div className='mb-4'>
                <h5 className='mb-3 text-base font-bold text-[#303030]'>
                  Coverage Selected
                </h5>
                <div className='space-y-2'>
                  <div className='flex items-start justify-between gap-3'>
                    <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                      Building Coverage
                    </span>
                    <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium text-[#303030]'>
                      ${parseInt(customizationData.building).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-start justify-between gap-3'>
                    <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                      Home Content Coverage
                    </span>
                    <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium text-[#303030]'>
                      $
                      {parseInt(customizationData.homeContent).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-start justify-between gap-3'>
                    <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                      Renovation Coverage
                    </span>
                    <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium text-[#303030]'>
                      ${parseInt(customizationData.renovation).toLocaleString()}
                    </span>
                  </div>
                  <div className='flex items-start justify-between gap-3'>
                    <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                      HDB Fire Insurance
                    </span>
                    <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium capitalize text-[#303030]'>
                      {customizationData.hdbFireInsurance}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Add-ons Section */}
            {selectedAddOns.length > 0 && (
              <div className='mb-4'>
                <h5 className='mb-3 text-base font-bold text-[#303030]'>
                  Add-ons
                </h5>
                <div className='space-y-3'>
                  {selectedAddOns.map((selectedAddOn) => {
                    const addOn = ADD_ONS.find(
                      (a) => a.id === selectedAddOn.id,
                    );
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
                        className='flex items-start justify-between gap-3'
                      >
                        <div className='min-w-0 flex-1'>
                          <div className='mb-1 break-words text-sm leading-tight text-[#303030]'>
                            {displayName}
                          </div>
                          {addOn.hasOptions && selectedAddOn.selectedOption && (
                            <div className='break-words text-xs text-gray-500'>
                              ${selectedAddOn.selectedOption} Coverage
                            </div>
                          )}
                        </div>
                        <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium text-[#080808]'>
                          SGD {price.toFixed(2)}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            <Separator />

            {/* Totals */}
            <div className='space-y-4'>
              <div className='flex items-start justify-between gap-3'>
                <span className='min-w-0 flex-1 break-words text-base font-bold text-[#303030]'>
                  Sub-Total
                </span>
                <span className='flex-shrink-0 whitespace-nowrap text-base font-bold text-[#303030]'>
                  SGD {subtotalBeforePromo.toFixed(2)}
                </span>
              </div>

              {/* Promo Code Row - Only show if promo is applied */}
              {promoStatus.status === 'applied' && (
                <div className='flex items-start justify-between gap-3'>
                  <span className='min-w-0 flex-1 break-words text-sm font-medium text-green-600'>
                    Promo Code Discount ({promoStatus.discount}% OFF)
                  </span>
                  <span className='flex-shrink-0 whitespace-nowrap text-sm font-medium text-green-600'>
                    -SGD {promoDiscount.toFixed(2)}
                  </span>
                </div>
              )}

              <div className='flex items-start justify-between gap-3'>
                <span className='min-w-0 flex-1 break-words text-sm text-[#303030]'>
                  GST (9%)
                </span>
                <span className='flex-shrink-0 whitespace-nowrap text-sm text-[#303030]'>
                  SGD {gst.toFixed(2)}
                </span>
              </div>

              <Separator />

              <div className='flex items-start justify-between gap-3'>
                <span className='min-w-0 flex-1 break-words text-lg font-bold text-[#303030]'>
                  Net Premium (Total)
                </span>
                <span className='flex-shrink-0 whitespace-nowrap text-lg font-bold text-[#02ADEF]'>
                  SGD {netPremium.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </SummarySection>

        {/* Standardized Premium Summary */}
        {selectedPlan && (
          <PremiumSummary
            selectedPlan={selectedPlan}
            selectedAddOns={selectedAddOns}
            totalPremium={totalPremium}
            promoStatus={promoStatus}
            currentStep={currentStep}
            onNext={onMakePayment}
            onBack={onBack}
            formData={formData}
            customizationData={customizationData}
          />
        )}
      </>
    );
  },
);

Step3Summary.displayName = 'Step3Summary';

export default Step3Summary;
