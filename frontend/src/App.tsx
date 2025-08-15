import { useState } from "react";
import downloadSvg from "./assets/download.svg";
import shareSvg from "./assets/Link.svg";
import AppDropZone from "./components/dropzone/AppDropZone.tsx";
import Header from "./components/header/Header.tsx";
import "./App.css";


function App() {
  const [ location, setLocation ] = useState<string | null>(null);

  function copyToClipboard(): void {
    const url = location!;
    navigator.clipboard.writeText(url)
      .catch((err) => console.error(err));  // TODO: handle error
  }

  function downloadImage() {
    const url = location!;
    fetch(url)
      .catch((err) => console.error(err));  // TODO: handle error
  }

  return (
    <>
      <Header />
      <main>
        <div className="outer-container">
          <AppDropZone location={location} setLocation={setLocation} />
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
