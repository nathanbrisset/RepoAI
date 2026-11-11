"use client";

import { useT } from "@/components/locale-provider"

export default function BackButton() {
  const t = useT()
  return (
    <button
      onClick={() => window.history.back()}
      className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-block"
    >
      ← {t("tool.back")}
    </button>
  );
} 