import { cn } from "@/lib/utils";

type Props = React.ComponentPropsWithoutRef<"div">;

async function Users({ className, ...props }: Props) {
  return <div className={cn(className)} {...props}></div>;
}

export { Users };

// import React, { useState } from 'react';
// import { Search, Filter, Plus, Edit, Trash2, Mail, Shield, User, Calendar, MoreVertical, Eye, UserCheck, UserX } from 'lucide-react';

// const AdminUsersPage = () => {
//   const [activeTab, setActiveTab] = useState('all');
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedUsers, setSelectedUsers] = useState([]);
//   const [showCreateModal, setShowCreateModal] = useState(false);
//   const [showEditModal, setShowEditModal] = useState(false);
//   const [editingUser, setEditingUser] = useState(null);

//   // Mock users data - replace with actual API calls
//   const [users, setUsers] = useState([
//     {
//       id: '1',
//       name: 'Dr. Sarah Johnson',
//       email: 'sarah.johnson@university.edu',
//       role: 'researcher',
//       affiliation: 'Harvard University',
//       createdAt: '2024-01-15',
//       lastActive: '2024-07-25',
//       status: 'active',
//       publicationsCount: 12,
//       projectsCount: 3
//     },
//     {
//       id: '2',
//       name: 'Prof. Michael Chen',
//       email: 'michael.chen@institute.org',
//       role: 'admin',
//       affiliation: 'MIT Research Institute',
//       createdAt: '2023-11-20',
//       lastActive: '2024-07-28',
//       status: 'active',
//       publicationsCount: 25,
//       projectsCount: 7
//     },
//     {
//       id: '3',
//       name: 'Dr. Emily Rodriguez',
//       email: 'emily.rodriguez@college.edu',
//       role: 'researcher',
//       affiliation: 'Stanford University',
//       createdAt: '2024-03-10',
//       lastActive: '2024-07-20',
//       status: 'active',
//       publicationsCount: 8,
//       projectsCount: 2
//     },
//     {
//       id: '4',
//       name: 'James Wilson',
//       email: 'james.wilson@external.com',
//       role: 'member',
//       affiliation: 'Independent Researcher',
//       createdAt: '2024-06-05',
//       lastActive: '2024-07-15',
//       status: 'pending',
//       publicationsCount: 0,
//       projectsCount: 0
//     },
//     {
//       id: '5',
//       name: 'Dr. Lisa Thompson',
//       email: 'lisa.thompson@university.ac.uk',
//       role: 'researcher',
//       affiliation: 'Oxford University',
//       createdAt: '2024-02-28',
//       lastActive: '2024-06-30',
//       status: 'inactive',
//       publicationsCount: 15,
//       projectsCount: 4
//     }
//   ]);

//   const roles = ['admin', 'researcher', 'affiliate', 'partner', 'member'];
//   const statuses = ['active', 'inactive', 'pending', 'suspended'];

//   const getRoleColor = (role) => {
//     const colors = {
//       admin: 'bg-red-100 text-red-800',
//       researcher: 'bg-blue-100 text-blue-800',
//       affiliate: 'bg-green-100 text-green-800',
//       partner: 'bg-purple-100 text-purple-800',
//       member: 'bg-gray-100 text-gray-800'
//     };
//     return colors[role] || colors.member;
//   };

//   const getStatusColor = (status) => {
//     const colors = {
//       active: 'bg-green-100 text-green-800',
//       inactive: 'bg-gray-100 text-gray-800',
//       pending: 'bg-yellow-100 text-yellow-800',
//       suspended: 'bg-red-100 text-red-800'
//     };
//     return colors[status] || colors.pending;
//   };

//   const filteredUsers = users.filter(user => {
//     const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
//                          user.affiliation?.toLowerCase().includes(searchTerm.toLowerCase());

//     if (activeTab === 'all') return matchesSearch;
//     return matchesSearch && user.role === activeTab;
//   });

//   const tabCounts = {
//     all: users.length,
//     admin: users.filter(u => u.role === 'admin').length,
//     researcher: users.filter(u => u.role === 'researcher').length,
//     member: users.filter(u => u.role === 'member').length,
//     affiliate: users.filter(u => u.role === 'affiliate').length,
//     partner: users.filter(u => u.role === 'partner').length
//   };

//   const handleSelectUser = (userId) => {
//     setSelectedUsers(prev =>
//       prev.includes(userId)
//         ? prev.filter(id => id !== userId)
//         : [...prev, userId]
//     );
//   };

//   const handleSelectAll = () => {
//     if (selectedUsers.length === filteredUsers.length) {
//       setSelectedUsers([]);
//     } else {
//       setSelectedUsers(filteredUsers.map(user => user.id));
//     }
//   };

//   const CreateUserModal = () => {
//     const [formData, setFormData] = useState({
//       name: '',
//       email: '',
//       role: 'member',
//       affiliation: '',
//       password: ''
//     });

//     const handleSubmit = (e) => {
//       e.preventDefault();
//       // Add API call here
//       const newUser = {
//         id: Date.now().toString(),
//         ...formData,
//         createdAt: new Date().toISOString().split('T')[0],
//         lastActive: new Date().toISOString().split('T')[0],
//         status: 'pending',
//         publicationsCount: 0,
//         projectsCount: 0
//       };
//       setUsers(prev => [...prev, newUser]);
//       setShowCreateModal(false);
//       setFormData({ name: '', email: '', role: 'member', affiliation: '', password: '' });
//     };

//     if (!showCreateModal) return null;

