"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useUpdateNotificationMutation } from "@/lib/redux/api";

export default function EnableNotificationModal({ open, onClose, farmId }) {
  const [updateNotification, { isLoading }] = useUpdateNotificationMutation();

  const handleEnableNotifications = async (enabled) => {
    await updateNotification({ enabled, farmId });
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Enable Notifications</DialogTitle>
          <DialogDescription>
            Would you like to enable notifications?
          </DialogDescription>
        </DialogHeader>
        <div className="flex justify-end gap-3">
          <Button
            variant="outline-success"
            onClick={() => handleEnableNotifications(false)}
            disabled={isLoading}
          >
            No
          </Button>
          <Button
            variant="success"
            onClick={() => handleEnableNotifications(true)}
            disabled={isLoading}
          >
            Yes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
