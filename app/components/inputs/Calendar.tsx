"use client";

import { DateRangePicker } from 'react-date-range';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

interface CalendarProps {
  value: Date | undefined;
  onChange: (date: Date) => void;
  minDate: Date | undefined;
  maxDate?: Date | undefined;
  disabledDates?: Date[];
}

const Calendar: React.FC<CalendarProps> = ({ 
  value, 
  onChange, 
  minDate, 
  maxDate = new Date(), 
  disabledDates 
}) => {
  return (
    <DateRangePicker
      ranges={[
        {
          startDate: value || undefined,
          endDate: value || undefined,
          key: 'selection',
        },
      ]}
      onChange={(range) => {
        const selectedDate = range.selection.startDate;
        if (selectedDate) {
          onChange(selectedDate);
        }
      }}
      color='#262626'
      showDateDisplay={false}
      dragSelectionEnabled={false}
      staticRanges={[]} 
      inputRanges={[]} 
      minDate={minDate || undefined}
      maxDate={maxDate || undefined}
      disabledDates={disabledDates}
    />
  );
}

export default Calendar;