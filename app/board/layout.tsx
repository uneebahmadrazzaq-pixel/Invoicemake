import type { Metadata } from "next";
import "./board.css";

export const metadata: Metadata = {
  title: "Orbit — Collaborative Task Board",
  description: "A shared task board where every update appears instantly.",
};

export default function BoardLayout({ children }: { children: React.ReactNode }) {
  return children;
}
