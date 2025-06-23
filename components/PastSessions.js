import React from 'react'

const PastSessions = ({sessions}) => {
  return (
    <div className="px-4">
    <h2 className="text-sm font-semibold py-2">Past Sessions</h2>
    {sessions.map((session, index) => (
      <div
        key={index}
        className="flex gap-2 items-center bg-[#FFFFFF50] px-3 py-2 rounded-lg mb-2"
      >
        <div className="text-sm font-semibold text-gray-600">
          {session.time}
        </div>
        <div className="border-gray-300 border w-[1px] h-[38px]"></div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-gray-600">
            {session.doctor}
          </p>
          <p className="text-sm text-gray-500">
            Previous Session <br />
            {session.date}
          </p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default PastSessions
