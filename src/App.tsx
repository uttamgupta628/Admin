import { Suspense } from 'react';
import { RouterProvider } from 'react-router-dom';
import router from './routes';
import LoadingSpinner from './components/LoadingSpinner';
import { Toaster } from 'sonner';

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <RouterProvider router={router} />
      <Toaster />
    </Suspense>
  );
}

export default App;
