import Table from "./Table";

export default function DateModal({ date, onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 grid place-content-center bg-black/50 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modalTitle"
    >
      <div className="relative w-full max-w-5xl min-h-[500px] rounded-lg bg-white p-8 shadow-xl">
        {/* Book Button - Top Left */}
        

        {/* ❌ Close Button - Top Right */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
          aria-label="Close"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {/* Modal Title */}
        <h2
          id="modalTitle"
          className="text-2xl font-bold text-gray-900 mb-6 text-center"
        >
          Appointment for {date?.toDateString()}
        </h2>

        {/* Table Content */}
        <Table date={date} />
      </div>
    </div>
  );
}