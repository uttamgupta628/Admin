import { Loader2 } from 'lucide-react';
import Logo from '@/assets/logos/MainLogo.png';

const LoadingSpinner = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-white">
      <img
        src={Logo}
        alt="Loading..."
        className="h-20 w-20 animate-bounce transition-all duration-500 ease-in-out"
      />

      <Loader2 className="animate-spin h-10 w-10 text-orange-600 mt-4" />

      <p className="mt-4 text-gray-600 text-sm font-medium animate-pulse">
        Loading, please wait...
      </p>
    </div>
  );
};

export default LoadingSpinner;
