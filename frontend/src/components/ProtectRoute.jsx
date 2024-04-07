import { useSelector } from 'react-redux';

import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { getUserInfo } from '../selectors';

const ProtectRoute = () => {
  const { pathname } = useLocation();
  const userInfo = useSelector(getUserInfo);

  return userInfo ? (
    <Outlet />
  ) : (
    <Navigate to={`/login?redirect=${pathname}`} replace />
  );
};

export default ProtectRoute;
