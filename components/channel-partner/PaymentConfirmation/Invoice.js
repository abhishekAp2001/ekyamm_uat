import React,{useEffect} from 'react'
import { hasCookie, getCookie } from 'cookies-next';
import { useRouter } from 'next/navigation';
const Invoice = () => {
    const router = useRouter()
    const sessions_selection = hasCookie("session_selection")
        ? JSON.parse(getCookie("session_selection"))
        : null;
    const selectedCounsellor = hasCookie("selectedCounsellor")
        ? JSON.parse(getCookie("selectedCounsellor"))
        : null;
    const patientInfo = hasCookie("PatientInfo")
        ? JSON.parse(getCookie("PatientInfo"))
        : null;
    const invitePatientInfo = hasCookie("invitePatientInfo")
        ? JSON.parse(getCookie("invitePatientInfo"))
        : null;
    const qr_code_info = hasCookie("qrCodeInfo")
        ? JSON.parse(getCookie("qrCodeInfo"))
        : null;
    const paymentStatusInfo = hasCookie("paymentStatusInfo")
        ? JSON.parse(getCookie("paymentStatusInfo"))
        : null;
    const channelPartnerData = hasCookie("channelPartnerData")
        ? JSON.parse(getCookie("channelPartnerData"))
        : null;

    // useEffect(() => {
    //     if (!sessions_selection || !selectedCounsellor || !patientInfo || !invitePatientInfo || !paymentStatusInfo || !channelPartnerData) {
    //         router.push('/login')
    //     }
    // }, [sessions_selection, selectedCounsellor,patientInfo,invitePatientInfo,paymentStatusInfo, channelPartnerData])

    function getFormattedDate() {
        const today = new Date();
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return today.toLocaleDateString('en-US', options);
    }
    const calculateGST = (total) => {
        const tax = total * 0.18
        return tax
    }
    const totalAmount = sessions_selection?.session_count * sessions_selection?.total
    
    return (
        <div className='print-only text-black'>
            <div className="invoice-box" id="invoice">
                <table cellPadding={0} cellSpacing={0}>
                    <tbody><tr>
                        <td>
                            <img src="https://www.ekyamm.com/public/images/ekyamm-white.png" height={100} alt />
                        </td>
                        <td>
                            <h3>Tax Invoice</h3>
                        </td>
                    </tr>
                        <tr className="top">
                            <td colSpan={2}>
                                <table>
                                    <tbody><tr>
                                        <td>
                                            <b>Invoice Number:</b>{paymentStatusInfo?.invoiceId?.trim() ? paymentStatusInfo.invoiceId : sessions_selection?.txnId}
                                            <br />
                                            <b>Created:</b>{getFormattedDate()}<br />
                                        </td>
                                    </tr>
                                    </tbody></table>
                            </td>
                        </tr>
                        <tr className="information">
                            <td colSpan={2}>
                                <table>
                                    <tbody><tr>
                                        <td>
                                            Acme Corp.<br />
                                            John Doe<br />
                                            john@example.com
                                        </td>
                                        <td>
                                            {/* NAME */}
                                            {channelPartnerData?.clinicName
                                                || (selectedCounsellor?.generalInformation?.firstName
                                                    ? `${selectedCounsellor.generalInformation.firstName} ${selectedCounsellor.generalInformation.lastName}`
                                                    : null)
                                            }
                                            <br />

                                            {/* ADDRESS */}
                                            {channelPartnerData?.area && channelPartnerData?.city
                                                ? `${channelPartnerData.area}, ${channelPartnerData.city}`
                                                : selectedCounsellor?.practiceDetails?.address
                                            }<br />

                                            {/* CITY, STATE, PINCODE */}
                                            {channelPartnerData?.state && channelPartnerData?.pincode
                                                ? `${channelPartnerData.state}, ${channelPartnerData.pincode}`
                                                : `${selectedCounsellor?.practiceDetails?.city}, ${selectedCounsellor?.practiceDetails?.state}, ${selectedCounsellor?.practiceDetails?.pincode}`
                                            }

                                        </td>
                                    </tr>
                                    </tbody></table>
                            </td>
                        </tr>
                        {/* <tr class="heading">
      <td>Sl. No.</td>
      <td colspan="3">Description</td>
      <td>Unit Price</td>
      <td>Qty</td>
      <td>Net Amount</td>
      <td>Tax Amount</td>
      <td>Total Amount</td>
  </tr>
  <tr class="details">
      <td>1</td>
      <td colspan="3">
          <p>
              <b>Patient Name:</b>
              Rohan Kumar
          </p>
      </td>
      <td>1000</td>
      <td>4</td>
      <td>4000</td>
      <td>400</td>
      <td>4400</td>
  </tr> */}
                    </tbody></table><table className="invoice_main_table" cellPadding={0} cellSpacing={0}>
                    <tbody><tr className="heading">
                        <td style={{ width: '5%' }}>Sl. No.</td>
                        <td style={{ width: '35%' }}>Product Description</td>
                        <td style={{ width: '5%' }}>Qty</td>
                        <td style={{ width: '10%' }}>Rate</td>
                        <td style={{ width: '10%' }}>Net</td>
                        <td style={{ width: '10%' }}>Tax %</td>
                        <td style={{ width: '10%' }}>Tax Amt</td>
                        <td style={{ width: '7%' }}>Discount</td>
                        <td style={{ width: '8%' }}>Total</td>
                    </tr>
                        <tr className="item">
                            <td>1</td>
                            <td style={{ fontWeight: 'bold' }}>
                                Patient Name: {invitePatientInfo?.firstName
                                    ? `${invitePatientInfo.firstName} ${invitePatientInfo.lastName}`
                                    : `${patientInfo?.firstName} ${patientInfo?.lastName}`
                                }
                                <br />
                                Has booked session with {selectedCounsellor?.generalInformation?.firstName
                                    ? `${selectedCounsellor.generalInformation.firstName} ${selectedCounsellor.generalInformation.lastName}`
                                    : "Ms. Sushma Trivedi"
                                } on 10 April, 2025
                            </td>

                            <td>{paymentStatusInfo?.sessionCount ?? sessions_selection?.session_count}</td>
                            <td>₹{paymentStatusInfo?.sessionPrice ?? sessions_selection?.total}</td>
                            <td>{paymentStatusInfo?.totalAmount ?? totalAmount}</td>
                            <td>18%</td>
                            <td>₹{paymentStatusInfo?.totalAmount
                                ? calculateGST(paymentStatusInfo.totalAmount)
                                : calculateGST(totalAmount)
                            }</td>
                            <td>₹0</td>
                            <td>₹{
                                paymentStatusInfo?.totalAmount
                                    ? paymentStatusInfo.totalAmount + calculateGST(paymentStatusInfo.totalAmount)
                                    : totalAmount + calculateGST(totalAmount)
                            }</td>

                        </tr>
                        <tr className="item">
                            <td>2</td>
                            <td style={{ fontWeight: 'bold' }}>
                                Patient Name: {invitePatientInfo?.firstName
                                    ? `${invitePatientInfo.firstName} ${invitePatientInfo.lastName}`
                                    : `${patientInfo?.firstName} ${patientInfo?.lastName}`
                                }
                                <br />
                                Has booked session with {selectedCounsellor?.generalInformation?.firstName
                                    ? `${selectedCounsellor.generalInformation.firstName} ${selectedCounsellor.generalInformation.lastName}`
                                    : "Ms. Sushma Trivedi"
                                } on 10 April, 2025
                            </td>

                            <td>{paymentStatusInfo?.sessionCount ?? sessions_selection?.session_count}</td>
                            <td>₹{paymentStatusInfo?.sessionPrice ?? sessions_selection?.total}</td>
                            <td>{paymentStatusInfo?.totalAmount ?? totalAmount}</td>
                            <td>18%</td>
                            <td>₹{paymentStatusInfo?.totalAmount
                                ? calculateGST(paymentStatusInfo.totalAmount)
                                : calculateGST(totalAmount)
                            }</td>
                            <td>₹0</td>
                            <td>₹{
                                paymentStatusInfo?.totalAmount
                                    ? paymentStatusInfo.totalAmount + calculateGST(paymentStatusInfo.totalAmount)
                                    : totalAmount + calculateGST(totalAmount)
                            }</td>

                        </tr>
                        <tr className="total">
                            <td colSpan={8} style={{ textAlign: 'right' }}>Grand Total:</td>
                            <td>₹{
                                paymentStatusInfo?.totalAmount
                                    ? paymentStatusInfo.totalAmount + calculateGST(paymentStatusInfo.totalAmount)
                                    : totalAmount + calculateGST(totalAmount)
                            }</td>
                        </tr>
                    </tbody></table>
                <footer>
                    <center>
                        <b>Radicle Minds Private Limited</b><br />
                        <b>Mailing Address:</b> A-103, Sun Swept, 2nd Cross Lane, Lokhandwala Complex, Andheri W, Mumbai - 53
                    </center>
                </footer>
            </div>
            <style jsx >
                {`

        .print-only {
            visibility: hidden; /* Hide on screen */
            position: absolute; /* Prevent layout interference */
            top: -5999px;
            left: 0;
            width: 100%;
          }
            body {
      font-family: Arial, sans-serif;
      line-height: 1.6;
    }
    .invoice-box {
        border: 5px solid #000;
      /* max-width: 100%; */
      max-width: 800px;
      margin: auto;
      padding: 30px;
    }
    .invoice-box table {
      width: 100%;
      line-height: inherit;
      text-align: left;
    }
    .invoice-box table td {
      padding: 5px;
      vertical-align: top;
    }
    .invoice-box table tr.top table td {
      padding-bottom: 20px;
    }
    .invoice-box table tr.information table td {
      padding-bottom: 40px;
    }
    .invoice-box table tr.heading td {
      background: #eee;
      font-weight: bold;
      border: 1px solid #000;
      /* border-bottom: 1px solid #ddd; */
    }
    .invoice-box table tr.details td {
      padding-bottom: 20px;
      border: 1px solid #000;
    }
    .invoice-box table tr.item td {
      /* border-bottom: 1px solid #eee; */
    }
    .invoice-box table tr.item.last td {
      border-bottom: none;
    }
    .invoice-box table tr.total td:nth-child(2) {
      /* border-top: 2px solid #eee; */
      font-weight: bold;
    }
    footer{
        padding-top: 5rem;
    }

    table.invoice_main_table {
        width: 100%;
        border-collapse: collapse;
        font-family: Arial, sans-serif;
        font-size: 14px;
    }

    table.invoice_main_table, .invoice_main_table th, .invoice_main_table td {
        border: 1px solid #000;
    }

    .invoice_main_table th, .invoice_main_table td {
        padding: 6px;
        text-align: left;
    }

    .invoice_main_table .total td {
        font-weight: bold;
    }
            @media print {
            .print-only {
              visibility: visible; /* Show when printing */
              position: static; /* Restore normal positioning */
            }
        }
        `}
            </style>
        </div>
    )
}

export default Invoice
