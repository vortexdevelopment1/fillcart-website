import React, { useState, useEffect, useRef } from "react";
import { Plus, Upload, FileText } from "lucide-react";
import ProfileLayout from "./ProfileLayout";
import { useCart } from "../../context/CartContext";
import api from "../../api";

// TODO: connect API (fallback mock data for My Prescriptions when none returned from backend)
const MOCK_PRESCRIPTIONS = [
  {
    id: "mock-rx-1",
    doctorName: "Dr. Arvind Mehta, MD",
    uploadDate: "14 Nov 2026",
    medicinesCount: 3,
    status: "Verified",
    fileUrl: "#",
  },
  {
    id: "mock-rx-2",
    doctorName: "Dr. Priya Sharma, MBBS",
    uploadDate: "18 Nov 2026",
    medicinesCount: 2,
    status: "Pending review",
    fileUrl: "#",
  },
  {
    id: "mock-rx-3",
    doctorName: "Dr. R. K. Gupta, Pediatrician",
    uploadDate: "02 Oct 2026",
    medicinesCount: 4,
    status: "Expired",
    fileUrl: "#",
  },
];

export default function ProfilePrescriptions() {
  const { user } = useCart();
  const [prescriptions, setPrescriptions] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const fileInputRef = useRef(null);

  const fetchPrescriptions = async () => {
    try {
      const res = await api.get("/prescriptions");
      if (res.data?.prescriptions?.length > 0) {
        setPrescriptions(res.data.prescriptions);
      }
    } catch (err) {
      // Fallback to mock
    }
  };

  useEffect(() => {
    fetchPrescriptions();
  }, [user]);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(""), 3000);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 10 * 1024 * 1024) {
      showToast("File size must be under 10 MB.");
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      await api.post("/prescriptions", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      showToast("Prescription uploaded for review!");
      fetchPrescriptions();
    } catch (err) {
      // Local fallback mock item
      const newRx = {
        id: `local-rx-${Date.now()}`,
        doctorName: file.name.replace(/\.[^/.]+$/, ""),
        uploadDate: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }),
        medicinesCount: 2,
        status: "Pending review",
        fileUrl: "#",
      };
      setPrescriptions((prev) => [newRx, ...prev]);
      showToast("Prescription uploaded for review!");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const displayPrescriptions = prescriptions.length > 0 ? prescriptions : MOCK_PRESCRIPTIONS;

  return (
    <ProfileLayout activeTab="prescriptions" pageName="My Prescriptions">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 left-1/2 -translate-x-1/2 z-[99999] px-5 py-3 rounded-2xl bg-[#0B2616] text-emerald-50 text-xs font-bold shadow-md">
          {toastMessage}
        </div>
      )}

      {/* 1. Header Card */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "1px solid #ECECE6",
          borderRadius: "20px",
          boxShadow: "0 1px 2px rgba(16,24,40,.04)",
          padding: "24px 28px",
        }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
      >
        <div>
          <h1
            style={{
              fontSize: "30px",
              fontWeight: 800,
              color: "#101828",
              lineHeight: "36px",
            }}
            className="m-0"
          >
            My Prescriptions
          </h1>
          <p
            style={{
              fontSize: "15px",
              color: "#667085",
              marginTop: "4px",
            }}
            className="m-0"
          >
            Upload a prescription and order your medicines in one tap.
          </p>
        </div>

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            height: "44px",
            borderRadius: "999px",
            backgroundColor: "#F5B800",
            color: "#101828",
            fontSize: "14px",
            fontWeight: 700,
            padding: "0 22px",
          }}
          className="hover:brightness-105 transition-all shadow-xs cursor-pointer inline-flex items-center gap-1.5 self-start sm:self-auto"
        >
          <Plus size={16} />
          <span>Upload prescription</span>
        </button>
      </div>

      {/* 2. Dashed upload box */}
      <div
        style={{
          backgroundColor: "#FFFFFF",
          border: "2px dashed #D0D5DD",
          borderRadius: "20px",
          padding: "32px 24px",
        }}
        className="flex flex-col items-center justify-center text-center gap-3"
      >
        <div
          style={{
            width: "56px",
            height: "56px",
            borderRadius: "999px",
            backgroundColor: "#F4F5F8",
            color: "#667085",
          }}
          className="flex items-center justify-center shrink-0"
        >
          <Upload size={24} />
        </div>
        <div>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "#101828" }} className="m-0">
            Upload doctor's prescription
          </h2>
          <p style={{ fontSize: "13px", color: "#667085", marginTop: "4px" }} className="m-0">
            JPG, PNG or PDF up to 10 MB
          </p>
        </div>
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          style={{
            height: "44px",
            borderRadius: "999px",
            border: "1px solid #D0D5DD",
            backgroundColor: "#FFFFFF",
            color: "#101828",
            fontSize: "14px",
            fontWeight: 600,
            padding: "0 24px",
          }}
          className="hover:bg-slate-50 transition-colors cursor-pointer"
        >
          {uploading ? "Uploading..." : "Choose file"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept=".jpg,.jpeg,.png,.webp,.pdf"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* 3. Prescriptions Stack of Cards */}
      <div className="flex flex-col gap-4">
        {displayPrescriptions.map((rx) => {
          const statusStr = (rx.status || "").toLowerCase();
          const isVerified = statusStr.includes("verif");
          const isPending = statusStr.includes("pend");
          const isExpired = statusStr.includes("expir");

          return (
            <div
              key={rx.id}
              style={{
                backgroundColor: "#FFFFFF",
                border: "1px solid #ECECE6",
                borderRadius: "20px",
                boxShadow: "0 1px 2px rgba(16,24,40,.04)",
                padding: "20px 24px",
              }}
              className="flex items-center justify-between gap-4 flex-wrap sm:flex-nowrap"
            >
              {/* Left: 64x76 document-icon thumb */}
              <div
                style={{
                  width: "64px",
                  height: "76px",
                  borderRadius: "14px",
                  backgroundColor: "#F4F5F8",
                  border: "1px solid #ECECE6",
                  color: "#667085",
                }}
                className="flex items-center justify-center shrink-0"
              >
                <FileText size={28} />
              </div>

              {/* Middle: Doctor name, upload date, status pill */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3
                    style={{
                      fontSize: "16px",
                      fontWeight: 800,
                      color: "#101828",
                    }}
                    className="m-0 truncate"
                  >
                    {rx.doctorName || rx.title || "Prescription Document"}
                  </h3>

                  {/* Status pill (rounded-full, 12-13px, 700) */}
                  <span
                    style={{
                      fontSize: "12px",
                      fontWeight: 700,
                      borderRadius: "999px",
                      padding: "2px 10px",
                      backgroundColor: isVerified
                        ? "#E6F4EA"
                        : isPending
                        ? "#FFF4CC"
                        : "#FDECEC",
                      color: isVerified
                        ? "#16603A"
                        : isPending
                        ? "#7A5A00"
                        : "#A12121",
                    }}
                  >
                    {rx.status || (isVerified ? "Verified" : isPending ? "Pending review" : "Expired")}
                  </span>
                </div>

                <p
                  style={{
                    fontSize: "13px",
                    color: "#667085",
                    marginTop: "4px",
                  }}
                  className="m-0"
                >
                  Uploaded {rx.uploadDate || "Recent"} · {rx.medicinesCount || 3} medicines
                </p>
              </div>

              {/* Right: View (ghost) + Order medicines/Upload new (primary) */}
              <div className="flex items-center gap-2.5 shrink-0">
                <button
                  type="button"
                  onClick={() => showToast("Opening prescription preview...")}
                  style={{
                    height: "44px",
                    borderRadius: "999px",
                    border: "1px solid #D0D5DD",
                    backgroundColor: "#FFFFFF",
                    color: "#101828",
                    fontSize: "14px",
                    fontWeight: 600,
                    padding: "0 20px",
                  }}
                  className="hover:bg-slate-50 transition-colors cursor-pointer"
                >
                  View
                </button>

                {isExpired ? (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    style={{
                      height: "44px",
                      borderRadius: "999px",
                      backgroundColor: "#F5B800",
                      color: "#101828",
                      fontSize: "14px",
                      fontWeight: 700,
                      padding: "0 20px",
                    }}
                    className="hover:brightness-105 transition-all shadow-xs cursor-pointer"
                  >
                    Upload new
                  </button>
                ) : (
                  <button
                    type="button"
                    disabled={isPending}
                    onClick={() => showToast("Order medicines request received!")}
                    style={{
                      height: "44px",
                      borderRadius: "999px",
                      backgroundColor: "#F5B800",
                      color: "#101828",
                      fontSize: "14px",
                      fontWeight: 700,
                      padding: "0 20px",
                    }}
                    className="hover:brightness-105 transition-all shadow-xs cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Order medicines
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </ProfileLayout>
  );
}
