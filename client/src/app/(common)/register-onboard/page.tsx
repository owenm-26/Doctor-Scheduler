import Link from 'next/link';

const RegisterOnboard: React.FC = () => {
    return (
      <div className="h-full w-screen">
        <div className="flex flex-col items-center justify-center h-full w-full gap-8">
          <h2 className="text-4xl">Register</h2>
          <div className="w-full max-w-md" style={{ color: "white" }}>
            <Link href="/register-patient">
              <button className="border-2 border-solid rounded-md p-4 w-full bg-white text-black">
                Are you a patient?
              </button>
            </Link>
          </div>
          <div className="w-full max-w-md" style={{ color: "white" }}>
            <Link href="/register-pt">
              <button className="border-2 border-solid rounded-md p-4 w-full bg-white text-black">
                Are you a PT?
              </button>
            </Link>
          </div>
        </div>
      </div>
    );
};

export default RegisterOnboard;
