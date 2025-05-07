import DeleteIcon from '@/components/icons/DeleteIcon';
import { DatePickerField } from '@/components/ui/form/datepicker';
import { DropdownField } from '@/components/ui/form/dropdownfield';
import { InputField } from '@/components/ui/form/inputfield';
import { PlusOutlined } from '@ant-design/icons';
import { Drawer } from 'antd';
import { zodResolver } from '@hookform/resolvers/zod';
import dayjs from 'dayjs';
import { useMemo, useRef, useState } from 'react';
import { FormProvider, useForm, useFieldArray } from 'react-hook-form';
import { z } from 'zod';

interface Props {
  isShowAdditionDriver: boolean;
  setIsShowAdditionDriver: (value: boolean) => void;
  setDataDrivers: (data: any[]) => void;
}

export const GENDER_OPTIONS = [
  { value: 'male', text: 'Male' },
  { value: 'female', text: 'Female' },
];

export const MARITAL_STATUS_OPTIONS = [
  { value: 'single', text: 'Single' },
  { value: 'married', text: 'Married' },
  { value: 'divorced', text: 'Divorced' },
  { value: 'widowed', text: 'Widowed' },
];

export const DRIVING_EXPERIENCE_OPTIONS = [
  { value: 'Less than 1 year', text: 'Less than 1 year' },
  { value: '1 year', text: '1 year' },
  { value: '2 year', text: '2 years' },
  { value: '3 year', text: '3 years' },
  { value: '4 year', text: '4 years' },
  { value: '5 year', text: '5 years' },
  { value: '6 year', text: '6 years and above' },
];

const createSchema = () =>
  z.object({
    drivers: z
      .array(
        z.object({
          name: z.string().min(1, 'Name is required'),
          nric: z.string().min(1, 'NRIC/FIN is required'),
          birthDate: z
            .date({ required_error: 'Date of birth is required' })
            .refine(
              (date) => date <= new Date(),
              'Date of birth cannot be in the future',
            ),
          gender: z.string().min(1, 'Gender is required'),
          marital: z.string().min(1, 'Marital status is required'),
          Driving: z.string().min(1, 'Driving experience is required'),
        }),
      )
      .min(1, 'At least one driver is required'),
  });

type FormData = z.infer<ReturnType<typeof createSchema>>;

const AdditionDriver = ({
  isShowAdditionDriver,
  setIsShowAdditionDriver,
  setDataDrivers,
}: Props) => {
  const schema = useMemo(() => createSchema(), []);
  const scrollRef = useRef<HTMLDivElement>(null);

  const methods = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { drivers: [{} as any] },
    mode: 'onSubmit',
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = methods;

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'drivers',
  });

  const [isWarningDriver, setIsWarningDriver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleAddDriver = () => {
    if (fields.length < 3) {
      append({} as any);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  };

  const handleRemoveDriver = (index: number) => {
    remove(index);
  };

  const onChangeDriver = (value: string) => {
    if (value === '1 year' || value === 'Less than 1 year') {
      setIsWarningDriver(true);
      setErrorMessage('Premium Increases for old/young/inexperienced drivers.');
    } else {
      setIsWarningDriver(false);
      setErrorMessage('');
    }
  };

  const onSubmit = (data: FormData) => {
    setDataDrivers(data.drivers);
    setIsShowAdditionDriver(false);
  };

  const _renderFormInput = () => {
    return (
      <>
        {fields.map((field, index) => (
          <div
            key={field.id}
            className='flex w-full flex-col gap-3 rounded-lg border border-[#E5E5E5] bg-[#8189940F] px-4 py-2'
          >
            <div className='flex w-full flex-row items-center justify-between'>
              <p className='text-xl font-semibold text-[#080808]'>
                Additional Driver {index + 1}
              </p>
              <div className='mt-3'>
                <DeleteIcon
                  className='cursor-pointer text-red-500'
                  onClick={() => handleRemoveDriver(index)}
                />
              </div>
            </div>

            <InputField
              name={`drivers.${index}.name`}
              label='Name as Per NRIC'
              placeholder='Enter your Name'
            />
            <InputField
              name={`drivers.${index}.nric`}
              label='NRIC'
              placeholder='Enter NRIC/FIN'
            />
            <DatePickerField
              name={`drivers.${index}.birthDate`}
              label='Date of Birth'
            />
            <DropdownField
              name={`drivers.${index}.gender`}
              label='Gender'
              placeholder='Select gender'
              options={GENDER_OPTIONS}
            />
            <DropdownField
              name={`drivers.${index}.marital`}
              label='Marital Status'
              placeholder='Select marital status'
              options={MARITAL_STATUS_OPTIONS}
            />
            <DropdownField
              name={`drivers.${index}.Driving`}
              label='Driving Experience'
              placeholder='Select driving experience'
              options={DRIVING_EXPERIENCE_OPTIONS}
              onChange={onChangeDriver}
            />

            {isWarningDriver && (
              <p className='text-sm text-red-500'>{errorMessage}</p>
            )}
          </div>
        ))}
      </>
    );
  };

  const content = (
    <>
      {_renderFormInput()}
      {fields.length < 3 && (
        <div className='flex flex-row justify-end' ref={scrollRef}>
          <button
            className='flex flex-row items-center gap-2 rounded-md border border-[#00ADEF] px-4 py-2 text-sm font-normal text-[#00ADEF]'
            onClick={handleAddDriver}
            type='button'
          >
            <PlusOutlined />
            <p>Add more driver</p>
          </button>
        </div>
      )}
      <div className='flex w-full flex-row justify-between gap-4 rounded-md bg-[#DCDDDC4F] px-8 py-2 text-base font-bold leading-[21px]'>
        <button
          className='rounded-md border border-[#0096D8] bg-white px-8 py-2 text-[#00ADEF]'
          type='button'
          onClick={() => setIsShowAdditionDriver(false)}
        >
          Cancel
        </button>
        <button
          className='rounded-md bg-[#00ADEF] px-8 py-2 text-white'
          type='submit'
        >
          Save
        </button>
      </div>
    </>
  );

  return (
    <Drawer
      placement='bottom'
      open={isShowAdditionDriver}
      closable={false}
      height='auto'
      className='w-full rounded-t-xl'
      onClose={() => setIsShowAdditionDriver(false)}
    >
      <div
        style={{ maxHeight: '90vh', overflowY: 'auto', overflowX: 'hidden' }}
      >
        <FormProvider {...methods}>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className='flex flex-col gap-8 py-6'
          >
            {content}
          </form>
        </FormProvider>
      </div>
    </Drawer>
  );
};

export default AdditionDriver;
