//#region Imports
import { memo } from 'react';
import {
  CheckCircle,
  Star,
  Shield,
  Gift,
  Check,
  Download,
  Phone,
  Mail,
  MapPin,
  FileText,
} from 'lucide-react';

import {
  QuoteForm,
  PersonalInfoForm,
  InsurancePlan,
  SelectedAddOn,
} from '@/libs/types/homeContents';

import {
  formatDateForDisplay,
  calculateExpiryDate,
  getSelectedAddOnDetails,
} from '@/libs/utils/calculations';
//#endregion

//Step4 Props
interface Step4Props {
  selectedPlan: InsurancePlan | null;
  selectedAddOns: SelectedAddOn[];
  totalPremium: number;
  formData: QuoteForm;
  personalInfoData: PersonalInfoForm;
  policyDetailsOpen: boolean;
  setPolicyDetailsOpen: (open: boolean) => void;
  helperDetailsOpen: boolean;
  setHelperDetailsOpen: (open: boolean) => void;
  insuredInfoOpen: boolean;
  setInsuredInfoOpen: (open: boolean) => void;
}

const Step4Success = memo<Step4Props>(
  ({
    selectedPlan,
    selectedAddOns,
    totalPremium,
    formData,
    personalInfoData,
  }) => {
    const policyExpiryDate = calculateExpiryDate(
      formData.policyStartDate,
      '12',
    ); // Default to 1 year since duration is now plan-based
    const selectedAddOnDetails = getSelectedAddOnDetails(selectedAddOns);

    // Generate policy number for home content insurance
    const policyNumber = `HCI-${new Date().getFullYear()}-${Date.now().toString().slice(-6)}`;

    // Calculate GST included total
    const gstAmount = totalPremium * 0.09;
    const netPremium = totalPremium + gstAmount;

    // Format property details based on form data
    const getPropertyTypeDisplay = () => {
      const homeTypeMap = {
        hdb: 'HDB',
        condo: 'Condominium',
        landed: 'Landed Property',
      };
      return (
        homeTypeMap[formData.homeType as keyof typeof homeTypeMap] ||
        formData.homeType
      );
    };

    const getUnitTypeDisplay = () => {
      const unitTypeMap = {
        '2-room': '2-Room',
        '3-room': '3-Room',
        '4-room': '4-Room',
        '5-room': '5-Room',
        executive: 'Executive',
        '1-room': '1-Room',
        penthouse: 'Penthouse',
        'landed-single': 'Single Storey',
        'landed-double': 'Double Storey',
        'landed-bungalow': 'Bungalow',
      };
      return (
        unitTypeMap[formData.unitType as keyof typeof unitTypeMap] ||
        formData.unitType
      );
    };

    const getOwnershipDisplay = () => {
      const ownershipMap = {
        'owner-living-in': 'Owner Living in Property',
        tenant: 'Tenant',
      };
      return (
        ownershipMap[formData.ownership as keyof typeof ownershipMap] ||
        formData.ownership
      );
    };

    return (
      <div className='mx-auto max-w-[1920px] p-4 pb-32'>
        <div className='mx-auto max-w-2xl'>
          {/* Enhanced Success Message with What's Next Combined */}
          <div className='relative mb-8 overflow-hidden rounded-3xl border border-green-100 bg-gradient-to-br from-green-50 to-blue-50 p-8 text-center shadow-xl'>
            {/* Decorative elements */}
            <div className='absolute right-0 top-0 -mr-16 -mt-16 h-32 w-32 rounded-full bg-gradient-to-br from-green-200/30 to-blue-200/30'></div>
            <div className='absolute bottom-0 left-0 -mb-12 -ml-12 h-24 w-24 rounded-full bg-gradient-to-tr from-blue-200/30 to-green-200/30'></div>

            <div className='relative z-10'>
              <div className='mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-green-400 to-green-600 shadow-lg'>
                <CheckCircle className='h-14 w-14 text-white' />
              </div>
              <div className='mb-3 flex items-center justify-center gap-2'>
                <Star className='h-5 w-5 fill-current text-yellow-400' />
                <h2 className='font-heading text-3xl font-bold text-gray-900'>
                  <span className='text-green-600'>Congratulations!</span>
                </h2>
                <Star className='h-5 w-5 fill-current text-yellow-400' />
              </div>
              <p className='font-body mb-2 text-xl font-semibold text-gray-800'>
                Your home content insurance policy has been activated
                successfully
              </p>
              <p className='font-body mb-6 text-lg text-gray-600'>
                🏠 Your home and belongings are now protected! Check your email
                for policy details.
              </p>

              {/* Quick Stats */}
              <div className='mb-8 grid grid-cols-2 gap-4'>
                <div className='rounded-xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm'>
                  <Shield className='mx-auto mb-2 h-6 w-6 text-green-600' />
                  <p className='font-body text-sm text-gray-600'>Coverage</p>
                  <p className='font-body font-semibold text-gray-900'>
                    {selectedPlan?.name} Plan
                  </p>
                </div>
                <div className='rounded-xl border border-white/50 bg-white/60 p-4 backdrop-blur-sm'>
                  <Gift className='mx-auto mb-2 h-6 w-6 text-green-600' />
                  <p className='font-body text-sm text-gray-600'>Total Paid</p>
                  <p className='font-body font-semibold text-gray-900'>
                    SGD {netPremium.toFixed(2)}
                  </p>
                </div>
              </div>

              {/* What's Next - Integrated into success section */}
              <div className='rounded-2xl border border-green-200 bg-white/80 p-6 backdrop-blur-sm'>
                <h3 className='font-heading mb-4 flex items-center justify-center gap-2 font-semibold text-gray-900'>
                  <Star className='h-5 w-5 text-green-500' />
                  What's Next?
                </h3>
                <div className='space-y-3 text-left text-sm text-gray-700'>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <span className='text-xs font-semibold text-green-600'>
                        1
                      </span>
                    </div>
                    <p className='font-body'>
                      Your policy documents will be emailed within 24 hours
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <span className='text-xs font-semibold text-green-600'>
                        2
                      </span>
                    </div>
                    <p className='font-body'>
                      Keep your policy number handy:{' '}
                      <span className='font-medium text-green-700'>
                        {policyNumber}
                      </span>
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <span className='text-xs font-semibold text-green-600'>
                        3
                      </span>
                    </div>
                    <p className='font-body'>
                      Access your online account for easy claims and support
                    </p>
                  </div>
                  <div className='flex items-start gap-3'>
                    <div className='mt-0.5 flex h-6 w-6 flex-shrink-0 items-center justify-center rounded-full bg-green-100'>
                      <span className='text-xs font-semibold text-green-600'>
                        4
                      </span>
                    </div>
                    <p className='font-body'>
                      Your coverage starts immediately on{' '}
                      {formatDateForDisplay(formData.policyStartDate)}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Streamlined Policy Information */}
          <div className='mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100'>
                <FileText className='h-5 w-5 text-[#02ADEF]' />
              </div>
              <h3 className='font-heading text-lg font-semibold text-gray-900'>
                Policy Summary
              </h3>
            </div>

            <div className='grid grid-cols-1 gap-6 md:grid-cols-2'>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Policy Type</span>
                  <span className='font-body font-medium text-gray-900'>
                    Home Content Insurance
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Plan</span>
                  <span className='font-body font-medium text-gray-900'>
                    {selectedPlan?.name}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Property Type</span>
                  <span className='font-body font-medium text-gray-900'>
                    {getPropertyTypeDisplay()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Unit Type</span>
                  <span className='font-body font-medium text-gray-900'>
                    {getUnitTypeDisplay()}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Customer Type</span>
                  <span className='font-body font-medium text-gray-900'>
                    {getOwnershipDisplay()}
                  </span>
                </div>
              </div>
              <div className='space-y-3'>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Policy Holder</span>
                  <span className='font-body font-medium text-gray-900'>
                    {personalInfoData.policyHolderFullName}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Policy Number</span>
                  <span className='font-body font-medium text-gray-900'>
                    {policyNumber}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>Start Date</span>
                  <span className='font-body font-medium text-gray-900'>
                    {formatDateForDisplay(formData.policyStartDate)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>End Date</span>
                  <span className='font-body font-medium text-gray-900'>
                    {formatDateForDisplay(policyExpiryDate)}
                  </span>
                </div>
                <div className='flex justify-between'>
                  <span className='font-body text-gray-600'>
                    Premium (incl. GST)
                  </span>
                  <span className='font-body font-bold text-[#02ADEF]'>
                    SGD {netPremium.toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Property Address Section */}
            <div className='mt-6 grid grid-cols-1 gap-4 md:grid-cols-2'>
              {/* Insured Premises Address */}
              <div className='rounded-xl border border-orange-100 bg-gradient-to-r from-orange-50 to-yellow-50 p-4'>
                <h4 className='font-heading mb-3 font-medium text-gray-900'>
                  Insured Premises Address
                </h4>
                <div className='space-y-1 text-sm text-gray-700'>
                  <div className='font-body'>
                    {personalInfoData.addressLine1}
                    {personalInfoData.addressLine2 && (
                      <>
                        <br />
                        {personalInfoData.addressLine2}
                      </>
                    )}
                    {personalInfoData.addressLine3 && (
                      <>
                        <br />
                        {personalInfoData.addressLine3}
                      </>
                    )}
                    <br />
                    Singapore {personalInfoData.postalCode}
                  </div>
                </div>
              </div>

              {/* Mailing Address - Only show if different */}
              {personalInfoData.mailingAddressDifferent === 'yes' &&
                personalInfoData.mailingAddressLine1 && (
                  <div className='rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50 p-4'>
                    <h4 className='font-heading mb-3 font-medium text-gray-900'>
                      Mailing Address
                    </h4>
                    <div className='space-y-1 text-sm text-gray-700'>
                      <div className='font-body'>
                        {personalInfoData.mailingAddressLine1}
                        {personalInfoData.mailingAddressLine2 && (
                          <>
                            <br />
                            {personalInfoData.mailingAddressLine2}
                          </>
                        )}
                        {personalInfoData.mailingAddressLine3 && (
                          <>
                            <br />
                            {personalInfoData.mailingAddressLine3}
                          </>
                        )}
                        <br />
                        Singapore {personalInfoData.mailingPostalCode}
                      </div>
                    </div>
                  </div>
                )}
            </div>

            {/* Key Benefits for Home Content Insurance */}
            <div className='mt-6 rounded-xl border border-blue-100 bg-gradient-to-r from-blue-50 to-green-50 p-4'>
              <h4 className='font-heading mb-3 font-medium text-gray-900'>
                Your Home Content Coverage Includes
              </h4>
              <div className='grid grid-cols-1 gap-2 text-sm md:grid-cols-2'>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>
                    Personal Belongings Protection
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>
                    Building Fixtures & Fittings
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>
                    Renovation & Improvement Works
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>24/7 Claims Support</span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>
                    Fire & Natural Disaster Coverage
                  </span>
                </div>
                <div className='flex items-center gap-2 text-gray-700'>
                  <Check className='h-4 w-4 text-green-600' />
                  <span className='font-body'>Theft & Burglary Protection</span>
                </div>
              </div>

              {/* Add-ons if any */}
              {selectedAddOns.length > 0 && (
                <div className='mt-4 border-t border-blue-200 pt-4'>
                  <h5 className='font-heading mb-2 font-medium text-gray-900'>
                    Additional Coverage
                  </h5>
                  <div className='space-y-1'>
                    {selectedAddOnDetails.map(
                      (addon, index) =>
                        addon && (
                          <div
                            key={index}
                            className='flex items-center gap-2 text-gray-700'
                          >
                            <Check className='h-4 w-4 text-green-600' />
                            <span className='font-body text-sm'>
                              {addon.name}
                            </span>
                          </div>
                        ),
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Enhanced Document Downloads */}
          <div className='mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'>
            <div className='mb-4 flex items-center gap-3'>
              <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-purple-100'>
                <Download className='h-5 w-5 text-purple-600' />
              </div>
              <h3 className='font-heading text-lg font-semibold text-gray-900'>
                Important Documents
              </h3>
            </div>

            <div className='space-y-3'>
              <button className='group flex w-full items-center justify-between rounded-xl border border-blue-200 bg-gradient-to-r from-blue-50 to-purple-50 p-4 transition-all duration-200 hover:from-blue-100 hover:to-purple-100'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-blue-100 transition-colors group-hover:bg-blue-200'>
                    <FileText className='h-5 w-5 text-blue-600' />
                  </div>
                  <div className='text-left'>
                    <h4 className='font-heading font-medium text-gray-900'>
                      Home Content Insurance Certificate
                    </h4>
                    <p className='font-body text-sm text-gray-600'>
                      Download your official policy document
                    </p>
                  </div>
                </div>
                <Download className='h-5 w-5 text-gray-400 transition-colors group-hover:text-blue-600' />
              </button>

              <button className='group flex w-full items-center justify-between rounded-xl border border-green-200 bg-gradient-to-r from-green-50 to-blue-50 p-4 transition-all duration-200 hover:from-green-100 hover:to-blue-100'>
                <div className='flex items-center gap-3'>
                  <div className='flex h-10 w-10 items-center justify-center rounded-lg bg-green-100 transition-colors group-hover:bg-green-200'>
                    <Shield className='h-5 w-5 text-green-600' />
                  </div>
                  <div className='text-left'>
                    <h4 className='font-heading font-medium text-gray-900'>
                      Home Insurance Terms & Conditions
                    </h4>
                    <p className='font-body text-sm text-gray-600'>
                      Complete policy terms and home coverage details
                    </p>
                  </div>
                </div>
                <Download className='h-5 w-5 text-gray-400 transition-colors group-hover:text-green-600' />
              </button>
            </div>
          </div>

          {/* Streamlined Contact Section */}
          <div className='mb-6 rounded-2xl border border-gray-100 bg-white p-6 shadow-lg'>
            <div className='mb-6 text-center'>
              <h3 className='font-heading mb-2 text-lg font-semibold text-gray-900'>
                Need Assistance?
              </h3>
              <p className='font-body text-gray-600'>
                We're here to help with your home insurance needs
              </p>
            </div>

            <div className='grid grid-cols-1 gap-4'>
              <button className='group flex flex-col items-center rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-cyan-50 p-4 transition-all duration-200 hover:from-blue-100 hover:to-cyan-100'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-blue-100 transition-colors group-hover:bg-blue-200'>
                  <Phone className='h-6 w-6 text-blue-600' />
                </div>
                <span className='font-heading text-sm font-medium text-gray-900'>
                  Call Us
                </span>
                <span className='font-body text-sm font-semibold text-blue-600'>
                  6206 5588
                </span>
                <span className='font-body mt-1 text-center text-xs text-gray-500'>
                  Mon-Fri 8:30-18:00
                </span>
              </button>

              <button className='group flex flex-col items-center rounded-xl border border-green-200 bg-gradient-to-br from-green-50 to-emerald-50 p-4 transition-all duration-200 hover:from-green-100 hover:to-emerald-100'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-green-100 transition-colors group-hover:bg-green-200'>
                  <Mail className='h-6 w-6 text-green-600' />
                </div>
                <span className='font-heading text-sm font-medium text-gray-900'>
                  Email
                </span>
                <span className='font-body text-sm font-semibold text-green-600'>
                  customerservice@ecics.com.sg
                </span>
                <span className='font-body mt-1 text-center text-xs text-gray-500'>
                  2-5 business days
                </span>
              </button>

              <button className='group flex flex-col items-center rounded-xl border border-purple-200 bg-gradient-to-br from-purple-50 to-pink-50 p-4 transition-all duration-200 hover:from-purple-100 hover:to-pink-100'>
                <div className='mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-purple-100 transition-colors group-hover:bg-purple-200'>
                  <MapPin className='h-6 w-6 text-purple-600' />
                </div>
                <span className='font-heading text-sm font-medium text-gray-900'>
                  Visit
                </span>
                <span className='font-body text-sm font-semibold text-purple-600'>
                  Singapore Office
                </span>
                <span className='font-body mt-1 text-center text-xs text-gray-500'>
                  10 Eunos Road 8<br />
                  #09-04A Singapore Post Centre
                  <br />
                  Singapore 408600
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  },
);

Step4Success.displayName = 'Step4Success';

export default Step4Success;
