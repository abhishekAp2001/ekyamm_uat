"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import Image from "next/image";
import { addDays, format, isSameMonth, parseISO, set, subDays } from "date-fns";

import { ChevronLeft, ChevronUpIcon, Loader, Loader2, X, ChevronRight, ChevronDown, Check } from "lucide-react";
import {
  Drawer,
  DrawerTrigger,
  DrawerContent,
  DrawerClose,
  DrawerTitle,
  DrawerFooter,
  DrawerHeader,
} from "@/components/ui/drawer";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  patientSessionData as getPatientSessionData,
  selectedCounsellorData as getSelectedCounsellorData,
  patientSessionToken as getPatientSessionToken,
  timeSlots,
} from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import axios from "axios";
import { Baseurl } from "@/lib/constants";
import SessionSection from "@/components/patient/SessionSection";

import { showErrorToast, showSuccessToast } from "@/lib/toast";

const Schedule_Session = () => {
  const router = useRouter();
  const patientSessionData = getPatientSessionData();
  const selectedCounsellorData = getSelectedCounsellorData();
  const [loading, setLoading] = useState(false);
  const [isFetchDaysNavigating, setIsFetchDaysNavigating] = useState(false);
  const [selectedFromTime, setSelectedFromTime] = useState(null);
  const [selectedToTime, setSelectedToTime] = useState(null);
  const [selectedDate, setSelectedDate] = useState(null);
  const [calenderLoading, setCalenderLoading] = useState(false);
  const [timeSlogLoading, setTimeSlogLoading] = useState(false);
  const [sessionDetail, setSessionDetail] = useState("");
  const [calenderOpen, setCalenderOpen] = useState(false);
  const [isRecurring, setIsRecurring] = useState(false);
  const [patientSessionToken, setPatientSessionToken] = useState(
    getPatientSessionToken()
  );
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [successDrawerOpen, setSuccessDrawerOpen] = useState(false);
  const [openConfirmed, setOpenConfirmed] = useState(true);
  const [openUnconfirmed, setOpenUnconfirmed] = useState(true);
  const [createdSessions, setCreatedSessions] = useState([]);
  const [unavailableSessions, setUnavailableSessions] = useState([]);
  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [availableDates, setAvailableDates] = useState({});
  const [availableSlots, setAvailableSlots] = useState({});
  console.log("times",availableSlots)
  const isDateAvailable = (date) => {
    const key = format(date, "yyyy-MM-dd");
    return availableDates[key] === true;
  };

  const goToPreviousDate = async () => {
    setSelectedDate((prevDate) => subDays(prevDate, 1));
  };

  const goToNextDate = async () => {
    setSelectedDate((prevDate) => addDays(prevDate, 1));
  };

  const getYearMonthString = (date, type = "month") => {
    if (type == "month") {
      return `${String(date.getMonth() + 1).padStart(2, "0")}`;
    } else {
      return `${date.getFullYear()}`;
    }
  };
  const fetchAvailability = async (monthDate) => {
    if (isFetchDaysNavigating) return;
    setIsFetchDaysNavigating(true);
    const month = getYearMonthString(monthDate, "month");
    const year = getYearMonthString(monthDate, "year");

    try {
      let bodyData = {
        practitionerId:
           selectedCounsellorData?.loginId || "",
        year: year,
        month: month,
      };
      let headers = {
        headers: {
          accesstoken: patientSessionToken,
          "Content-Type": "application/json",
        },
      };
      setCalenderLoading(true);
      const response = await axios.post(
        process.env.NEXT_PUBLIC_BASE_URL + `/v2/cp/patient/session/available/dates`,
        bodyData,
        headers
      );

      const data = response.data?.data || [];
      // console.log('data',data);

      const map = {};
      data.forEach((item) => {
        map[item.date] = item.available;
      });
      // console.log('map',map)
      setAvailableDates(map);
    } catch (error) {
      console.error("API error:", error);
    } finally {
      setCalenderLoading(false);
      setIsFetchDaysNavigating(false);
    }
  };

  const canSubmit = 
  patientSessionData?.firstName && 
  patientSessionData?.lastName &&
  selectedCounsellorData?.loginId &&
  selectedCounsellorData?.generalInformation?.firstName &&
  selectedCounsellorData?.generalInformation?.lastName &&
  selectedCounsellorData?.generalInformation?.email &&
  selectedFromTime &&
  selectedToTime &&
  !loading;

  const validateForm = () => {
    if (!patientSessionData?.firstName || !patientSessionData?.lastName) {
      showErrorToast("Missing patient first or last name.");
      return false;
    }

    const { loginId, generalInformation } = selectedCounsellorData || {};
    if (
      !loginId ||
      !generalInformation?.firstName ||
      !generalInformation?.lastName ||
      !generalInformation?.email
    ) {
      showErrorToast(
        "Missing practitioner login ID, first name, last name, or email."
      );
      return false;
    }

    if (!selectedDate || !selectedFromTime || !selectedToTime) {
      showErrorToast("Please select a date and time.");
      return false
    }

    return true;
  };

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const [touched, setTouched] = useState({
    sessionDate: false,
    sessionTime: false,
  });

  const handleConfirmBooking = async () => {
    setTouched((prev) => ({
      ...prev,
      sessionDate: true,
      sessionTime: true,
    }));

    const isValid = validateForm();

    if (!isValid) {
      return null;
    }

    const payload = {
      sessionDetails: {
        sessionTime: {
          from: selectedFromTime,
          to: selectedToTime,
        },
        practitioner: {
          practitionerId: selectedCounsellorData?.loginId || "",
          name: `${
            selectedCounsellorData?.generalInformation?.firstName || ""
          } ${selectedCounsellorData?.generalInformation?.lastName || ""}`,
          email: selectedCounsellorData?.generalInformation?.email || "",
        },
        sessionDetail: sessionDetail.trim(),
      },
    };

    if (isRecurring) {
      payload.recurringSession = true;
    }

    try {
      setLoading(true);
      const headers = {
        headers: {
          accesstoken: patientSessionToken,
          "Content-Type": "application/json",
        },
      };

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}/v2/cp/patient/session`,
        payload,
        headers
      );

      if (response.data.success) {
        showSuccessToast("Session booked successfully!");
        setDrawerOpen(false);
        setSuccessDrawerOpen(true);
        if (response.data.data.createdSessions) {
          setCreatedSessions(response.data.data.createdSessions)
          } else {
            setCreatedSessions([response.data.data.createdSession])
          };
        setUnavailableSessions(response?.data?.unavailableSlots || []);
        // router.push("/patient/dashboard");
      } else {
        showErrorToast("Failed to book session. Please try again.");
      }
    } catch (error) {
      showErrorToast(
        error?.response?.data?.error?.message || "Something went wrong.1"
      );
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchAvailability(currentMonth);
  }, [currentMonth]);

  useEffect(() => {
    setPatientSessionToken(getPatientSessionToken());
  }, []);

  useEffect(() => {
    const fetchAvailabilitySlots = async (monthDate) => {
      try {
        // practitionerId: selectedCounsellorData?.loginId || "",
        const date = new Date(selectedDate);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are 0-indexed
        const day = String(date.getDate()).padStart(2, "0");

        const formattedDate = `${year}-${month}-${day}`;
        let bodyData = {
          practitionerId:
             selectedCounsellorData?.loginId || "",
          sessionDate: formattedDate,
        };
        let headers = {
          headers: {
            accesstoken: patientSessionToken,
            "Content-Type": "application/json",
          },
        };
        setTimeSlogLoading(true);
        const response = await axios.post(
          process.env.NEXT_PUBLIC_BASE_URL + `/v2/cp/patient/session/available/slots`,
          bodyData,
          headers
        );

        const data = response.data?.data?.availableSlots || {};
        console.log("data", data);

        setAvailableSlots(data);
      } catch (error) {
        setAvailableSlots({});
      } finally {
        setTimeSlogLoading(false);
      }
    };
    if (selectedDate) {
      console.log("selectedDate",selectedDate)
      fetchAvailabilitySlots();
    }
  }, [selectedDate]);

  const handleMonthChange = (newMonth) => {
    if (!isSameMonth(currentMonth, newMonth)) {
      setCurrentMonth(newMonth);
      fetchAvailability(currentMonth);
    }
  };
  const handleSuccessDrawerClose = () => {
    setSuccessDrawerOpen(false);
  }

const handleTimeFormat = (dateTime) => {
  const utcDate = new Date(dateTime);

  const formatter = new Intl.DateTimeFormat('en-IN', {
    timeZone: 'Asia/Kolkata',
    weekday: 'short',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  });

  const parts = formatter.formatToParts(utcDate);

  const dayName = parts.find(p => p.type === 'weekday')?.value;
  const day = parts.find(p => p.type === 'day')?.value;
  const month = parts.find(p => p.type === 'month')?.value;
  const year = parts.find(p => p.type === 'year')?.value;
  const hour = parts.find(p => p.type === 'hour')?.value;
  const minute = parts.find(p => p.type === 'minute')?.value;
  const ampm = parts.find(p => p.type === 'dayPeriod')?.value;

  const formattedTime = `${hour}:${minute} ${ampm}`;
  const formattedDate = `${dayName}, ${day} ${month} ${year}`;

  return {
    time: formattedTime,
    date: formattedDate,
  };
};

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] relative max-w-[576px] mx-auto">
      <div className="fixed top-0 left-0 right-0 h-[64px] z-50 flex items-center px-4 bg-gradient-to-b from-[#eeecfb] to-[#eeecfb] max-w-[576px] mx-auto">
        <ChevronLeft
          size={24}
          className="text-black cursor-pointer"
          onClick={() => {
            router.push(`/patient/dashboard`);
          }}
        />
        <strong className="ml-2 text-[16px] font-semibold text-gray-800">
          Schedule Session
        </strong>
      </div>
      <div className="pt-15 px-4 pb-20 flex justify-center relative">
        <div className="w-full flex flex-col gap-6">
          <div>
            <label className="block text-[#8F8F8F] mb-1 text-[15px]">
              Patient
            </label>
            <div className="w-full bg-[#ffffff1a] rounded-[12px] px-[12px] py-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-fill w-[42px] h-[42px]"
                    src={patientSessionData?.profileImageUrl||"/images/profile.png"}
                    alt={`${patientSessionData?.firstName || ""} ${
                      patientSessionData?.lastName || ""
                    }`}
                  />
                </Avatar>
                <div>
                  <Label className="text-[16px] text-black font-[600] font-['Quicksand']">
                    {`${patientSessionData?.firstName || ""} ${
                      patientSessionData?.lastName || ""
                    }`}
                  </Label>
                  <Label className="text-[15px] text-[#6D6A5D] font-[500] font-['Quicksand']">
                    {`${
                      patientSessionData?.countryCode_primary.match(/\d+$/)
                        ? "+" +
                          patientSessionData.countryCode_primary.match(
                            /\d+$/
                          )[0]
                        : "+91"
                    } ${patientSessionData?.primaryMobileNumber || ""}`}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[#8F8F8F] mb-1 text-[15px]">
              Assign Practitioner
            </label>
            <div className="w-full bg-[#ffffff1a] rounded-[12px] px-[12px] py-[8px] flex items-center justify-between">
              <div className="flex items-center gap-[12px]">
                <Avatar>
                  <AvatarImage
                    className="rounded-full object-fill w-[42px] h-[42px]"
                    src={
                      selectedCounsellorData?.generalInformation
                        ?.profileImageUrl || ""
                    }
                    alt={`${
                      selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                    } ${
                      selectedCounsellorData?.generalInformation?.lastName || ""
                    }`}
                  />
                  <AvatarFallback>
                    {`${
                      selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                    } ${
                      selectedCounsellorData?.generalInformation?.lastName || ""
                    }`
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <Label className="text-[16px] text-black font-[600] font-['Quicksand']">
                    {`${
                      selectedCounsellorData?.generalInformation?.firstName ||
                      ""
                    } ${
                      selectedCounsellorData?.generalInformation?.lastName || ""
                    }`}
                  </Label>
                  <Label className="text-[15px] text-[#6D6A5D] font-[500] font-['Quicksand']">
                    {`${
                      selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                        /\d+$/
                      )
                        ? "+" +
                          selectedCounsellorData?.generalInformation?.countryCode_primary.match(
                            /\d+$/
                          )[0]
                        : "+91"
                    } ${
                      selectedCounsellorData?.generalInformation
                        ?.primaryMobileNumber || ""
                    }`}
                  </Label>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-6 font-quicksand text-sm bg-gradient-to-br rounded-[16px]">
            <div>
              <Label className="block text-[#8F8F8F] mb-1">Session Type</Label>
              <Input
                type="text"
                placeholder="Enter session type"
                value="Counselling ( 1 Hr )"
                readOnly
                className="w-full h-10 rounded-[7.26px] bg-[#ffffff28] px-3 py-2  border border-[#E6E6E6] text-gray-400 text-[12px] font-medium focus:border-none focus:ring-0 focus-visible:border-none focus-visible:ring-0 focus-visible:outline-0"
              />
            </div>

            <div className="flex gap-7">
              <div>
                <Label className="block text-[#8F8F8F] mb-1">
                  Session Date
                </Label>
                <Popover open={calenderOpen} onOpenChange={setCalenderOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative cursor-pointer">
                      <Input
                        disabled
                        value={
                          selectedDate ? format(selectedDate, "dd/MM/yyyy") : ""
                        }
                        onBlur={() => handleBlur("sessionDate")}
                        placeholder="Enter date"
                        className="w-full h-10 rounded-[7.26px] bg-white px-3 py-2 border border-[#E6E6E6]"
                      />
                      <Image
                        src="/images/calender.jpg"
                        alt="calendar-icon"
                        width={23}
                        height={20}
                        className="absolute right-3 top-2.5"
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0 relative"side="bottom" align="start">
                    <div className="relative">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(selectedDate) => {
                          setSelectedDate(selectedDate);
                          if (selectedDate) {
                            setDrawerOpen(true);
                            setCalenderOpen(false);
                          }
                        }}
                        onMonthChange={handleMonthChange}
                        disabled={(date) => {
                          const key = format(date, "yyyy-MM-dd");
                          const isOutsideCurrentMonth =
                            date.getMonth() !== currentMonth.getMonth();

                          return (
                            isOutsideCurrentMonth ||
                            availableDates[key] === false
                          );
                        }}
                      />
                      {calenderLoading && (
                        <div className="absolute inset-0 z-10 flex items-center justify-center bg-white/60 backdrop-blur-sm">
                          <Loader className="w-6 h-6 text-purple-600 animate-spin" />
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
                {touched.sessionDate && !selectedDate ? (
                  <span className="text-red-500 text-sm mt-1 block">
                    Please select a session date
                  </span>
                ) : (
                  <></>
                )}
              </div>

              <div className="flex-1">
                <Label className="block text-[#8F8F8F] mb-1">
                  Session Time Slot
                </Label>

                <Drawer open={drawerOpen} onClose={handleCloseDrawer}>
                  <DrawerTrigger>
                    <div className="relative">
                      <Input
                        readOnly
                        placeholder="HH : MM"
                        value={
                          selectedFromTime
                            ? format(parseISO(selectedFromTime), "hh:mm a")
                            : ""
                        }
                        onBlur={() => handleBlur("sessionTime")}
                        className="opacity-50 w-full h-10 rounded-[7.26px] bg-white px-3 py-2  border border-[#E6E6E6] cursor-pointer"
                        onClick={() => {
                          if (selectedDate) {
                            setDrawerOpen(true);
                          } else {
                            setCalenderOpen(true);
                          }
                        }}
                      />
                      <Image
                        src="/images/Time2.png"
                        alt="time-icon"
                        width={23}
                        height={20}
                        className="absolute  right-3 top-2.5"
                        onClick={() => {
                          if (selectedDate) {
                            setDrawerOpen(true);
                          } else {
                            setCalenderOpen(true);
                          }
                        }}
                      />
                    </div>
                  </DrawerTrigger>

                  <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] max-h-[90vh] mx-auto w-full max-w-md rounded-t-[12px] bottom-drawer">
                    <DrawerHeader className="relative">
                      <DrawerTitle className="text-base text-center font-semibold">
                        Select Session Time
                      </DrawerTitle>
                      <div className="flex items-center justify-center px-6">
                        <button
                          onClick={goToPreviousDate}
                          className=" text-[20px] text-[#00000066] font-[300]"
                        >
                          ❮
                        </button>

                        <div className="flex items-center gap-1 text-center text-sm mx-[10px]">
                          <span className="text-[#776EA5] font-bold text-[15px]">
                            {format(selectedDate, "EEE,")}
                          </span>
                          <span className="text-[#776EA5] text-[15px] font-bold">
                            {format(selectedDate, "dd MMM yyyy")}
                          </span>
                        </div>

                        <button
                          onClick={() => {
                            goToNextDate();
                          }}
                          className="text-[20px] text-[#00000066] font-[300]"
                        >
                          ❯
                        </button>
                      </div>
                      {/* <Date_Slider selectedDate={selectedDate} /> */}
                      <DrawerClose className="absolute right-4 top-7 -translate-y-1/2">
                        <X
                          className="h-5 w-5 text-gray-600"
                          onClick={() => {
                            handleCloseDrawer(false);
                          }}
                        />
                      </DrawerClose>
                    </DrawerHeader>
                    <div className="p-4 space-y-4 overflow-y-auto py-0">
                      {Object.entries(availableSlots).map(([period, times]) => {
                        return (
                          <SessionSection
                            key={period}
                            period={period}
                            times={times}
                            selectedFromTime={selectedFromTime}
                            setSelectedFromTime={setSelectedFromTime}
                            setSelectedToTime={setSelectedToTime}
                          />
                        );
                      })}
                    </div>
                    <DrawerFooter className="flex flex-row justify-between items-center p-4 gap-2">
                      <DrawerClose asChild>
                        <Button
                          onClick={() => {
                            setDrawerOpen(false);
                          }}
                          variant="outline"
                          className="flex-1 border border-[#CC627B] h-[45px] rounded-[8px] text-[15px] font-semibold text-[#CC627B]"
                        >
                          Cancel
                        </Button>
                      </DrawerClose>
                      <Button
                        className="flex-1 bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white h-[45px] rounded-[8px] text-[15px]"
                        onClick={() => {
                          setDrawerOpen(false);
                        }}
                      >
                        Confirm
                      </Button>
                    </DrawerFooter>
                  </DrawerContent>
                </Drawer>
                {touched.sessionTime &&
                (!selectedFromTime || !selectedToTime) ? (
                  <span className="text-red-500 text-sm mt-1 block">
                    Please select a slot
                  </span>
                ) : (
                  <></>
                )}
              </div>
            </div>

            {/* <div className="flex items-center gap-2">
              <label className="text-[#8F8F8F]">
                Weekly Recurring Sessions
              </label>
              <Checkbox
                className="h-4 w-[16.05px] border-[1.5px] border-[#776EA5] rounded-[1.7px]"
                checked={isRecurring}
                onCheckedChange={(checked) => setIsRecurring(checked)}
              />
            </div> */}
            
            <label className="flex items-center gap-2 cursor-pointer text-[#8F8F8F]">
  <span className="select-none">Weekly Recurring Sessions</span>
  <Checkbox
    className="h-4 w-[16.05px] border-[1.5px] border-[#776EA5] rounded-[1.7px]"
    checked={isRecurring}
    onCheckedChange={(checked) => setIsRecurring(checked)}
  />
</label>


            <div>
              <label className="block text-[#8F8F8F] mb-1">
                Session Details (Optional)
              </label>
              <textarea
                value={sessionDetail}
                onChange={(e) => setSessionDetail(e.target.value)}
                placeholder="Enter session details here"
                className="w-full h-[100px] rounded-[7.26px] bg-white px-3 py-2 border border-[#E6E6E6] opacity-80"
              />
            </div>
          </div>

          <div className="gap-3 fixed bottom-0 pb-[23px] left-0 right-0 flex justify-center z-50 bg-gradient-to-b from-[#fce8e5] to-[#fce8e5] max-w-[576px] mx-auto px-4 ">
            <button
              onClick={() => {
                router.push(`/patient/dashboard`);
              }}
              className="border border-[#CC627B] text-[#CC627B] rounded-[8px] text-[15px] font-[600] w-[48%] h-[45px]"
            >
              Cancel
            </button>
            <button
              onClick={handleConfirmBooking}
              type="button"
              className={`bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white rounded-[8px] text-[15px] font-[600] w-[48%] h-[45px] flex items-center justify-center cursor-pointer ${!canSubmit ? "opacity-50 cursor-not-allowed" : "cursor-pointer"}`}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" aria-hidden="true" />
              ) : (
                "Confirm"
              )}
            </button>
          </div>
          <div className="mt-8 flex space-x-4 px-4 fixed bottom-0 left-0 right-0 pb-5 bg-[#fee9e7] max-w-[576px] mx-auto">
          <Drawer className="pt-[9.97px] max-w-[576px] m-auto"
            open={successDrawerOpen}
            onClose = {handleSuccessDrawerClose}>
            <Button
              variant="outline"
              className="flex-1 border border-[#CC627B] text-sm text-[#CC627B] rounded-[7.26px]  w-[48%] h-[45px]"
            >
              Cancel
            </Button>
            <DrawerTrigger className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px] h-[45px]  rounded-[8px] flex items-center justify-center w-[48%]">
              Confirm
            </DrawerTrigger>
            <DrawerContent className="bg-gradient-to-b  from-[#e7e4f8] via-[#f0e1df] via-70%  to-[#feedea] bottom-drawer p-4 rounded-t-[20px]">
              <div className="flex justify-center w-full">
                <DrawerHeader className="p-0">
                  <DrawerTitle className="text-base text-center font-semibold">
                    Select Session Time
                  </DrawerTitle>
                </DrawerHeader>
                <DrawerClose>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-black absolute top-2 right-2"
                    onClick={() => handleCloseDrawer()}
                  >
                    <X
                      className="w-5 h-5 text-black"
                      color="black"
                      fontWeight={700}
                    />
                  </Button>
                </DrawerClose>
              </div>

              <div className="mb-2 border border-[#e2d7ef] rounded-[12px] bg-[#FFFFFF80] mt-6">
                <button
                  onClick={() => setOpenConfirmed(!openConfirmed)}
                  className="w-full text-left p-4  text-base text-black font-semibold flex justify-between items-center"
                >
                  Confirmed Sessions
                    <span>
                    {openConfirmed ? (
                      <ChevronDown className="w-5 h-5 text-[#00000066]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#00000066]" />
                    )}
                  </span>
                </button>
                {openConfirmed && (
                  <div className="px-4 pb-3 text-sm text-[#555] space-y-2">
                    { createdSessions.length > 0 ? (
                      createdSessions.map((session, index) => (
                    <div className="flex justify-between items-center" key={index}>
                      <span className="text-xs text-[#CC627B]">
                        Session {index + 1}: {handleTimeFormat(session.sessionTime.from).date} | {handleTimeFormat(session.sessionTime.from).time}
                      </span>
                      <span className="text-[#1DA563] text-xs font-medium flex items-center gap-1">
                        <Check className="bg-[#11805D] text-white w-[12px] h-[12px] p-[1px] rounded-full" />
                        Confirmed
                      </span>
                    </div>
                    ))
                    ):(<>
                      <span className="text-xs text-[#CC627B]">
                        No confirmed Sessions
                      </span>  
                      </>)
                    }
                  </div>
                )}
              </div>

              <div className="mb-3 border border-[#e2d7ef] rounded-[12px] bg-[#FFFFFF80] ">
                <button
                  onClick={() => setOpenUnconfirmed(!openUnconfirmed)}
                  className="w-full text-left p-4 text-base text-black font-semibold flex justify-between items-center"
                >
                  Unconfirmed Sessions{" "}
                  <span>
                    {openUnconfirmed ? (
                      <ChevronDown className="w-5 h-5 text-[#00000066]" />
                    ) : (
                      <ChevronRight className="w-5 h-5 text-[#00000066]" />
                    )}
                  </span>
                </button>
                {openUnconfirmed && (
                  <div className="px-4 pb-3 text-sm text-[#555] space-y-2">
                    <div className="flex justify-between items-center">
                      {unavailableSessions.length > 0 ? (
                        unavailableSessions.map((session, index) => (
                        <>
                        <div className="flex items-center gap-1" key={index}>
                        <span className="text-xs text-[#CC627B]">
                          Session {index + 1}: {handleTimeFormat(session.sessionTime.from).date} | {handleTimeFormat(session.sessionTime.from).time}
                        </span>
                        <div className="rounded-full  w-fit h-6 inline-block bg-gradient-to-r  from-[#B0A4F5] to-[#EDA197] p-[1px]">
                          <button className="bg-[#f8f0ef] text-[11px] text-black rounded-full w-full h-full flex items-center justify-center gap-1 px-2">
                            + Book Session
                          </button>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-red-500 text-sm font-medium flex gap-[2px] items-center">
                          {" "}
                          <Image
                            src="/images/error_circle.png"
                            width={16}
                            height={16}
                            className="w-4"
                            alt="error"
                          />{" "}
                          Not Available
                        </span>
                      </div>
                      </>
                        ))
                      ) : (<>
                      <span className="text-xs text-[#CC627B]">
                        No Unconfirmed Sessions
                      </span>  
                      </>)}
                    </div>
                  </div>
                )}
              </div>

              <DrawerFooter className="flex justify-between pt-2 p-0">
                <div className="flex items-center gap-3">
                    <Button
                      variant="outline"
                      className="border border-[#CC627B] text-[#CC627B] rounded-[7.26px] w-[48%] h-[45px]"
                      onClick={() => {
                        handleCloseDrawer();
                        router.push('/patient/dashboard');
                      }}
                    >
                      Cancel
                    </Button>
                    <Button
                      className="bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white text-[15px] font-[600] py-[14.5px] h-[45px] rounded-[8px] w-[48%]"
                      onClick={() => {
                        handleCloseDrawer();
                        router.push('/patient/dashboard');
                      }}
                    >
                    Go To Dashboard
                  </Button>
                </div>
              </DrawerFooter>
            </DrawerContent>
          </Drawer>
        </div>
        </div>
      </div>
    </div>
  );
};

export default Schedule_Session;
