import React from 'react';

const LoginNavbar: React.FC = () => {
  return (
    <nav 
      className="p-4 sticky top-0 flex justify-between items-center z-[1000]"
      style={{ backgroundColor: "#001529" }}
    >
      <div className="flex justify-between w-full md:w-auto">
        <div className="logo">
          <a className="text-[20px] font-medium text-white" href="#home">
            <h2 className="text-white">EZPZ</h2>
          </a>
        </div>
      </div>
      <div>
        <a
          className="text-[20px] font-medium text-white no-wrap"
          href="#signup"
          style={{ whiteSpace: 'nowrap' }} // Prevent text wrapping
        >
          Sign Up
        </a>
      </div>
    </nav>
  );
};

export default LoginNavbar;