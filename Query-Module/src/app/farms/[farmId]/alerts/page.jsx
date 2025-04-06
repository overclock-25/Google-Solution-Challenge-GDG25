"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertTriangle,
  Wind,
  Bell,
  Home,
  Search,
  Check,
  Trash2,
  MoreVertical,
  Cloud,
  ChevronDown,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useGetFarmAlertsQuery } from "@/lib/redux/api";
import { useGetUserQuery } from "@/lib/redux/authApi";
import SimpleRiceLoader from "@/components/riceLoader";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AlertsPage() {
  const { farmId } = useParams();
  const router = useRouter();

  const { data: user, isLoading, isError: userError } = useGetUserQuery();
  const {
    data: alerts,
    isLoading: alertsLoading,
    isError: alertError,
  } = useGetFarmAlertsQuery(farmId);

  useEffect(() => {
    if (!isLoading && (!user || userError)) {
      router.replace("/auth/login");
    }
  }, [user, isLoading, userError, router]);
  // console.log({alert})
  const [openSheet, setOpenSheet] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedAlert, setSelectedAlert] = useState(null);
  const [activeTab, setActiveTab] = useState("all");

  const [isMobile, setIsMobile] = useState(false);

  useState(() => {
    const checkIfMobile = () => setIsMobile(window.innerWidth < 768);
    checkIfMobile();
    window.addEventListener("resize", checkIfMobile);
    return () => window.removeEventListener("resize", checkIfMobile);
  }, []);

  const formatDate = (seconds) => {
    const date = new Date(seconds * 1000);
    return date.toLocaleString("en-IN", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
    });
  };

  const handleAlertClick = (alert) => {
    setSelectedAlert(alert);
    if (isMobile) {
      setOpenSheet(true);
    } else {
      setOpenDialog(true);
    }
  };

  const getAlertIcon = (event) => {
    if (event.includes("Rainfall")) return <Cloud className="h-6 w-6" />;
    if (event.includes("Wind")) return <Wind className="h-6 w-6" />;
    return <AlertTriangle className="h-6 w-6" />;
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case "Severe":
        return "bg-red-500";
      case "Moderate":
        return "bg-orange-400";
      case "Minor":
        return "bg-red-200";
      default:
        return "bg-red-200";
    }
  };

  if (alertsLoading) {
    return (
      <div className="flex justify-center items-center h-screen w-full">
        <SimpleRiceLoader />
      </div>
    );
  }
  return (
    <div className="flex flex-col h-screen w-full">
      <div className="px-4 pt-2">
        <Tabs
          defaultValue="all"
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <div className="flex justify-between items-center">
            <TabsList className="grid w-32 grid-cols-2">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>
            <button className="text-blue-600 text-sm">Mark all as read</button>
          </div>

          <TabsContent value="all" className="mt-2">
            <div className="space-y-2">
              {alerts?.map((alert, index) => (
                <div
                  className="bg-blue-50 rounded-md p-3 flex justify-between items-start cursor-pointer"
                  onClick={() => handleAlertClick(alerts[index])}
                  key={index}
                >
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="h-6 w-6 text-gray-600" />
                    <div>
                      <div className="font-medium">{alert?.event}</div>
                      <div className="text-sm text-gray-500 overflow-hidden">
                        {alert?.headline}
                      </div>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <button className="p-1">
                        <MoreVertical className="h-5 w-5 text-gray-500" />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Check className="h-4 w-4 mr-2" />
                        <span>Mark as read</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Delete</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              ))}

              {alerts?.length === 0 && <div>No Alerts yet.</div>}
            </div>
          </TabsContent>

          <TabsContent value="unread">
            <div className="mt-2 text-center text-gray-500">
              No unread alerts
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Mobile Bottom Navigation */}
      {/* <div className="mt-auto border-t">
        <div className="flex justify-around p-3">
          <div className="flex flex-col items-center text-gray-500">
            <span className="sr-only">Farms</span>
            <div className="h-6 w-6 flex items-center justify-center">🌾</div>
            <span className="text-xs">Farms</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Search className="h-6 w-6" />
            <span className="text-xs">Query</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Bell className="h-6 w-6" />
            <span className="text-xs">Alert</span>
          </div>
          <div className="flex flex-col items-center text-gray-500">
            <Home className="h-6 w-6" />
            <span className="text-xs">Home</span>
          </div>
        </div>
      </div> */}

      {/* Mobile Sheet */}
      <Sheet open={openSheet} onOpenChange={setOpenSheet}>
        <SheetTitle className="sr-only">Alert</SheetTitle>
        <SheetContent side="bottom" className="h-[85vh] rounded-t-xl px-0">
          <div className="flex justify-center mb-2">
            <ChevronDown className="h-6 w-6 text-gray-400" />
          </div>
          {selectedAlert && (
            <div className="px-4">
              {/* Alert Header */}
              <div
                className={cn(
                  "rounded-lg p-4 mb-4",
                  getSeverityColor(selectedAlert.severity)
                )}
              >
                <div className="flex items-center gap-2">
                  {getAlertIcon(selectedAlert.event)}
                  <div className="font-semibold">{selectedAlert.event}</div>
                </div>
                <div className="text-sm mt-1">
                  {formatDate(selectedAlert.effective._seconds)}
                </div>
              </div>

              {/* Alert Details */}
              <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <div>
                  <p>{selectedAlert.headline}</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm">{selectedAlert.district}</p>
                </div>
                <div>
                  <h3 className="font-medium">Effective Period</h3>
                  <p className="text-sm">
                    {formatDate(selectedAlert.effective._seconds)} to{" "}
                    {formatDate(selectedAlert.expires._seconds)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Instructions</h3>
                  <p className="text-sm">{selectedAlert.instruction}</p>
                </div>
              </div>

              {/* Insights Section */}
              {/* <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900">Insights</h3>
                <p className="text-sm text-purple-800 mt-1">
                  This area could contain AI-powered recommendations based on
                  the alert.
                </p>
              </div> */}
            </div>
          )}
        </SheetContent>
      </Sheet>

      {/* Desktop Dialog */}
      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Alert Details</DialogTitle>
          </DialogHeader>

          {selectedAlert && (
            <div>
              {/* Alert Header */}
              <div
                className={cn(
                  "rounded-lg p-4 mb-4",
                  getSeverityColor(selectedAlert.severity)
                )}
              >
                <div className="flex items-center gap-2">
                  {getAlertIcon(selectedAlert.event)}
                  <div className="font-semibold">{selectedAlert.event}</div>
                </div>
                <div className="text-sm mt-1">
                  {formatDate(selectedAlert.effective._seconds)}
                </div>
              </div>

              {/* Alert Details */}
              <div className="space-y-4">
                <div>
                  <p>{selectedAlert.headline}</p>
                </div>
                <div>
                  <h3 className="font-medium">Location</h3>
                  <p className="text-sm">{selectedAlert.district}</p>
                </div>
                <div>
                  <h3 className="font-medium">Effective Period</h3>
                  <p className="text-sm">
                    {formatDate(selectedAlert.effective._seconds)} to{" "}
                    {formatDate(selectedAlert.expires._seconds)}
                  </p>
                </div>
                <div>
                  <h3 className="font-medium">Instructions</h3>
                  <p className="text-sm">{selectedAlert.instruction}</p>
                </div>
              </div>

              {/* Insights Section */}
              <div className="mt-6 bg-purple-50 p-4 rounded-lg">
                <h3 className="font-medium text-purple-900">Insights</h3>
                <p className="text-sm text-purple-800 mt-1">
                  This area could contain AI-powered recommendations based on
                  the alert.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
