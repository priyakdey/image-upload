import { useState } from "react";
import downloadSvg from "./assets/download.svg";
import shareSvg from "./assets/Link.svg";
import FileDropZone from "./components/dropzone/FileDropZone.tsx";
import Header from "./components/header/Header.tsx";
import "./App.css";


function App() {
  const [ location, setLocation ] = useState<string | null>(null);
  const [ id, setId ] = useState<string | null>(null);

  function copyToClipboard(): void {
    const url = location!;
    navigator.clipboard.writeText(url)
      .catch((err) => console.error(err));  // TODO: handle error
  }

  async function downloadImage() {
    const url = `http://localhost:3000/api/download/${id}`;

    const res = await fetch(url);
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
      <Header />
      <main>
        <div className="outer-container">
          <FileDropZone
            location={location}
            setLocation={setLocation}
            setId={setId}
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
      </main>
    </>
  );
}

export default App;
