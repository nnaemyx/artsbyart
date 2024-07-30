import { useState } from "react";
import Modal from "react-modal";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import Select from "react-select";
import { ID, account, db } from "@/utils/appwrite";
import { saveICToLocalStorage } from "@/utils/Localstorage";
import Spinner from "@/components/Layouts/Spinner";

// Options for the services select dropdown
const servicesOptions = [
  { value: "Signages", label: "Signages" },
  { value: "Banners", label: "Banners" },
  { value: "Billboards", label: "Billboards" },
  { value: "Apparels", label: "Apparels" },
  { value: "Vehicle Branding", label: "Vehicle Branding" },
  { value: "Business Cards", label: "Business Cards" },
  { value: "Certificates", label: "Certificates" },
  { value: "Calendars", label: "Calendars" },
  { value: "Cartons And Boxes", label: "Cartons And Boxes" },
  { value: "Flyers And Posters", label: "Flyers And Posters" },
  { value: "Invitation And Tickets", label: "Invitation And Tickets" },
  { value: "Letterhead Papers", label: "Letterhead Papers" },
  { value: "Souvenirs/Stationaries", label: "Souvenirs/Stationaries" },
  { value: "Bags Branding", label: "Bags Branding" },
  { value: "Stickers", label: "Stickers" },
  { value: "Roll Up Stands", label: "Roll Up Stands" },
  { value: "Stamps And Seals", label: "Stamps And Seals" },
  { value: "Throw Pillows Branding", label: "Throw Pillows Branding" },
  { value: "Paintings", label: "Paintings" },
  { value: "Government Registrations", label: "Government Registrations" },
  { value: "Designs", label: "Designs" },
  { value: "Phone Branding", label: "Phone Branding" },
  { value: "Maintenance", label: "Maintenance" },
  { value: "Books", label: "Books" },
];

const Register = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    office_address: "",
    reg_num: "",
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
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleServiceChange = (selectedOptions) => {
    setFormData((prevData) => ({
      ...prevData,
      services: selectedOptions ? selectedOptions.map((opt) => opt.value) : [],
    }));
  };

  const sendAdminSMS = async () => {
    try {
      const response = await fetch("/api/sms", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          phoneNumber: "+2347069363614",
          message:
            "Hello Admin, a new IC has been registered. Please review the details.",
        }),
      });

      if (response.ok) {
        console.log("SMS sent successfully!");
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to send SMS");
      }
    } catch (error) {
      console.error("Error sending SMS:", error);
    }
  };

  const submitForm = async () => {
    setIsLoading(true);
    try {
      const generateID = Math.random().toString(36).substring(2, 24);

      await account.create(
        generateID,
        formData.email,
        formData.password,
        formData.bus_name
      );

      const response = await db.createDocument(
        process.env.NEXT_PUBLIC_DB_ID,
        process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID,
        generateID,
        {
          office_address: formData.office_address,
          reg_num: formData.reg_num,
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
        await sendAdminSMS();
      } else {
        toast.error("Error submitting form");
        console.log("Error submitting form - Response:", response);
      }
    } catch (error) {
      toast.error("Error submitting form", error);
      console.log(error);
    }
    setIsLoading(false);
  };

  const nextStep = () => {
    if (step === 2) {
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
    router.push("/ICregister/AccountLogin");
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl md:mt-[5rem] font-futura font-semibold mb-4">
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
            disabled={isLoading}
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

          <label htmlFor="password">Create Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="email">Email:</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full p-2 mb-4 border border-gray-300"
          />

          <label htmlFor="services">Services:</label>
          <Select
            id="services"
            isMulti
            options={servicesOptions}
            value={servicesOptions.filter((option) =>
              formData.services.includes(option.value)
            )}
            onChange={handleServiceChange}
            className="w-full p-2 mb-4"
          />

          <button
            onClick={prevStep}
            className="bg-gray-500 text-white p-2 rounded mr-2"
            disabled={isLoading}
          >
            Previous
          </button>

          <button
            onClick={nextStep}
            className="bg-blue-500 text-white p-2 rounded"
            disabled={isLoading}
          >
            {isLoading ? <Spinner /> : "Submit"}
          </button>
        </div>
      )}

      <Modal
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
            className="bg-primary w-[10%] mt-6 mx-auto font-futura text-white p-2 rounded"
            onClick={closeModal}
          >
            Close
          </button>
        </div>
      </Modal>

      <div className="mb-16">
        <p className="text-center">
          Already have an account,{" "}
          <Link href="/ICregister/AccountLogin" className="text-primary">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