//     return (
//       <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
//         <div className="bg-white rounded-lg p-6 w-full max-w-md">
//           <h3 className="text-lg font-semibold mb-4">Create New User</h3>
//           <form onSubmit={handleSubmit} className="space-y-4">
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
//               <input
//                 type="text"
//                 value={formData.name}
//                 onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//               <input
//                 type="email"
//                 value={formData.email}
//                 onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
//               <select
//                 value={formData.role}
//                 onChange={(e) => setFormData(prev => ({ ...prev, role: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               >
//                 {roles.map(role => (
//                   <option key={role} value={role}>{role}</option>
//                 ))}
//               </select>
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Affiliation</label>
//               <input
//                 type="text"
//                 value={formData.affiliation}
//                 onChange={(e) => setFormData(prev => ({ ...prev, affiliation: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <div>
//               <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
//               <input
//                 type="password"
//                 value={formData.password}
//                 onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
//                 className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 required
//               />
//             </div>
//             <div className="flex justify-end space-x-3 pt-4">
//               <button
//                 type="button"
//                 onClick={() => setShowCreateModal(false)}
//                 className="px-4 py-2 text-gray-600 hover:text-gray-800"
//               >
//                 Cancel
//               </button>
//               <button
//                 type="submit"
//                 className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
//               >
//                 Create User
//               </button>
//             </div>
//           </form>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-gray-50 p-6">
//       <div className="max-w-7xl mx-auto">
//         {/* Header */}
//         <div className="mb-8">
//           <div className="flex justify-between items-center">
//             <div>
//               <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
//               <p className="text-gray-600 mt-2">Manage users, researchers, and their permissions</p>
//             </div>
//             <button
//               onClick={() => setShowCreateModal(true)}
//               className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center space-x-2"
//             >
//               <Plus className="w-4 h-4" />
//               <span>Add User</span>
//             </button>
//           </div>
//         </div>

//         {/* Tabs */}
//         <div className="bg-white rounded-lg shadow-sm border mb-6">
//           <div className="border-b border-gray-200">
//             <nav className="flex space-x-8 px-6">
//               {[
//                 { key: 'all', label: 'All Users' },
//                 { key: 'admin', label: 'Admins' },
//                 { key: 'researcher', label: 'Researchers' },
//                 { key: 'member', label: 'Members' },
//                 { key: 'affiliate', label: 'Affiliates' },
//                 { key: 'partner', label: 'Partners' }
//               ].map(tab => (
//                 <button
//                   key={tab.key}
//                   onClick={() => setActiveTab(tab.key)}
//                   className={`py-4 px-1 border-b-2 font-medium text-sm ${
//                     activeTab === tab.key
//                       ? 'border-blue-500 text-blue-600'
//                       : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//                   }`}
//                 >
//                   {tab.label} ({tabCounts[tab.key]})
//                 </button>
//               ))}
//             </nav>
//           </div>
//         </div>

//         {/* Search and Filters */}
//         <div className="bg-white rounded-lg shadow-sm border p-6 mb-6">
//           <div className="flex flex-col sm:flex-row gap-4">
//             <div className="flex-1 relative">
//               <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
//               <input
//                 type="text"
//                 placeholder="Search users by name, email, or affiliation..."
//                 value={searchTerm}
//                 onChange={(e) => setSearchTerm(e.target.value)}
//                 className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//             </div>
//             <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50">
//               <Filter className="w-4 h-4" />
//               <span>Filter</span>
//             </button>
//           </div>
//         </div>

//         {/* Users Table */}
//         <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
//           <div className="px-6 py-4 border-b border-gray-200">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center space-x-4">
//                 <input
//                   type="checkbox"
//                   checked={selectedUsers.length === filteredUsers.length && filteredUsers.length > 0}
//                   onChange={handleSelectAll}
//                   className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                 />
//                 <span className="text-sm text-gray-700">
//                   {selectedUsers.length > 0 ? `${selectedUsers.length} selected` : `${filteredUsers.length} users`}
//                 </span>
//               </div>
//               {selectedUsers.length > 0 && (
//                 <div className="flex items-center space-x-2">
//                   <button className="text-sm text-blue-600 hover:text-blue-800">Bulk Edit</button>
//                   <button className="text-sm text-red-600 hover:text-red-800">Delete Selected</button>
//                 </div>
//               )}
//             </div>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full">
//               <thead className="bg-gray-50">
//                 <tr>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
//                     <input type="checkbox" className="rounded border-gray-300" />
//                   </th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Activity</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Stats</th>
//                   <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
//                 </tr>
//               </thead>
//               <tbody className="bg-white divide-y divide-gray-200">
//                 {filteredUsers.map((user) => (
//                   <tr key={user.id} className="hover:bg-gray-50">
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <input
//                         type="checkbox"
//                         checked={selectedUsers.includes(user.id)}
//                         onChange={() => handleSelectUser(user.id)}
//                         className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
//                       />
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="flex items-center">
//                         <div className="flex-shrink-0 h-10 w-10">
//                           <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center">
//                             <User className="h-5 w-5 text-gray-600" />
//                           </div>
//                         </div>
//                         <div className="ml-4">
//                           <div className="text-sm font-medium text-gray-900">{user.name}</div>
//                           <div className="text-sm text-gray-500">{user.email}</div>
//                           <div className="text-xs text-gray-400">{user.affiliation}</div>
//                         </div>
//                       </div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getRoleColor(user.role)}`}>
//                         {user.role}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(user.status)}`}>
//                         {user.status}
//                       </span>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap">
//                       <div className="text-sm text-gray-900">Joined {user.createdAt}</div>
//                       <div className="text-sm text-gray-500">Last active {user.lastActive}</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
//                       <div>{user.publicationsCount} publications</div>
//                       <div className="text-gray-500">{user.projectsCount} projects</div>
//                     </td>
//                     <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
//                       <div className="flex items-center space-x
