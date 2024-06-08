import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import { ID, account, db } from "@/utils/appwrite";
import { saveICToLocalStorage } from "@/utils/Localstorage";

const CreateIC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    office_address: "",
    reg_num: "",
    // bank_account: "",
    smart_phone: "",
    password: "",
    email: "",
    bus_name: "",
    phone_num1: "",
    phone_num2: "",
    branches: "",
    services: [],
  });
  const [isSuccessModalOpen, setSuccessModalOpen] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };


  const submitForm = async () => {
    try {
      const generateID = Math.random().toString(36).substring(2, 24);

      await account.create(
        generateID,
        formData.email, 
        formData.password,
        formData.bus_name
      );

      // Assuming you have a collection named 'registrations' in your Appwrite database
      const response = await db.createDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID,
        generateID,
        {
          
          office_address: formData.office_address,
          reg_num: formData.reg_num,
          // bank_account: formData.bank_account,
          smart_phone: formData.smart_phone,
          bus_name: formData.bus_name,
          phone_num1: formData.phone_num1,
          phone_num2: formData.phone_num2,
          branches: formData.branches,
          services: formData.services,
          user_id: generateID,
        }
      );

      if (response.$id) {
        toast.success("Form submitted successfully!");
        saveICToLocalStorage(response, generateID);
        setSuccessModalOpen(true);
      } else {
        toast.error("Error submitting form");
        console.log("Error submitting form - Response:", response);
      }
    } catch (error) {
      toast.error("Error submitting form", error);
      console.log(error);
    }
  };

  const nextStep = () => {
    if (step === 2) {
      // Submit the form data to the backend API
      submitForm();
    } else {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    setStep(step - 1);
  };

  const router = useRouter();

  const closeModal = () => {
    setSuccessModalOpen(false);
    // Navigate to the dashboard after closing the modal
    // You can replace this with your actual navigation logic
    router.push("/ICregister/AccountLogin");
  };

  const handleCheckboxChange = (service) => {
    const isChecked = formData.services.includes(service);

    if (isChecked) {
      // Remove service if already selected
      setFormData((prevData) => ({
        ...prevData,
        services: prevData.services.filter((s) => s !== service),
      }));
    } else {
      // Add service if not selected
      setFormData((prevData) => ({
        ...prevData,
        services: [...prevData.services, service],
      }));
    }
  };

  return (
    <div className="container  mx-auto p-4">
      <h1 className="text-2xl  md:mt-[5rem] font-futura font-semibold mb-4">
        Business Information Form
      </h1>
      {step === 1 && (
        <div className="font-opensans">
          <h2 className="text-xl font-bold mb-2">Step 1: Office Address</h2>
          <label htmlFor="office_address">Office Address:</label>
          <input
            type="text"
            id="office_address"
            name="office_address"
            value={formData.office_address}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="reg_num">
            Registered Business with CAC (Business Registration Number):
          </label>
          <input
            type="text"
            id="reg_num"
            name="reg_num"
            value={formData.reg_num}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />
{/* 
          <label htmlFor="bank_account">Business Bank Account:</label>
          <input
            type="number"
            id="bank_account"
            name="bank_account"
            value={formData.bank_account}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          /> */}

          <label htmlFor="smart_phone">Do you have a smartphone?</label>
          <select
            id="smart_phone"
            name="smart_phone"
            value={formData.smart_phone}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          >
            <option value="">Select</option>
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>

          <button
            onClick={nextStep}
            className="bg-blue-500 mb-8 text-white p-2 rounded"
          >
            Next
          </button>
        </div>
      )}

      {step === 2 && (
        <div className="font-opensans">
          <h2 className="text-xl font-bold mb-2">
            Step 2: Business Information
          </h2>
          <label htmlFor="bus_name">Business Name:</label>
          <input
            type="text"
            id="bus_name"
            name="bus_name"
            value={formData.bus_name}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="phone_num1">Phone Number 1:</label>
          <input
            type="text"
            id="phone_num1"
            name="phone_num1"
            value={formData.phone_num1}
            onChange={handleChange}
            pattern="^[0-9]{10}$"
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="phone_num2">Phone Number 2 (optional):</label>
          <input
            type="text"
            id="phone_num2"
            name="phone_num2"
            value={formData.phone_num2}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="branches">
            Branches (locations where you have branches):
          </label>
          <input
            type="text"
            id="branches"
            name="branches"
            value={formData.branches}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="password">Create password</label>
          <input
            type="password"
            id="passsword"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="email">email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label>Services:</label>
          <div className="flex flex-wrap">
            <label className="w-full md:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                value="service1"
                checked={formData.services.includes("service1")}
                onChange={() => handleCheckboxChange("service1")}
              />
              Service 1
            </label>

            <label className="w-full md:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                value="service2"
                checked={formData.services.includes("service2")}
                onChange={() => handleCheckboxChange("service2")}
              />
              Service 2
            </label>

            <label className="w-full md:w-1/2 lg:w-1/3">
              <input
                type="checkbox"
                value="service3"
                checked={formData.services.includes("service3")}
                onChange={() => handleCheckboxChange("service3")}
              />
              Service 3
            </label>

            {/* Add more services as needed */}
          </div>
          <button
            onClick={prevStep}
            className="bg-gray-500 text-white p-2 rounded mr-2"
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            className="bg-blue-500 md:mb-0  text-white p-2 rounded"
          >
            Submit
          </button>
        </div>
      )}
      {/* <Modal
        isOpen={isSuccessModalOpen}
        onRequestClose={closeModal}
        contentLabel="Success Modal"
        className="w-[40%] h-[50%] mx-auto bg-white border border-solid rounded-md mt-[10rem]"
      >
        <div className="text-dark text-center flex flex-col justify-center absolute right-0 top-0 left-0 bottom-0">
          <h1 className="text-[36px] font-opensans">
            Your information is under review.
          </h1>
          <p className="text-[18px] font-opensans">
            Click the close button and login to navigate to your dashboard.
          </p>
          <button
            className="bg-primary w-[10%] mt-6 mx-auto font-futura  text-white p-2 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>
     */}
    </div>
  );
};

export default CreateIC;
