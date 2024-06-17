import { useSelector } from 'react-redux';

import { Outlet, Navigate, useLocation } from 'react-router-dom';

import { getUserInfo } from '../selectors';

const ProtectRoute = ({ forAdmin = false }) => {
  const { pathname } = useLocation();
  const userInfo = useSelector(getUserInfo);

  console.log(userInfo);
  console.log('protect route');

  return userInfo ? (
    forAdmin ? (
      userInfo.isAdmin ? (
        <Outlet />
      ) : (
        <Navigate to={`/login?redirect=${pathname}`} replace />
      )
    ) : (
      <Outlet />
    )
  ) : (
    <Navigate to={`/login?redirect=${pathname}`} replace />
  );
};

export default ProtectRoute;
