interface AlertProps {
  setCloseWarning: React.Dispatch<React.SetStateAction<boolean>>;
}

const Alert = ({ setCloseWarning }: AlertProps) => {
  return (
    <>
      <div className="w-96  z-40 absolute right-0 top-40 mt-10 mr-10 hidden lg:block xl:block">
        <div
          role="alert"
          className="bg-yellow-100 dark:bg-yellow-900  border-yellow-500 dark:border-yellow-700 text-yellow-900 dark:text-yellow-100 p-2 rounded-lg flex items-center transition duration-300 ease-in-out hover:bg-yellow-200 dark:hover:bg-yellow-800 transform hover:scale-105"
        >
          <svg
            stroke="currentColor"
            viewBox="0 0 24 24"
            fill="none"
            className="h-5 w-5 flex-shrink-0 mr-2 text-yellow-600 cursor-pointer"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M13 16h-1v-4h1m0-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              strokeWidth={2}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
          <p className="text-xs font-[SatoshiMedium]">
            Warning: Backend & PostgreSQL are on Render. They sleep after 15
            mins of inactivity. If slow, just refresh!
          </p>
          <div>
            <button
              onClick={() => {
                setCloseWarning(false);
              }}
              className="ml-2 text-yellow-900 dark:text-yellow-100 cursor-pointer hover:text-yellow-900 dark:hover:text-yellow-100"
            >
              <span className="sr-only">Close</span>
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                className="h-4 w-4"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default Alert;
