import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import uploadIcon from "../../assets/exit.svg";
import "./AppDropZone.css";

interface AppDropZoneProps {
  location: string | null;
  setLocation: (l: string | null) => void;
}

function AppDropZone({ location, setLocation }: AppDropZoneProps) {
  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("http://localhost:3000/api/upload", {
      method: "POST",
      body: formData
    });

    const status = res.status;
    if (status === 400 || status === 413 || status === 500) {
      const body = await res.json();
      console.error("EXPECTED", status, body);
      return;
    } else if (status !== 201) {
      console.error("UNEXPECTED", status);
    }

    const location = res.headers.get("Location");
    setLocation(location);
  }, []);

  const {
    getRootProps,
    getInputProps
  } = useDropzone({
    accept: {
      "image/png": [ ".png" ],
      "image/jpeg": [ ".jpg", ".jpeg" ],
      "image/gif": [ ".gif" ]
    },
    maxSize: 2 * 1024 * 1024,
    maxFiles: 1,
    onDrop
  });


  return (
    <div className="inner-container" {...getRootProps()}>
      {
        location === null
          ? (
            <>
              <div className="icon-container">
                <img src={uploadIcon} alt="upload image"
                     className="upload-icon" />
              </div>
              <div className="text-container">
                <input {...getInputProps()} />
                <p className="text">
                  Drag & drop a file or
                  <span className="browse-file"> browse files</span>
                </p>
                <p className="subtext">JPG, PNG or GIF - Max file size 2MB</p>
              </div>
            </>
          )
          : <img
            src={location}
            alt="uploaded image"
            className="uploaded-image"
          />
      }
    </div>
  );
}

export default AppDropZone;