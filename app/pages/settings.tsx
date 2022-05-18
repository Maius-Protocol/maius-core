import { useApp } from "../src/hooks/useAppProvider";

const SettingsPage = () => {
  const { program, merchantAccount } = useApp();
  console.log(merchantAccount);
  return <div></div>;
};

export default SettingsPage;
