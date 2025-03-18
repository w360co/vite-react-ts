import React from 'react';
import {Outlet} from "react-router-dom";


export const AppLayout: React.FC = () => {
  return (
    <div className={'flex flex-col min-h-screen'}>
        <Outlet />
    </div>
  );
};