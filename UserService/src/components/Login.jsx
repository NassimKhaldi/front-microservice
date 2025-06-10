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

const Login = ({ switchToSignup }) => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const { login } = useAuth();

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

    try {
      await login(formData);
      // Navigation will be handled by App component based on auth state
    } catch (error) {
      setError(error.message || "Login failed");
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
          {/* Left side - Login Form */}
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
                        className="bi bi-shield-lock-fill text-primary"
                        style={{ fontSize: "4rem" }}
                      ></i>
                    </div>
                    <h1
                      className="fw-bold text-dark mb-2"
                      style={{ fontSize: "2.2rem" }}
                    >
                      Welcome Back
                    </h1>
                    <p className="text-muted fs-6">
                      Please sign in to your account
                    </p>
                  </div>{" "}
                  <Form onSubmit={handleSubmit}>
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

                    <Form.Group className="mb-4">
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

                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <Form.Check
                        type="checkbox"
                        id="rememberMe"
                        label="Remember me"
                        className="text-muted"
                      />
                      <Button
                        variant="link"
                        className="p-0 text-decoration-none small"
                      >
                        Forgot password?
                      </Button>
                    </div>

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
                            Signing in...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-box-arrow-in-right me-2"></i>
                            Sign In
                          </>
                        )}
                      </Button>
                    </div>

                    <div className="text-center">
                      <hr className="my-4" />
                      <p className="text-muted mb-0">
                        Don't have an account?{" "}
                        <Button
                          variant="link"
                          className="p-0 fw-semibold text-decoration-none"
                          onClick={switchToSignup}
                        >
                          Create Account
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
              {/* Task Management Illustration */}
              <div style={{ fontSize: "8rem", marginBottom: "2rem" }}>
                <i
                  className="bi bi-kanban"
                  style={{ color: "rgba(255, 255, 255, 0.9)" }}
                ></i>
              </div>

              <h2 className="fw-bold mb-4" style={{ fontSize: "2.5rem" }}>
                Welcome to Task Management Platform
              </h2>

              <p
                className="fs-5 mb-4"
                style={{ color: "rgba(255, 255, 255, 0.9)" }}
              >
                Organize your work, collaborate with your team, and achieve your
                goals efficiently.
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
                      className="bi bi-check-circle-fill fs-3 mb-2"
                      style={{ color: "#4CAF50" }}
                    ></i>
                    <p className="mb-0 small">Task Tracking</p>
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
                      className="bi bi-people-fill fs-3 mb-2"
                      style={{ color: "#2196F3" }}
                    ></i>
                    <p className="mb-0 small">Team Collaboration</p>
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
                      className="bi bi-graph-up fs-3 mb-2"
                      style={{ color: "#FF9800" }}
                    ></i>
                    <p className="mb-0 small">Progress Analytics</p>
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
                      className="bi bi-bell-fill fs-3 mb-2"
                      style={{ color: "#9C27B0" }}
                    ></i>
                    <p className="mb-0 small">Smart Notifications</p>
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
                <i className="bi bi-clipboard-check"></i>
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
                <i className="bi bi-calendar-event"></i>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
