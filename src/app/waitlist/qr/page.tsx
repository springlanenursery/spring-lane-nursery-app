"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Download, Printer, Copy, Check } from "lucide-react";
import QRCode from "qrcode";

export default function WaitlistQRPage() {
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>("");
  const [copied, setCopied] = useState(false);

  const waitlistUrl = "https://www.springlanenursery.co.uk/waitlist";

  useEffect(() => {
    // Generate QR code on mount
    QRCode.toDataURL(waitlistUrl, {
      width: 400,
      margin: 2,
      color: {
        dark: "#252650",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    })
      .then((url) => {
        setQrCodeDataUrl(url);
      })
      .catch((err) => {
        console.error("Error generating QR code:", err);
      });
  }, []);

  const handleDownload = () => {
    if (!qrCodeDataUrl) return;

    const link = document.createElement("a");
    link.download = "springlane-waitlist-qr.png";
    link.href = qrCodeDataUrl;
    link.click();
  };

  const handlePrint = () => {
    window.print();
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(waitlistUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-slate-100">
      {/* Header - Hidden when printing */}
      <header className="bg-white shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <Image
              src="/assets/logo.png"
              alt="Spring Lane Nursery"
              width={48}
              height={48}
              className="h-12 w-auto"
            />
          </Link>
          <Link
            href="/"
            className="text-teal-600 hover:text-teal-700 font-medium flex items-center gap-2"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-12">
        {/* Print Header - Only visible when printing */}
        <div className="hidden print:block text-center mb-8">
          <Image
            src="/assets/logo.png"
            alt="Spring Lane Nursery"
            width={120}
            height={120}
            className="h-24 w-auto mx-auto mb-4"
          />
        </div>

        {/* QR Code Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden print:shadow-none print:rounded-none">
          <div className="bg-teal-600 px-6 py-4 print:bg-white print:border-b-2 print:border-teal-600">
            <h1 className="text-2xl font-bold text-white text-center print:text-teal-600">
              Join Our Waitlist
            </h1>
            <p className="text-teal-100 text-center mt-1 print:text-slate-600">
              Scan the QR code to register
            </p>
          </div>

          <div className="p-8 text-center">
            {/* QR Code */}
            <div className="bg-white p-4 rounded-xl inline-block border-4 border-teal-100 mb-6">
              {qrCodeDataUrl ? (
                <img
                  src={qrCodeDataUrl}
                  alt="Waitlist QR Code"
                  className="w-64 h-64 md:w-80 md:h-80"
                />
              ) : (
                <div className="w-64 h-64 md:w-80 md:h-80 bg-slate-100 animate-pulse rounded-lg" />
              )}
            </div>

            <p className="text-lg text-slate-700 font-medium mb-2">
              Spring Lane Nursery Waitlist
            </p>

            <p className="text-slate-500 mb-6 print:mb-4">
              Scan with your phone camera to join our waiting list
            </p>

            {/* URL Display */}
            <div className="bg-slate-50 rounded-lg p-3 mb-6 print:border print:border-slate-200">
              <p className="text-sm text-slate-500 mb-1">Or visit:</p>
              <p className="text-teal-600 font-mono text-sm break-all">
                {waitlistUrl}
              </p>
            </div>

            {/* Action Buttons - Hidden when printing */}
            <div className="flex flex-wrap gap-3 justify-center print:hidden">
              <button
                onClick={handleDownload}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg font-medium hover:bg-teal-700 transition-colors flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download QR
              </button>
              <button
                onClick={handlePrint}
                className="px-4 py-2 border-2 border-teal-600 text-teal-600 rounded-lg font-medium hover:bg-teal-50 transition-colors flex items-center gap-2"
              >
                <Printer className="w-4 h-4" />
                Print
              </button>
              <button
                onClick={handleCopyLink}
                className="px-4 py-2 border-2 border-slate-300 text-slate-600 rounded-lg font-medium hover:bg-slate-50 transition-colors flex items-center gap-2"
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-green-600" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    Copy Link
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Footer Info */}
          <div className="bg-slate-50 px-6 py-4 border-t border-slate-200">
            <div className="text-center text-sm text-slate-600">
              <p className="font-medium">Spring Lane Nursery</p>
              <p>23 Spring Lane, Croydon SE25 4SP</p>
              <p>Tel: 0203 561 8257</p>
            </div>
          </div>
        </div>

        {/* Instructions - Hidden when printing */}
        <div className="mt-8 bg-white rounded-xl p-6 shadow print:hidden">
          <h2 className="font-semibold text-slate-800 mb-3">
            How to use this QR code:
          </h2>
          <ul className="space-y-2 text-sm text-slate-600">
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">1.</span>
              Print this page and display it at your reception or waiting area
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">2.</span>
              Parents can scan the QR code with their phone camera
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">3.</span>
              They&apos;ll be taken directly to the waitlist registration form
            </li>
            <li className="flex items-start gap-2">
              <span className="text-teal-600 font-bold">4.</span>
              You&apos;ll receive an email notification for each new registration
            </li>
          </ul>
        </div>
      </main>

      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          .print\\:hidden {
            display: none !important;
          }
          .print\\:block {
            display: block !important;
          }
        }
      `}</style>
    </div>
  );
}
