import React, { createContext, useContext, useState, useEffect } from "react";
import { API_BASE_URL } from "../config/env";

type JobAd = {
  id: string;
  title: string;
  requirements: string;
  location: string;
  type: string;
  salary: string;
  domain: string;
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
  addJobAd: (ad: Omit<JobAd, "id">) => Promise<any>;
  updateJobAd: (ad: JobAd) => void;
};

const EmployerContext = createContext<EmployerContextType | undefined>(
  undefined
);

function generateId() {
  return Math.random().toString(36).slice(2, 10) + Date.now();
}

export function EmployerProvider({ children }: { children: React.ReactNode }) {
  const [employer, setEmployer] = useState<Employer | null>(null);

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
      } catch {}
    }
    if (jobAdsStr) {
      try {
        jobAds = JSON.parse(jobAdsStr);
      } catch {}
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

              const response = await fetch(`${API_BASE_URL}/api/jobs`, {
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

  const updateJobAd = (ad: JobAd) => {
    setEmployer((e) => {
      if (!e) return e;
      const newJobAds = (e.jobAds || []).map((j) => (j.id === ad.id ? ad : j));
      localStorage.setItem("jobAds", JSON.stringify(newJobAds));
      return { ...e, jobAds: newJobAds };
    });
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
