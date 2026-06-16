"use client";

export default function Toast({
  message,
  show,
}: {
  message: string;
  show: boolean;
}) {
  if (!show) return null;

  return (
    <div className="fixed bottom-6 right-6 bg-black text-white px-4 py-3 rounded-lg shadow-lg z-50">
      {message}
    </div>
  );
}