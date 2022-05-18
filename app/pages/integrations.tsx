import { useRouter } from "next/router";

const encodeUrl = require("encodeurl");

const Integrations = () => {
  const router = useRouter();
  const prefixUrl = `http://localhost:8000/payment?redirect_url=${encodeUrl(
    "https://google.com?payme"
  )}`;

  return <div>Your URL Payment: {prefixUrl}</div>;
};

export default Integrations;
