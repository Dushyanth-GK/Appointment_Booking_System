import React, { useEffect, useState } from 'react';
import { fetchSlotsByDate, bookAppointment, cancelAppointment } from '../api/api';
import { backendTimeToDisplay } from '../utils/timeConversion';
import { useNavigate } from 'react-router-dom';
import moment from 'moment'; // Ensure moment is installed and imported

export default function Table({ date }) {
  const [slots, setSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Get current user info from localStorage
  const currentUserId = localStorage.getItem('userId');
  const currentUserName = localStorage.getItem('userName');
  const currentDepartment = localStorage.getItem('userDepartment');
  const token = localStorage.getItem('token');

  // Redirect if not authenticated
  useEffect(() => {
    if (!token) {
      alert('You must be logged in to view this page.');
      navigate('/login');
    }
  }, [token, navigate]);

  // Fixed time slots 08:00 to 18:00 backend format
  const timeSlots = Array.from({ length: 11 }, (_, i) => {
    const hour = i + 8;
    return `${hour.toString().padStart(2, '0')}:00:00`;
  });

  useEffect(() => {
  async function loadSlots() {
    setLoading(true);
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const result = await fetchSlotsByDate(formattedDate);

    if (!result.error) {
      setSlots(result);
      console.log('Fetched slots:', result);

      // Find current user's booking and store its ID
      const currentUserName = localStorage.getItem('userName');
      const userBooking = result.find(
        slot => slot.booked && slot.name === currentUserName
      );

      if (userBooking && userBooking.id) {
        localStorage.setItem('bookingId', userBooking.id); // ✅ Save booking ID
      } else {
        localStorage.removeItem('bookingId'); // ✅ Clear if no booking
      }
    } else {
      alert(result.error);
    }

    setLoading(false);
  }

  loadSlots();
}, [date]);

  const handleBook = async (slotTime) => {
  setLoading(true);

  const bookingData = {
    booking_date: moment(date).format('YYYY-MM-DD'),
    slot_time: slotTime
  };

  try {
    const result = await bookAppointment(bookingData);

    if (!result.error) {
      const updatedSlots = await fetchSlotsByDate(moment(date).format('YYYY-MM-DD'));
      setSlots(updatedSlots);

      const userBooking = updatedSlots.find(
        slot => slot.booked && slot.name === currentUserName
      );

      if (userBooking && userBooking.id) {
        localStorage.setItem('bookingId', userBooking.id);
      }

      // Optionally show success message
      // alert('Booking successful!');
    } else {
      alert(result.error);
      console.error('Booking error:', result.error);
    }
  } catch (err) {
    console.error('Unexpected error:', err);
    alert('Something went wrong while booking.');
  }

  setLoading(false);
};

 const handleCancel = async () => {
  const bookingId = localStorage.getItem('bookingId');

  if (!bookingId) {
    return alert('No booking found to cancel.');
  }

  const result = await cancelAppointment(bookingId);

  if (!result.error) {
    const formattedDate = moment(date).format('YYYY-MM-DD');
    const updatedSlots = await fetchSlotsByDate(formattedDate);
    setSlots(updatedSlots);

    // Clear booking ID from localStorage after successful cancellation
    localStorage.removeItem('bookingId');
  } else {
    alert(result.error);
  }
};

  return (
    <div className="text-gray-800">
      <div className="max-h-[400px] overflow-auto rounded-lg border border-gray-300 shadow-sm">
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
                <td colSpan={4} className="text-center py-4">Loading...</td>
              </tr>
            ) : (
              timeSlots.map((slot, idx) => {
                const appointment = slots.find((s) => s.time === slot);
                const isBooked = appointment?.booked || false;
                const isCurrentUser = appointment?.name === currentUserName;

                return (
                  <tr key={idx} className="hover:bg-gray-50 transition">
                    <td className="px-4 py-3 whitespace-nowrap font-medium">
                      {backendTimeToDisplay(slot)}
                    </td>
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