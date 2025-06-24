import React from 'react'

const RePastSessions = ({sessions}) => {
  return (
    <div className="">
    <h2 className="text-sm font-semibold py-2">Past Sessions</h2>
    {sessions.map((session, index) => (
      <div
        key={index}
        className="flex gap-2 items-center rounded-[12px] bg-[#ffffff80] opacity-80 relative px-3 py-2  mb-2"
      >
        <div className="text-sm font-semibold text-gray-black flex flex-col">
          <span className='text-xs text-[#6D6A5D] font-medium'>24th Apr</span>
          {session.time}
        </div>
        <div className="border-gray-300 border w-[1px] h-[38px]"></div>
        <div className="flex flex-col">
          <p className="text-sm font-semibold text-black">
            {session.doctor}
          </p>
          <p className="text-xs text-[#6D6A5D] font-medium">
            Previous Session <br />
            {session.date}
          </p>
        </div>
      </div>
    ))}
  </div>
  )
}

export default RePastSessions
