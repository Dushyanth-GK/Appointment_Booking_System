import React, { useEffect, useState } from 'react';
import { fetchDataByDate, bookAppointment, cancelAppointment } from '../api/api';

export default function Table({ date }) {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = localStorage.getItem('userName');
  const currentDepartment = localStorage.getItem('userDepartment');

  // Fetch appointments for the selected date
  useEffect(() => {
    async function loadData() {
      setLoading(true);
      const result = await fetchDataByDate(date);
      if (!result.error) {
        setAppointments(result.appointments || []);
      }
      setLoading(false);
    }
    loadData();
  }, [date]);

  // Time slots from 08:00 AM to 06:00 PM
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    const suffix = hour >= 12 ? "PM" : "AM";
    const displayHour = hour % 12 === 0 ? 12 : hour % 12;
    return `${displayHour}:00 ${suffix}`;
  });

  // Book an appointment
  const handleBook = async (startTime) => {
    const bookingData = {
      date,
      startTime,
      name: currentUser,
      department: currentDepartment
    };
    const result = await bookAppointment(bookingData);
    if (!result.error) {
      setAppointments(prev => [...prev, bookingData]);
    } else {
      alert(result.error);
    }
  };

  // Cancel an appointment
  const handleCancel = async (startTime) => {
    const appointment = appointments.find(
      item => item.date === date && item.startTime === startTime && item.name === currentUser
    );
    if (!appointment) return;

    const result = await cancelAppointment(appointment.id);
    if (!result.error) {
      setAppointments(prev => prev.filter(item => item.id !== appointment.id));
    } else {
      alert(result.error);
    }
  };

  return (
    <div className="text-gray-800">
      <div className="max-h-[400px] overflow-y-auto overflow-x-auto rounded-lg border border-gray-300 shadow-sm">
        <table className="min-w-full divide-y divide-gray-200 text-sm">
          <thead className="sticky top-0 bg-gray-100 text-center">
            <tr>
              <th className="px-4 py-3 font-semibold text-gray-700">Time Slot</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Name</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Department</th>
              <th className="px-4 py-3 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {loading ? (
              <tr>
                <td colSpan="4" className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              timeSlots.map((slot, index) => {
                const appointment = appointments.find(
                  item => item.date === date && item.startTime === slot
                );
                const isBooked = Boolean(appointment);
                const isCurrentUser = appointment?.name === currentUser;

                return (
                  <tr key={index} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">{slot}</td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isBooked ? appointment.name : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isBooked ? appointment.department : <span className="text-gray-400">—</span>}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      {isBooked ? (
                        isCurrentUser ? (
                          <button
                            onClick={() => handleCancel(slot)}
                            className="w-20 px-4 py-2 text-sm font-medium text-white bg-red-500 hover:bg-red-600 rounded transition"
                          >
                            Cancel
                          </button>
                        ) : (
                          <button
                            className="w-20 px-4 py-2 text-sm font-medium text-white bg-gray-400 rounded cursor-not-allowed"
                            disabled
                          >
                            Booked
                          </button>
                        )
                      ) : (
                        <button
                          onClick={() => handleBook(slot)}
                          className="w-20 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded transition"
                        >
                          Book
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}