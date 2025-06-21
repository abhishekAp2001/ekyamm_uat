import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";

export const CustomToast = ({
  type = "success",
  message = "Notification",
  fontSize = "14px",
}) => {
  const isSuccess = type === "success";

  return (
    <div className="flex items-center gap-3 w-full max-w-[90vw] sm:max-w-[360px] rounded-[6px]">
      {isSuccess ? (
        <Image
          src="/images/check_circle.svg"
          width={25}
          height={25}
          className="w-[25px] h-[25px] object-cover"
          alt="success"
        />
      ) : (
        <XCircle className="text-[#CC627B] mt-1" size={20} />
      )}
      <p
        className="font-semibold leading-snug text-[#000000] fw-[600] text-[12px]"
        style={{ fontSize }}
      >
        {message}
      </p>
    </div>
  );
};
