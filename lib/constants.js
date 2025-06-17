export const Baseurl = process.env.BASE_URL || 'https://dev.ekyamm.com'
const phoneNumber = "9920934198";
const message = "hi";
export const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;