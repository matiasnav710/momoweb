import React, { Component } from "react";
import { Link, withRouter } from "react-router-dom";
import { Form } from "react-bootstrap";
import { connect } from "react-redux";
import { AuthActions } from "../store";
import Api from "../api";
import i18n from "../../i18n";

class Login extends Component {
  state = {
    loginErrTxt: ""
  };

  componentWillReceiveProps(nextProps, nextContext) {
    if (nextProps.authenticated && nextProps.email_verified) {
      this.props.history.push("/dashboard");
    }
  }

  onLogin = () => {
    this.setState({ loginErrTxt: "" });
    const email = this.refEmail.value;
    const password = this.refPassword.value;
    this.props.setLoading(true);
    Api.login(email, password)
      .then(({ user, access_token }) => {

        // Save Session
        Api.setSession(access_token);
        this.props.setUser(user);
        this.props.setLoading(false);
        this.props.setAuthenticated(true);

        if (!user.email_verified) {
          this.props.history.push('/verify');
        } else if (!user.subscription) {
          this.props.history.push('/plans');
        } else {
          this.props.history.push('/dashboard');
        }
      })
      .catch(error => {
        const errTxt = error.toString()
        let loginErrTxt
        if (error.toString() === 'TypeError: Failed to fetch') {
          loginErrTxt = 'Service not available';
        } else {
          loginErrTxt = i18n.getResource("en", ["translations"], errTxt);
          if (!loginErrTxt) {
            loginErrTxt = "Unknown problem";
          }
        }

        this.setState({ loginErrTxt });
        this.props.setLoading(false);
        this.props.setAuthenticated(true);
      });
  };

  onFacebook = () => { };

  render() {
    const { loginErrTxt } = this.state;
    return (
      <div>
        <div className="d-flex align-items-center auth px-0">
          <div className="row w-100 mx-0">
            <div className="col-lg-4 mx-auto">
              <div className="card text-left py-5 px-4 px-sm-5">
                <div className="brand-logo">
                  <h2>MomoWeb</h2>
                </div>
                <h4>Hello! let's get started</h4>
                <h6 className="font-weight-light">Mometic Inc.</h6>
                <Form className="pt-3">
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="email"
                      placeholder="Username"
                      size="lg"
                      className="h-auto"
                      ref={ref => {
                        this.refEmail = ref;
                      }}
                    />
                  </Form.Group>
                  <Form.Group className="d-flex search-field">
                    <Form.Control
                      type="password"
                      placeholder="Password"
                      size="lg"
                      className="h-auto"
                      ref={ref => {
                        this.refPassword = ref;
                      }}
                    />
                  </Form.Group>
                  {loginErrTxt !== "" && (
                    <label className="text-danger">{`${loginErrTxt}`}</label>
                  )}
                  <div className="mt-3">
                    <a
                      className="btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn"
                      onClick={this.onLogin}
                    >
                      SIGN IN
                    </a>
                  </div>
                  <div className="my-2 d-flex justify-content-between align-items-center">
                    <div className="form-check">
                      <label className="form-check-label text-muted">
                        <input type="checkbox" className="form-check-input" />
                        <i className="input-helper"></i>
                        Keep me signed in
                      </label>
                    </div>
                    <a
                      href="!#"
                      onClick={event => event.preventDefault()}
                      className="auth-link text-black"
                    >
                      Forgot password?
                    </a>
                  </div>
                  <div className="mb-2">
                    <button
                      type="button"
                      className="btn btn-block btn-facebook auth-form-btn"
                      onClick={this.onFacebook}
                    >
                      <i className="mdi mdi-facebook mr-2"></i>Connect using
                      facebook
                    </button>
                  </div>
                  <div className="text-center mt-4 font-weight-light">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-primary">
                      Create
                    </Link>
                  </div>
                </Form>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapDispatchToProps = {
  setAuthenticated: AuthActions.setAuthenticated,
  setLoading: AuthActions.setLoading,
  setUser: AuthActions.setUser,
};

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
