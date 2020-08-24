import React from "react";
import { connect } from "react-redux";
import { MenuActions } from "../store";
import { withRouter } from "react-router-dom";

const MainMenu = (props) => {
  const {
    stream,
    alertHistory,
    meters,
    popular,
    quotes,
    discovery,
    isPro,
    toggle,
  } = props;
  return (
    <div className="d-flex justify-content-start flex-wrap static-bar pl-3">
      <div
        className={`d-flex flex-row align-items-center static-row ${
          stream ? "showWidget" : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={toggle.bind(null, "stream")}
      >
        <span className="bar-icon">
          <i className="mdi mdi-speedometer text-primary" />
        </span>
        <span className="small white-no-wrap bar-txt">STREAM</span>
      </div>
      <div
        className={`d-flex flex-row align-items-center static-row ${
          alertHistory ? "showWidget" : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={toggle.bind(null, "alertHistory")}
      >
        <span className="bar-icon">
          <i className="mdi mdi-file-restore text-success" />
        </span>
        <span className="small white-no-wrap bar-txt">ALERT HISTORY</span>
      </div>
      <div
        className={`d-flex flex-row align-items-center static-row ${
          meters ? "showWidget" : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={toggle.bind(null, "meters")}
      >
        <span className="bar-icon">
          <i className="mdi mdi-crosshairs-gps text-warning" />
        </span>
        <span className="small white-no-wrap bar-txt">METERS</span>
      </div>
      <div
        className={`d-flex flex-row align-items-center static-row  ${
          popular ? "showWidget" : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={toggle.bind(null, "popular")}
      >
        <span className="bar-icon">
          <i className="mdi mdi-clipboard-text text-danger" />
        </span>
        <span className="small white-no-wrap bar-txt">POPULAR</span>
      </div>
      <div
        className={`d-flex flex-row align-items-center static-row ${
          quotes ? "showWidget" : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={toggle.bind(null, "quotes")}
      >
        <span className="bar-icon">
          <i className="mdi mdi-chart-bar text-primary" />
        </span>
        <span className="small white-no-wrap bar-txt">QUOTE</span>
      </div>

      <div
        style={{ cursor: "pointer" }}
        className={`d-flex flex-row align-items-center static-row ${
          isPro ? (discovery ? "showWidget" : "hideWidget") : "hideWidget"
        }`}
        style={{ cursor: "pointer" }}
        onClick={() => {
          if (isPro) toggle("discovery");
          else history.push("/plans");
        }}
      >
        <span className="bar-icon">
          <i className="mdi mdi-content-copy text-success" />
        </span>
        <span
          className="small white-no-wrap bar-txt"
          style={{ display: "flex" }}
        >
          DISCOVERY
          <span
            style={{
              paddingLeft: 2,
              paddingRight: 2,
              fontSize: "10px",
              color: "black",
              background: isPro ? (discovery ? "#ffff" : "gray") : "gray",
              marginLeft: "5px",
              height: "12px",
            }}
          >
            PRO
          </span>
        </span>
      </div>
    </div>
  );
};

const mapDispatchToProps = {
  toggle: MenuActions.toggleMenu,
};

const mapStateToProps = (state) => ({
  ...state.menu,
  isPro:
    state.auth.user.subscription.plan === "pro_monthly" ||
    state.auth.user.subscription.plan === "pro_semi_annual",
});

export default withRouter(
  connect(mapStateToProps, mapDispatchToProps)(MainMenu)
);
