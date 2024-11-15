import React from 'react'

const Navbar = () => {
  return (
    <div className="sticky grid xl:grid-cols-1 grid-cols-1">
      <div className="px-5 pt-5 bg-gradient-to-r from-blue-50/50 via-indigo-50 to-blue-50/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800"
      >
        <div className="py-3 px-3 rounded-xl border border-gray-500 w-full bg-gradient-to-r from-blue-50/50 via-indigo-50 to-blue-50/50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800">
          <div className="flex justify-between items-center">
            <div className="flex justify-items-center items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5"
                stroke="currentColor" className="w-6 h-6 text-gray-300">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25H12" />
              </svg>
              <p className="font-semibold text-gray-300">CoDraw</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Navbar
