"use client";
import { useParams } from "react-router-dom";

export default function Conference() {
  const { slug = "" } = useParams<{ slug: string }>();

  const conferences = [
    {
      monthYear: "052022",
      btn: "Click here to Download SEASON OF REVIVAL - MAY 2022 Song Sheet",
      file: "/images/conference/May 2022.pdf",
    },
    {
      monthYear: "112022",
      btn: "Click here to Download Advance - November 2022 Song Sheet",
      file: "/images/conference/November 2022.pdf",
    },
    {
      monthYear: "052023",
      btn: "Click here to Download Fulfilling our Task - May 2023 Song Sheet",
      file: "/images/conference/MAY 2023.pdf",
    },
    {
      monthYear: "122023",
      btn: "Click here to Download Mission Ready! - December 2023 Song Sheet",
      file: "/images/conference/December 2023.pdf",
    },
    {
      monthYear: "052024",
      btn: "Click here to Regions Beyond! - May 2024 Song Sheet",
      file: "/images/conference/May 2024.pdf",
    },
    {
      monthYear: "112024",
      btn: "Click here to Download - November 2024 Song Sheet",
      file: "/images/conference/112024.pdf",
    },
    {
      monthYear: "052025",
      btn: "Click here to Download - May 2025 Song Sheet",
      file: "/images/conference/May2025.pdf",
    },
    {
      monthYear: "112025",
      btn: "Click here to Download - November 2025 Song Sheet",
      file: "/images/conference/Nov2025.pdf",
    },
    {
      monthYear: "052026",
      btn: "Click here to Download - May 2026 Song Sheet",
      file: "/images/conference/May 2026.pdf",
    },
  ];

  const conference = conferences.find((c) => c.monthYear === slug);

  if (!conference) {
    return (
      <section className="hero container mx-auto mt-25">
        <p className="text-center">Conference not found.</p>
      </section>
    );
  }

  return (
    <div className="mt-23">
      <iframe src={conference.file} style={{ width: "100%", height: "80vh" }} title="PDF Viewer" />
    </div>
  );
}
