import NavbarWrapper from '@/components/Wrapper/NavbarWrapper';
import UserGrowthChart from '@/components/Dashboard/UserGrowthChart';
import GenderRatioChart from '@/components/Dashboard/GenderRatioChart';
import ServiceUsageChart from '@/components/Dashboard/ServiceUsageChart';
import TopMerchantsTable from '@/components/Dashboard/TopMerchantsTable';
import TopUsersTable from '@/components/Dashboard/TopUsersTable';
import RecentTransactions from '@/components/Dashboard/RecentTransactions';
import RevenueSummary from '@/components/Dashboard/RevenueSummary';
import PopularServicesChart from '@/components/Dashboard/PopularServicesChart';
import LoginActivityChart from '@/components/Dashboard/LoginActivityChart';
// import SubscriptionPlansChart from '@/components/Dashboard/SubscriptionPlansChart';
// import AppRatingsFeedback from '@/components/Dashboard/AppRatingsFeedback';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("No admin token found!");
        return;
      }

      const res = await fetch(`${import.meta.env.VITE_API_URL}/api/users/admin/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
        },
      });

      const data = await res.json();
      if (res.ok) {
        alert(data.message);
        localStorage.removeItem("token");
        navigate("/");
      } else {
        alert(data.message || "Logout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    }
  };

  return (
    <NavbarWrapper>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Dashboard</h1>
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
          >
            Logout
          </button>
        </div>

        {/* Revenue Summary Cards */}
        <RevenueSummary />

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <UserGrowthChart />
          <GenderRatioChart />
          <ServiceUsageChart />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PopularServicesChart />
          <LoginActivityChart />
        </div>

        <div className="w-full">
          <TopMerchantsTable />
        </div>
        <div className="w-full">
          <TopUsersTable />
        </div>
        <div className="w-full">
          <RecentTransactions />
        </div>

        {/* <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SubscriptionPlansChart />
          <AppRatingsFeedback />
        </div> */}
      </div>
    </NavbarWrapper>
  );
}

export default Home;
