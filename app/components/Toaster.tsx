import { Toaster } from "react-hot-toast";

export const ToasterHub = () => {
  return (
    <Toaster
      position="top-right"
      containerStyle={{ position: "relative", top: 0, marginRight: 20 }}
    />
  );
};
