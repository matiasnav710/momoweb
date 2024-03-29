import React, { Component } from "react";
import {
  Table,
  Column,
  InfiniteLoader,
  AutoSizer,
  SortDirection,
} from "react-virtualized";
import "./DiscoveryTable.css";
import "react-virtualized/styles.css";
import { ContextMenuTrigger } from "react-contextmenu";
let contextTrigger = null;
let alertContextTrigger = null;
class DiscoveryTable extends Component {
  constructor() {
    super();
    this._sort = this._sort.bind(this);
    this.loadMore = this.loadMore.bind(this);
    this.toggleMenu = this.toggleMenu.bind(this);
    this._rowClassName = this._rowClassName.bind(this);
    this.state = {
      items: [],
      sortedList: [],
      sortBy: "",
      sortDirection: SortDirection.DESC,
      discoverySector: "Industry",
    };
  }
  componentWillReceiveProps(props) {
    if (props.discoveryData) {
      const { sortBy, sortDirection } = this.state;
      const sortedList = this._sortList(
        sortBy,
        sortDirection,
        props.discoveryData
      );
      this.setState({
        items: props.discoveryData,
        sortedList: this.state.sortBy === "" ? props.discoveryData : sortedList,
        sortBy:
          this.state.discoverySector === props.discoverySector &&
          props.discoveryFilter === ""
            ? this.state.sortBy
            : "",
        discoverySector: props.discoverySector,
      });
    }
  }

  loadMore() {
    return new Promise((resolve, reject) => {
      this.promiseResolve = resolve;
    });
  }

  _sort({ sortBy }) {
    if (sortBy !== "alert") {
      this.setState(
        {
          sortBy,
          sortDirection:
            this.state.sortDirection === SortDirection.DESC
              ? SortDirection.ASC
              : SortDirection.DESC,
        },
        () => {
          const sortedList = this._sortList(
            sortBy,
            this.state.sortDirection,
            this.state.items
          );
          this.setState({ sortedList });
        }
      );
    }
  }

  _sortList(sortBy, sortDirection, items) {
    return sortDirection === SortDirection.ASC
      ? _.sortBy(items, sortBy)
      : _.sortBy(items, sortBy).reverse();
  }

  _round = (value, decimals) => parseFloat(value).toFixed(decimals);

  _setColorOnValue(symbol, data, type, decimals) {
    const roundedValue = isNaN(data) ? "__" : this._round(data, decimals);
    return (
      <div style={{ color: data > 0 ? "#00d25b" : "#fc424a" }}>
        {isNaN(data)
          ? "__"
          : roundedValue > 0
          ? `+${roundedValue}${type}`
          : `${roundedValue}${type}`}
      </div>
    );
  }

  _rowClassName({ index }) {
    if (index < 0) {
      return "row-color-grey";
    } else {
      return index % 2 === 0 ? "row-color-grey" : "row-color-black";
    }
  }

  toggleMenu(event, symbol) {
    if (contextTrigger) {
      contextTrigger.handleContextClick(event);
      this.props.onContextMenuTrigger(symbol);
    }
  }

  render() {
    return (
      <div className="container h-100">
        <ContextMenuTrigger
          id={`discovery-context-menu`}
          ref={(c) => (contextTrigger = c)}
        >
          <></>
        </ContextMenuTrigger>
        <ContextMenuTrigger
          id={"discovery-alert-context-menu"}
          ref={(c) => (alertContextTrigger = c)}
        >
          <></>
        </ContextMenuTrigger>
        <InfiniteLoader
          isRowLoaded={({ index }) => !!this.state.sortedList[index]}
          loadMoreRows={this.loadMore}
          rowCount={this.state.sortedList.length}
        >
          {({ onRowsRendered }) => (
            <AutoSizer>
              {({ width, height }) => (
                <Table
                  height={height}
                  rowHeight={65}
                  sort={this._sort}
                  headerHeight={50}
                  width={width}
                  style={{ fontSize: 14, height: "100%" }}
                  sortBy={this.state.sortBy}
                  onRowsRendered={onRowsRendered}
                  rowCount={this.state.sortedList.length}
                  sortDirection={this.state.sortDirection}
                  rowGetter={({ index }) => this.state.sortedList[index]}
                  rowClassName={(index) =>
                    index.index % 2 === 0 ? "oddRow" : "evenRow"
                  }
                >
                  <Column
                    width={200}
                    label="Symbol"
                    dataKey="symbol"
                    style={{ fontWeight: 600, paddingLeft: 10 }}
                    cellRenderer={({ cellData }) => (
                      <div
                        onContextMenu={(e) => this.toggleMenu(e, cellData)}
                        onClick={(e) => this.toggleMenu(e, cellData)}
                      >
                        {cellData}
                      </div>
                    )}
                  />
                  <Column
                    width={200}
                    label="Last"
                    dataKey="price_dist"
                    cellRenderer={({ cellData, rowData }) => (
                      <div>
                        <div>{rowData.last}</div>
                        <small
                          className={
                            "price-dist " +
                            (rowData.price_dist == 0
                              ? ""
                              : rowData.price_dist > 0
                              ? "text-success"
                              : "text-danger")
                          }
                        >
                          {rowData.price_dist > 0 ? "+" : ""}
                          {rowData.price_dist}%
                        </small>
                      </div>
                    )}
                  />
                  <Column
                    width={200}
                    label="Volume"
                    dataKey="volume"
                    cellRenderer={({ cellData, rowData }) => (
                      <div style={{ color: "#9B9B9C" }}>{cellData}</div>
                    )}
                  />
                  <Column
                    width={200}
                    label="Momentum"
                    dataKey="momentum"
                    cellRenderer={({ cellData, rowData }) =>
                      this._setColorOnValue(rowData.symbol, cellData, "", "")
                    }
                  />
                  <Column
                    width={200}
                    label="UVol"
                    dataKey="uVol"
                    cellRenderer={({ cellData, rowData }) =>
                      this._setColorOnValue(rowData.symbol, cellData, "%", "2")
                    }
                  />
                  <Column
                    width={200}
                    label="VWAPDist"
                    dataKey="vWAPDist"
                    cellRenderer={({ cellData, rowData }) =>
                      this._setColorOnValue(rowData.symbol, cellData, "%", "2")
                    }
                  />
                  <Column
                    width={160}
                    dataKey="alert"
                    label="Actions"
                    style={{ overflowX: "auto" }}
                    cellRenderer={({ cellData, rowData }) => (
                      <div className="action-column">
                        <span
                          className="mdi mdi-bell text-white popover-icon action-button-margin"
                          onClick={(e) => {
                            alertContextTrigger.handleContextClick(e);
                            this.props.onAlertTrigger(
                              cellData,
                              rowData.vWAPDist
                            );
                          }}
                        />
                        <i
                          className={`${
                            this.props.checkIsFavorite(cellData)
                              ? "mdi mdi-star quote-star popover-icon"
                              : "mdi mdi-star text-white popover-icon"
                          }`}
                          style={{ cursor: "pointer" }}
                          onClick={() => this.props.onSetSymbolFav(cellData)}
                        />
                      </div>
                    )}
                  />
                </Table>
              )}
            </AutoSizer>
          )}
        </InfiniteLoader>
      </div>
    );
  }
}

export default DiscoveryTable;
