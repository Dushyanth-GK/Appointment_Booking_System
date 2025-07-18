import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import DateModal from '../components/DateModal';

export default function Home() {
  const [selectedDate, setSelectedDate] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedDate(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-100 to-gray-300 flex flex-col items-center justify-center p-6">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Book Your Appointment
      </h2>
      <div className="bg-white shadow-xl rounded-xl p-8 max-w-md w-full flex items-center justify-center">
        <Calendar
          onClickDay={handleDateClick}
          value={selectedDate}
          className="react-calendar"
        />
        {selectedDate && (
          <p className="mt-4 text-center text-gray-600">
            Selected Date: <span className="font-medium">{selectedDate.toDateString()}</span>
          </p>
        )}
      </div>

      {isModalOpen && (
        <DateModal date={selectedDate} onClose={closeModal} />
      )}
    </div>
  );
}