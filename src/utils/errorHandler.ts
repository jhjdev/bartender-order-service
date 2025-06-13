import { toast } from 'react-toastify';
import { AxiosError } from 'axios';

interface ApiErrorResponse {
  status: number;
  message: string;
  code?: string;
  details?: unknown;
}

export const handleApiError = (error: AxiosError<ApiErrorResponse>) => {
  if (error.response) {
    const { status, data } = error.response;
    const errorMessage = data?.message || 'An error occurred';

    switch (status) {
      case 400:
        toast.error(errorMessage, {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 401:
        toast.error('Please log in to continue', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 403:
        toast.error('You do not have permission to perform this action', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 404:
        toast.error('The requested resource was not found', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 409:
        toast.error(
          'This action conflicts with the current state of the resource',
          {
            position: 'top-right',
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: 'colored',
          }
        );
        break;

      case 422:
        toast.error('The provided data is invalid', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 429:
        toast.error('Too many requests. Please try again later', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      case 503:
        toast.error('Service temporarily unavailable. Please try again later', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
        break;

      default:
        toast.error('An unexpected error occurred', {
          position: 'top-right',
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: 'colored',
        });
    }
  } else if (error.request) {
    // Network error
    toast.error('Network error. Please check your connection', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  } else {
    // Other errors
    toast.error('An unexpected error occurred', {
      position: 'top-right',
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: 'colored',
    });
  }
};

export const showSuccessToast = (message: string) => {
  toast.success(message, {
    position: 'top-right',
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    theme: 'colored',
  });
};
