import Link from "next/link";
import {
  Home as HomeIcon,
  FileText as QueryIcon,
  Bell as AlertIcon,
  MapPin as FarmsIcon,
} from "lucide-react";

export default async function FarmLayout({ children, params }) {
  const { farmId } = await params;
  return (
    <div className="flex h-screen">
      {/* Mobile Bottom Navigation (hidden on desktop) */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t z-50 md:hidden">
        <div className="flex justify-around py-2">
          <Link href={`/farms/${farmId}`}>
            <button className="flex flex-col items-center">
              <FarmsIcon className="text-gray-600" />
              <span className="text-xs">Farms</span>
            </button>
          </Link>
          <Link href={`/farms/${farmId}/query`}>
            <button className="flex flex-col items-center">
              <QueryIcon className="text-gray-600" />
              <span className="text-xs">Query</span>
            </button>
          </Link>
          <Link href={`/farms/${farmId}/alerts`}>
            <button className="flex flex-col items-center">
              <AlertIcon className="text-gray-600" />
              <span className="text-xs">Alert</span>
            </button>
          </Link>
          <Link href={`/farms`}>
            <button className="flex flex-col items-center">
              <HomeIcon className="text-gray-600" />
              <span className="text-xs">Home</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Sidebar for Desktop (hidden on mobile) */}
      <div className="hidden  md:flex flex-col w-64 bg-gray-100 p-4 border-r">
        <div className="flex items-center mb-8">
          <h2 className="text-xl font-bold">Farm Management</h2>
        </div>
        <nav className="space-y-2">
          <Link href={`/farms/${farmId}`}>
            <button className="flex items-center w-full p-2 hover:bg-gray-200 rounded">
              <FarmsIcon className="mr-3" /> Farms
            </button>
          </Link>
          <Link href={`/farms/${farmId}/query`}>
            <button className="flex items-center w-full p-2 hover:bg-gray-200 rounded">
              <QueryIcon className="mr-3" /> Query
            </button>
          </Link>
          <Link href={`/farms/${farmId}/alerts`}>
            <button className="flex items-center w-full p-2 hover:bg-gray-200 rounded">
              <AlertIcon className="mr-3" /> Alert
            </button>
          </Link>
          <Link href={`/farms`}>
            <button className="flex items-center w-full p-2 hover:bg-gray-200 rounded">
              <HomeIcon className="mr-3" /> Home
            </button>
          </Link>
        </nav>
      </div>
      {children}
    </div>
  );
}
