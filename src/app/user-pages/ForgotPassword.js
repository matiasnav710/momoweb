import React, { Component } from 'react'
import { Link, withRouter } from 'react-router-dom'
import { Form } from 'react-bootstrap'
import { connect } from 'react-redux'

import { AuthActions } from '../store'
import Api from '../api'

class ForgotPassword extends Component {
  state = {
    sendErrTxt: '',
    sent: false,
    email: ''
  }

  componentDidMount() {
    window.localStorage.removeItem('jwt_access_token')
  }

  onSubmit = async (e) => {

    e.preventDefault()
    this.setState({ sendErrTxt: '' })
    const { email } = this.state

    this.props.setLoading(true)
    await Api.sendForgotPasswordEmail(email)
    this.props.setLoading(false)
    this.setState({
      sent: true,
      email
    })
  }

  render() {
    const { sendErrTxt } = this.state
    return (
      <div>
        <div className='d-flex align-items-center auth px-0'>
          <div className='row w-100 mx-0'>
            <div className='col-lg-4 mx-auto'>
              <div className='card text-left py-5 px-4 px-sm-5'>
                <div className='brand-logo'>
                  <span className='h2 pr-2'>MOMO</span>
                </div>
                <h4>Forgot password</h4>

                {this.state.sent ? <>
                  <div className='text-muted'>We have sent an email to reset your password: {this.state.email}</div>
                  <div className='text-center mt-4 font-weight-light'>
                    <div className='text-muted'>If you do not see any emails, you can <a className='text-secondary' style={{cursor: 'pointer'}}onClick={() => {
                      this.setState({
                        sent: false
                      })
                    }}>try again</a>.</div>
                  </div>

                  <div className='text-center mt-4 font-weight-light'>
                    <Link to='/login' className='text-success'>
                      Log in
                      </Link>
                  </div>
                </> : <>
                    <h6 className='font-weight-light'>Please enter your email.</h6>
                    <div className='text-muted'>We will send instructions to your email.</div>
                    <Form className='pt-3' onSubmit={this.onSubmit}>
                      <Form.Group>
                        <div className='input-group'>
                          <div className='input-group-prepend'>
                            <i className='input-group-text mdi mdi-email text-success' />
                          </div>
                          <Form.Control type='text' className='form-control text-light' placeholder='Email'
                            value={this.state.email}
                            onChange={(e) => {
                              this.setState({
                                email: e.target.value
                              })
                            }}
                          />
                        </div>
                      </Form.Group>

                      {sendErrTxt !== '' && (
                        <label className='text-danger'>{`${sendErrTxt}`}</label>
                      )}
                      <div className='mt-3'>
                        <button
                          type='submit'
                          className='btn btn-block btn-primary btn-lg font-weight-medium auth-form-btn'
                        >
                          SEND
                      </button>
                      </div>
                      <div className='text-center mt-4 font-weight-light'>
                        <Link to='/login' className='text-success'>
                          Log in
                      </Link>
                      </div>

                    </Form>
                  </>}
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapDispatchToProps = {
  setAuthenticated: AuthActions.setAuthenticated,
  setLoading: AuthActions.setLoading,
  setUser: AuthActions.setUser,
}

const mapStateToProps = state => ({
  authenticated: state.auth.authenticated
})

export default connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
