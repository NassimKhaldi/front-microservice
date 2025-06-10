import React from "react";
import { useAuth } from "../context/AuthContext";
import { Container, Row, Col, Card, Button } from "react-bootstrap";

const Dashboard = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };
  return (
    <div
      style={{
        background: "linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)",
        minHeight: "100vh",
        padding: "20px",
      }}
    >
      <Container fluid>
        <Row className="mb-4">
          <Col>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <Card.Header
                className="bg-primary text-white d-flex justify-content-between align-items-center"
                style={{ borderRadius: "15px 15px 0 0" }}
              >
                {" "}
                <div>
                  <h3 className="mb-0 fw-bold">
                    <i className="bi bi-person-circle me-2"></i>
                    Task Management - User Portal
                  </h3>
                  <small className="opacity-75">
                    Welcome back, {user?.name}!
                  </small>
                </div>
                <Button
                  variant="outline-light"
                  onClick={handleLogout}
                  className="fw-semibold"
                >
                  <i className="bi bi-box-arrow-right me-2"></i>
                  Logout
                </Button>
              </Card.Header>
            </Card>
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card
              className="shadow-sm border-0 text-center"
              style={{ borderRadius: "15px" }}
            >
              <Card.Body className="p-5">
                <div className="mb-4">
                  <i
                    className="bi bi-check-circle-fill text-success"
                    style={{ fontSize: "4rem" }}
                  ></i>
                </div>
                <h2 className="text-dark mb-3">Welcome to User Service</h2>
                <p className="text-muted fs-5 mb-4">
                  You have successfully logged in to your account. Your session
                  is active and secure.
                </p>
                <div className="d-flex justify-content-center gap-3">
                  <Button variant="primary" size="lg" className="fw-semibold">
                    <i className="bi bi-gear me-2"></i>
                    Account Settings
                  </Button>
                  <Button
                    variant="outline-primary"
                    size="lg"
                    className="fw-semibold"
                  >
                    <i className="bi bi-question-circle me-2"></i>
                    Help & Support
                  </Button>
                </div>
              </Card.Body>
            </Card>{" "}
          </Col>
        </Row>

        <Row className="mb-4">
          <Col>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <Card.Header className="bg-info text-white">
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-gear me-2"></i>
                  Account Management
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  <Col md={6} className="mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <i className="bi bi-person-gear text-info fs-4 me-3"></i>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark">
                          Manage Profile
                        </h6>
                        <small className="text-muted">
                          Update your personal information and profile picture
                        </small>
                      </div>
                      <Button
                        variant="info"
                        size="sm"
                        onClick={() => (window.location.href = "/profile")}
                        className="fw-semibold"
                      >
                        <i className="bi bi-arrow-right me-1"></i>
                        Edit
                      </Button>
                    </div>
                  </Col>
                  <Col md={6} className="mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <i className="bi bi-shield-lock text-info fs-4 me-3"></i>
                      <div className="flex-grow-1">
                        <h6 className="mb-1 fw-bold text-dark">
                          Security Settings
                        </h6>
                        <small className="text-muted">
                          Change password and security preferences
                        </small>
                      </div>
                      <Button
                        variant="outline-info"
                        size="sm"
                        className="fw-semibold"
                        disabled
                      >
                        <i className="bi bi-lock me-1"></i>
                        Soon
                      </Button>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        <Row>
          <Col>
            <Card
              className="shadow-sm border-0"
              style={{ borderRadius: "15px" }}
            >
              <Card.Header className="bg-light">
                <h4 className="mb-0 fw-bold text-dark">
                  <i className="bi bi-info-circle me-2"></i>
                  Account Information
                </h4>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  <Col md={4} className="mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <i className="bi bi-person-fill text-primary fs-4 me-3"></i>
                      <div>
                        <small className="text-muted d-block">Full Name</small>
                        <strong className="text-dark">
                          {user?.name || "Not provided"}
                        </strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <i className="bi bi-envelope-fill text-primary fs-4 me-3"></i>
                      <div>
                        <small className="text-muted d-block">
                          Email Address
                        </small>
                        <strong className="text-dark">
                          {user?.email || "Not provided"}
                        </strong>
                      </div>
                    </div>
                  </Col>
                  <Col md={4} className="mb-3">
                    <div className="d-flex align-items-center p-3 bg-light rounded-3">
                      <i className="bi bi-calendar-fill text-primary fs-4 me-3"></i>
                      <div>
                        <small className="text-muted d-block">
                          Member Since
                        </small>
                        <strong className="text-dark">
                          {user?.createdAt
                            ? new Date(user.createdAt).toLocaleDateString()
                            : "N/A"}
                        </strong>
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Dashboard;
