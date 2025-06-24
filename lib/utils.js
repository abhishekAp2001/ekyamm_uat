import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import CryptoJS from "crypto-js";
import { getCookie } from "cookies-next";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export const customEncodeString = (inputString) => {
  // Step 1: Generate a random number between 1 and 9
  const randomNum = Math.floor(Math.random() * 9) + 1;

  // Step 2: Define the first array and fetch the required indices
  // DEV
  const randomIndices = [
    38, 17, 3, 46, 31, 25, 43, 22, 14, 0, 8, 41, 24, 7, 9, 37, 27, 5, 20, 35,
    13, 30, 19, 48, 10, 29, 44, 45, 15, 26, 33, 12, 49, 4, 42, 18, 21, 6, 39,
    47, 40, 32, 23, 34, 2, 11, 16, 1, 28, 26,
  ];

  const fetchIndices = randomIndices.slice(randomNum - 1, randomIndices.length);

  // Step 3: Define the second array and fetch the corresponding values
  // DEV
  const randomValues = [
    102, 874, 4956, 203, 1278, 330, 7245, 451, 2901, 3842, 1005, 2203, 5928,
    383, 4152, 784, 2048, 391, 5230, 290, 7524, 430, 1189, 594, 7620, 1857, 334,
    2950, 472, 1245, 903, 3154, 450, 2356, 789, 4032, 1178, 5720, 321, 486,
    2840, 4092, 730, 1995, 562, 4903, 2381, 640, 1885, 9274,
  ];

  // Step 4: Modify the input string by inserting the fetched values
  let modifiedString = "";
  let inputArray = inputString.split("");
  for (let x = 0; x < inputArray.length; x++) {
    modifiedString += `${inputArray[x]}${randomValues[fetchIndices[x]]}`;
  }

  // Step 5: Attach the random number at the start
  const finalString = randomNum + modifiedString;

  return finalString;
};

export const encryptData = (plainText) => {
  // Create a 32-byte key from the secret key using SHA-256
  const key = CryptoJS.SHA256("Pq7Gk2Xm5Hs8RdF4Nv3Tc9Bz6WyJfLuM");

  // Create a constant IV derived from a string using MD5
  const constantIV = CryptoJS.MD5("9Q8w7E6r5T4y3U2i");

  // Encrypt the plain text using AES/CBC/PKCS5Padding
  const encrypted = CryptoJS.AES.encrypt(plainText, key, {
    iv: constantIV,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });

  // Convert the encrypted data to Base64 string
  return encrypted.toString();
};

export const formatTime = (seconds) => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
};

