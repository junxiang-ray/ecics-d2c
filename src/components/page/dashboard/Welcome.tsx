const Welcome = (): React.ReactNode => {
  // todo: Impl the logic get user info after implimented the login screen

  return (
    <div className='mb-12'>
      <p className='font-heading mb-3 text-3xl font-bold text-gray-900'>
        Welcome back, <span>John</span>
      </p>
      <p className='font-body text-lg text-gray-600'>
        Manage your policies and stay protected
      </p>
    </div>
  );
};
export default Welcome;
