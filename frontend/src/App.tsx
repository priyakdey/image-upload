import uploadIcon from "./assets/exit.svg";
import Header from "./components/header/Header.tsx";
import "./App.css";


function App() {
  return (
    <>
      <Header />
      <main>
        <div className="outer-container">
          <div className="inner-container">
            <div className="icon-container">
              <img src={uploadIcon} alt="upload image" className="upload-icon" />
            </div>
            <div className="text-container">
              <p className="text">
                Drag & drop a file or
                <span className="browse-file"> browse files</span>
              </p>
              <p className="subtext">JPG, PNG or GIF - Max file size 2MB</p>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default App;
