import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/env";
import { useAuthStore } from "../stores/authStore";

export type JobAd = {
  id: string;
  title: string;
  requirements: string;
  description?: string;
  location: string;
  type: string;
  salary: string | { min?: number; max?: number; currency?: string };
  domain: string;
  category?: string;
  experience?: string;
  skills?: string[];
  benefits?: string[];
  image?: string;
};

type Company = {
  name: string;
  cui: string;
  location: string;
  domain: string;
  description: string;
  logoUrl?: string;
};

type Employer = {
  id: string;
  email: string;
  company?: Company;
  jobAds?: JobAd[];
};

type EmployerContextType = {
  employer: Employer | null;
  login: (
    id: string,
    email: string,
    company?: Company,
    jobAds?: JobAd[],
    token?: string
  ) => void;
  logout: (cb?: () => void) => void;
  updateCompany: (company: Company) => void;
  addJobAd: (ad: Omit<JobAd, "id">) => Promise<void>;
  updateJobAd: (ad: JobAd) => Promise<void>;
};

const EmployerContext = createContext<EmployerContextType | undefined>(
  undefined
);

export function EmployerProvider({ children }: { children: React.ReactNode }) {
  const [employer, setEmployer] = useState<Employer | null>(null);
  const { token } = useAuthStore();

  // Persistent login on refresh if token and employerId exist
  useEffect(() => {
    const token = localStorage.getItem("token");
    const employerId = localStorage.getItem("employerId");
    const email = localStorage.getItem("employerEmailOrPhone");
    const companyStr = localStorage.getItem("company");
    const jobAdsStr = localStorage.getItem("jobAds");
    let company: Company | undefined = undefined;
    let jobAds: JobAd[] | undefined = undefined;
    if (companyStr) {
      try {
        company = JSON.parse(companyStr);
      } catch {
        // Invalid JSON in localStorage, ignore
      }
    }
    if (jobAdsStr) {
      try {
        jobAds = JSON.parse(jobAdsStr);
      } catch {
        // Invalid JSON in localStorage, ignore
      }
    }
    if (token && employerId && email) {
      setEmployer({
        id: employerId,
        email,
        company,
        jobAds,
      });
    }
  }, []);

  const login = (
    id: string,
    email: string,
    company?: Company,
    jobAds?: JobAd[],
    token?: string
  ) => {
    // Clear all localStorage before saving employer info
    localStorage.clear();
    if (token) localStorage.setItem("token", token);
    localStorage.setItem("employerId", id);
    localStorage.setItem("employerEmailOrPhone", email);
    if (company) localStorage.setItem("company", JSON.stringify(company));
    if (jobAds) localStorage.setItem("jobAds", JSON.stringify(jobAds));
    setEmployer({
      id,
      email,
      company,
      jobAds,
    });
  };

  const logout = (cb?: () => void) => {
    localStorage.clear();
    setEmployer(null);
    if (cb) cb();
  };

  const updateCompany = (company: Company) => {
    setEmployer((e) => {
      if (!e) return e;
      localStorage.setItem("company", JSON.stringify(company));
      return { ...e, company };
    });
  };

  const addJobAd = async (ad: Omit<JobAd, "id">) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Nu ești autentificat");
      }

      // Map frontend fields to backend fields
      const jobData = {
        title: ad.title,
        description: ad.requirements,
        location: ad.location,
        type: ad.type.toLowerCase().replace('-', ''),
        category: ad.domain,
        salary: ad.salary,
        // Add other required fields with defaults
        experience: 'entry',
        skills: [],
        benefits: []
      };

              const response = await fetch(`${API_BASE_URL}/jobs`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error?.message || 'Eroare la crearea job-ului');
      }

      const result = await response.json();
      
      // Update local state with the new job from backend
    setEmployer((e) => {
      if (!e) return e;
        const newJobAd = {
          id: result.data._id,
          title: result.data.title,
          requirements: result.data.description,
          location: result.data.location,
          type: result.data.type,
          salary: result.data.salary?.min ? `${result.data.salary.min} RON` : '',
          domain: result.data.category,
          image: ad.image
        };
        const newJobAds = [...(e.jobAds || []), newJobAd];
      localStorage.setItem("jobAds", JSON.stringify(newJobAds));
      return { ...e, jobAds: newJobAds };
    });

      return result.data;
    } catch (error) {
      console.error('Error adding job ad:', error);
      throw error;
    }
  };

  const updateJobAd = async (ad: JobAd) => {
    try {
      console.log('=== UPDATE JOB AD START ===');
      console.log('Job ad to update:', ad);
      console.log('Token from useAuthStore:', token ? 'exists' : 'missing');
      
      if (!token) {
        throw new Error("Nu ești autentificat");
      }

      // Parse salary if it's a string
      let salaryData = ad.salary;
      if (typeof ad.salary === 'string') {
        console.log('Parsing salary string:', ad.salary);
        
        // Pattern pentru "2000-4000 EUR" sau "2000-4000 RON"
        const rangeMatch = ad.salary.match(/(\d+)\s*-\s*(\d+)\s*(EUR|RON)/);
        if (rangeMatch) {
          salaryData = { 
            min: parseInt(rangeMatch[1]), 
            max: parseInt(rangeMatch[2]), 
            currency: rangeMatch[3] 
          };
          console.log('Parsed range salary:', salaryData);
        } else {
          // Pattern pentru "2000 EUR" sau "2000 RON"
          const singleMatch = ad.salary.match(/(\d+)\s*(EUR|RON)/);
          if (singleMatch) {
            salaryData = { 
              min: parseInt(singleMatch[1]), 
              currency: singleMatch[2] 
            };
            console.log('Parsed single salary:', salaryData);
          } else {
            // Fallback - trimite ca string dacă nu se poate parsa
            console.log('Could not parse salary, sending as string');
            salaryData = ad.salary;
          }
        }
      }

      // Map type correctly from frontend to backend
      let mappedType = ad.type.toLowerCase();
      if (mappedType === 'full-time') mappedType = 'fulltime';
      else if (mappedType === 'part-time') mappedType = 'parttime';
      else if (mappedType === 'proiect') mappedType = 'contract';
      else if (mappedType === 'ocazional') mappedType = 'internship';
      else if (mappedType === 'sezonier') mappedType = 'seasonal';

      // Map frontend fields to backend fields
      const jobData = {
        title: ad.title,
        description: ad.requirements,
        location: ad.location,
        type: mappedType,
        category: ad.domain,
        salary: salaryData,
        experience: ad.experience || 'entry',
        skills: ad.skills || [],
        benefits: ad.benefits || []
      };

      console.log('Updating job with data:', jobData);
      console.log('Job ID for update:', ad.id);

      const response = await fetch(`${API_BASE_URL}/jobs/${ad.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(jobData)
      });

      console.log('Update response status:', response.status);

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Update error response:', errorData);
        throw new Error(errorData.error?.message || 'Eroare la actualizarea job-ului');
      }

      const result = await response.json();
      console.log('Update success response:', result);
      
      // Update local state with the updated job from backend
      setEmployer((e) => {
        if (!e) return e;
        const newJobAds = (e.jobAds || []).map((j) => 
          j.id === ad.id ? {
            id: result.data._id,
            title: result.data.title,
            requirements: result.data.description,
            location: result.data.location,
            type: result.data.type,
            salary: result.data.salary?.min ? `${result.data.salary.min} RON` : '',
            domain: result.data.category,
            image: ad.image
          } : j
        );
        localStorage.setItem("jobAds", JSON.stringify(newJobAds));
        return { ...e, jobAds: newJobAds };
      });

      return result.data;
    } catch (error) {
      console.error('Error updating job ad:', error);
      throw error;
    }
  };

  return (
    <EmployerContext.Provider
      value={{ employer, login, logout, updateCompany, addJobAd, updateJobAd }}
    >
      {children}
    </EmployerContext.Provider>
  );
}

export function useEmployer() {
  const ctx = useContext(EmployerContext);
  if (!ctx) throw new Error("useEmployer must be used within EmployerProvider");
  return ctx;
}
