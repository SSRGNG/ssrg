// 'use client'

// import { useEffect } from 'react'

// import { AlertTriangle, RefreshCw, Home, Bug } from 'lucide-react';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
// import { Shell } from '@/components/shell';

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string }
//   reset: () => void
// }) {
//   useEffect(() => {
//     console.error('Users management page error', error)
//   }, [error])

//   // Determine error type for better UX
//   const isDatabaseError = error.message.includes('PostgresError') ||
//                          error.message.includes('GROUP BY') ||
//                          error.message.includes('aggregate function') ||
//                          error.message.includes('database');

//   const isNetworkError = error.message.includes('fetch') ||
//                         error.message.includes('ECONNREFUSED') ||
//                         error.message.includes('network');

//   const getErrorInfo = () => {
//     if (isDatabaseError) {
//       return {
//         title: 'Database Error',
//         description: 'There was a problem with the database query. This is likely a temporary issue.',
//         icon: <Bug className="h-5 w-5" />,
//         suggestions: [
//           'Try refreshing the page',
//           'Check if the database is running',
//           'Review the SQL query syntax'
//         ]
//       };
//     }

//     if (isNetworkError) {
//       return {
//         title: 'Connection Error',
//         description: 'Unable to connect to the server. Please check your network connection.',
//         icon: <AlertTriangle className="h-5 w-5" />,
//         suggestions: [
//           'Check your internet connection',
//           'Try refreshing the page',
//           'Contact support if the problem persists'
//         ]
//       };
//     }

//     return {
//       title: 'Something went wrong',
//       description: 'An unexpected error occurred while loading the teams data.',
//       icon: <AlertTriangle className="h-5 w-5" />,
//       suggestions: [
//         'Try refreshing the page',
//         'Go back to the dashboard',
//         'Contact support if the problem persists'
//       ]
//     };
//   };

//   const errorInfo = getErrorInfo();

//   return (
//     <div>
//       <h2>Something went wrong!</h2>
//       <div>

//       </div>
//       <button
//         onClick={
//           // Attempt to recover by trying to re-render the segment
//           () => reset()
//         }
//       >
//         Try again
//       </button>
//     </div>
//   )
// }
