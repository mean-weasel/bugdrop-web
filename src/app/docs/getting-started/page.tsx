import { permanentRedirect } from "next/navigation";

export default function GettingStartedRedirect() {
  permanentRedirect("/docs");
}
