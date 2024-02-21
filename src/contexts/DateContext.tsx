import React, { createContext, useContext, useState } from "react";

interface DateContextType {
  appDate: Date;
  setAppDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateContext = createContext<DateContextType | undefined>(undefined);

export const useDate = () => {
  const context = useContext(DateContext);
  if (!context) {
    throw new Error("useDate must be used within a DateProvider");
  }
  return context;
};

export const DateProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [appDate, setAppDate] = useState<Date>(new Date());

  return (
    <DateContext.Provider value={{ appDate, setAppDate }}>
      {children}
    </DateContext.Provider>
  );
};
