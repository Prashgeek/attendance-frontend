import React from 'react'
import QRCodeAttendance from '../../Components/Student/QrScan/QRCodeAttendance'
import RecentQRScans from '../../Components/Student/QrScan/RecentQRScans'
import AboutQRCodeAttendance from '../../Components/Student/QrScan/AboutQRCodeAttendance'

const QrScan = () => {
  return (
     <div className="p-4 space-y-6">
      <QRCodeAttendance />
      <RecentQRScans />
      <AboutQRCodeAttendance />
    </div>
  )
}

export default QrScan
