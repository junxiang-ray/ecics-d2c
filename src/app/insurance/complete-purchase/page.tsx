'use client';
import { useEffect, useState } from 'react';
import BasicDetailsIcon from '@/components/icons/BasicDetailsIcon';
import ReviewSection from './ReviewSection';
import PersonIcon from '@/components/icons/PersonIcon';
import NewOldReplacementIcon from '@/components/icons/NewOldReplacementIcon';
import PolicyPlanIcon from '@/components/icons/PolicyPlanIcon';
import AddOnsSelectedIcon from '@/components/icons/AddOnsSelectedIcon';
import AdditionalDriverDetailsIcon from '@/components/icons/AdditionalDriverDetailsIcon';
import ImportantNoticeModal from './review-your-detail/modal/ImportantNoticeModal';

interface QuoteParams {
  data: {
    plans: any[];
    selected_addons: {
      [key: string]: string;
    };
    selected_plan: string;
    insurance_additional_info: {
      end_date: string;
      no_claim_discount: number;
      no_of_claim: number;
      start_date: string;
    };
    vehicle_info_selected: {
      engine_no: string;
      chassis_no: string;
      vehicle_make: string;
      chasis_number: string;
      vehicle_model: string;
      first_registered_year: string;
    };
  };
  company: {
    id: number;
    name: string;
  };
}

export default function Page() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const [quote, setQuote] = useState<QuoteParams | null>(null);

  useEffect(() => {
    getQuote();
  }, []);

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };
  const getQuote = async () => {
    try {
      const res = await fetch(`/api/v1/quote//1745750192970`);
      const response = await res.json();
      setQuote(response.data);
    } catch (error) {
      console.error('Failed to fetch hire purchase list:', error);
    }
  };

  const handleEditClick = (key: string) => {
    toggleSection(key);
  };

  const addonsSectionData = Object.entries(quote?.data.selected_addons || {})
    .filter(([, selectedValue]) => selectedValue !== 'NO')
    .map(([code, selectedValue]) => {
      const addon = quote?.data.plans?.[0]?.addons?.find(
        (a: any) => a.code === code,
      );
      const label =
        addon?.options?.find((opt: any) => opt.value === selectedValue)
          ?.label || selectedValue;

      return {
        title: addon?.title || code,
        value: label,
      };
    });

  const sharedDataMap: { [key: string]: { title: string; value: any }[] } = {
    basic: [
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info.start_date,
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info.end_date,
      },
      {
        title: 'No Claim Discount',
        value: `${quote?.data.insurance_additional_info.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in last 3 years',
        value: quote?.data.insurance_additional_info.no_of_claim,
      },
      { title: 'Vehicle financed by', value: quote?.company?.name || 'N/A' },
    ],
    vehicle: [
      {
        title: 'Vehicle  Number',
        value: quote?.data.vehicle_info_selected?.chasis_number || 'N/A',
      },
      {
        title: 'Year of Registration',
        value:
          quote?.data.vehicle_info_selected?.first_registered_year || 'N/A',
      },
      {
        title: 'Vehicle Make',
        value: quote?.data.vehicle_info_selected?.vehicle_make || 'N/A',
      },
      {
        title: 'Vehicle Model',
        value: quote?.data.vehicle_info_selected?.vehicle_model || 'N/A',
      },
      {
        title: 'Chassis Number',
        value: quote?.data.vehicle_info_selected?.chassis_no || 'N/A',
      },
      {
        title: 'Engine Number',
        value: quote?.data.vehicle_info_selected?.engine_no || 'N/A',
      },
      { title: 'Engine Capacity', value: 'N/A' },
      { title: 'Power Rate', value: 'N/A' },
      { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      { title: 'Selected Plan', value: quote?.data.selected_plan },
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info.end_date || 'N/A',
      },
    ],
    addons: addonsSectionData,
    driver: [{ title: 'Driver Name', value: 'Steve Smith' }],
    owner: [{ title: 'Owner Name', value: 'John Doe' }],
  };

  const sections = [
    {
      key: 'basic',
      title: 'Basic Details',
      description: 'Policy Period NCD No. of claims',
      icon: <BasicDetailsIcon className='text-white' />,
    },
    {
      key: 'vehicle',
      title: 'Vehicle Details',
      description: `${quote?.data.vehicle_info_selected?.vehicle_make} ${quote?.data.vehicle_info_selected?.vehicle_model} ${quote?.data.vehicle_info_selected?.chasis_number}`,
      icon: <NewOldReplacementIcon className='text-white' />,
    },
    {
      key: 'policy',
      title: 'Policy Plan',
      description: 'Comprehensive Plan',
      icon: <PolicyPlanIcon className='text-white' />,
    },
    {
      key: 'addons',
      title: 'Add Ons Selected',
      description: 'Additional Named Driver',
      icon: <AddOnsSelectedIcon className='text-white' />,
    },
    {
      key: 'driver',
      title: 'Additional Driver Details',
      description: 'Steve Smith',
      icon: <AdditionalDriverDetailsIcon className='text-white' />,
    },
    {
      key: 'owner',
      title: 'Vehicle Owner',
      description: 'BMW i5 2.2 ST1234B',
      icon: <PersonIcon className='text-white' />,
    },
  ];

  return (
    <div className='px-4'>
      <h1 className='mb-4 text-xl font-bold'>Review your details</h1>
      {sections.map((section) => (
        <ReviewSection
          key={section.key}
          title={section.title}
          description={section.description}
          icon={section.icon}
          data={sharedDataMap[section.key] || []}
          isExpanded={!!expandedSections[section.key]}
          onToggle={() => handleEditClick(section.key)}
          setShowModal={setShowModal}
        />
      ))}

      {showModal && (
        <div className='fixed bottom-0 left-0 right-0 z-50 animate-slide-up rounded-t-2xl bg-white shadow-lg sm:mx-auto sm:max-w-md'>
          <ImportantNoticeModal onSave={() => setShowModal(false)} />
        </div>
      )}
    </div>
  );
}
