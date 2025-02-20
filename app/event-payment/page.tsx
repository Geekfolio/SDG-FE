export default function Payment() {
  return (
    <div style={{ height: "100vh", margin: 0 }}>
      <iframe
        src="https://razorpay.com/payment-link/plink_PxslJbz6tl13kQ"
        title="Embedded Page"
        style={{
          width: "100%",
          height: "100%",
          border: "none",
        }}
      />
    </div>
  );
}
