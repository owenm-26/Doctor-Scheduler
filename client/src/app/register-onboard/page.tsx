const RegisterOnboard: React.FC = () => {
    return (
        <div className="h-screen w-screen">
            <div className="flex flex-col items-center justify-center h-full w-full gap-8">
                <button className="border border-solid rounded-md p-4">
                    Register Patient
                </button>
                <button className="border border-solid rounded-md p-4">
                    Register PT
                </button>
            </div>
        </div>
    )
}

export default RegisterOnboard