"use client";
import React, { useState } from "react";
import IP_Header from "../IP_Header/IP_Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X, ChevronDown, CirclePlus, CircleX } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import Link from "next/link";
import { Slider } from "@/components/ui/slider";
import Filter_Header from "../Filter_Header/Filter_Header";

const Filter = () => {
  const specializations = ["English", "Hindi", "Marathi"];
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");
  const [selectedItems, setSelectedItems] = useState(["Telugu"]);
  const [currentSelection, setCurrentSelection] = useState("Telugu");
  const [selectedGender, setSelectedGender] = useState("male");
  const filteredSpecializations = specializations.filter((item) =>
    item.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelectItem = (item) => {
    setCurrentSelection(item);
    setOpen(false);
    setSearchValue("");
  };

  const handleAddItem = () => {
    if (currentSelection && !selectedItems.includes(currentSelection)) {
      setSelectedItems((prev) => [...prev, currentSelection]);
    }
  };

  const handleRemoveItem = (item) => {
    setSelectedItems((prev) => prev.filter((i) => i !== item));
  };

  return (
    <div className="bg-gradient-to-t from-[#fce8e5] to-[#eeecfb] min-h-screen flex flex-col max-w-[576px] mx-auto">
      <Filter_Header />
      <div className="flex-grow px-4 mt-[18px] pb-[90px] pt-[16%] lg:pt-[10%]">
        {/* Session Fee */}
        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <div className="text-[15px] font-[500] text-gray-500 mb-3">
            Session Fee
          </div>
          <Slider defaultValue={[10]} max={100} step={1} />
          <div className="flex justify-between mt-2 text-[12px] text-[#6D6A5D] font-[500]">
            <span>₹150/-</span>
            <span>₹1,500/-</span>
          </div>
        </div>

        <div className="bg-white rounded-[12px] p-4 mb-[10px]">
          <div className="text-[15px] font-[500] text-gray-500 mb-2">
            Gender
          </div>
          <RadioGroup
            value={selectedGender}
            onValueChange={setSelectedGender}
            className="flex gap-4 items-center"
          >
            {["male", "female", "other"].map((gender) => (
              <div key={gender} className="flex items-center space-x-2">
                <RadioGroupItem
                  value={gender}
                  id={gender}
                  className=""
                />
                <Label
                  htmlFor={gender}
                  className={`text-[16px] ${
                    selectedGender === gender
                      ? "font-[600] text-black text-[16px]"
                      : "font-[500] text-gray-500 text-[16px]"
                  }`}
                >
                  {gender.charAt(0).toUpperCase() + gender.slice(1)}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="bg-white rounded-[12px] p-4 mb-4 pb-[25px]">
          <Label className="text-[15px] text-gray-500 font-[500] mb-2 block">
            Select Preferred Language
          </Label>
          <div className="flex gap-2 relative">
            <Popover open={open} onOpenChange={setOpen} >
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="flex-1 justify-between bg-[#BBA3E41A] rounded-[7.26px] h-[39px]"
                >
                  <span className="text-black text-sm font-semibold">
                    {currentSelection}
                  </span>
                  <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-0" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-full p-0 " align="start">
                <Command>
                  <CommandInput
                    placeholder="Search language..."
                    value={searchValue}
                    onValueChange={setSearchValue}
                  />
                  <CommandList>
                    <CommandEmpty>No language found.</CommandEmpty>
                    <CommandGroup>
                      {filteredSpecializations.map((spec) => (
                        <CommandItem
                          key={spec}
                          value={spec}
                          onSelect={() => handleSelectItem(spec)}
                        >
                          {spec}
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
            <Button
              onClick={handleAddItem}
              size="icon"
              variant="ghost"
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-[20.75px]"
            >
              <CirclePlus size={22} className="text-[22px] text-[#1C1B1F] w-[20.75px] h-[25px] lang_input" />
            </Button>
          </div>

          <div className="flex flex-wrap gap-2 mt-3 pb-3">
            {selectedItems.map((item) => (
              <Badge
                key={item}
                className="flex items-center gap-[2px] bg-[#f3f3f3] rounded-[5px] text-sm font-medium text-gray-700"
              >
                {item}
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-[11px] h-[11px] ml-1 p-0"
                  onClick={() => handleRemoveItem(item)}
                >
                  <CircleX className="w-[11px] h-[11px]" />
                </Button>
              </Badge>
            ))}
          </div>
          <Label className="text-[15px] text-gray-500 font-[500] mb-2 block">
            Suggested Languages
          </Label>
          <div className="flex gap-2 flex-wrap">
            {["Kannada", "Konkani", "Tamil"].map((lang) => (
              <Button
                key={lang}
                className="bg-[#776EA5] text-white rounded-[5px] h-6 px-2 text-[12px] font-medium flex items-center gap-1"
              >
                {lang}
                <CirclePlus size={22} className="text-[22px] text-white w-[20.75px] h-[25px] lang_btn" />
              </Button>
            ))}
          </div>
          {/* Footer Buttons */}
          <div className="bg-gradient-to-b  from-[#fce8e5]  to-[#fce8e5]  flex justify-center items-center gap-3 mt-[20.35px] fixed bottom-0 pb-[23px] left-0 right-0 max-w-[576px] mx-auto">
            <Button className="border border-[#CC627B] bg-transparent text-[15px] font-[600] text-[#CC627B] py-[14.5px]   rounded-[8px] flex items-center justify-center w-[46%] h-[45px]">
              Cancel
            </Button>
            <Button className="bg-gradient-to-r  from-[#BBA3E4] to-[#E7A1A0] text-[15px] font-[600] text-white py-[14.5px]   rounded-[8px] flex items-center justify-center w-[46%] h-[45px]">
              Apply
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Filter;
