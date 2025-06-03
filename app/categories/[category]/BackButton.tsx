"use client";

export default function BackButton() {
  return (
    <button
      onClick={() => window.history.back()}
      className="text-xs text-gray-500 hover:text-gray-700 mb-4 inline-block"
    >
      ← Back
    </button>
  );
} 