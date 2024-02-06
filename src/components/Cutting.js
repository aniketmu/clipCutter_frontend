import React from "react";
import { useState, useRef } from "react";

function Cutting() {
//   const [exportLocation, setExportLocation] = useState("");
const fileInputRef = useRef(null); 
  const [startTime, setStartTime] = useState("");
  const [endTime, setEndTime] = useState("");
  const [clipDuration, setClipDuration] = useState("");
  const [message, setMessage] = useState("")

//   const handleExportLocationChange = (e) => {
//     const location = e.target.value;
//     setExportLocation(location);
//   };

  const [selectedFile, setSelectedFile] = useState(null);
  const [files, setFiles] = useState([]);

  const handleFileChange = (event) => {
    console.log(event.target.files[0]);
    setSelectedFile(event.target.files[0]);
  };
  const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submit action
    if (!selectedFile) {
      alert("Please select a file first!");
      return;
    }
    const formData = new FormData();
    formData.append("video", selectedFile); // 'video' is the field name expected by the server
    // formData.append('age', age);
    // formData.append("outputPath", exportLocation);
    // formData.append("start", exportLocation);
    formData.append("end", endTime);
    formData.append("clipsDur", clipDuration);
    try {
      console.log(formData);
      console.log("selected file", selectedFile);

      const response = await fetch("http://localhost:4000/api/videoclip", {
        method: "POST",
        body: formData, // Send the form data as the request body
        // Don't set Content-Type header, let the browser set it with the boundary
      });

      if (response.status === 200) {
        const result = await response.json();
        setMessage("Upload Successful !")
        console.log("Upload successful:", result.locations);
        setFiles(result.locations);
        // You can reset the form values if needed
        setSelectedFile(null);
        // setExportLocation("");
        fileInputRef.current.value = null
        setStartTime("");
        setEndTime("");
        setClipDuration("");
      } else {
        alert("Upload failed");
      }
    } catch (error) {
      console.error("Error uploading the file:", error);
      alert("Error uploading file");
    }
  };
  return (
    // <div><form onSubmit={
    //     handleSubmit
    // }>
    //     <label htmlFor="videoFile">Upload Video:</label>
    //     <input
    //         type="file"
    //         name='video'
    //         id="videoFile"
    //         accept="video/*" // Restrict file input to video files
    //         onChange={handleFileChange}
    //     />
    //     <button type="submit">Submit</button>

    // </form></div>

    <form
      className="video-form"
      onSubmit={handleSubmit}
      style={{ marginTop: "5%" }}
    >
      <h1>Video Cutter TruAD</h1>
      {message && (<h2 style={{color: "Green"}}>{message}</h2>)}
      {files &&
        files.map((file) => {
          return (
            <div key={file}>
              <video src={file} controls width={400} height={200} />
            </div>
          );
        })}

      <label>
        Import Video File:*
        <input
        ref={fileInputRef}
          type="file"
          name="video"
          id="videoFile"
          accept="video/*" // Restrict file input to video files
          onChange={handleFileChange}
          required
        />
      </label>

      {/* <label>
        Export Location:*
        <input
          type="text"
          value={exportLocation}
          required
          onChange={handleExportLocationChange}
        />
      </label> */}

      <label>
        Start Time:
        <input
          disabled
          type="text"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
        />
      </label>

      <label>
        End Time:
        <input
          disabled
          type="text"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
        />
      </label>

      <label>
        Clip Duration:*
        <input
          required
          type="text"
          value={clipDuration}
          onChange={(e) => setClipDuration(e.target.value)}
        />
      </label>

      <button type="submit">Submit</button>
    </form>
  );
}

export default Cutting;
