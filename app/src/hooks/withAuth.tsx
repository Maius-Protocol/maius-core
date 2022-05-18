import { useWallet } from "@solana/wallet-adapter-react";
import LandingPage from "../components/LandingPage";

const withAuth = (Component: any) => {
  const AuthenticatedComponent = () => {
    const { connecting, connected } = useWallet();

    return connecting || !connected ? <LandingPage /> : <Component />;
  };

  return AuthenticatedComponent;
};

export default withAuth;
