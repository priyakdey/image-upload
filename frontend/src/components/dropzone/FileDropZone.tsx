import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import uploadIcon from "../../assets/exit.svg";
import "./FileDropZone.css";

interface FileDropZoneProps {
  location: string | null;
  setLocation: (l: string | null) => void;
  setId: (i: string | null) => void;
  setIsUploading: (isUploading: boolean) => void;
}

function FileDropZone({
                        location,
                        setLocation,
                        setId,
                        setIsUploading
                      }: FileDropZoneProps) {


  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (acceptedFiles.length === 0) {
      toast.warning("Upload a file", {
        position: "bottom-right",
        theme: localStorage.getItem("theme") ?? "light"
      });
      return;
    }

    const file = acceptedFiles[0];

    if (!file) {
      toast.warning("Upload a file", {
        position: "bottom-right",
        theme: localStorage.getItem("theme") ?? "light"
      });
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    setIsUploading(true);
    let message = "";
    let isSuccess = false;

    try {
      const res = await fetch("http://localhost:3000/api/upload", {
        method: "POST",
        body: formData
      });

      const status = res.status;
      if (status === 400 || status === 413 || status === 500) {
        const body = await res.json();
        message = body.message;
        console.error("EXPECTED", status, body);
        return;
      } else if (status !== 201) {
        message = "Something went wrong. Please try again later.";
        console.error("UNEXPECTED", status);
        return;
      }

      message = "Uploaded file successfully.";
      isSuccess = true;
      const location = res.headers.get("Location");
      setLocation(location);
      setId((await res.json()).id);
    } catch(error) {
      message = "Something went wrong. Please try again later.";
      console.error(error);
    } finally {
      setTimeout(() => {
        setIsUploading(false);
        if (isSuccess) {
          toast.info(message, {
            position: "bottom-right",
            theme: localStorage.getItem("theme") ?? "light"
          });
        } else {
          toast.error(message, {
            position: "bottom-right",
            theme: localStorage.getItem("theme") ?? "light"
          });
        }
      }, 5000);
    }
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

export default FileDropZone;