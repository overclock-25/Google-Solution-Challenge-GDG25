// components/FarmForm.js
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import {
  Select,
  SelectItem,
  SelectGroup,
  SelectTrigger,
  SelectContent,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useAddFarmMutation } from "@/lib/redux/api";
import { Loader2 } from "lucide-react";

import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown } from "lucide-react";
import { Label } from "@/components/ui/label";

import districtData from "@/lib/data/state_districts_codes.json";
export default function FarmForm({ onClose }) {
  const [location, setLocation] = useState({});
  const [farmName, setFarmName] = useState("");
  const [waterSource, setWaterSource] = useState("");
  const [notification, setNotification] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedState, setSelectedState] = useState("West Bengal");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [districtCode, setDistrictCode] = useState(null);
  const [open, setOpen] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  

  const [addFarm, { isLoading: isMutationLoading, error, isSuccess }] =
    useAddFarmMutation();

  const fetchLocation = () => {
    setIsLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            longitude: position.coords.longitude,
            latitude: position.coords.latitude,
          });
          setIsLoading(false);
          setLocationError(false);
        },
        () => {
          setIsLoading(false);
          setLocationError(true);
        }
      );
    } else {
      setIsLoading(false);
      setLocationError(true);
    }
  };

  const handleLocationChange = (selection) => {
    console.log("Selected:", selection);
    
  };

  const requestLocation = () => {
    setIsLoading(true);

    if (!navigator.geolocation) {
      setLocationError(true);
      setIsLoading(false);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocation(
          `Lat: ${position.coords.latitude}, Lng: ${position.coords.longitude}`
        );
        setLocationError(false);
        setIsLoading(false);
      },
      (error) => {
        console.log("Geolocation error:", error);
        setLocationError(true);
        setIsLoading(false);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );
  };

  useEffect(() => {
    fetchLocation();
  }, []);

  const validateForm = () => {
    const errors = {};
    
    if (!selectedDistrict) {
      errors.district = "Please select a district";
    }
    
    if (!waterSource) {
      errors.waterSource = "Please select a water source";
    }
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      return;
    }
    
    if (!location) {
      alert("Location is required. Please enable GPS.");
      return;
    }

    try {
      const response = await addFarm({
        name: farmName,
        location,
        waterSource,
        notification,
        state: selectedState,
        district: selectedDistrict,
        districtCode
      }).unwrap();

      // console.log({ response });
      onClose();
    } catch (error) {
      console.log("Error:", error);
      alert("Submission failed. Please try again.");
    }
  };

  const districts = Object.keys(districtData[selectedState] || {});
  
  const handleDistrictSelect = (district) => {
    setSelectedDistrict(district);
    const code = districtData[selectedState][district];
    setDistrictCode(code);
    setOpen(false);

    if (formErrors.district) {
      setFormErrors({...formErrors, district: null});
    }

    handleLocationChange({
      state: selectedState,
      district: district,
      districtCode: code,
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-4">
      <DialogTitle>Add a New Farm</DialogTitle>
      <Input
        placeholder="Farm Name"
        value={farmName}
        onChange={(e) => setFarmName(e.target.value)}
        required
      />

      <div className="flex items-center gap-2">
        <Input
          placeholder="Farm Location"
          value={`Lat: ${location.latitude}, Lng: ${location.longitude}`}
          readOnly
          className="bg-gray-100 flex-1"
        />
        {isLoading && <Loader2 className="animate-spin" size={20} />}
      </div>

      <div className="space-y-2 flex items-center gap-3">
        <Label htmlFor="state">State</Label>
        <Select value={selectedState} disabled name="state" id="state">
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select a state" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {Object.keys(districtData).map((state) => (
                <SelectItem key={state} value={state}>
                  {state}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
        <input type="hidden" name="stateValue" value={selectedState} />
      </div>

      <div className="space-y-2">
        <div className="flex items-center gap-3">
          <Label htmlFor="district">District</Label>
          <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
              <Button
                id="district"
                variant="outline"
                role="combobox"
                aria-expanded={open}
                className={`w-full justify-between ${formErrors.district ? 'border-red-500' : ''}`}
                type="button"
              >
                {selectedDistrict ? selectedDistrict : "Select district..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Search district..." />
                <CommandEmpty>No district found.</CommandEmpty>
                <CommandGroup className="max-h-64 overflow-auto">
                  {districts.map((district) => (
                    <CommandItem
                      key={district}
                      value={district}
                      onSelect={() => handleDistrictSelect(district)}
                    >
                      <div className="mr-2 h-4 w-4 flex items-center justify-center">
                        {selectedDistrict === district && (
                          <Check className="h-4 w-4" />
                        )}
                      </div>
                      {district}
                    </CommandItem>
                  ))}
                </CommandGroup>
              </Command>
            </PopoverContent>
          </Popover>
        </div>
        {formErrors.district && (
          <p className="text-red-500 text-sm mt-1">{formErrors.district}</p>
        )}
      </div>

      {locationError && (
        <Dialog open={locationError} onOpenChange={setLocationError}>
          <DialogContent className="p-6">
            <DialogTitle>Location Access Denied</DialogTitle>
            <p className="text-gray-600">Please enable GPS to continue.</p>
            <Button onClick={requestLocation} className="mt-4 w-full">
              {isLoading ? "Trying..." : "Try Again"}
            </Button>
          </DialogContent>
        </Dialog>
      )}

      <div className="space-y-2">
        <Select 
          onValueChange={(val) => {
            setWaterSource(Number(val));
            if (formErrors.waterSource) {
              setFormErrors({...formErrors, waterSource: null});
            }
          }}
        >
          <SelectTrigger className={formErrors.waterSource ? 'border-red-500' : ''}>
            <SelectValue placeholder="Select Major Water Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={"1"}>River</SelectItem>
            <SelectItem value={"2"}>Underground</SelectItem>
            <SelectItem value={"3"}>Rain Water/Others</SelectItem>
          </SelectContent>
        </Select>
        {formErrors.waterSource && (
          <p className="text-red-500 text-sm">{formErrors.waterSource}</p>
        )}
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="alert"
          value={notification}
          onCheckedChange={() => setNotification(!notification)}
        />
        <label
          htmlFor="alert"
          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
        >
          Get weather alerts
        </label>
      </div>
      <Button
        type="submit"
        className="w-full"
        disabled={!location || isMutationLoading}
      >
        {isMutationLoading ? "Submitting..." : "Submit"}
      </Button>

    </form>
  );
}