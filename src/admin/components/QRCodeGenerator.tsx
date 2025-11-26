// src/admin/components/QRCodeGenerator.tsx
import React from "react";
import { QRCodeCanvas } from "qrcode.react";

export default function QRCodeGenerator({ value }: { value: string }) {
  return (
    <div className="p-3 bg-white rounded shadow inline-block">
      <QRCodeCanvas value={value} size={150} />
    </div>
  );
}
