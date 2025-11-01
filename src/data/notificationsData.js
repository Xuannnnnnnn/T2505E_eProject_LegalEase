const notificationsData = {
  customers: [
    {
      id: 1,
      title: "Consultation Confirmed",
      message: "Your consultation with Lawyer Nguyen Van A has been confirmed for 10/11/2025 at 3:00 PM.",
      time: "2 hours ago",
      read: false
    },
    {
      id: 2,
      title: "Payment Successful",
      message: "Your payment for legal consultation has been received successfully.",
      time: "1 day ago",
      read: true
    }
  ],
  lawyers: [
    {
      id: 1,
      title: "New Consultation Request",
      message: "Client Tran Thi B requested a consultation on Corporate Law.",
      time: "30 mins ago",
      read: false
    },
    {
      id: 2,
      title: "Payment Completed",
      message: "You have received payment for consultation ID #2025.",
      time: "3 hours ago",
      read: true
    }
  ]
};

export default notificationsData;
