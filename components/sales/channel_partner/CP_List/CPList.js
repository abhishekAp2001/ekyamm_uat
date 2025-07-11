import Image from "next/image";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../../../ui/avatar";
import { Dialog, DialogTrigger, DialogContent } from "@/components/ui/dialog";
import { Mail, Phone, MapPin } from "lucide-react";

const CPList = ({ list }) => {
  function cleanNumber(input) {
    return input.replace(/🇮🇳/, '')
      .replace(/\s+/g, '')
      .trim();
  }
    function formatDate(isoString) {

    const date = new Date(isoString);

    const formatted = date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    return formatted
  }
  return (
    <>
      <div className="flex flex-wrap mt-[10.9px]">
        {list?.map((list, index) => (
          <div
            key={index}
            className="w-1/3 rounded-[65px] flex flex-col items-center gap-1 mb-3.5"
          >
            <Dialog>
              <DialogTrigger asChild>
                <Avatar className="cursor-pointer">
                  <AvatarImage
                    src={list?.generalInformation?.profileImageUrl}
                    alt={`${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
                  />
                  <AvatarFallback>
                    {list?.clinicName
                      ? list.clinicName
                        .split(" ")
                        .map((word) => word[0])
                        .join("")
                        .toUpperCase()
                      : `${list?.generalInformation?.firstName?.[0] || ""}${list?.generalInformation?.lastName?.[0] || ""
                        }`.toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DialogTrigger>

              <DialogContent className=" bg-[#f2f2f2] rounded-2xl p-[18px_12px]">
                <div className="flex flex-col space-y-4">
                  <h2 className="text-[20px] font-semibold">
                    Practice Details
                  </h2>

                  {/* Avatar / logo and practice info */}
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0 rounded-md bg-gray-100 p-2">
                      {/* Logo: replace src with your static logo or dynamic one */}
                     <Avatar className="cursor-pointer">
                                       {list?.generalInformation?.profileImageUrl ? (
                                         <AvatarImage
                                           src={list.generalInformation.profileImageUrl}
                                           alt={`${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
                                         />
                                       ) : null}
                     
                                       <AvatarFallback>
                                         {list?.clinicName
                                           ? list.clinicName
                                             .split(" ")
                                             .map((word) => word[0])
                                             .join("")
                                             .toUpperCase()
                                           : `${list?.generalInformation?.firstName?.[0] || ""}${list?.generalInformation?.lastName?.[0] || ""}`.toUpperCase()}
                                       </AvatarFallback>
                                     </Avatar>
                     
                    </div>
                    <div className="flex flex-col space-y-1 text-sm">
                      <span className="font-semibold text-base">
                        Care Center
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Phone className="w-4 h-4 mr-1" />
                        {list?.generalInformation?.primaryMobileNumber
                          ? cleanNumber(list.generalInformation.primaryMobileNumber)
                          : "Not added"
                        }
                        (Primary)
                      </span>
                      <span className="flex items-center text-gray-500">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="16"
                          fill="currentColor"
                          viewBox="0 0 448 512"
                          className="w-4 h-4 mr-1"
                        >
                          <path d="M380.9 97.1C339-2.3 211.2-26.7 114.4 34.6 55.6 73.1 16 138.1 16 212.5c0 39.2 10.3 77.6 29.7 111.2L0 480l160.7-43c32.3 8.8 66 10.7 98.4 4.5 48.8-9.3 92.9-34.7 125-71.2 58.4-67.5 68.2-164.8 19.7-238.2zm-44.4 194c-5.4 15-26.8 28.4-36.9 30.4-9.5 1.9-22.4 2.7-35.8-2.2-8.2-2.9-18.7-6.1-32.4-11.9-56.9-24.6-94-82.1-96.8-85.9-2.8-3.8-23.2-30.8-23.2-58.8 0-28 14.7-41.8 19.9-47.4 5.1-5.6 11.2-7 14.9-7 3.7 0 7.4.1 10.6.2 3.4.1 7.9-.6 12.2 9.2 4.4 10.6 15 36.9 16.3 39.6 1.3 2.7 2.2 6.1.4 9.9-1.8 3.8-2.7 6.1-5.2 9.4-2.4 3.2-5 7.2-7.2 9.6-2.4 2.4-4.9 5-2.1 9.8 2.7 4.8 12 19.8 25.7 32.1 17.6 15.9 32.5 21 37.3 23.3 4.8 2.4 7.6 2 10.3-1.2 2.7-3.2 11.8-13.7 14.9-18.4 3.1-4.6 6.2-3.8 10.3-2.3 4.1 1.6 26.1 12.3 30.5 14.6 4.5 2.3 7.4 3.4 8.4 5.3 1.1 1.9 1.1 11 .3 21.2z" />
                        </svg>
                        {list?.generalInformation?.whatsappNumber
                          ? cleanNumber(list.generalInformation.whatsappNumber)
                          : "Not added"
                        }
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Mail className="w-4 h-4 mr-1" /> {list?.generalInformation?.email || "Not added"}
                        (Primary)
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Mail className="w-4 h-4 mr-1" /> {list?.generalInformation?.billingEmail || "Not added"}
                        (Practice)
                      </span>
                      <span className="text-gray-700 font-medium">
                        <b>Date of Birth - </b>
                        <span className="font-normal">{list?.generalInformation?.dateOfBirth
                            ? formatDate(list?.generalInformation?.dateOfBirth)
                            : "Not added"
                          }</span>
                      </span>
                    </div>
                  </div>

                  {/* Emergency Number */}
                  <div className="text-sm">
                    <div className="font-medium text-base">
                      Emergency Number
                    </div>
                    <div className="flex items-center text-gray-500">
                      <Phone className="w-4 h-4 mr-1" />
                      {list?.generalInformation?.emergencyNumber
                        ? cleanNumber(list.generalInformation.emergencyNumber)
                        : "Not added"
                      }

                    </div>
                  </div>

                  {/* Address */}
                  <div className="text-sm">
                    <div className="font-medium text-base">Address</div>
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-4 h-4 mr-1" /> {list?.generalInformation?.residentialAddress || "Not added"}
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <div className="flex flex-col">
              <span className="text-[14px] text-black font-medium whitespace-pre-line text-center">
                {list?.clinicName ||
                  `${list?.generalInformation?.firstName} ${list?.generalInformation?.lastName}`}
                <br />
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default CPList;