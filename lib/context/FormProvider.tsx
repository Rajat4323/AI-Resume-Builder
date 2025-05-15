"use client";

import { ReactNode, useEffect } from "react";
import { createContext, useState, useContext } from "react";
import { fetchResume } from "../actions/resume.actions";

// Define the context type
interface FormContextType {
  formData: any;
  handleInputChange: (e: any) => void;
  setFormData: React.Dispatch<React.SetStateAction<any>>; // Exposing setFormData for manual data updates
}

const FormContext = createContext<FormContextType>({} as FormContextType);

export const FormProvider = ({
  params,
  children,
}: {
  params: { id: string };
  children: ReactNode;
}) => {
  const [formData, setFormData] = useState<any>({});

  useEffect(() => {
    const loadResumeData = async () => {
      try {
        const resumeData = await fetchResume(params.id);
        setFormData(JSON.parse(resumeData)); // Parsing the fetched data
      } catch (error) {
        console.error("Error fetching resume:", error);
      }
    };

    loadResumeData();
  }, [params.id]); // Dependency array to reload when the `id` changes

  const handleInputChange = (e: any) => {
    const { name, value } = e.target;
    setFormData((prevData: any) => ({
      ...prevData,
      [name]: value, // Update form data for the input field
    }));
  };

  return (
    <FormContext.Provider value={{ formData, handleInputChange, setFormData }}>
      {children}
    </FormContext.Provider>
  );
};

// Custom hook to access form context
export const useFormContext = () => useContext(FormContext);
