import PropTypes from 'prop-types';
import React from 'react';

import AlertBox from '@department-of-veterans-affairs/formation-react/AlertBox';

import ExternalServicesError from 'platform/monitoring/external-services/ExternalServicesError';
// import recordEvent from 'platform/monitoring/record-event';
import SubmitSignInForm from 'platform/static-data/SubmitSignInForm';
import { login, signup } from 'platform/user/authentication/utilities';
import environment from 'platform/utilities/environment';

import downtimeBanners from '../utilities/downtimeBanners';

const loginHandler = loginType => () => {
  // TODO add separate login tracking for this page
  //   recordEvent({ event: `login-attempted-${loginType}` });
  login(loginType, 'v1');
};

const handleDsLogon = loginHandler('dslogon');
const handleMhv = loginHandler('mhv');
const handleIdMe = loginHandler('idme');

const vaGovFullDomain = environment.BASE_URL;

class SignInModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      globalDowntime: false,
    };
  }

  setGlobalDowntimeState = () => {
    this.setState({ globalDowntime: true });
  };

  downtimeBanner = (
    { dependencies, headline, status, message, globalDowntime },
    index,
  ) => (
    <ExternalServicesError
      dependencies={dependencies}
      onRender={globalDowntime ? this.setGlobalDowntimeState : null}
      key={index}
    >
      <div className="downtime-notification row">
        <div className="columns small-12">
          <div className="form-warning-banner">
            <AlertBox headline={headline} isVisible status={status}>
              {message}
            </AlertBox>
            <br />
          </div>
        </div>
      </div>
    </ExternalServicesError>
  );

  render() {
    const { globalDowntime } = this.state;

    return (
      <main className="login">
        <div className="container">
          <div className="row">
            <div className="columns small-12">
              {/* TODO this title will need to be dynamic in the future */}
              <h1>Sign in to My Healthy Life</h1>
            </div>
          </div>
          <div className="row medium-screen:vads-u-display--none mobile-explanation">
            <div className="columns small-12">
              {/* TODO this content will need to be dynamic in the future */}
              <h2>One account to access My Healthy Life and VA.gov.</h2>
            </div>
          </div>
          {downtimeBanners.map((props, index) =>
            this.downtimeBanner(props, index),
          )}
          <div className="row">
            <div className="usa-width-one-half">
              <div className="signin-actions-container">
                <div className="top-banner">
                  <div>
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/lock-icon.svg`}
                    />{' '}
                    Secured & powered by{' '}
                    <img
                      alt="ID.me"
                      src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                    />
                  </div>
                </div>
                <div className="signin-actions">
                  <h5>Sign in with an existing account</h5>
                  <div>
                    <button
                      disabled={globalDowntime}
                      className="dslogon"
                      onClick={handleDsLogon}
                    >
                      <img
                        alt="DS Logon"
                        src={`${vaGovFullDomain}/img/signin/dslogon-icon.svg`}
                      />
                      <strong> Sign in with DS Logon</strong>
                    </button>
                    <button
                      disabled={globalDowntime}
                      className="mhv"
                      onClick={handleMhv}
                    >
                      <img
                        alt="My HealtheVet"
                        src={`${vaGovFullDomain}/img/signin/mhv-icon.svg`}
                      />
                      <strong> Sign in with My HealtheVet</strong>
                    </button>
                    <button
                      disabled={globalDowntime}
                      className="usa-button-primary va-button-primary"
                      onClick={handleIdMe}
                    >
                      <img
                        alt="ID.me"
                        src={`${vaGovFullDomain}/img/signin/idme-icon-white.svg`}
                      />
                      <strong> Sign in with ID.me</strong>
                    </button>
                    <span className="sidelines">OR</span>
                    <div className="alternate-signin">
                      <h5>Don't have those accounts?</h5>
                      <button
                        disabled={globalDowntime}
                        className="idme-create usa-button usa-button-secondary"
                        onClick={signup}
                      >
                        <img
                          alt="ID.me"
                          src={`${vaGovFullDomain}/img/signin/idme-icon-dark.svg`}
                        />
                        <strong> Create an ID.me account</strong>
                      </button>
                      <p>Use your email, Google, or Facebook</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="usa-width-one-half">
              <div className="explanation-content">
                {/* TODO this content will need to be dynamic in the future */}
                <div className="vads-u-display--none medium-screen:vads-u-display--block usa-font-lead">
                  One account to access My Healthy Life and VA.gov.
                </div>
                <p className="vads-u-margin-y--5">
                  Use your existing DS Logon, MyHealtheVet, or ID.me account to
                  log in to My Healthy Life. Access and manage your VA benefits
                  and health care without creating another account.
                </p>
                <p>
                  <strong>A secure account powered by ID.me</strong>
                  <br />
                  ID.me is our trusted technology partner in helping to keep
                  your personal information safe. They specialize in digital
                  identity protection and help us make sure you're you—and not
                  someone pretending to be you—before we give you access to your
                  information.
                </p>
                <p>
                  <a href="/sign-in-faq/#what-is-idme" target="_blank">
                    Learn more about ID.me
                  </a>
                </p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="columns small-12">
              <div className="help-info">
                <h4>Having trouble signing in?</h4>
                <p>
                  <a href="/sign-in-faq/" target="_blank">
                    Get answers to Frequently Asked Questions
                  </a>
                </p>
                <p>
                  <SubmitSignInForm startSentence />
                </p>
              </div>
              <hr />
              <div className="fed-warning">
                <p>
                  When you sign in to VA.gov, you’re using a United States
                  federal government information system.
                </p>
                <p>
                  By signing in, you agree to only use information you have
                  legal authority to view and use. You also agree to let us
                  monitor and record your activity on the system and share this
                  information with auditors or law enforcement officials.
                </p>
                <p>
                  By signing in, you confirm that you understand the following:
                </p>
                <p>
                  Unauthorized use of this system is prohibited and may result
                  in criminal, civil, or administrative penalties. Unauthorized
                  use includes gaining unauthorized data access, changing data,
                  harming the system or its data, or misusing the system. We can
                  suspend or block your access to this system if we suspect any
                  unauthorized use.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    );
  }
}

SignInModal.propTypes = {
  onClose: PropTypes.func,
  visible: PropTypes.bool,
};

export default SignInModal;
