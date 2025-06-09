const express = require("express");
const { authenticateToken } = require("../middleware/auth");
const router = express.Router();

let users = [
  { id: 1, name: "John Doe", email: "john@example.com", createdAt: new Date() },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    createdAt: new Date(),
  },
];

router.get("/", authenticateToken, (req, res) => {
  res.json({
    success: true,
    data: users,
    count: users.length,
  });
});

router.get("/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const user = users.find((u) => u.id === userId);

  if (!user) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  res.json({
    success: true,
    data: user,
  });
});

router.put("/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  const { name, email } = req.body;

  if (name) users[userIndex].name = name;
  if (email) users[userIndex].email = email;
  users[userIndex].updatedAt = new Date();

  res.json({
    success: true,
    data: users[userIndex],
    message: "User updated successfully",
  });
});

router.delete("/:id", authenticateToken, (req, res) => {
  const userId = parseInt(req.params.id);
  const userIndex = users.findIndex((u) => u.id === userId);

  if (userIndex === -1) {
    return res.status(404).json({
      success: false,
      message: "User not found",
    });
  }

  users.splice(userIndex, 1);

  res.json({
    success: true,
    message: "User deleted successfully",
  });
});

module.exports = router;
