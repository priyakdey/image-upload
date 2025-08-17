import { useState } from "react";
import { toast } from "react-toastify";
import downloadSvg from "../../assets/download.svg";
import shareSvg from "../../assets/Link.svg";
import FileDropZone from "./FileDropZone.tsx";
import "./FileDropZoneContainer.css"

interface FileDropZoneContainerProps {
  setIsUploading: (isUploading: boolean) => void;
}

function FileDropZoneContainer({ setIsUploading }: FileDropZoneContainerProps) {
  const [ location, setLocation ] = useState<string | null>(null);
  const [ id, setId ] = useState<string | null>(null);


  async function copyToClipboard(): Promise<void> {
    const url = location!;
    try {
      await navigator.clipboard.writeText(url);
      toast.info("URL copied to clipboard", {
        position: "bottom-right",
        theme: localStorage.getItem("theme") ?? "light"
      });
    } catch(err) {
      toast.error("Could not copy to clipboard", {
        position: "bottom-right",
        theme: localStorage.getItem("theme") ?? "light"
      });
      console.error("Could not copy to clipboard", err);
    }
  }

  async function downloadImage(): Promise<void> {
    const url = `http://localhost:3000/api/download/${id}`;

    const res = await fetch(url);

    if (!res.ok) {
      toast.error("Something went wrong. Please try again later.", {
        position: "bottom-right",
        theme: localStorage.getItem("theme") ?? "light"
      });
      console.error("Could not download image: ", res.status);
      return;
    }

    const blob = await res.blob();
    const filename = res.headers.get("Content-Disposition")?.split(";")[1].split("=")[1].trim();

    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = downloadUrl;
    a.download = filename!;

    document.body.appendChild(a);
    a.click();
    URL.revokeObjectURL(downloadUrl);
    a.remove();
  }

  return (
    <>
      <div className="outer-container">
        <FileDropZone
          location={location}
          setLocation={setLocation}
          setId={setId}
          setIsUploading={setIsUploading}
        />
      </div>
      {
        (location !== null && location !== "") && (
          <div className="btn-container">
            <button className="btn" onClick={copyToClipboard}>
              <img src={shareSvg} alt="share button" />
              Share
            </button>
            <button className="btn" onClick={downloadImage}>
              <img src={downloadSvg} alt="download button" />
              Download
            </button>
          </div>
        )
      }
    </>
  );
}

export default FileDropZoneContainer;