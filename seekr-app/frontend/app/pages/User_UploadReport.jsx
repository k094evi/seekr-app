import React, { useState } from "react";
import { Upload, Trash2, CheckCircle, Calendar } from "lucide-react";

const UploadReport = () => {
  const [step, setStep] = useState(1);
  const [image, setImage] = useState(null);
  const [formData, setFormData] = useState({
    itemName: "",
    lostFound: "",
    color: "",
    brand: "",
    description: "",
    location: "",
    locationDescription: "",
    dateReported: "",
    firstName: "",
    middleName: "",
    lastName: "",
    occupation: "",
    program: "",
    email: "",
  });

  const colors = ["Red", "Orange", "Yellow", "Green", "Blue", "Indigo", "Violet", "Others"];
  const locations = [
    "Atrium", "Lobby", "Library", "Cafeteria", "Gymnasium", "Parking Area",
    "Computer Lab", "Nursing Lab", "Accounting Office", "Registrar’s Office",
    "Guidance Office", "Student Center", "Admin Office",
    "Clinic", "Faculty Room", "AVR (Audio Visual Room)",
    "Stairs", "Comfort Room", "Multi Purpose Hall A", "Multi Purpose Hall B",
    "Multi Purpose Hall C", "Lecture Hall A", "Lecture Hall B",
    "Lecture Hall C", "Others",
  ];
  const occupations = ["Student", "Admin", "Staff", "Maintenance", "Faculty"];
  const programs = ["NOT APPLICABLE", "BSIT", "BSPSY", "BSHNCA", "BACOMM", "BSN", "BSBA MM", "BSBA FM", "BSA", "BSE", "BSHM", "BSTM"];

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file && (file.type === "image/png" || file.type === "image/jpeg")) {
      const reader = new FileReader();
      reader.onloadend = () => setImage(reader.result);
      reader.readAsDataURL(file);
    } else {
      alert("Only PNG and JPG files are allowed!");
    }
  };

  const isStepValid = () => {
    if (step === 1) {
      return (
        formData.itemName &&
        formData.lostFound &&
        formData.color &&
        formData.brand &&
        formData.description &&
        formData.location &&
        formData.locationDescription &&
        formData.dateReported &&
        image
      );
    }
    return true;
  };

  const nextStep = () => {
    if (isStepValid()) setStep(step + 1);
    else alert("Please fill out all fields before continuing!");
  };

  const prevStep = () => setStep(step - 1);
  const handleResetImage = () => setImage(null);

  const handleSubmit = async () => {
    try {
    let user = null;
      try {
        user = JSON.parse(localStorage.getItem("user"));
      } catch (err) {
        console.warn("⚠️ Failed to parse user from localStorage:", err);
      }

      const loggedInUserId = user && user.user_id ? user.user_id : null;

      if (!loggedInUserId) {
        alert("You must be logged in to submit a report.");
        return;
      }

      const form = new FormData();
      let endpoint = "";

        if (formData.lostFound === "Lost") {
          endpoint = "http://localhost:5000/api/reports/lost";
          form.append("user_id", loggedInUserId);
          form.append("item_lost", formData.itemName);
          form.append("other_description", formData.description);
          form.append("color_name", formData.color);
          form.append("brand_lost", formData.brand);
          form.append("location_name", formData.location);
          form.append("location_description", formData.locationDescription);
          form.append("date_lost", formData.dateReported);
        } else if (formData.lostFound === "Found") {
        endpoint = "http://localhost:5000/api/reports/found";
        form.append("user_id", loggedInUserId);
        form.append("item_found", formData.itemName);
        form.append("description", formData.description);
        form.append("color_name", formData.color);
        form.append("brand_found", formData.brand);
        form.append("location_name", formData.location);
        form.append("location_description", formData.locationDescription);
        form.append("date_reported", formData.dateReported);
      } else {
        alert("Please select Lost or Found before submitting!");
        return;
      }

      if (image) {
        const blob = await (await fetch(image)).blob();
        form.append("image", blob, "upload.jpg");
      }

      const response = await fetch(endpoint, {
        method: "POST",
        body: form,
      });

      const result = await response.json();

      if (response.ok) {
        alert(result.message || "Report submitted successfully!");
        setFormData({
          itemName: "",
          lostFound: "",
          color: "",
          brand: "",
          description: "",
          location: "",
          locationDescription: "",
          dateReported: "",
          firstName: "",
          middleName: "",
          lastName: "",
          occupation: "",
          program: "",
          email: "",
        });
        setImage(null);
        setStep(1);
      } else {
        alert(result.error || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      alert("Failed to submit report. Please try again later.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4 sm:p-6">
      <div className="w-full max-w-3xl flex justify-start mb-6">
        <h2 className="text-4xl font-semibold text-[#3A0CA3] text-left">
          Upload Report
        </h2>
      </div>

      {/* Step Navigation */}
      <div className="relative flex justify-center items-center mb-4 w-full max-w-3xl">
        <div className="absolute top-5 w-full border-t-2 border-[#7209B7] z-0"></div>
        <div className="flex justify-between w-full relative z-10 px-2 sm:px-6">
          {[1, 2].map((num) => (
            <div key={num} className="flex flex-col items-center text-center">
              <div
                className={`w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center rounded-full text-white font-bold
                [box-shadow:inset_2.88px_2.88px_11.5px_0px_rgba(0,0,0,0.100),5.75px_5.75px_11.5px_0px_rgba(255,255,255,0.75)]
                ${step >= num ? "bg-[#3A0CA3]" : "bg-[#DCD6F7]"}`}
              >
                {num}
              </div>
              <span className="text-xs sm:text-sm mt-1 text-[#3A0CA3] font-medium">
                {num === 1 ? "Basic Info" : num === 2 ? "Confirm" : " "}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* STEP 1 - BASIC INFORMATION */}
      {step === 1 && (
        <div className="rounded-3xl shadow-2xl p-5 sm:p-6 w-full max-w-3xl bg-[#DCD6F7]">
          <h2 className="text-2xl font-bold text-[#3A0CA3] mb-3">
            Basic Information
          </h2>

          <div className="flex flex-col md:flex-row gap-4 items-center md:items-start">
            {/* Image Upload */}
            <div className="flex flex-col items-center justify-center w-full md:w-auto">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Preview"
                    className="w-36 h-36 md:w-40 md:h-40 object-cover rounded-lg"
                  />
                  <button
                    onClick={handleResetImage}
                    className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ) : (
                <label className="flex flex-col items-center justify-center w-36 h-36 md:w-40 md:h-40 border-2 border-dashed border-[#3A0CA3] rounded-2xl cursor-pointer hover:bg-purple-50 transition-colors text-center p-3">
                  <Upload size={24} className="text-purple-500 mb-1" />
                  <span className="text-xs text-purple-700 font-medium">
                    Upload Image
                  </span>
                  <input
                    type="file"
                    accept="image/png, image/jpeg"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </label>
              )}
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 flex-1 text-[#3A0CA3] w-full">
              <label>
                Item Name
                <input
                  type="text"
                  name="itemName"
                  placeholder="e.g. iPhone 13"
                  value={formData.itemName}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </label>

              <label>
                Lost/Found
                <select
                  name="lostFound"
                  value={formData.lostFound}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select</option>
                  <option value="Lost">Lost</option>
                  <option value="Found">Found</option>
                </select>
              </label>

              <label>
                Color
                <select
                  name="color"
                  value={formData.color}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Color</option>
                  {colors.map((c) => (
                    <option key={c}>{c}</option>
                  ))}
                </select>
              </label>

              <label>
                Brand
                <input
                  type="text"
                  name="brand"
                  placeholder="e.g. Apple"
                  value={formData.brand}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </label>

              <label className="md:col-span-2">
                Other Notable Description
                <input
                  type="text"
                  name="description"
                  placeholder="e.g. Blue phone case, small scratch on back"
                  value={formData.description}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </label>

              <label>
                Location
                <select
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                >
                  <option value="">Select Location</option>
                  {locations.map((loc) => (
                    <option key={loc}>{loc}</option>
                  ))}
                </select>
              </label>

              <label>
                Location Description
                <input
                  type="text"
                  name="locationDescription"
                  placeholder="e.g. Near the vending machine"
                  value={formData.locationDescription}
                  onChange={handleChange}
                  className="h-[32px] border p-2 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none"
                />
              </label>

              <label className="md:col-span-2 relative">
                Date Reported
                <div className="relative">
                  <input
                    type="date"
                    name="dateReported"
                    value={formData.dateReported}
                    onChange={handleChange}
                    className="h-[32px] border p-2 pr-10 shadow rounded-full w-full bg-white focus:ring-2 focus:ring-purple-500 outline-none text-[#3A0CA3]"
                  />
                  <Calendar
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#3A0CA3] cursor-pointer"
                    onClick={() =>
                      document.querySelector('input[name="dateReported"]').showPicker?.()
                    }
                  />
                </div>
              </label>

              <div className="flex justify-end md:col-span-2 mt-2">
                <button
                  onClick={nextStep}
                  className="bg-[#3A0CA3] text-[#E6DEFF] px-5 py-1.5 rounded-full hover:bg-purple-700 transition"
                >
                  Next
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* STEP 2 - CONFIRMATION */}
      {step === 2 && (
        <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md text-center mx-auto">
          <CheckCircle size={60} className="text-[#3A0CA3] mx-auto mb-4" />
          <p className="text-[#7209B7] mb-6">
            I understand that all found items must be surrendered to the Student
            Discipline Department (SDD) to approve submitted report. I confirm
            that all information I provided is true and accurate to the best of
            my knowledge.
          </p>
          <div className="flex justify-between">
            <button
              onClick={prevStep}
              className="bg-[#3A0CA3] text-[#E6DEFF] px-6 py-2 rounded-full hover:bg-purple-700"
            >
              Back
            </button>
            <button
              onClick={handleSubmit}
              className="bg-[#3A0CA3] text-[#E6DEFF] px-6 py-2 rounded-full hover:bg-purple-700"
            >
              Agree and Submit
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UploadReport;