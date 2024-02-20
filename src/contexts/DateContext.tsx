import React, { createContext, useContext } from 'react';

interface DateContextType {
  appDate: Date;
  setAppDate: React.Dispatch<React.SetStateAction<Date>>;
}

const DateContext = createContext<DateContextType | undefined>(undefined);




export default DateContext;

export const useDate = () => {
    const context = useContext(DateContext);
    if (!context) {
      throw new Error('useDate must be used within a DateProvider');
    }
    return context;
  };