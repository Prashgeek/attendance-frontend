import React from 'react'
import TopNav from './TopNav'
import SelectNav from './SelectNav'
import { Outlet } from 'react-router-dom'

const StudentLayout = () => {
  return (
    <>
      <TopNav/>
      <SelectNav/>
      <Outlet/>
    </>
  )
}

export default StudentLayout
