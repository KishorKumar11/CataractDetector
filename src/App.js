import React, { useRef, useState } from "react";
import "./App.css";

function App() {
  // Refs for DOM elements
  const fileUploadRef = useRef();
  const imageCanvasRef = useRef();
  const pupilOverlayRef = useRef();
  const analyzeBtnRef = useRef();
  const resetBtnRef = useRef();
  const uploadContainerRef = useRef();
  const imagePreviewContainerRef = useRef();
  const initialStateRef = useRef();
  const resultsContainerRef = useRef();
  const resultCardRef = useRef();
  const resultIconRef = useRef();
  const resultTitleRef = useRef();
  const resultDescriptionRef = useRef();
  const analysisDetailsRef = useRef();
  const [showUploadBox, setShowUploadBox] = useState(true);

  // Helper functions
  const preventDefaults = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const highlight = () => {
    if (uploadContainerRef.current)
      uploadContainerRef.current.parentElement.classList.add("border-blue-400");
    if (uploadContainerRef.current)
      uploadContainerRef.current.parentElement.classList.remove(
        "border-gray-300"
      );
  };

  const unhighlight = () => {
    if (uploadContainerRef.current)
      uploadContainerRef.current.parentElement.classList.remove(
        "border-blue-400"
      );
    if (uploadContainerRef.current)
      uploadContainerRef.current.parentElement.classList.add("border-gray-300");
  };

  // Handle image upload
  const handleImageUpload = (e) => {
    const file = fileUploadRef.current.files[0];
    if (!file) return;
    if (!file.type.match("image.*")) {
      alert("Please upload an image file (JPEG, PNG)");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      alert("File size should be less than 5MB");
      return;
    }
    const reader = new window.FileReader();
    reader.onload = function (ev) {
      const img = new window.Image();
      img.onload = function () {
        // Set canvas dimensions
        const maxWidth = 500;
        const maxHeight = 400;
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height *= maxWidth / width;
          width = maxWidth;
        }
        if (height > maxHeight) {
          width *= maxHeight / height;
          height = maxHeight;
        }
        const canvas = imageCanvasRef.current;
        const ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        ctx.drawImage(img, 0, 0, width, height);
        // Show preview and hide upload section
        if (imagePreviewContainerRef.current) {
          imagePreviewContainerRef.current.classList.remove("hidden");
        }
        if (uploadContainerRef.current) {
          uploadContainerRef.current.classList.add("hidden");
        }
        setShowUploadBox(false); // Hide upload box
      };
      img.src = ev.target.result;
    };
    reader.readAsDataURL(file);
  };

  // Analyze image (simulated)
  const analyzeImage = () => {
    const btn = analyzeBtnRef.current;
    btn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Analyzing...';
    btn.disabled = true;
    setTimeout(() => {
      const hasCataract = Math.random() > 0.5;
      const severity = hasCataract
        ? Math.random() > 0.5
          ? "Moderate"
          : "Early"
        : "None";
      const confidence = Math.floor(Math.random() * 30) + 70;
      displayResults(hasCataract, severity, confidence);
      btn.innerHTML = '<i class="fas fa-search mr-2"></i> Analyze';
      btn.disabled = false;
    }, 2000);
  };

  // Display analysis results
  const displayResults = (hasCataract, severity, confidence) => {
    initialStateRef.current.classList.add("hidden");
    resultsContainerRef.current.classList.remove("hidden");
    if (hasCataract) {
      resultIconRef.current.innerHTML =
        '<i class="fas fa-exclamation-triangle text-yellow-500"></i>';
      resultTitleRef.current.textContent = "Potential Cataract Detected";
      resultDescriptionRef.current.textContent = `Our analysis detected signs of ${severity.toLowerCase()} cataracts with ${confidence}% confidence.`;
      resultCardRef.current.className = resultCardRef.current.className
        .replace(/from-[a-z]+-50/g, "from-yellow-50")
        .replace(/to-[a-z]+-50/g, "to-orange-50")
        .replace(/border-[a-z]+-100/g, "border-yellow-100");
      resultCardRef.current.classList.add("pulse");
    } else {
      resultIconRef.current.innerHTML =
        '<i class="fas fa-check-circle text-green-500"></i>';
      resultTitleRef.current.textContent = "No Cataract Detected";
      resultDescriptionRef.current.textContent = `Our analysis found no significant signs of cataracts (${confidence}% confidence).`;
      resultCardRef.current.className = resultCardRef.current.className
        .replace(/from-[a-z]+-50/g, "from-green-50")
        .replace(/to-[a-z]+-50/g, "to-teal-50")
        .replace(/border-[a-z]+-100/g, "border-green-100");
      resultCardRef.current.classList.remove("pulse");
    }
    analysisDetailsRef.current.innerHTML = "";
    const details = [
      {
        title: "Cloudiness Detection",
        value: hasCataract ? "Detected" : "Not Detected",
        icon: hasCataract
          ? "fa-cloud text-yellow-500"
          : "fa-sun text-green-500",
        description: hasCataract
          ? "The lens appears cloudy, which is a common sign of cataracts."
          : "The lens appears clear with no significant cloudiness.",
      },
      {
        title: "Severity Level",
        value: severity,
        icon:
          severity === "None"
            ? "fa-smile text-green-500"
            : severity === "Early"
            ? "fa-meh text-yellow-500"
            : "fa-frown text-orange-500",
        description:
          severity === "None"
            ? "No signs of cataract development."
            : severity === "Early"
            ? "Early signs detected. Regular monitoring recommended."
            : "Moderate signs detected. Consultation with a specialist recommended.",
      },
      {
        title: "Confidence Level",
        value: `${confidence}%`,
        icon:
          "fa-chart-line " +
          (confidence > 85
            ? "text-green-500"
            : confidence > 75
            ? "text-yellow-500"
            : "text-orange-500"),
        description:
          confidence > 85
            ? "High confidence in analysis results."
            : confidence > 75
            ? "Moderate confidence in analysis results."
            : "Lower confidence in analysis results. Consider retaking the image.",
      },
    ];
    details.forEach((detail) => {
      const detailElement = document.createElement("div");
      detailElement.className = "flex items-start";
      detailElement.innerHTML = `
        <div class="flex-shrink-0 mr-4 mt-1">
          <i class="fas ${detail.icon} text-lg"></i>
        </div>
        <div>
          <h4 class="font-medium text-gray-800">${detail.title}</h4>
          <div class="flex items-center mt-1">
            <span class="font-medium ${
              hasCataract ? "text-yellow-600" : "text-green-600"
            }">${detail.value}</span>
            <span class="mx-2 text-gray-300">|</span>
            <span class="text-sm text-gray-500">${detail.description}</span>
          </div>
        </div>
      `;
      analysisDetailsRef.current.appendChild(detailElement);
    });
    // Add pupil overlay for visualization
    const canvasRect = imageCanvasRef.current.getBoundingClientRect();
    const pupilSize = Math.min(canvasRect.width, canvasRect.height) * 0.3;
    pupilOverlayRef.current.style.width = `${pupilSize}px`;
    pupilOverlayRef.current.style.height = `${pupilSize}px`;
    pupilOverlayRef.current.style.left = `${
      canvasRect.width / 2 - pupilSize / 2
    }px`;
    pupilOverlayRef.current.style.top = `${
      canvasRect.height / 2 - pupilSize / 2
    }px`;
    pupilOverlayRef.current.style.borderColor = hasCataract
      ? "rgba(255, 165, 0, 0.7)"
      : "rgba(0, 255, 0, 0.7)";
    pupilOverlayRef.current.classList.remove("hidden");
  };

  // Reset the app
  const resetApp = () => {
    if (fileUploadRef.current) {
      fileUploadRef.current.value = "";
    }
    if (imagePreviewContainerRef.current) {
      imagePreviewContainerRef.current.classList.add("hidden");
    }
    if (resultsContainerRef.current) {
      resultsContainerRef.current.classList.add("hidden");
    }
    if (initialStateRef.current) {
      initialStateRef.current.classList.remove("hidden");
    }
    if (pupilOverlayRef.current) {
      pupilOverlayRef.current.classList.add("hidden");
    }
    setShowUploadBox(true); // Show upload box again
    const canvas = imageCanvasRef.current;
    const ctx = canvas.getContext("2d");
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  };

  // Drag and drop event listeners
  React.useEffect(() => {
    const uploadContainer = uploadContainerRef.current;
    if (!uploadContainer) return;
    const dragEvents = ["dragenter", "dragover", "dragleave", "drop"];
    dragEvents.forEach((eventName) => {
      uploadContainer.addEventListener(eventName, preventDefaults, false);
    });
    ["dragenter", "dragover"].forEach((eventName) => {
      uploadContainer.addEventListener(eventName, highlight, false);
    });
    ["dragleave", "drop"].forEach((eventName) => {
      uploadContainer.addEventListener(eventName, unhighlight, false);
    });
    uploadContainer.addEventListener(
      "drop",
      (e) => {
        const dt = e.dataTransfer;
        const files = dt.files;
        if (files.length && files[0].type.match("image.*")) {
          fileUploadRef.current.files = files;
          handleImageUpload();
        }
      },
      false
    );
    // Cleanup
    return () => {
      dragEvents.forEach((eventName) => {
        uploadContainer.removeEventListener(eventName, preventDefaults, false);
      });
      ["dragenter", "dragover"].forEach((eventName) => {
        uploadContainer.removeEventListener(eventName, highlight, false);
      });
      ["dragleave", "drop"].forEach((eventName) => {
        uploadContainer.removeEventListener(eventName, unhighlight, false);
      });
      uploadContainer.removeEventListener("drop", handleImageUpload, false);
    };
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl font-bold text-blue-800 mb-3">CataractEye</h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            A simple tool to help detect potential cataract symptoms from eye
            images.
            <span className="block text-sm text-gray-500 mt-2">
              This is for educational purposes only. Always consult an
              ophthalmologist.
            </span>
          </p>
        </header>

        {/* Main Content */}
        <div className="flex flex-col lg:flex-row gap-8">
          <div className="w-full lg:w-1/2 bg-white rounded-xl shadow-md p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Upload Eye Image
              </h2>
              <p className="text-gray-600">
                Upload a clear photo of the eye (preferably with flash in a dark
                room)
              </p>
            </div>
            {/* Only show upload area if preview is hidden */}
            {showUploadBox && (
              <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center mb-6 hover:border-blue-400 transition-colors duration-300">
                <div
                  id="upload-container"
                  ref={uploadContainerRef}
                  className="cursor-pointer"
                >
                  <i className="fas fa-cloud-upload-alt text-5xl text-blue-400 mb-4"></i>
                  <p className="text-gray-600 mb-2">
                    Drag & drop your image here or click to browse
                  </p>
                  <p className="text-sm text-gray-500">
                    Supported formats: JPG, PNG (Max 5MB)
                  </p>
                  <input
                    type="file"
                    id="file-upload"
                    ref={fileUploadRef}
                    className="file-upload hidden"
                    accept="image/*"
                    onChange={handleImageUpload}
                    style={{ display: "none" }}
                  />
                  <button
                    id="upload-btn"
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
                    onClick={() => fileUploadRef.current.click()}
                  >
                    Select Image
                  </button>
                </div>
              </div>
            )}
            {/* Center align preview image */}
            <div
              id="image-preview-container"
              ref={imagePreviewContainerRef}
              className="hidden"
            >
              <div className="flex justify-center items-center">
                <div className="canvas-container">
                  <canvas
                    id="image-canvas"
                    ref={imageCanvasRef}
                    className="max-w-full h-auto rounded-lg shadow"
                  ></canvas>
                  <div
                    id="pupil-overlay"
                    ref={pupilOverlayRef}
                    className="pupil-overlay hidden"
                  ></div>
                </div>
              </div>
              <div className="flex justify-center mt-4 space-x-3">
                <button
                  id="analyze-btn"
                  ref={analyzeBtnRef}
                  className="bg-green-500 hover:bg-green-600 text-white font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  onClick={analyzeImage}
                >
                  <i className="fas fa-search mr-2"></i> Analyze
                </button>
                <button
                  id="reset-btn"
                  ref={resetBtnRef}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-6 rounded-full transition-colors duration-300"
                  onClick={resetApp}
                >
                  <i className="fas fa-times mr-2"></i> Remove
                </button>
              </div>
            </div>
          </div>
          {/* Results Section */}
          <div className="w-full lg:w-1/2">
            <div className="bg-white rounded-xl shadow-md p-6 h-full">
              <h2 className="text-2xl font-semibold text-gray-800 mb-6">
                Analysis Results
              </h2>
              <div
                id="initial-state"
                ref={initialStateRef}
                className="text-center py-12"
              >
                <div className="inline-block bg-blue-50 rounded-full p-6 mb-6">
                  <i className="fas fa-eye text-5xl text-blue-400"></i>
                </div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  No Image Analyzed
                </h3>
                <p className="text-gray-500">
                  Upload an eye image to check for potential cataract symptoms
                </p>
              </div>
              <div
                id="results-container"
                ref={resultsContainerRef}
                className="hidden"
              >
                <div className="grid grid-cols-1 gap-4 mb-6">
                  <div
                    id="result-card"
                    ref={resultCardRef}
                    className="result-card bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100"
                  >
                    <div className="flex items-start">
                      <div
                        id="result-icon"
                        ref={resultIconRef}
                        className="mr-4 mt-1 text-3xl"
                      ></div>
                      <div>
                        <h3
                          id="result-title"
                          ref={resultTitleRef}
                          className="text-xl font-semibold mb-1"
                        ></h3>
                        <p
                          id="result-description"
                          ref={resultDescriptionRef}
                          className="text-gray-600"
                        ></p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="bg-gray-50 rounded-xl p-6">
                  <h3 className="font-medium text-gray-800 mb-3">
                    Detailed Analysis
                  </h3>
                  <div
                    id="analysis-details"
                    ref={analysisDetailsRef}
                    className="space-y-4"
                  >
                    {/* Dynamically filled by JS */}
                  </div>
                </div>
                <div className="mt-6 bg-yellow-50 border-l-4 border-yellow-400 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0 text-yellow-400">
                      <i className="fas fa-exclamation-circle"></i>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-yellow-700">
                        <strong>Disclaimer:</strong> This tool provides
                        preliminary information only and is not a substitute for
                        professional medical advice. Always consult an eye care
                        specialist for diagnosis.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Information Section */}
        <div className="mt-16 bg-white rounded-xl shadow-md p-6">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">
            About Cataracts
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-blue-50 rounded-lg p-5 border border-blue-100">
              <div className="text-blue-500 mb-3 text-2xl">
                <i className="fas fa-info-circle"></i>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                What are Cataracts?
              </h3>
              <p className="text-gray-600 text-sm">
                A cataract is a clouding of the eye's natural lens, which lies
                behind the iris and the pupil. It's the most common cause of
                vision loss in people over 40.
              </p>
            </div>
            <div className="bg-green-50 rounded-lg p-5 border border-green-100">
              <div className="text-green-500 mb-3 text-2xl">
                <i className="fas fa-list-alt"></i>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                Common Symptoms
              </h3>
              <ul className="text-gray-600 text-sm space-y-1">
                <li>
                  <i className="fas fa-check-circle text-green-400 mr-1"></i>{" "}
                  Clouded or blurred vision
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-400 mr-1"></i>{" "}
                  Difficulty with night vision
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-400 mr-1"></i>{" "}
                  Sensitivity to light and glare
                </li>
                <li>
                  <i className="fas fa-check-circle text-green-400 mr-1"></i>{" "}
                  Fading or yellowing of colors
                </li>
              </ul>
            </div>
            <div className="bg-purple-50 rounded-lg p-5 border border-purple-100">
              <div className="text-purple-500 mb-3 text-2xl">
                <i className="fas fa-stethoscope"></i>
              </div>
              <h3 className="font-medium text-gray-800 mb-2">
                When to See a Doctor
              </h3>
              <p className="text-gray-600 text-sm">
                If you experience any vision changes like blurred vision, glare,
                or difficulty seeing at night, schedule an appointment with an
                ophthalmologist for a comprehensive eye exam.
              </p>
            </div>
          </div>
        </div>
        {/* Footer */}
        <footer className="mt-12 text-center text-gray-500 text-sm">
          <p>This is a demonstration tool for educational purposes only</p>
          <p className="mt-1">© 2024 CataractEye</p>
        </footer>
      </div>
    </div>
  );
}

export default App;
