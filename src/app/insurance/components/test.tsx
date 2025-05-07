import DeleteIcon from '@/components/icons/DeleteIcon';
import { useDeviceDetection } from '@/hook/useDeviceDetection';
import { PlusOutlined } from '@ant-design/icons';
import { DatePicker, Drawer, Form, Input, Modal, Select } from 'antd';
import { useRef, useState } from 'react';

interface Props {
  isShowAdditionDriver: boolean;
  setIsShowAdditionDriver: (value: boolean) => void;
  setDataDrivers: (data: any[]) => void;
}

const SELECT_OPTIONS = {
  gender: [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
  ],
  maritalStatus: [
    { value: 'single', label: 'Single' },
    { value: 'married', label: 'Married' },
    { value: 'divorced', label: 'Divorced' },
    { value: 'widowed', label: 'Widowed' },
  ],
  driving: [
    { value: 'Less than 1 year', label: 'Less than 1 year' },
    { value: '1 year', label: '1 year' },
    { value: '2 year', label: '2 years' },
    { value: '3 year', label: '3 years' },
    { value: '4 year', label: '4 years' },
    { value: '5 year', label: '5 years' },
    { value: '6 year', label: '6 years and above' },
  ],
};

const AdditionDriver = (props: Props) => {
  const { isShowAdditionDriver, setIsShowAdditionDriver, setDataDrivers } =
    props;

  const isMobile = useDeviceDetection();
  const ref = useRef<(HTMLDivElement | null)[]>([]);
  const [drivers, setDrivers] = useState([1]);
  const [isWarningDriver, setIsWarningDriver] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [form] = Form.useForm();

  const handleAddDriver = () => {
    if (drivers.length < 3) {
      const newDriverIndex = drivers.length;
      const newDrivers = [newDriverIndex + 1, ...drivers];
      setDrivers(newDrivers);

      setTimeout(() => {
        const lastDriverEl = ref.current[newDrivers.length - 1];
        if (lastDriverEl) {
          lastDriverEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    }
  };

  const handleRemoveDriver = (index: number) => {
    const updatedDrivers = drivers.filter((_, i) => i !== index);
    setDrivers(updatedDrivers);
    const currentDrivers = form.getFieldValue('drivers') || [];
    form.setFieldsValue({
      drivers: currentDrivers.filter((_: any, i: number) => i !== index),
    });
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

  const onFinish = (values: any) => {
    console.log('value', values);
    setDataDrivers(values.drivers);
    setIsShowAdditionDriver(false);
  };

  const renderInput = (
    label: string,
    maxLength: number,
    name: (string | number)[],
  ) => (
    <div className='flex flex-col gap-2'>
      <p className='text-base font-semibold text-[#1E1E1E]'>{label}</p>
      <Form.Item
        name={name}
        rules={[
          { required: true, message: `${label} is required` },
          { min: 3, message: `${label} must be at least 3 characters` },
          {
            max: maxLength,
            message: `${label} cannot exceed ${maxLength} characters`,
          },
        ]}
      >
        <Input
          className='h-[39px] w-full rounded-lg border border-[#81899466] px-4 text-sm font-normal text-[#1E1E1E]'
          maxLength={maxLength}
        />
      </Form.Item>
    </div>
  );

  const renderInputDate = (label: string, name: (string | number)[]) => (
    <div className='flex flex-col gap-2'>
      <p className='text-base font-semibold text-[#1E1E1E]'>{label}</p>
      <Form.Item
        name={name}
        rules={[{ required: true, message: `${label} is required` }]}
      >
        <DatePicker
          className='h-[39px] w-full rounded-lg border border-[#81899466] text-sm font-normal text-[#1E1E1E]'
          format='DD/MM/YYYY'
        />
      </Form.Item>
    </div>
  );

  const renderSelect = (
    label: string,
    name: (string | number)[],
    options: { value: string; label: string }[],
    onChange?: (value: string) => void,
    status?: boolean,
    errorMessage?: string,
  ) => (
    <div className='flex flex-col gap-2'>
      <p className='text-base font-semibold text-[#1E1E1E]'>{label}</p>
      <Form.Item
        name={name}
        rules={[{ required: true, message: `${label} is required` }]}
        validateStatus={status ? 'error' : undefined}
        help={errorMessage}
      >
        <Select
          className={`h-[39px] w-full rounded-lg border ${status ? 'border-red' : 'border-[#81899466]'} text-sm font-normal text-[#1E1E1E]`}
          options={options}
          onChange={onChange}
        />
      </Form.Item>
    </div>
  );

  const renderDriver = (index: number) => (
    <div
      key={index}
      className='flex w-full flex-col gap-4 rounded-lg border border-[#E5E5E5] bg-[#8189940F] px-4 py-2'
      ref={(el) => {
        ref.current[index] = el;
      }}
    >
      <div className='flex w-full flex-row items-center justify-between'>
        <p className='text-xl font-semibold leading-8 text-[#080808]'>
          Additional Driver {index + 1}
        </p>
        <div className='mt-3'>
          <DeleteIcon
            className='cursor-pointer text-red-500'
            onClick={() => handleRemoveDriver(index)}
          />
        </div>
      </div>
      {renderInput('Name as Per NRIC', 60, ['drivers', index, 'driverName'])}
      {renderInput('NRIC', 9, ['drivers', index, 'nric'])}
      {renderInputDate('Date of Birth', ['drivers', index, 'birthDate'])}
      {renderSelect(
        'Gender',
        ['drivers', index, 'gender'],
        SELECT_OPTIONS.gender,
      )}
      {renderSelect(
        'Marital Status',
        ['drivers', index, 'marital'],
        SELECT_OPTIONS.maritalStatus,
      )}
      {renderSelect(
        'Driving Experience',
        ['drivers', index, 'Driving'],
        SELECT_OPTIONS.driving,
        onChangeDriver,
        isWarningDriver,
        errorMessage,
      )}
    </div>
  );

  const content = (
    <div className='flex flex-col gap-8'>
      {drivers.map((_, index) => renderDriver(index))}
      {drivers.length < 3 && (
        <div className='flex flex-row justify-end'>
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
    </div>
  );

  return isMobile.isMobile ? (
    <Drawer
      placement='bottom'
      open={isShowAdditionDriver}
      closable={false}
      height='auto'
      className='w-full rounded-t-xl'
      onClose={() => setIsShowAdditionDriver(false)}
    >
      <div style={{ maxHeight: '90vh', overflowY: 'auto' }}>
        <Form form={form} onFinish={onFinish} initialValues={{ drivers: [] }}>
          {content}
        </Form>
      </div>
    </Drawer>
  ) : (
    <Modal
      open={isShowAdditionDriver}
      closable={false}
      onCancel={() => setIsShowAdditionDriver(false)}
      maskClosable={false}
      keyboard={false}
      footer={null}
      centered
      width={600}
    >
      <div style={{ maxHeight: 'calc(100vh - 60px)', overflowY: 'auto' }}>
        <Form form={form} onFinish={onFinish}>
          {content}
        </Form>
      </div>
    </Modal>
  );
};

export default AdditionDriver;