export const debounce = (func, delay) => {
  let timeoutId;
  const debounced = (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
  debounced.cancel = () => clearTimeout(timeoutId);
  return debounced;
};

const base64ToBlob = (base64, mime = "image/png") => {
  const byteString = atob(base64.split(",")[1]); // decode base64
  const ab = new ArrayBuffer(byteString.length);
  const ia = new Uint8Array(ab);

  for (let i = 0; i < byteString.length; i++) {
    ia[i] = byteString.charCodeAt(i);
  }

  return new Blob([ab], { type: mime });
};

export const base64ToFile = (base64, filename = "image.png") => {
  const mime = base64.match(/data:(.*?);base64/)?.[1] || "image/png";
  const blob = base64ToBlob(base64, mime);
  return new File([blob], filename, { type: mime });
};

export const formatAmount = (amount) => {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

export const calculatePaymentDetails = (
  sessionPrice,
  sessionCount,
  clinicSharePercent = 10
) => {
  const price = Number(sessionPrice);
  const count = Number(sessionCount);

  if (!price || !count) {
    return {
      total: formatAmount(0),
      clinicShare: formatAmount(0),
      totalPayable: formatAmount(0),
    };
  }

  const total = price * count;
  const clinicShare = (total * clinicSharePercent) / 100;
  const totalPayable = total - clinicShare;

  return {
    total: formatAmount(total),
    clinicShare: formatAmount(clinicShare),
    totalPayable: formatAmount(totalPayable),
  };
};
export const sanitizeInput = (input) => {
  return input?.replace(/[<>]/g, "").trim(); // Remove HTML tags and trim whitespace
};
export const clinicSharePercent = 10;

export const patientSessionToken = () => {
  const userDataCookie = getCookie("patientSessionData");
  let token;
  if (userDataCookie) {
    try {
      token = JSON.parse(userDataCookie).token;
      return token;
    } catch (error) {
      return null;
    }
  }

  if (!token) {
    return null;
  }
};

export const currentPatientId = () => {
  const userDataCookie = getCookie("patientSessionData");
  let userId;
  if (userDataCookie) {
    try {
      userId = JSON.parse(userDataCookie).userId;
      return userId;
    } catch (error) {
      return null;
    }
  }

  if (!userId) {
    return null;
  }
};

export const patientSessionData = () => {
  const dataCookie = getCookie("PatientInfo");
  let data;
  if (dataCookie) {
    try {
      data = JSON.parse(dataCookie);
      return data;
    } catch (error) {
      return null;
    }
  }

  if (!data) {
    return null;
  }
};

  export const greeting =
    new Date().getHours() < 12
      ? "Morning"
      : new Date().getHours() < 16 ||
        (new Date().getHours() === 16 && new Date().getMinutes() === 0)
      ? "Afternoon"
      : "Evening";
export const doctors = [
  {
    id: 1,
    name: "Dr. Rohit Sharma",
    phone: "+91 98765 43210",
    avatar: "/images/akshit.png",
    expertise: "Gynaecology",
    gender: "Male",
    sessionMode: "In-Person & Online",
    fee: "₹1,500",
  },
  {
    id: 2,
    name: "Dr. Shubman Gill",
    phone: "+91 98765 43210",
    avatar: "/images/rahul.png",
    expertise: "IVF Specialist",
    gender: "Female",
    sessionMode: "Online",
    fee: "₹2,000",
  },
  {
    id: 3,
    name: "Dr. Shikhar Dhawan",
    phone: "+91 98765 43210",
    avatar: "/images/akshit.png",
    expertise: "Gynaecology",
    gender: "Male",
    sessionMode: "In-Person",
    fee: "₹1,200",
  },
  {
    id: 4,
    name: "Dr. Ravindra Jadeja",
    phone: "+91 98765 43210",
    avatar: "/images/akshit.png",
    expertise: "Gynaecology",
    gender: "Male",
    sessionMode: "In-Person & Online",
    fee: "₹1,500",
  },
  {
    id: 5,
    name: "Dr. Virat Kohli",
    phone: "+91 98765 43210",
    avatar: "/images/rahul.png",
    expertise: "IVF Specialist",
    gender: "Female",
    sessionMode: "Online",
    fee: "₹2,000",
  },
];

export const timeSlots = {
  morning: ["08:00 AM", "09:00 AM", "10:00 AM", "11:00 AM"],
  afternoon: ["12:00 PM", "01:00 PM", "02:00 PM", "03:00 PM"],
  evening: ["04:00 PM", "05:00 PM", "06:00 PM", "07:00 PM"],
  night: ["08:00 PM", "09:00 PM", "10:00 PM", "11:00 PM"],
};

export const upcomingSession = {
  time: "11:00 AM",
  location: "Bandra",
  doctor: {
    name: "Dr. Kiran Rathi",
    profilePic: "/images/akshit.png",
  },
  duration: "01:00 HR",
  mode: "Online",
  previousSession: "Tuesday, March 5, 2023",
};

export const pastSessions = [
  {
    doctor: "Dr. Ramesh Naik",
    time: "12:00 AM",
    date: "Tuesday, March 25, 2023",
  },
  {
    doctor: "Dr. Suresh Sawant",
    time: "10:30 AM",
    date: "Tuesday, March 15, 2023",
  },
  {
    doctor: "Dr. Neeta Singh",
    time: "09:30 AM",
    date: "Tuesday, Feb 25, 2023",
  },
];
