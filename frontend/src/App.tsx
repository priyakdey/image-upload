import { useState } from "react";
import { ToastContainer } from "react-toastify";
import FileDropZoneContainer
  from "./components/dropzone/FileDropZoneContainer.tsx";
import Header from "./components/header/Header.tsx";
import "./App.css";


function App() {
  const [ isUploading, setIsUploading ] = useState<boolean>(false);

  return (
    <>
      <Header />
      <main>
        {
          !isUploading ?
            <FileDropZoneContainer setIsUploading={setIsUploading} />
            :
            <p>Loading....</p>
        }
      </main>
      <ToastContainer />
    </>
  );
}

export default App;
