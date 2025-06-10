import React, { useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Container,
  Row,
  Col,
  Card,
  Form,
  Button,
  Alert,
  Spinner,
  Image,
} from "react-bootstrap";

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    bio: user?.bio || "",
  });
  const [profilePicture, setProfilePicture] = useState(
    user?.profilePicture || null
  );
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
    setSuccess("");
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        setError("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError("Image size should be less than 5MB");
        return;
      }

      // Create a preview URL
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfilePicture(e.target.result);
      };
      reader.readAsDataURL(file);
      setError("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const updateData = {
        ...formData,
        profilePicture,
      };

      // Call the updateProfile function from AuthContext
      await updateProfile(updateData);
      setSuccess("Profile updated successfully!");
    } catch (error) {
      setError(error.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container fluid>
        <Row className="justify-content-center">
          <Col xs={12} md={8} lg={6}>
            <Card
              className="shadow-lg border-0"
              style={{ borderRadius: "20px" }}
            >
              <Card.Body className="p-5">
                <div className="text-center mb-4">
                  <h1
                    className="fw-bold text-dark mb-2"
                    style={{ fontSize: "2.2rem" }}
                  >
                    <i className="bi bi-person-circle me-2"></i>
                    User Profile
                  </h1>
                  <p className="text-muted">Manage your personal information</p>
                </div>

                {/* Profile Picture Section */}
                <div className="text-center mb-4">
                  <div className="position-relative d-inline-block">
                    <Image
                      src={
                        profilePicture ||
                        "https://via.placeholder.com/150x150?text=No+Image"
                      }
                      alt="Profile"
                      roundedCircle
                      width="150"
                      height="150"
                      className="border border-3 border-primary"
                      style={{ objectFit: "cover" }}
                    />
                    <Button
                      variant="primary"
                      size="sm"
                      className="position-absolute bottom-0 end-0 rounded-circle"
                      style={{ width: "40px", height: "40px" }}
                      onClick={triggerFileInput}
                    >
                      <i className="bi bi-camera"></i>
                    </Button>
                  </div>
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    style={{ display: "none" }}
                  />
                  <div className="mt-2">
                    <small className="text-muted">
                      Click the camera icon to change your profile picture
                    </small>
                  </div>
                </div>

                <Form onSubmit={handleSubmit}>
                  <Row>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          Full Name
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-person text-muted"></i>
                          </span>
                          <Form.Control
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            placeholder="Enter your full name"
                            size="lg"
                            className="border-start-0 ps-0"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-semibold text-dark">
                          Email Address
                        </Form.Label>
                        <div className="input-group">
                          <span className="input-group-text bg-light border-end-0">
                            <i className="bi bi-envelope text-muted"></i>
                          </span>
                          <Form.Control
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            placeholder="Enter your email"
                            size="lg"
                            className="border-start-0 ps-0"
                          />
                        </div>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold text-dark">
                      Phone Number
                    </Form.Label>
                    <div className="input-group">
                      <span className="input-group-text bg-light border-end-0">
                        <i className="bi bi-telephone text-muted"></i>
                      </span>
                      <Form.Control
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        placeholder="Enter your phone number"
                        size="lg"
                        className="border-start-0 ps-0"
                      />
                    </div>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-semibold text-dark">
                      Bio
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={4}
                      name="bio"
                      value={formData.bio}
                      onChange={handleChange}
                      placeholder="Tell us about yourself..."
                      className="border-2"
                    />
                  </Form.Group>

                  {error && (
                    <Alert variant="danger" className="border-0 rounded-3">
                      <i className="bi bi-exclamation-triangle-fill me-2"></i>
                      {error}
                    </Alert>
                  )}

                  {success && (
                    <Alert variant="success" className="border-0 rounded-3">
                      <i className="bi bi-check-circle-fill me-2"></i>
                      {success}
                    </Alert>
                  )}

                  <div className="d-grid">
                    <Button
                      type="submit"
                      variant="primary"
                      size="lg"
                      disabled={loading}
                      className="fw-semibold py-3 rounded-3"
                    >
                      {loading ? (
                        <>
                          <Spinner
                            as="span"
                            animation="border"
                            size="sm"
                            role="status"
                            aria-hidden="true"
                            className="me-2"
                          />
                          Updating Profile...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-save me-2"></i>
                          Update Profile
                        </>
                      )}
                    </Button>
                  </div>
                </Form>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
