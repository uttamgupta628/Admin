import ParkingLotList from '@/components/garage/parkinglot';
import { lazy } from 'react';
import { createBrowserRouter } from 'react-router-dom';

// Lazy load components
const Home = lazy(() => import('../pages/(dashboard)/Home'));
const Login = lazy(() => import('../pages/Login'));
const LaundryOwners = lazy(() => import('@/pages/(Laundry)/LaundryOwners'));
const VehiclesOwners = lazy(() => import('@/pages/(Vehicles)/VehiclesOwners'));
const AllMerchantsTable = lazy(() => import('@/components/Dashboard/TopMerchantsTable'));
const AllUsersTable = lazy(() => import('@/components/Dashboard/TopUsersTable'));
const MerchantDetailsPage = lazy(() => import('@/components/Dashboard/MerchantDetailsPage'));
const AllgaragesTable = lazy(() => import('@/components/garage/garageList'));
const AllDryCleaner= lazy(() => import('@/components/Laundry/DryCleaner'));
const ResidenceParking= lazy(() => import('@/components/garage/ResidenceList'));
// Define routes
const router = createBrowserRouter([
  {
    path: '/',
    element: <Login />,
  },
  {
    path: '/home',
    element: <Home />,
  },
  {
    path: '/laundry-owners',
    element: <LaundryOwners />,
  },
  {
    path: '/vehicle-owners',
    element: <VehiclesOwners />,
  },{
    path: '/garage-list',
    element: <AllgaragesTable />,
  },
  {
    path: '/users',
    element: <AllUsersTable />,
  },
  {
    path: '/merchants',
    element: <AllMerchantsTable />,
  },{
    path:'/dry-cleaner-owners',
    element: <AllDryCleaner/>,
  },{
    path: '/parking-lot',
    element: <ParkingLotList />,
  },
  {
    path: '/admin/merchant/:id',
    element: <MerchantDetailsPage />,
  },{
    path: '/residant-parking',
    element: <ResidenceParking />,
  }
]);

export default router;
