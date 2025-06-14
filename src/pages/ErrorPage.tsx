import { PageNotFoundArt } from '../assets/svg/PageNotFoundArt';
import { Link } from 'react-router-dom';

interface ErrorPageProps {
  title?: string;
  message?: string;
}

export const ErrorPage = ({
  title = 'Page not found',
  message = "Sorry, we couldn't find the page you're looking for.",
}: ErrorPageProps) => {
  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-3xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="text-center">
          <h1 className="h1">{title}</h1>
          <p className="body mt-4">{message}</p>
        </div>

        <div className="mt-6 flex items-center justify-center">
          <div className="w-full max-w-[600px] mb-8">
            <PageNotFoundArt />
          </div>
        </div>

        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => window.history.back()}
            className="inline-flex items-center justify-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors min-w-[200px]"
            title="Go to previous page"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            <span className="body">Go to Previous Page</span>
          </button>
          <Link
            to="/"
            className="inline-flex items-center justify-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors min-w-[200px]"
            title="Go to home page"
          >
            <svg
              className="w-5 h-5 mr-2"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span className="body">Go to Home Page</span>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ErrorPage;
