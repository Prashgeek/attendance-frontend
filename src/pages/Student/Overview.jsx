import React from 'react'
import HeaderSummary from '../../Components/Student/Overview/HeaderSummary'
import TodayStatus from '../../Components/Student/Overview/TodayStatus'
import StatsCards from '../../Components/Student/Overview/StatsCards'
import AttendanceOverview from '../../Components/Student/Overview/AttendanceOverview'

const Overview = () => {
  return (
    <>
      <HeaderSummary />
      <TodayStatus />
      <StatsCards />
      <AttendanceOverview />
    </>
  )
}

export default Overview
