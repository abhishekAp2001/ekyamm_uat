import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { format, parseISO } from "date-fns";

const SessionSection = ({
  period,
  times,
  selectedFromTime,
  setSelectedFromTime,
  setSelectedToTime,
}) => (
  <Accordion type="single" collapsible className="">
    <AccordionItem
      value={period}
      className="overflow-hidden bg-[#ffffff52] p-4 rounded-[12px]"
    >
      <AccordionTrigger
        className={`text-base font-semibold no-underline hover:no-underline focus:no-underline active:no-underline focus-visible:no-underline ${
          times.length === 0
            ? "opacity-50 cursor-not-allowed pointer-events-none"
            : ""
        }`}
        disabled={times.length === 0}
        tabIndex={times.length === 0 ? -1 : 0}
      >
        {period.charAt(0).toUpperCase() + period.slice(1)}
      </AccordionTrigger>
      {times.length > 0 && (
        <AccordionContent className="pb-0">
          <div className="grid grid-cols-4 gap-2 mt-3">
            {times.map((time, ti) => (
              <Button
                disabled={!time?.available}
                key={ti}
                variant="outline"
                className={`text-xs rounded-[8px] border border-[#CC627B] text-[#CC627B] py-2 transition-all bg-transparent hover:text-white ${
                  selectedFromTime === time?.from
                    ? "bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0] text-white border-none"
                    : "hover:bg-gradient-to-r from-[#BBA3E4] to-[#E7A1A0]"
                }`}
                onClick={() => {
                  setSelectedFromTime(time?.from);
                  setSelectedToTime(time?.to);
                }}
              >
                {format(parseISO(time?.from), "hh:mm a")}
              </Button>
            ))}
          </div>
        </AccordionContent>
      )}
    </AccordionItem>
  </Accordion>
);

export default SessionSection;
