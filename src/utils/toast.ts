import { toast, ToastPosition } from 'react-toastify';

const toastConfig = {
  position: 'top-right' as ToastPosition,
  autoClose: 5000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  style: {
    textAlign: 'center' as const,
    background: '#1B2B44', // oxford-blue
    color: '#FFF1D6', // papaya-whip
    minWidth: '300px',
    maxWidth: '400px',
  },
};

export const showToast = {
  success: (message: string) => {
    toast.success(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#4A7B6F', // form-button-secondary color (green)
      },
    });
  },
  error: (message: string) => {
    toast.error(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#B85C6A', // form-button-danger color
      },
    });
  },
  info: (message: string) => {
    toast.info(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#4B6B8B', // form-button-primary color
      },
    });
  },
  warning: (message: string) => {
    toast.warning(message, {
      ...toastConfig,
      style: {
        ...toastConfig.style,
        background: '#D97706', // warning-600 color
      },
    });
  },
};
