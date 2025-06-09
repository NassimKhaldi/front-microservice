const User = require("../models/User");

class UserController {
  // Get all users
  static async getAllUsers(req, res) {
    try {
      const users = await User.find().select("-password");

      res.json({
        success: true,
        message: "Users retrieved successfully",
        data: users,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving users",
        error: error.message,
      });
    }
  }

  // Get user by ID
  static async getUserById(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findById(id).select("-password");

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User retrieved successfully",
        data: user,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error retrieving user",
        error: error.message,
      });
    }
  }

  // Update user
  static async updateUser(req, res) {
    try {
      const { id } = req.params;
      const { name, email } = req.body;

      // Check if user exists
      const user = await User.findById(id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      // Check if email is already taken by another user
      if (email && email !== user.email) {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
          return res.status(400).json({
            success: false,
            message: "Email already exists",
          });
        }
      }

      // Update user
      const updatedUser = await User.findByIdAndUpdate(
        id,
        { name, email },
        { new: true, runValidators: true }
      ).select("-password");

      res.json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error updating user",
        error: error.message,
      });
    }
  }

  // Delete user
  static async deleteUser(req, res) {
    try {
      const { id } = req.params;

      const user = await User.findByIdAndDelete(id);

      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found",
        });
      }

      res.json({
        success: true,
        message: "User deleted successfully",
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Error deleting user",
        error: error.message,
      });
    }
  }
}

module.exports = UserController;
