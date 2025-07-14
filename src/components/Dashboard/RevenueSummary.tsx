import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { DollarSign, Users, Activity, ArrowUp, ArrowDown } from 'lucide-react';

export default function RevenueSummary() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {/* Total Revenue */}
      <Card className="bg-gray-200 text-white shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-orange-500">
            Total Revenue
          </CardTitle>
          <DollarSign className="w-6 h-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold text-orange-600">$50,000</h2>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-600" />
            <span className="ml-1 text-green-600 font-semibold text-sm">
              +8.5% this month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* New Users */}
      <Card className="bg-gray-200 text-white shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-orange-600">
            New Users
          </CardTitle>
          <Users className="w-6 h-6 text-green-600 " />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold text-orange-600">1,200</h2>
          <div className="flex items-center mt-2">
            <ArrowUp className="w-4 h-4 text-green-600" />
            <span className="ml-1 text-green-600 font-semibold text-sm">
              +12.3% this month
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Active Users */}
      <Card className="bg-gray-200 text-white shadow-lg rounded-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-lg font-semibold text-orange-600">
            Active Users
          </CardTitle>
          <Activity className="w-6 h-6 text-green-600" />
        </CardHeader>
        <CardContent>
          <h2 className="text-3xl font-bold text-orange-600">3,500</h2>
          <div className="flex items-center mt-2">
            <ArrowDown className="w-4 h-4 text-red-600" />
            <span className="ml-1 text-red-600 font-semibold text-sm">
              -2.1% this month
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
