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
import ReviewDesktop from './ReviewDesktop';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { ROUTES } from '@/constants/routes';
import { useGetQuote } from '@/hook/insurance/quote';

export default function Page() {
  const [expandedSections, setExpandedSections] = useState<{
    [key: string]: boolean;
  }>({});
  const [showModal, setShowModal] = useState(false);
  const { isMobile } = useDeviceDetection();

  const toggleSection = (key: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const { data: quote } = useGetQuote('1745750192188');

  const handleEditClick = (key: string) => {
    toggleSection(key);
  };

  const routerBySectionKey = (key: string) => {
    switch (key) {
      case 'basic':
        return ROUTES.INSURANCE.BASIC_DETAIL;
      case 'addons':
        return ROUTES.INSURANCE.ADD_ON;
      case 'policy':
        return ROUTES.INSURANCE.PLAN;
      case 'driver':
        return ROUTES.INSURANCE.ADD_ON;
      default:
        return undefined;
    }
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

  const getAdditionalDriverData = (drivers: any[] = []) => {
    return drivers.flatMap((driver, index) => [
      {
        title: `Additional Driver ${index + 1}`,
        value: '',
        isTitleOnly: true,
      },
      {
        title: 'Name',
        value: driver.name,
      },
      {
        title: 'NRIC',
        value: driver.nric_or_fin,
      },
    ]);
  };

  const getDriverSections = (drivers: any[] = []) => {
    return drivers.map((driver, index) => {
      const data = [
        { title: 'Name as Per NRIC', value: driver.name },
        { title: 'NRIC', value: driver.nric_or_fin },
        { title: 'Date of Birth', value: driver.date_of_birth },
        { title: 'Gender', value: driver.gender },
        { title: 'Marital Status', value: driver.marital_status },
        { title: 'Driving Experience', value: driver.driving_experience },
      ];

      return {
        key: `driver-${index}`,
        title: `Additional Driver ${index + 1}`,
        description: driver.name,
        icon: <AdditionalDriverDetailsIcon className='text-white' />,
        data,
      };
    });
  };

  const sharedDataMap: { [key: string]: { title: string; value: any }[] } = {
    basic: [
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date,
      },
      {
        title: 'No Claim Discount',
        value: `${quote?.data.insurance_additional_info?.no_claim_discount}%`,
      },
      {
        title: 'Number of claims in last 3 years',
        value: quote?.data.insurance_additional_info?.no_of_claim,
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
        value: quote?.data.vehicle_info_selected?.chasis_number || 'N/A',
      },
      {
        title: 'Engine Number',
        value: quote?.data.vehicle_info_selected?.engine_number || 'N/A',
      },
      { title: 'Engine Capacity', value: 'N/A' },
      { title: 'Power Rate', value: 'N/A' },
      { title: 'Year of Manufacture', value: 'N/A' },
    ],
    policy: [
      { title: 'Selected Plan', value: quote?.data.selected_plan || 'N/A' },
      {
        title: 'Policy Start Date',
        value: quote?.data.insurance_additional_info?.start_date || 'N/A',
      },
      {
        title: 'Policy End Date',
        value: quote?.data.insurance_additional_info?.end_date || 'N/A',
      },
    ],
    addons: addonsSectionData,
    driver: getAdditionalDriverData(quote?.data.add_named_driver_info),
    owner: [
      { title: 'Owner Name', value: `${quote?.data.personal_info?.name} ` },
      {
        title: 'Chasis number',
        value: `${quote?.data.vehicle_info_selected?.chasis_number} `,
      },
    ],
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
      description: `${quote?.data.personal_info?.name}  ${quote?.data.vehicle_info_selected?.chasis_number}`,
      icon: <PersonIcon className='text-white' />,
    },
  ];

  return (
    <div className='px-4'>
      <h1 className='mb-4 text-xl font-bold'>Review your details</h1>
      <div className='flex flex-col lg:flex-row lg:gap-8'>
        <div className='flex-1'>
          {sections.map((section) => {
            if (section.key === 'driver') {
              const drivers = getDriverSections(
                quote?.data.add_named_driver_info,
              );
              return drivers.map((driverSection) =>
                isMobile ? (
                  <ReviewSection
                    key={driverSection.key}
                    title={driverSection.title}
                    description={driverSection.description}
                    icon={driverSection.icon}
                    data={driverSection.data}
                    isExpanded={!!expandedSections[driverSection.key]}
                    onToggle={() => handleEditClick(driverSection.key)}
                    setShowModal={setShowModal}
                    editRoute={ROUTES.INSURANCE.ADD_ON}
                  />
                ) : (
                  <ReviewDesktop
                    key={driverSection.key}
                    title={driverSection.title}
                    description={driverSection.description}
                    icon={driverSection.icon}
                    data={driverSection.data}
                    isExpanded={!!expandedSections[driverSection.key]}
                    onToggle={() => handleEditClick(driverSection.key)}
                    setShowModal={setShowModal}
                    editRoute={ROUTES.INSURANCE.ADD_ON}
                  />
                ),
              );
            }

            return isMobile ? (
              <ReviewSection
                key={section.key}
                title={section.title}
                description={section.description}
                icon={section.icon}
                data={sharedDataMap[section.key] || []}
                isExpanded={!!expandedSections[section.key]}
                onToggle={() => handleEditClick(section.key)}
                setShowModal={setShowModal}
                editRoute={routerBySectionKey(section.key)}
              />
            ) : (
              <ReviewDesktop
                key={section.key}
                title={section.title}
                description={section.description}
                icon={section.icon}
                data={sharedDataMap[section.key] || []}
                isExpanded={!!expandedSections[section.key]}
                onToggle={() => handleEditClick(section.key)}
                setShowModal={setShowModal}
                editRoute={routerBySectionKey(section.key)}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
