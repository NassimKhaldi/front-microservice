import React, { useState } from "react";
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
} from "react-bootstrap";

const SignUp = ({ switchToLogin }) => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const { signup } = useAuth();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(""); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      setLoading(false);
      return;
    }

    try {
      const { confirmPassword, ...signupData } = formData;
      await signup(signupData);
      // Navigation will be handled by App component based on auth state
    } catch (error) {
      setError(error.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)",
        minHeight: "100vh",
        padding: 0,
        width: "100%",
        margin: 0,
      }}
    >
      <Container fluid style={{ padding: 0, height: "100vh" }}>
        <Row style={{ margin: 0, height: "100%" }}>
          {/* Left side - SignUp Form */}
          <Col
            md={6}
            lg={5}
            className="d-flex align-items-center justify-content-center"
            style={{ padding: "40px" }}
          >
            <div style={{ width: "100%", maxWidth: "450px" }}>
              <Card
                className="shadow-lg border-0"
                style={{ borderRadius: "20px" }}
              >
                <Card.Body className="p-5">
                  <div className="text-center mb-5">
                    <div className="mb-4">
                      <i
                        className="bi bi-person-plus-fill text-primary"
                        style={{ fontSize: "4rem" }}
                      ></i>
                    </div>
                    <h1
                      className="fw-bold text-dark mb-2"
                      style={{ fontSize: "2.2rem" }}
                    >
                      Create Account
                    </h1>
                    <p className="text-muted fs-6">
                      Join us today and get started
                    </p>
                  </div>

                  <Form onSubmit={handleSubmit}>
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

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold text-dark">
                        Password
                      </Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock text-muted"></i>
                        </span>
                        <Form.Control
                          type={showPassword ? "text" : "password"}
                          name="password"
                          value={formData.password}
                          onChange={handleChange}
                          required
                          placeholder="Enter your password"
                          size="lg"
                          minLength="6"
                          className="border-start-0 border-end-0 ps-0"
                        />
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{ borderColor: "#ced4da" }}
                        >
                          <i
                            className={`bi ${
                              showPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold text-dark">
                        Confirm Password
                      </Form.Label>
                      <div className="input-group">
                        <span className="input-group-text bg-light border-end-0">
                          <i className="bi bi-lock-fill text-muted"></i>
                        </span>
                        <Form.Control
                          type={showConfirmPassword ? "text" : "password"}
                          name="confirmPassword"
                          value={formData.confirmPassword}
                          onChange={handleChange}
                          required
                          placeholder="Confirm your password"
                          size="lg"
                          minLength="6"
                          className="border-start-0 border-end-0 ps-0"
                        />
                        <button
                          className="btn btn-outline-secondary border-start-0"
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          style={{ borderColor: "#ced4da" }}
                        >
                          <i
                            className={`bi ${
                              showConfirmPassword ? "bi-eye-slash" : "bi-eye"
                            }`}
                          ></i>
                        </button>
                      </div>
                    </Form.Group>

                    {error && (
                      <Alert variant="danger" className="border-0 rounded-3">
                        <i className="bi bi-exclamation-triangle-fill me-2"></i>
                        {error}
                      </Alert>
                    )}

                    <div className="d-grid mb-3">
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
                            Creating Account...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-person-plus me-2"></i>
                            Create Account
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <hr className="my-4" />
                      <p className="text-muted mb-0">
                        Already have an account?{" "}
                        <Button
                          variant="link"
                          className="p-0 fw-semibold text-decoration-none"
                          onClick={switchToLogin}
                        >
                          Sign In
                        </Button>
                      </p>{" "}
                    </div>
                  </Form>
                </Card.Body>
              </Card>
            </div>
          </Col>

          {/* Right side - Illustration */}
          <Col
            md={6}
            lg={7}
            className="d-none d-md-flex align-items-center justify-content-center"
            style={{
              background: "rgba(255, 255, 255, 0.1)",
              padding: "40px",
              position: "relative",
            }}
          >
            <div
              className="text-center text-white"
              style={{ maxWidth: "500px" }}
            >
              {/* Join Our Platform Illustration */}
              <div style={{ fontSize: "8rem", marginBottom: "2rem" }}>
                <i
                  className="bi bi-people-fill"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                ></i>
              </div>

              <h2 className="fw-bold mb-4" style={{ fontSize: "2.5rem" }}>
                Join Our Task Management Community
              </h2>

              <p
                className="fs-5 mb-4"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Start organizing your tasks, collaborate with your team, and
                boost your productivity today.
              </p>

              {/* Feature highlights */}
              <div className="row g-3">
                <div className="col-6">
                  <div
                    className="p-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    <i
                      className="bi bi-shield-check fs-3 mb-2"
                      style={{ color: "#4CAF50" }}
                    ></i>
                    <p className="mb-0 small">Secure & Private</p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    <i
                      className="bi bi-lightning-charge-fill fs-3 mb-2"
                      style={{ color: "#FFD700" }}
                    ></i>
                    <p className="mb-0 small">Fast Setup</p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    <i
                      className="bi bi-heart-fill fs-3 mb-2"
                      style={{ color: "#FF69B4" }}
                    ></i>
                    <p className="mb-0 small">User Friendly</p>
                  </div>
                </div>
                <div className="col-6">
                  <div
                    className="p-3"
                    style={{
                      background: "rgba(255, 255, 255, 0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    <i
                      className="bi bi-trophy-fill fs-3 mb-2"
                      style={{ color: "#FF8C00" }}
                    ></i>
                    <p className="mb-0 small">Achievement Tracking</p>
                  </div>
                </div>
              </div>

              {/* Decorative elements */}
              <div
                style={{
                  position: "absolute",
                  top: "10%",
                  right: "10%",
                  fontSize: "3rem",
                  color: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <i className="bi bi-star-fill"></i>
              </div>
              <div
                style={{
                  position: "absolute",
                  bottom: "15%",
                  left: "10%",
                  fontSize: "2.5rem",
                  color: "rgba(255, 255, 255, 0.2)",
                }}
              >
                <i className="bi bi-rocket-takeoff"></i>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default SignUp;
