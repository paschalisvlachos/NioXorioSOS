import React, { useEffect, useState, CSSProperties } from 'react';
import axios from 'axios';

interface User {
  _id: string;
  name: string;
  telephone: string;
  comments: string;
  mapCoordinates: string;
  photo: string;
  approved: boolean;
  isRemoved: boolean;
  createdAt: string;
}

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortField, setSortField] = useState<keyof User>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  const [showRemoved, setShowRemoved] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/users');
        setUsers(response.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching users:', error);
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    let filtered = users.filter(
      user =>
        (showRemoved ? user.isRemoved : !user.isRemoved) &&
        user.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Sorting logic
    filtered.sort((a, b) => {
      let valueA = a[sortField];
      let valueB = b[sortField];

      if (sortField === 'createdAt') {
        return sortOrder === 'asc'
          ? new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          : new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      }

      if (typeof valueA === 'boolean' && typeof valueB === 'boolean') {
        return sortOrder === 'asc' ? Number(valueA) - Number(valueB) : Number(valueB) - Number(valueA);
      }

      valueA = String(valueA);
      valueB = String(valueB);

      return sortOrder === 'asc' ? valueA.localeCompare(valueB) : valueB.localeCompare(valueA);
    });

    setFilteredUsers(filtered);
  }, [users, searchQuery, sortField, sortOrder, showRemoved]);

  const handleToggleApproval = async (id: string) => {
    try {
      const response = await axios.patch(`http://localhost:5001/api/users/${id}/toggle-approval`);
      setUsers(users.map(user => user._id === id ? { ...user, approved: response.data.approved } : user));
    } catch (error) {
      console.error("Error toggling approval:", error);
    }
  };

  const handleToggleRemove = async (id: string, isCurrentlyRemoved: boolean) => {
    try {
      const endpoint = isCurrentlyRemoved ? `/users/${id}/restore` : `/users/${id}/remove`;
      const response = await axios.patch(`http://localhost:5001/api${endpoint}`);
      setUsers(users.map(user => user._id === id ? { ...user, isRemoved: response.data.isRemoved } : user));
    } catch (error) {
      console.error("Error toggling removal:", error);
    }
  };

  const handlePermanentDelete = async (id: string) => {
    try {
      await axios.delete(`http://localhost:5001/api/users/${id}`);
      setUsers(users.filter(user => user._id !== id));
      alert("User permanently deleted.");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const handleViewDetails = (user: User) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(event.target.value);
  };

  const handleSort = (field: keyof User) => {
    setSortOrder(prevOrder => (sortField === field && prevOrder === 'asc' ? 'desc' : 'asc'));
    setSortField(field);
  };

  if (loading) {
    return <p style={styles.loadingText}>Loading...</p>;
  }

  return (
    <div style={styles.container}>
      <h1 style={styles.header}>User List</h1>

      {/* Search and Toggle Removed Users */}
      <div style={styles.controls}>
        <input 
          type="text" 
          placeholder="Search by name..." 
          value={searchQuery} 
          onChange={handleSearch} 
          style={styles.searchBar} 
        />
        <label>
          <input 
            type="checkbox" 
            checked={showRemoved} 
            onChange={() => setShowRemoved(prev => !prev)} 
          />
          Show Removed Users
        </label>
      </div>

      <div style={styles.tableContainer}>
        <table style={styles.table}>
          <thead>
            <tr style={styles.tableHeaderRow}>
              <th onClick={() => handleSort('name')} style={styles.sortableHeader}>Name ⬍</th>
              <th onClick={() => handleSort('telephone')} style={styles.sortableHeader}>Telephone ⬍</th>
              <th onClick={() => handleSort('approved')} style={styles.sortableHeader}>Approved ⬍</th>
              <th onClick={() => handleSort('createdAt')} style={styles.sortableHeader}>Created At ⬍</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredUsers.map((user, index) => (
              <tr key={user._id} style={index % 2 === 0 ? styles.evenRow : styles.oddRow}>
                <td>{user.name}</td>
                <td>{user.telephone}</td>
                <td>{user.approved ? '✅ Yes' : '❌ No'}</td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td style={styles.actionButtons}>
                  {!showRemoved ? (
                    <>
                      <button style={styles.viewButton} onClick={() => handleViewDetails(user)}>👁 View</button>
                      <button 
                        style={user.approved ? styles.unapproveButton : styles.approveButton} 
                        onClick={() => handleToggleApproval(user._id)}
                      >
                        {user.approved ? '❌ Unapprove' : '✅ Approve'}
                      </button>
                      <button 
                        style={styles.removeButton} 
                        onClick={() => handleToggleRemove(user._id, user.isRemoved)}
                      >
                        🗑 Remove
                      </button>
                    </>
                  ) : (
                    <>
                      <button 
                        style={styles.restoreButton} 
                        onClick={() => handleToggleRemove(user._id, user.isRemoved)}
                      >
                        ♻️ Restore
                      </button>
                      <button 
                        style={styles.deleteButton} 
                        onClick={() => handlePermanentDelete(user._id)}
                      >
                        ❌ Delete Permanently
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* MODAL */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h2>User Details</h2>
            <p><strong>Name:</strong> {selectedUser.name}</p>
            <p><strong>Telephone:</strong> {selectedUser.telephone}</p>
            <p><strong>Comments:</strong> {selectedUser.comments}</p>
            {/* Check if mapCoordinates exist and are valid */}
            {selectedUser.mapCoordinates && (() => {
            try {
                const parsedCoords = JSON.parse(selectedUser.mapCoordinates);
                if (parsedCoords.latitude !== 0 && parsedCoords.longitude !== 0) {
                return (
                    <p>
                    <strong>Location:</strong>{' '}
                    <a 
                        href={`https://www.google.com/maps?q=${parsedCoords.latitude},${parsedCoords.longitude}`} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        style={{ color: '#3498db', textDecoration: 'none', fontWeight: 'bold' }}
                    >
                        Check Location
                    </a>
                    </p>
                );
                }
            } catch (error) {
                console.error('Error parsing map coordinates:', error);
            }
            return null;
            })()}

            <p><strong>Approved:</strong> {selectedUser.approved ? '✅ Yes' : '❌ No'}</p>
            <p><strong>Created At:</strong> {new Date(selectedUser.createdAt).toLocaleDateString()}</p>
            {selectedUser.photo && (
            <img 
                src={`http://localhost:5001${selectedUser.photo}`} 
                alt="User" 
                style={styles.modalImage} 
                onError={(e) => e.currentTarget.style.display = 'none'} // Hide broken images
            />
            )}
            <button style={styles.closeButton} onClick={closeModal}>Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles with TypeScript Fixes
const styles: { [key: string]: CSSProperties } = {
  container: { margin: '20px', fontFamily: 'Arial, sans-serif' },
  header: { fontSize: '24px', textAlign: 'center', marginBottom: '20px' },
  tableContainer: { overflowX: 'auto', boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.1)', borderRadius: '10px' },
  table: { width: '100%', borderCollapse: 'collapse' },
  tableHeaderRow: { backgroundColor: '#f2f2f2', textAlign: 'left' },
  evenRow: { backgroundColor: '#ffffff' },
  oddRow: { backgroundColor: '#f9f9f9' },
  actionButtons: { display: 'flex', gap: '10px' },
  viewButton: { backgroundColor: '#3498db', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
  approveButton: { backgroundColor: '#2ecc71', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
  unapproveButton: { backgroundColor: '#f39c12', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
  removeButton: { backgroundColor: '#e74c3c', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
  modalOverlay: { 
    position: 'fixed' as 'fixed', 
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0, 
    backgroundColor: 'rgba(0, 0, 0, 0.5)', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    padding: '20px', // Allows space for scrolling
  },
  modal: { 
    backgroundColor: 'white', 
    padding: '20px', 
    borderRadius: '10px', 
    textAlign: 'center' as 'center', 
    width: '90%',  // Makes the modal responsive 
    maxWidth: '400px', // Prevents it from getting too large
    maxHeight: '80vh', // Prevents modal from being too tall
    overflowY: 'auto', // Enables scrolling if content overflows
    display: 'flex',
    flexDirection: 'column',
  },
  modalImage: { 
    width: '100%', 
    height: 'auto', 
    borderRadius: '5px', 
    marginTop: '10px' 
  },
  closeButton: { marginTop: '15px', backgroundColor: '#555', color: 'white', padding: '8px', borderRadius: '5px', cursor: 'pointer' },
  loadingText: { textAlign: 'center', fontSize: '18px', fontWeight: 'bold' },
};

export default UserList;
