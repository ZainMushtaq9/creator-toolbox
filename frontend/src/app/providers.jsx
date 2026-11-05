import { HelmetProvider } from "react-helmet-async";
export default function Providers({ children }) {
  return <HelmetProvider>{children}</HelmetProvider>;
}
