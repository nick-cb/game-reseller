import React, { PropsWithChildren } from 'react';
import { BrowseSideBar } from '@/components/pages/browse/BrowseSideBar';

const layout = async ({ children }: PropsWithChildren) => {
  return (
    <div className="grid grid-cols-4 gap-8">
      <div className="col-start-1 col-end-5 text-white_primary md:col-end-4">{children}</div>
      <BrowseSideBar />
    </div>
  );
};

export default layout;
