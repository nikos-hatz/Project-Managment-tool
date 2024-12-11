import React, { useEffect, useState } from "react";
import { collection, getDocs, updateDoc, doc } from "firebase/firestore";
import { db } from "./firebase";
import { Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Button, Typography, Paper } from "@mui/material";

const AdminPage = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const usersSnapshot = await getDocs(collection(db, "users"));
        const usersData = usersSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error("Error fetching users:", error.message);
      }
    };

    fetchUsers();
  }, []);

  const updateUserRole = async (userId, newRole) => {
    try {
      await updateDoc(doc(db, "users", userId), { role: newRole });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user.id === userId ? { ...user, role: newRole } : user
        )
      );
      console.log(`User ${userId} role updated to ${newRole}`);
    } catch (error) {
      console.error("Error updating user role:", error.message);
    }
  };

  return (
    <div style={{ padding: "20px" }}>
      <Typography variant="h4" gutterBottom>
        Admin Panel
      </Typography>
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Role</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Button
                    variant="contained"
                    color="primary"
                    onClick={() => updateUserRole(user.id, "manager")}
                  >
                    Promote to Manager
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => updateUserRole(user.id, "member")}
                    style={{ marginLeft: "10px" }}
                  >
                    Demote to Member
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default AdminPage;
