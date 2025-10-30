import './App.css'
import {BrowserRouter, Route, Routes} from "react-router-dom";

// Student pages
import Attendance from './pages/Student/Attendance';
import Overview from './pages/Student/Overview';
import QrScan from './pages/Student/QrScan';

// layouts
import StudentLayout from './layout/Student/StudentLayout';
import CheckInCheckOut from './pages/Student/CheckInCheckOut';

function App() {
  return (
    <>
      <BrowserRouter>
        <Routes>

          {/* Student Routes */}
          <Route path="student">
            <Route index element={<>Not Found</>}/>
            <Route element={<StudentLayout />}>
              <Route path="overview" element={<Overview />}/>
              <Route path="checkin-checkout" element={<CheckInCheckOut />}/>
              <Route path="qrscan" element={<QrScan />}/>
              <Route path="attendance" element={<Attendance />}/>
            </Route>
          </Route>

          {/* Teacher Routes */}

          {/* Admin Routes */}
    
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
