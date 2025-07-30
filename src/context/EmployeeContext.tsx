import React, { createContext, useContext, useState, useEffect } from "react";

type EmployeeCV = {
  name: string;
  experience: string;
  skills: string;
  location: string;
  availability: string;
  photoUrl?: string;
};

type Employee = {
  id: string;
  name: string;
  phone: string;
  hasCompletedCv?: boolean;
  cv?: EmployeeCV;
};

type EmployeeContextType = {
  employee: Employee | null;
  login: (
    userId: string,
    name: string,
    phone: string,
    hasCompletedCv?: boolean,
    cv?: EmployeeCV
  ) => void;
  logout: (cb?: () => void) => void;
  updateCV: (cv: EmployeeCV) => void;
};

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export function EmployeeProvider({ children }: { children: React.ReactNode }) {
  const [employee, setEmployee] = useState<Employee | null>(null);

  // Persistent login on refresh if token exists
  useEffect(() => {
    const token = localStorage.getItem("token");
    const userId = localStorage.getItem("userId");
    const userName = localStorage.getItem("userName");
    const phone = localStorage.getItem("userPhone");
    const hasCompletedCv = localStorage.getItem("hasCompletedCv");
    const cvRaw = localStorage.getItem("cv");
    const cv: EmployeeCV | undefined = cvRaw ? JSON.parse(cvRaw) : undefined;

    if (token && userId && userName && phone) {
      setEmployee({
        id: userId,
        name: userName,
        phone,
        hasCompletedCv: hasCompletedCv === "true",
        cv,
      });
    }
  }, []);

  const login = (
    userId: string,
    name: string,
    phone: string,
    hasCompletedCv?: boolean,
    cv?: EmployeeCV
  ) => {
    localStorage.setItem("userId", userId);
    localStorage.setItem("userName", name);
    localStorage.setItem("userPhone", phone);
    if (hasCompletedCv !== undefined)
      localStorage.setItem("hasCompletedCv", hasCompletedCv ? "true" : "false");
    if (cv !== undefined) localStorage.setItem("cv", JSON.stringify(cv));
    setEmployee({
      id: userId,
      name,
      phone,
      hasCompletedCv,
      cv,
    });
  };

  const logout = (cb?: () => void) => {
    localStorage.clear();
    setEmployee(null);
    if (cb) cb();
  };

  const updateCV = (cv: EmployeeCV) => {
    localStorage.setItem("cv", JSON.stringify(cv));
    setEmployee((e) =>
      e
        ? {
            ...e,
            cv,
            hasCompletedCv: true,
          }
        : e
    );
  };

  return (
    <EmployeeContext.Provider value={{ employee, login, logout, updateCV }}>
      {children}
    </EmployeeContext.Provider>
  );
}

export function useEmployee() {
  const ctx = useContext(EmployeeContext);
  if (!ctx) throw new Error("useEmployee must be used within EmployeeProvider");
  return ctx;
}
