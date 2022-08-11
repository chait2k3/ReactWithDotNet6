import { FC, PropsWithChildren } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { toast } from "react-toastify";
import { useAppSelector } from "../store/configure-store";

interface PrivateRouteProps extends PropsWithChildren<any> {
  roles?: string[];
}

const PrivateRoute: FC<PrivateRouteProps> = ({ children, roles}) => {
  const { user } = useAppSelector(state => state.account);
  const location = useLocation();
  
  if (!user) {
    return <Navigate to="/login" state={{from: {pathname: location.pathname}}}/>;
  }

  if (roles && !roles?.some(r => user.roles?.includes(r))) {
    toast.error('Not authorised to access this area');
    return <Navigate to="/catalog" />;
  }

  return (children);
}

export default PrivateRoute;