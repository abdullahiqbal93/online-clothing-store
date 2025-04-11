import React from 'react'

export default function UnauthPage() {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md overflow-hidden rounded-xl bg-white/80 p-1 backdrop-blur-sm dark:bg-slate-950/80">
        <div className="rounded-lg border-2 border-dashed border-slate-300 bg-white p-8 dark:border-slate-700 dark:bg-slate-900">
          <div className="flex flex-col items-center space-y-6 text-center">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 animate-ping rounded-full bg-red-400/20 dark:bg-red-500/20"></div>
              <div className="relative flex h-full w-full items-center justify-center rounded-full bg-red-50 dark:bg-red-950">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="24" 
                  height="24" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-8 w-8 text-red-500 dark:text-red-400"
                >
                  <circle cx="12" cy="12" r="10"></circle>
                  <line x1="12" y1="8" x2="12" y2="12"></line>
                  <line x1="12" y1="16" x2="12.01" y2="16"></line>
                </svg>
              </div>
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Access Restricted</h2>
              <p className="text-slate-500 dark:text-slate-400">You don't have sufficient permissions to access this resource</p>
            </div>
            <button 
              onClick={() => window.history.back()} 
              className="group relative inline-flex items-center justify-center overflow-hidden rounded-lg bg-slate-900 px-6 py-3 font-medium text-white transition duration-300 ease-out dark:bg-slate-700"
            >
              <span className="absolute inset-0 h-full w-full bg-gradient-to-br from-slate-800 to-slate-900 opacity-0 transition duration-300 ease-out group-hover:opacity-100 dark:from-slate-600 dark:to-slate-700"></span>
              <span className="relative flex items-center gap-2">
                <svg 
                  xmlns="http://www.w3.org/2000/svg" 
                  width="16" 
                  height="16" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  className="h-4 w-4"
                >
                  <path d="m15 18-6-6 6-6"></path>
                </svg>
                Return
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
