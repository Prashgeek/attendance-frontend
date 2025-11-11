
import React, { useState, useEffect, useCallback } from "react";
import api from "../../api/config"; // ✅ Use configured API instance
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line, Pie } from "react-chartjs-2";

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

export default function AdminDashboard() {
  // --- Data (dynamic) ---
  const [totalUsers, setTotalUsers] = useState(0);
  const [presentCount, setPresentCount] = useState(0);
  const [absentCount, setAbsentCount] = useState(0);
  const [lateCount, setLateCount] = useState(0);
  const [attendanceRate, setAttendanceRate] = useState(0);
  const [recentRecords, setRecentRecords] = useState([]);
  const [loading, setLoading] = useState(false);
  const [trendData, setTrendData] = useState(null);

  // Initialize with empty trend data
  const initializeTrendData = useCallback(() => {
    const labels = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      });
      labels.push(label);
    }

    return {
      labels,
      datasets: [
        {
          label: "Absent",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#ef4444",
          backgroundColor: "#f87171",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#ef4444",
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: "Late",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#f59e0b",
          backgroundColor: "#fbbf24",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#f59e0b",
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: "Present",
          data: [0, 0, 0, 0, 0, 0, 0],
          borderColor: "#10b981",
          backgroundColor: "#34d399",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#10b981",
          borderWidth: 2,
          spanGaps: true,
        },
      ],
    };
  }, []);

  // Function to generate trend data from recent records
  const generateTrendData = useCallback(() => {
    // Get last 7 days
    const labels = [];
    const presentData = [];
    const lateData = [];
    const absentData = [];

    for (let i = 6; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const dateString = date.toISOString().slice(0, 10);
      const label = date.toLocaleDateString('en-US', {
        month: 'short',
        day: '2-digit'
      });
      labels.push(label);

      // Filter records for this date
      const dayRecords = recentRecords.filter(record => {
        if (!record) return false;
        const recordDate = record.createdAt
          ? new Date(record.createdAt).toISOString().slice(0, 10)
          : (record.date || '');
        return recordDate === dateString;
      });

      // Count statuses for this day
      const present = dayRecords.filter(record => record?.status === "present").length;
      const late = dayRecords.filter(record => record?.status === "late").length;
      const absent = dayRecords.filter(record => record?.status === "absent").length;

      presentData.push(present);
      lateData.push(late);
      absentData.push(absent);
    }

    return {
      labels,
      datasets: [
        {
          label: "Absent",
          data: absentData,
          borderColor: "#ef4444",
          backgroundColor: "#f87171",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#ef4444",
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: "Late",
          data: lateData,
          borderColor: "#f59e0b",
          backgroundColor: "#fbbf24",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#f59e0b",
          borderWidth: 2,
          spanGaps: true,
        },
        {
          label: "Present",
          data: presentData,
          borderColor: "#10b981",
          backgroundColor: "#34d399",
          tension: 0.4,
          fill: false,
          pointStyle: "circle",
          pointRadius: 5,
          pointBackgroundColor: "#10b981",
          borderWidth: 2,
          spanGaps: true,
        },
      ],
    };
  }, [recentRecords]);

  // ✅ FIXED: Use configured api instance instead of axios
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);

      // ✅ Changed from axios.get('/api/users') to api.get('/users')
      const usersRes = await api.get('/users', {
        params: { limit: 1000 }
      });

      console.log('📊 Raw API response:', usersRes.data);

      // Handle response format: { success: true, users: [...] }
      let users = [];
      if (usersRes.data && usersRes.data.users && Array.isArray(usersRes.data.users)) {
        users = usersRes.data.users;
      } else if (Array.isArray(usersRes.data)) {
        // Fallback if API returns array directly
        users = usersRes.data;
      } else {
        console.warn('⚠️ Unexpected API response format:', usersRes.data);
        users = [];
      }

      console.log(`📊 Total users from API: ${users.length}`);

      // Filter: Include ALL active users
      const allActiveUsers = users.filter(user => user.isActive !== false);
      
      console.log(`📊 Active users: ${allActiveUsers.length}`);
      console.log(`📊 User roles: ${users.map(u => u.role).join(', ')}`);

      setTotalUsers(allActiveUsers.length);

      // Fetch reports (last 30 days)
      const today = new Date();
      const from = new Date();
      from.setDate(today.getDate() - 30);
      const fromStr = from.toISOString().slice(0,10);
      const toStr = today.toISOString().slice(0,10);

      // ✅ Changed from axios.get('/api/reports') to api.get('/reports')
      const reportsRes = await api.get('/reports', {
        params: {
          fromDate: fromStr,
          toDate: toStr,
          limit: 2000
        }
      });

      const aggregates = reportsRes.data?.aggregates || {};
      setPresentCount(aggregates.present || 0);
      setLateCount(aggregates.late || 0);
      setAbsentCount(aggregates.absent || 0);
      setAttendanceRate(aggregates.attendanceRate || 0);
      setRecentRecords(reportsRes.data?.records || []);

    } catch (err) {
      console.error('❌ AdminDashboard load error', err);
      if (err.response) {
        console.error('Response status:', err.response.status);
        console.error('Response data:', err.response.data);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    console.log('🚀 AdminDashboard mounted - Loading initial data');
    setTrendData(initializeTrendData());
    fetchData();
  }, [initializeTrendData, fetchData]);

  // Event listeners
  useEffect(() => {
    const handleUserCreated = () => {
      console.log('🔄 🟢 userCreated event received - Refreshing dashboard');
      fetchData();
    };

    const handleUserUpdated = () => {
      console.log('🔄 🔵 userUpdated event received - Refreshing dashboard');
      fetchData();
    };

    const handleUserDeleted = () => {
      console.log('🔄 🔴 userDeleted event received - Refreshing dashboard');
      fetchData();
    };

    // Add event listeners
    window.addEventListener('userCreated', handleUserCreated);
    window.addEventListener('userUpdated', handleUserUpdated);
    window.addEventListener('userDeleted', handleUserDeleted);

    console.log('📡 Event listeners registered');

    // Cleanup event listeners
    return () => {
      console.log('📡 Cleaning up event listeners');
      window.removeEventListener('userCreated', handleUserCreated);
      window.removeEventListener('userUpdated', handleUserUpdated);
      window.removeEventListener('userDeleted', handleUserDeleted);
    };
  }, [fetchData]);

  // Generate trend data when recentRecords changes
  useEffect(() => {
    if (recentRecords && recentRecords.length >= 0) {
      const newTrendData = generateTrendData();
      setTrendData(newTrendData);
    }
  }, [recentRecords, generateTrendData]);

  const absentPerc = totalUsers ? Math.round((absentCount / totalUsers) * 100) : 0;
  const latePerc = totalUsers ? Math.round((lateCount / totalUsers) * 100) : 0;

  const trendOptions = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: {
      mode: "index",
      intersect: false
    },
    plugins: {
      legend: {
        position: "bottom",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          color: "#374151",
        },
      },
      tooltip: {
        mode: "index",
        intersect: false
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        },
        grid: {
          drawBorder: false
        },
      },
      x: {
        grid: {
          drawBorder: false
        }
      },
    },
  };

  const pieData = {
    labels: [`Present (${attendanceRate}%)`, `Absent (${absentPerc}%)`, `Late (${latePerc}%)`],
    datasets: [
      {
        label: "Today's Attendance",
        data: [attendanceRate, absentPerc, latePerc],
        backgroundColor: ["#10b981", "#ef4444", "#f59e0b"],
        borderWidth: 0,
        hoverOffset: 20,
      },
    ],
  };

  const pieOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "right",
        labels: {
          usePointStyle: true,
          pointStyle: "circle",
          boxWidth: 14,
          padding: 20,
          color: "#374151",
          font: {
            size: 14,
            weight: "600"
          },
        },
      },
      tooltip: {
        enabled: true
      },
    },
  };

  // Custom icons (same as before - keeping for brevity)
  const TotalUsersIcon = () => (
    <div className="w-10 h-10 rounded-full border-2 border-gray-300 flex items-center justify-center">
      <svg className="w-5 h-5 text-gray-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    </div>
  );

  const PresentTodayIcon = () => (
    <div className="w-10 h-10 rounded-full border-2 border-green-400 flex items-center justify-center">
      <svg className="w-5 h-5 text-green-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="m9 12l2 2l4-4" stroke="#10b981" strokeWidth="2" />
      </svg>
    </div>
  );

  const AbsentTodayIcon = () => (
    <div className="w-10 h-10 rounded-full border-2 border-red-400 flex items-center justify-center">
      <svg className="w-5 h-5 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <path d="m15 9l-6 6m0-6l6 6" stroke="#ef4444" strokeWidth="2" />
      </svg>
    </div>
  );

  const LateArrivalsIcon = () => (
    <div className="w-10 h-10 rounded-full border-2 border-amber-400 flex items-center justify-center">
      <svg className="w-5 h-5 text-amber-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
        <circle cx="12" cy="7" r="4" />
        <circle cx="12" cy="12" r="8" stroke="#f59e0b" strokeWidth="2" fill="none" />
        <path d="M12 8v4l2 2" stroke="#f59e0b" strokeWidth="2" />
      </svg>
    </div>
  );

  if (!trendData) {
    return (
      <div className="bg-[#f9fafb] min-h-screen p-6 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#f9fafb] min-h-screen p-6">
      {/* Header Cards */}
      <section className="mb-10">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {/* Total Users Card */}
          <article className="bg-white rounded-lg p-4 shadow-sm relative">
            <div className="absolute top-3 right-3">
              <TotalUsersIcon />
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Total Users
            </div>
            <div className="text-2xl font-bold mt-3">{totalUsers}</div>
            <div className="text-xs text-gray-500 mt-1">Registered students</div>
          </article>

          {/* Present Today Card */}
          <article className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-green-400 relative">
            <div className="absolute top-3 right-3">
              <PresentTodayIcon />
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Present Today
            </div>
            <div className="text-2xl font-bold mt-3 text-green-600">{presentCount}</div>
            <div className="text-xs text-gray-500 mt-1">
              {attendanceRate}% attendance rate
            </div>
          </article>

          {/* Absent Today Card */}
          <article className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-red-400 relative">
            <div className="absolute top-3 right-3">
              <AbsentTodayIcon />
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Absent Today
            </div>
            <div className="text-2xl font-bold mt-3 text-red-600">{absentCount}</div>
            <div className="text-xs text-gray-500 mt-1">{absentPerc}% Requires attention</div>
          </article>

          {/* Late Arrivals Card */}
          <article className="bg-white rounded-lg p-4 shadow-sm border-l-4 border-amber-400 relative">
            <div className="absolute top-3 right-3">
              <LateArrivalsIcon />
            </div>
            <div className="text-sm font-semibold text-gray-700">
              Late Arrivals
            </div>
            <div className="text-2xl font-bold mt-3 text-amber-600">{lateCount}</div>
            <div className="text-xs text-gray-500 mt-1">{latePerc}% Today's late entries</div>
          </article>
        </div>
      </section>

      {/* Charts area */}
      <section className="mb-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-7">
          <div className="bg-white rounded-lg p-5 shadow-sm min-h-[260px]">
            <h3 className="text-base font-semibold mb-1">7-Day Attendance Trend</h3>
            <p className="text-sm text-gray-500 mb-4">Daily attendance breakdown for the past week</p>
            <div className="w-full h-56 md:h-64 lg:h-56">
              <Line data={trendData} options={trendOptions} />
            </div>
          </div>

          <div className="bg-white rounded-lg p-5 shadow-sm min-h-[260px]">
            <h3 className="text-base font-semibold mb-1">Today's Attendance Distribution</h3>
            <p className="text-sm text-gray-500 mb-4">Breakdown of today's attendance status</p>
            <div className="w-full h-64 flex items-center justify-center">
              <div className="w-full max-w-xs">
                <Pie data={pieData} options={pieOptions} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Monthly overview */}
      <section className="mb-10">
        <div className="mb-4">
          <h3 className="text-base font-semibold mb-1">Monthly Overview</h3>
          <p className="text-sm text-gray-500">Current month attendance statistics</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-6 max-w-8xl mx-auto justify-center">
          <div className="flex-1 rounded-lg p-6 font-semibold shadow-sm bg-green-50 text-green-700 min-w-[250px] max-w-[410px]">
            <div className="text-sm">Total Present</div>
            <div className="text-2xl font-bold mt-2">{presentCount}</div>
          </div>

          <div className="flex-1 rounded-lg p-6 font-semibold shadow-sm bg-blue-50 text-blue-700 min-w-[250px] max-w-[410px]">
            <div className="text-sm">Total Records</div>
            <div className="text-2xl font-bold mt-2">{recentRecords.length}</div>
          </div>

          <div className="flex-1 rounded-lg p-6 font-semibold shadow-sm bg-purple-50 text-purple-700 min-w-[250px] max-w-[410px]">
            <div className="text-sm">Attendance Rate</div>
            <div className="text-2xl font-bold mt-2">{attendanceRate}%</div>
          </div>
        </div>
      </section>
    </div>
  );
}
