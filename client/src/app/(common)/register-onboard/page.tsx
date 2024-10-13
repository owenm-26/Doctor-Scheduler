const RegisterOnboard: React.FC = () => {
    return (
        <div className="h-full w-screen">
            <div className="flex flex-col items-center justify-center h-full w-full gap-8">
                <h2 className="text-4xl">Register</h2>
                <button className="border-2 border-solid rounded-md p-4 w-full max-w-md">
                    Are you a patient?
                </button>
                <button className="border-2 border-solid rounded-md p-4 w-full max-w-md">
                    Are you a PT?
                </button>
            </div>
        </div>
    )
}

export default RegisterOnboard;