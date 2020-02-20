import React, { Component } from "react";
import { ProgressBar } from "react-bootstrap";
import API from '../api'
import "./settings.css";

export class Settings extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hLow: [],
      uVol: [
        { category: "SPY", rate: 25 },
        { category: "SPY", rate: 25 },

      ],
      vWap: [
        { category: "SPY", rate: 25 },
        { category: "SPY", rate: 25 },
      ],
      addingAlert: 0,
      addingAlertProgress: 0
    };
  }

  componentDidMount() {
    this.getAlertSettings()
  }

  getAlertSettings = async () => {
    const hLow = await API.getAlerts()
    console.info('Alert Settings:', hLow)

    this.setState({
      hLow: hLow.reverse()
    })
  }

  getFixedData = (data, type) => {
    /** type 0 -> High/Low, 1 -> Unusual Vol, 2 -> VWAP */
    let renderData = [];
    data.map(({ category, rate }, index) => {
      renderData.push(
        <div
          className="row mx-0 justify-content-between align-items-center item-content mt-1"
          key={`render-notification-high-low-${index}`}
        >
          <span className="small company-name">{category}</span>
          <div className="row justify-content-center align-items-center">
            <ProgressBar className="progress" variant="white" now={rate} />
            <div className="ml-3 bg-dark progress-value justify-content-center align-items-center text-center">
              {`${rate}${type !== 0 ? "%" : ""}`}
            </div>
          </div>
          <div className="row">
            <button className="bg-transparent border-0 invisible">
              <i className="mdi mdi-close text-white popover-icon" />
            </button>
            <button
              className="bg-transparent border-0"
              onClick={() => {
                this.deleteFixedData(type, index, category, rate);
              }}
            >
              <i className="mdi mdi-close text-white popover-icon" />
            </button>
          </div>
        </div>
      );
    });
    return renderData;
  };

  deleteFixedData = async (type, index, category, rate) => {
    switch (type) {
      case 0:
        let hLow = this.state.hLow;
        hLow.splice(index, 1);
        this.setState({ hLow });
        break;
      case 1:
        let uVol = this.state.uVol;
        uVol.splice(index, 1);
        this.setState({ uVol });
        break;
      case 2:
        let vWap = this.state.vWap;
        vWap.splice(index, 1);
        this.setState({ vWap });
        break;
      default:
        break;
    }
  };

  onClickAddAlert = (addingAlert) => {
    /** addingAlert 1 -> High/Low, 2 -> Unusual Vol, 3 -> VWAP */
    this.setState({ addingAlert, addingAlertProgress: 0 });
  };

  onAddAlert = async () => {

    if (
      this.refLowName.value !== "" &&
      this.refLowVal.value !== ""
    ) {
      
      await API.addAlert({
        category: this.refLowName.value.toString(),
        rate: parseFloat(this.refLowVal.value),
        high: 0,
        low: 0
      })

      const hLow = [{
        category: this.refLowName.value.toString(),
        rate: parseFloat(this.refLowVal.value)
      }, ...this.state.hLow]

      this.setState({ addingAlert: 0, hLow, addingAlertProgress: 0 })

      // Load Alert Settings Again
      this.getAlertSettings()
    }
  }

  render() {
    const { hLow, uVol, vWap, addingAlert, addingAlertProgress } = this.state;
    return (
      <div>
        {/** General */}
        <div>
          <label>General</label>
        </div>
        <div className="ml-3 mt-3">
          <label>High/Low</label>
        </div>
        <div className="ml-5 mt-3">
          <h6 className="small">Price Range</h6>
          <label className="mt-5 small">Volume</label>
          <div>
            <label className="mt-5 small">Industry</label>
          </div>
        </div>

        {/** Notifications */}
        <div className="mt-5">
          <label>Notifications</label>
        </div>
        <div>
          {/** Notifications -> High/Low */}
          <div className="value-item">
            <label className="small">High/Low</label>
            <div className="row justify-content-between align-items-center mx-0 symbol mt-1">
              <label className="small text-symbol">Symbol</label>
              <label className="small text-symbol">Sensitivity</label>
              <button
                className="btn bg-transparent border-0 px-0"
                onClick={() => { this.onClickAddAlert(1); }}
              >
                <label className="small text-alert cursor-pointer">Add Alert</label>
              </button>
            </div>
            {addingAlert === 1 && (
              <div className="row mx-0 justify-content-between align-items-center item-content mt-1 alert-input">
                <input
                  placeholder="Name"
                  className="bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                  ref={ref => {
                    this.refLowName = ref;
                    if (ref) {
                      ref.focus()
                    }
                  }}
                />
                <div className="row justify-content-center align-items-center">
                  <ProgressBar className="progress" variant="white" now={addingAlertProgress} />
                  <input
                    placeholder="Sensitivity"
                    className="ml-3 bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                    ref={ref => {
                      this.refLowVal = ref;
                    }}
                    onChange={(val) => { this.setState({ addingAlertProgress: parseFloat(this.refLowVal.value) }); }}
                  />
                </div>
                <div className="row">
                  <button
                    className="bg-transparent border-0"
                    onClick={this.onAddAlert}
                  >
                    <i className="mdi mdi-check text-white popover-icon" />
                  </button>
                  <button
                    className="bg-transparent border-0"
                    onClick={() => {
                      this.setState({ addingAlert: 0, addingAlertProgress: 0 });
                    }}
                  >
                    <i className="mdi mdi-close text-white popover-icon" />
                  </button>
                </div>
              </div>
            )}
            {this.getFixedData(hLow, 0)}
          </div>

          {/** Notifications -> Unusual Vol */}
          <div className="value-item">
            <label className="small">Unusual Vol</label>
            <div className="row justify-content-between align-items-center mx-0 symbol mt-1">
              <label className="small text-symbol">Symbol</label>
              <label className="small text-symbol">% Deviation</label>
              <button
                className="bg-transparent border-0 px-0"
                onClick={() => { this.onClickAddAlert(2); }}
              >
                <label className="small text-alert cursor-pointer">Add Alert</label>
              </button>
            </div>
            {addingAlert === 2 && (
              <div className="row mx-0 justify-content-between align-items-center item-content mt-1">
                <input
                  placeholder="Name"
                  className="bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                  ref={ref => {
                    this.refVolName = ref;
                  }}
                />
                <div className="row justify-content-center align-items-center">
                  <ProgressBar className="progress" variant="white" now={addingAlertProgress} />
                  <input
                    placeholder="Deviation"
                    className="ml-3 bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                    ref={ref => {
                      this.refVolVal = ref;
                    }}
                    onChange={(val) => { this.setState({ addingAlertProgress: parseFloat(this.refVolVal.value) }); }}
                  />
                </div>
                <div className="row">
                  <button
                    className="bg-transparent border-0"
                    onClick={() => {
                      if (
                        this.refVolName.value !== "" &&
                        this.refVolVal.value !== ""
                      ) {
                        let vols = uVol;
                        vols.push({
                          category: this.refVolName.value.toString(),
                          rate: parseFloat(this.refVolVal.value)
                        });
                        this.setState({ addingAlert: 0, uVol: vols, addingAlertProgress: 0 });
                      }
                    }}
                  >
                    <i className="mdi mdi-check text-white popover-icon" />
                  </button>
                  <button
                    className="bg-transparent border-0"
                    onClick={() => {
                      this.setState({ addingAlert: 0, addingAlertProgress: 0 });
                    }}
                  >
                    <i className="mdi mdi-close text-white popover-icon" />
                  </button>
                </div>
              </div>
            )}
            {this.getFixedData(uVol, 1)}
          </div>

          {/** Notifications -> VWAP */}
          <div className="value-item">
            <label className="small">VWAP</label>
            <div className="row justify-content-between align-items-center mx-0 symbol mt-1">
              <label className="small text-symbol">Symbol</label>
              <label className="small text-symbol">% Dist VWAP</label>
              <button
                className="bg-transparent border-0 px-0"
                onClick={() => { this.onClickAddAlert(3); }}
              >
                <label className="small text-alert cursor-pointer">Add Alert</label>
              </button>
            </div>
            {addingAlert === 3 && (
              <div className="row mx-0 justify-content-between align-items-center item-content mt-1">
                <input
                  placeholder="Name"
                  className="bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                  ref={ref => {
                    this.refWapName = ref;
                  }}
                />
                <div className="row justify-content-center align-items-center">
                  <ProgressBar className="progress" variant="white" now={addingAlertProgress} />
                  <input
                    placeholder="Dist"
                    className="ml-3 bg-dark progress-input justify-content-center align-items-center text-center border-0 white-color small"
                    ref={ref => {
                      this.refWapVal = ref;
                    }}
                    onChange={(val) => { this.setState({ addingAlertProgress: parseFloat(this.refWapVal.value) }); }}
                  />
                </div>
                <div className="row">
                  <button
                    className="bg-transparent border-0"
                    onClick={() => {
                      if (
                        this.refWapName.value !== "" &&
                        this.refWapVal.value !== ""
                      ) {
                        let waps = vWap;
                        waps.push({
                          category: this.refWapName.value.toString(),
                          rate: parseFloat(this.refWapVal.value)
                        });
                        this.setState({ addingAlert: 0, vWap: waps, addingAlertProgress: 0 });
                      }
                    }}
                  >
                    <i className="mdi mdi-check text-white popover-icon" />
                  </button>
                  <button
                    className="bg-transparent border-0"
                    onClick={() => {
                      this.setState({ addingAlert: 0, addingAlertProgress: 0 });
                    }}
                  >
                    <i className="mdi mdi-close text-white popover-icon" />
                  </button>
                </div>
              </div>
            )}
            {this.getFixedData(vWap, 2)}
          </div>
        </div>
      </div>
    );
  }
}

export default Settings;
