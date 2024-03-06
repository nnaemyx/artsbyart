import { Client, Account, Databases } from "appwrite";

export const client = new Client();

client
  .setEndpoint("https://cloud.appwrite.io/v1")
  .setProject(process.env.NEXT_PUBLIC_PROJECT_ID);

export const account = new Account(client);
export const db = new Databases(client);
export const { ID } = require("appwrite");

// Function to get and set is_verified state from localStorage
export const getIsVerified = () => {
  const isVerified = localStorage.getItem("is_verified");
  return isVerified ? JSON.parse(isVerified) : false;
};

export const setIsVerified = (value) => {
  localStorage.setItem("is_verified", JSON.stringify(value));
};

// Function to update is_verified in the database
export const updateIsVerified = async (documentId, newValue) => {
  try {
    const response = await db.updateDocument(
      process.env.NEXT_PUBLIC_DB_ID,
      process.env.NEXT_PUBLIC_REGISTRATION_COLLECTION_ID,
      documentId,
      {
        is_verified: newValue,
      }
    );

    // Assuming you have a success response handling logic
    console.log("Update successful:", response);

    // Update is_verified in localStorage
    setIsVerified(newValue);
  } catch (error) {
    console.error("Error updating is_verified:", error);
  }
};
