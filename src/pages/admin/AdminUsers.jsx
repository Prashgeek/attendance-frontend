import React, { useEffect, useRef, useState } from "react";

/**
 * Users.jsx
 * Fully responsive user management component:
 * - Table view on md+ screens
 * - Card view on small screens
 * - Accessible add/edit modal with focus trap
 * - Accessible view modal
 * - Action menu that flips above if there's not enough space
 */

export default function Users() {
  // sample data
  const [users, setUsers] = useState([
    {
      id: 1,
      fullName: "John Doe",
      email: "john@example.com",
      role: "Student",
      dept: "Class 10",
      uid: "STU-001",
      attendance: 92,
    },
    {
      id: 2,
      fullName: "Jane Smith",
      email: "jane@example.com",
      role: "Teacher",
      dept: "Physics",
      uid: "EMP-101",
      attendance: 87,
    },
  ]);

  // modal state (create / edit)
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null); // null = create
  const [form, setForm] = useState({
    fullName: "",
    email: "",
    role: "Student",
    dept: "",
    uid: "",
    attendance: "",
  });
  const [errors, setErrors] = useState({});

  // action menu per-row: store id of open menu
  const [openActionId, setOpenActionId] = useState(null);
  // store whether the open menu should be displayed above the anchor (flip)
  const [menuFlipUp, setMenuFlipUp] = useState(false);

  // view modal state (simple details)
  const [viewUser, setViewUser] = useState(null);

  // search
  const [query, setQuery] = useState("");

  const firstInputRef = useRef(null);
  // mapping id -> wrapper element for actions
  const actionMenuRefs = useRef({});

  // ------------------------------------------------------------------------------------------------
  // UTILITIES
  // ------------------------------------------------------------------------------------------------
  function nextId() {
    // reliable unique id without depending on array order
    return Date.now() + Math.floor(Math.random() * 999);
  }

  // ------------------------------------------------------------------------------------------------
  // MODAL helpers
  // ------------------------------------------------------------------------------------------------
  function openCreateModal() {
    setEditingId(null);
    setForm({ fullName: "", email: "", role: "Student", dept: "", uid: "", attendance: "" });
    setErrors({});
    setIsModalOpen(true);
  }

  function openEditModal(user) {
    setEditingId(user.id);
    setForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      dept: user.dept || "",
      uid: user.uid,
      attendance: user.attendance ?? "",
    });
    setErrors({});
    setIsModalOpen(true);
  }

  function handleView(user) {
    setViewUser(user);
  }

  // ------------------------------------------------------------------------------------------------
  // CRUD handlers
  // ------------------------------------------------------------------------------------------------
  function handleDelete(userId) {
    if (!window.confirm("Delete this user? This action cannot be undone.")) return;
    setUsers((prev) => prev.filter((u) => u.id !== userId));
    setOpenActionId(null);
  }

  function handleChange(e) {
    const { name, value } = e.target;
    setForm((s) => ({ ...s, [name]: value }));
  }

  function validate() {
    const err = {};
    if (!form.fullName.trim()) err.fullName = "Full name required";
    if (!form.email.trim()) err.email = "Email required";
    else if (!/^\S+@\S+\.\S+$/.test(form.email)) err.email = "Invalid email";
    if (!form.role.trim()) err.role = "Role required";
    if (!form.uid.trim()) err.uid = "ID required";
    if (
      form.attendance !== "" &&
      (isNaN(Number(form.attendance)) || Number(form.attendance) < 0 || Number(form.attendance) > 100)
    )
      err.attendance = "Attendance must be 0–100";
    return err;
  }

  function handleSubmit(e) {
    e.preventDefault();
    const err = validate();
    setErrors(err);
    if (Object.keys(err).length) return;

    const payload = {
      fullName: form.fullName.trim(),
      email: form.email.trim(),
      role: form.role,
      dept: form.dept.trim(),
      uid: form.uid.trim(),
      attendance: form.attendance === "" ? 0 : Number(form.attendance),
    };

    if (editingId) {
      setUsers((prev) => prev.map((u) => (u.id === editingId ? { ...u, ...payload } : u)));
    } else {
      const newUser = { id: nextId(), ...payload };
      setUsers((prev) => [newUser, ...prev]);
    }

    setIsModalOpen(false);
    setEditingId(null);
  }

  // ------------------------------------------------------------------------------------------------
  // Action menu position logic (flip above if not enough space)
  // ------------------------------------------------------------------------------------------------
  function toggleActionMenu(userId, event) {
    event.stopPropagation();

    // if closing same menu
    if (openActionId === userId) {
      setOpenActionId(null);
      return;
    }

    // determine if there's room below the clicked button to open the menu
    const btn = event.currentTarget; // the button element
    if (btn && typeof btn.getBoundingClientRect === "function") {
      const rect = btn.getBoundingClientRect();
      const estimatedMenuHeight = 150; // px - safe guess for menu height
      const spaceBelow = window.innerHeight - rect.bottom;
      const shouldFlip = spaceBelow < estimatedMenuHeight && rect.top > estimatedMenuHeight;
      setMenuFlipUp(shouldFlip);
    } else {
      setMenuFlipUp(false);
    }

    setOpenActionId(userId);
  }

  // ------------------------------------------------------------------------------------------------
  // Global keyboard handlers and click outside
  // ------------------------------------------------------------------------------------------------
  useEffect(() => {
    function onKey(e) {
      if (e.key === "Escape") {
        setIsModalOpen(false);
        setViewUser(null);
        setOpenActionId(null);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // autofocus first input when opening modal
  useEffect(() => {
    if (isModalOpen) {
      // small delay so modal mounts
      setTimeout(() => firstInputRef.current?.focus(), 80);
    }
  }, [isModalOpen]);

  // close action menu when clicking outside any menu
  useEffect(() => {
    function onDocClick(e) {
      let clickedInsideMenu = false;
      Object.values(actionMenuRefs.current).forEach((ref) => {
        if (ref && ref.contains && ref.contains(e.target)) clickedInsideMenu = true;
      });
      if (!clickedInsideMenu) setOpenActionId(null);
    }
    document.addEventListener("click", onDocClick);
    return () => document.removeEventListener("click", onDocClick);
  }, []);

  // filtered users for search
  const filtered = users.filter((u) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      u.fullName.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q) ||
      (u.dept || "").toLowerCase().includes(q)
    );
  });

  // ------------------------------------------------------------------------------------------------
  // Render
  // ------------------------------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#f8f9fb] text-[#111827]">
      <main className="mx-3 sm:mx-6 mb-10 bg-white rounded-xl p-4 sm:p-6 shadow-md relative">
        {/* Add User (desktop) */}
        <button
          type="button"
          onClick={openCreateModal}
          className="hidden sm:inline-flex items-center gap-2 absolute top-4 right-4 bg-gray-900 text-white px-4 py-2 rounded-md text-sm hover:bg-gray-800 transition-shadow shadow-sm z-10"
          aria-label="Add user"
        >
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
            <path d="M12 5v14M5 12h14" />
          </svg>
          Add User
        </button>

        <div className="mb-4">
          <h2 className="font-bold text-xl text-gray-900">User Management</h2>
          <p className="text-gray-600 text-sm">Manage students, teachers, and staff members</p>
        </div>

        {/* Controls */}
        <div className="flex flex-wrap gap-3 mb-4 items-center">
          <div className="relative flex-grow min-w-[160px]">
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              type="search"
              placeholder="Search by name, email, id or department..."
              className="w-full border border-gray-300 rounded-md py-2 pl-3 pr-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Search users"
            />
          </div>

          <select
            aria-label="Filter by role"
            className="border border-gray-300 rounded-md py-2 px-3 text-sm bg-gray-50 text-gray-700 shrink-0"
          >
            <option>All Roles</option>
            <option>Admin</option>
            <option>Teacher</option>
            <option>Student</option>
            <option>Staff</option>
          </select>

          {/* Mobile Add User */}
          <button
            onClick={openCreateModal}
            className="flex items-center gap-2 bg-gray-900 text-white px-3 py-2 rounded-md text-sm hover:bg-gray-800 transition sm:hidden"
            aria-label="Add user"
          >
            <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
              <path d="M12 5v14M5 12h14" />
            </svg>
            Add
          </button>
        </div>

        {/* Table for md+ */}
        <div className="overflow-x-auto">
          <div className="hidden md:block">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Department / Class</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Attendance %</th>
                  <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>

              <tbody className="bg-white divide-y divide-gray-100">
                {filtered.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold">
                          {u.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                        </div>
                        <div>
                          <div className="text-sm font-medium text-gray-900">{u.fullName}</div>
                          <div className="text-xs text-gray-400">ID: {u.uid}</div>
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{u.email}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-gray-100 text-gray-700">
                        {u.role}
                      </span>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-700">{u.dept || "-"}</div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="w-40">
                        <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                          <span aria-hidden>{u.attendance}%</span>
                          <span className="sr-only">Attendance {u.attendance} percent</span>
                        </div>
                        <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden" role="progressbar" aria-valuemin="0" aria-valuemax="100" aria-valuenow={u.attendance}>
                          <div className="h-2 rounded-full" style={{
                            width: `${Math.max(0, Math.min(100, u.attendance))}%`,
                            background: u.attendance >= 75 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#f59e0b,#fbbf24)"
                          }} />
                        </div>
                      </div>
                    </td>

                    <td className="px-4 py-3 whitespace-nowrap text-right">
                      <div
                        ref={(el) => (actionMenuRefs.current[u.id] = el)}
                        className="relative inline-block"
                      >
                        <button
                          onClick={(e) => toggleActionMenu(u.id, e)}
                          aria-haspopup="true"
                          aria-expanded={openActionId === u.id}
                          className="inline-flex items-center p-2 rounded hover:bg-gray-100 focus:outline-none"
                          title="Actions"
                        >
                          <svg className="w-5 h-5 text-gray-600" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
                            <path d="M12 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4zm0 7a2 2 0 110-4 2 2 0 010 4z" />
                          </svg>
                        </button>

                        {openActionId === u.id && (
                          <div
                            role="menu"
                            className={`absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-lg shadow-lg z-30 dropdown-animation ${menuFlipUp ? "origin-bottom-right -translate-y-2" : ""}`}
                            style={{
                              transformOrigin: menuFlipUp ? "bottom right" : undefined
                            }}
                          >
                            <button
                              onClick={() => { setOpenActionId(null); handleView(u); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <span className="text-[14px]">👁</span> View Details
                            </button>
                            <button
                              onClick={() => { setOpenActionId(null); openEditModal(u); }}
                              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <span className="text-[14px]">✏️</span> Edit
                            </button>
                            <button
                              onClick={() => { handleDelete(u.id); }}
                              className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                              role="menuitem"
                            >
                              <span className="text-[14px]">🗑</span> Delete
                            </button>
                          </div>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}

                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-6 text-center text-sm text-gray-500">
                      No users found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Card view for small screens */}
          <div className="block md:hidden space-y-3">
            {filtered.length === 0 && (
              <div className="text-center py-6 text-gray-500 text-sm">No users found.</div>
            )}

            {filtered.map((u) => (
              <article key={u.id} className="bg-white border rounded-lg shadow-sm p-4">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center text-gray-600 font-semibold text-sm">
                    {u.fullName.split(" ").map((p) => p[0]).slice(0, 2).join("")}
                  </div>
                  <div className="flex-1">
                    <div className="flex justify-between items-start gap-2">
                      <div>
                        <h3 className="text-sm font-medium text-gray-900">{u.fullName}</h3>
                        <p className="text-xs text-gray-400">ID: {u.uid}</p>
                      </div>

                      <div className="flex items-center gap-1">
                        <span className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{u.role}</span>
                      </div>
                    </div>

                    <p className="text-xs text-gray-700 mt-2">{u.email}</p>
                    <p className="text-xs text-gray-700 mt-1"><strong>Dept:</strong> {u.dept || "-"}</p>

                    <div className="mt-3">
                      <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                        <span>Attendance</span>
                        <span>{u.attendance}%</span>
                      </div>
                      <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden">
                        <div className="h-2 rounded-full" style={{
                          width: `${Math.max(0, Math.min(100, u.attendance))}%`,
                          background: u.attendance >= 75 ? "linear-gradient(90deg,#10b981,#34d399)" : "linear-gradient(90deg,#f59e0b,#fbbf24)"
                        }} />
                      </div>
                    </div>

                    <div className="mt-3 flex justify-end gap-2">
                      <button onClick={() => handleView(u)} className="px-3 py-1 text-xs rounded bg-gray-100 hover:bg-gray-200">View</button>
                      <button onClick={() => openEditModal(u)} className="px-3 py-1 text-xs rounded bg-blue-600 text-white hover:bg-blue-700">Edit</button>
                      <button onClick={() => handleDelete(u.id)} className="px-3 py-1 text-xs rounded bg-red-50 text-red-600 hover:bg-red-100">Delete</button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </main>

      {/* Add/Edit modal */}
      {isModalOpen && (
        <Modal
          form={form}
          firstInputRef={firstInputRef}
          handleChange={handleChange}
          handleSubmit={handleSubmit}
          errors={errors}
          editingId={editingId}
          onClose={() => { setIsModalOpen(false); setEditingId(null); }}
        />
      )}

      {/* View user modal */}
      {viewUser && (
        <ViewModal user={viewUser} onClose={() => setViewUser(null)} />
      )}

      {/* small animations */}
      <style>{`
        @keyframes modalIn {
          from { transform: translateY(6px) scale(.98); opacity: 0; }
          to { transform: translateY(0) scale(1); opacity: 1; }
        }
        .dropdown-animation {
          animation: dropdownIn 120ms ease-out forwards;
        }
        @keyframes dropdownIn {
          from { opacity: 0; transform: scale(0.98) translateY(-6px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }

        /* When menu flipped (menuFlipUp true) we slightly shift it upward */
        .origin-bottom-right {
          transform-origin: bottom right;
        }

        /* small responsive tweaks */
        @media (max-width: 480px) {
          /* make main card padding smaller on very small screens */
          main { padding-left: 12px; padding-right: 12px; }
        }
      `}</style>
    </div>
  );
}

/* -------------------------
   Modal component (create/edit)
   - Focus trap
   - ESC handled globally in parent
   ------------------------- */
function Modal({ form, firstInputRef, handleChange, handleSubmit, errors, editingId, onClose }) {
  const modalRef = useRef(null);
  const closeBtnRef = useRef(null);

  useEffect(() => {
    // focus trap: keep focus inside modal
    const modal = modalRef.current;
    if (!modal) return;

    const focusable = modal.querySelectorAll(
      'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])'
    );

    function handleKey(e) {
      if (e.key !== "Tab") return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey) {
        // shift + tab
        if (document.activeElement === first) {
          e.preventDefault();
          last.focus();
        }
      } else {
        // tab
        if (document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    }

    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, []);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6" role="dialog" aria-modal="true" aria-labelledby="modal-title">
      <div className="fixed inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      <div
        ref={modalRef}
        className="relative z-50 w-full max-w-2xl mx-auto bg-white rounded-xl shadow-xl transform transition-all duration-150 max-h-[90vh] overflow-y-auto"
        style={{ animation: "modalIn 160ms ease-out forwards" }}
        onClick={(e) => e.stopPropagation()}
      >
        <form onSubmit={handleSubmit} className="p-5 sm:p-6">
          <div className="mb-3">
            <h3 id="modal-title" className="text-lg font-semibold text-gray-900">
              {editingId ? "Edit User" : "Add New User"}
            </h3>
            <p className="text-sm text-gray-500 mt-1">Create or update a user account</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="text-xs font-medium text-gray-700 block mb-1">Full name</label>
              <input
                ref={firstInputRef}
                name="fullName"
                value={form.fullName}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.fullName ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="e.g. Priya Patel"
              />
              {errors.fullName && <div className="text-xs text-red-500 mt-1">{errors.fullName}</div>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Email</label>
              <input
                name="email"
                value={form.email}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.email ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="email@example.com"
                type="email"
              />
              {errors.email && <div className="text-xs text-red-500 mt-1">{errors.email}</div>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Role</label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.role ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
              >
                <option>Student</option>
                <option>Teacher</option>
                <option>Admin</option>
                <option>Staff</option>
              </select>
              {errors.role && <div className="text-xs text-red-500 mt-1">{errors.role}</div>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Department / Class</label>
              <input
                name="dept"
                value={form.dept}
                onChange={handleChange}
                className="w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 border-gray-300 focus:ring-blue-200"
                placeholder="e.g. Class 10 / Physics"
              />
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Employee / Student ID</label>
              <input
                name="uid"
                value={form.uid}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.uid ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="e.g. STU-123 or EMP-001"
              />
              {errors.uid && <div className="text-xs text-red-500 mt-1">{errors.uid}</div>}
            </div>

            <div>
              <label className="text-xs font-medium text-gray-700 block mb-1">Attendance %</label>
              <input
                name="attendance"
                value={form.attendance}
                onChange={handleChange}
                className={`w-full border rounded-md px-3 py-2 text-sm outline-none focus:ring-1 ${
                  errors.attendance ? "border-red-400 focus:ring-red-200" : "border-gray-300 focus:ring-blue-200"
                }`}
                placeholder="0 - 100"
                inputMode="numeric"
              />
              {errors.attendance && <div className="text-xs text-red-500 mt-1">{errors.attendance}</div>}
            </div>
          </div>

          <div className="mt-6 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              ref={closeBtnRef}
              className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200 transition"
            >
              Cancel
            </button>
            <button type="submit" className="px-4 py-2 rounded-md bg-blue-600 text-white text-sm hover:bg-blue-700 transition shadow">
              {editingId ? "Save Changes" : "Add User"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* -------------------------
   View modal (read-only)
   ------------------------- */
function ViewModal({ user, onClose }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-3 sm:px-6" role="dialog" aria-modal="true" aria-labelledby="view-user-title">
      <div className="fixed inset-0 bg-black/40" onClick={onClose} />

      <div className="relative z-50 w-full max-w-md mx-auto bg-white rounded-xl shadow-xl p-5 sm:p-6" onClick={(e) => e.stopPropagation()}>
        <h3 id="view-user-title" className="text-lg font-semibold text-gray-900">{user.fullName}</h3>
        <p className="text-sm text-gray-500 mb-4">User details</p>

        <div className="text-sm text-gray-700 space-y-2">
          <div><strong>Email:</strong> {user.email}</div>
          <div><strong>Role:</strong> {user.role}</div>
          <div><strong>Department / Class:</strong> {user.dept || "-"}</div>
          <div><strong>ID:</strong> {user.uid}</div>
          <div><strong>Attendance:</strong> {user.attendance}%</div>
        </div>

        <div className="mt-6 flex justify-end">
          <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-100 text-gray-700 text-sm hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
}
