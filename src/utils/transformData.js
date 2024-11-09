const transformData = ({ data, category = null }) => {
  return (
    data?.message
      .map((item) => {
        return [...(category ? [category] : ["invoice", "payment"])].map(
          (data) => {
            if (data === "invoice")
              return {
                _id: item._id,
                description: item.invoice.title,
                amount: `${item.invoice.total}`,
                status: item.invoice.status,
                category: "Invoice",
                date: item.invoice.invoice_date,
              };
            if (data === "payment")
              return {
                _id: item._id,
                description: `Payment to ${item.payment.name}`,
                amount: `${item.payment.amount}`,
                status: item.payment.status,
                category: "Payment",
                date: item.payment.payment_date,
              };
          }
        );
      })
      .flat() ?? []
  );
};

export default transformData;
