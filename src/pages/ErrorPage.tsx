import { PageNotFoundArt } from "../assets/svg/PageNotFoundArt";
import { PageNotFoundBtn } from "../assets/svg/PageNotFoundBtn";

const ErrorMessage = () => {
  return (
    <>
      <div className="h-screen w-full flex">
        <div className="flex flex-col justify-center mx-auto">
          <div className="flex-col items-center justify-center">
            <PageNotFoundArt />
          </div>

          <div className=" w-1/2 md:2/3 lg:w-3/4 flex flex-col items-center justify-center">
            <p className="text-3xl md:text-4xl lg:text-5xl text-gray-800 mt-12 dark:text-white">
              Page Not Found
            </p>
            <p className="md:text-lg lg:text-xl text-gray-600 mt-8 dark:text-gray-400">
              Sorry, the page you are looking for could not be found.
            </p>
            <a
              href="/"
              className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-gray-100 px-4 py-2 mt-12 rounded transition duration-150"
              title="Return Home"
            >
              <PageNotFoundBtn />
              <span>Return Home</span>
            </a>
          </div>
        </div>
      </div>
    </>
  );
};

export default ErrorMessage;
