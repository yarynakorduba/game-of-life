import React from "react";
import { select } from "d3";
import { compose, flatten, path } from "ramda";
import { lifecycle, withStateHandlers } from "recompose";
import "./Field.scss";

const Field = () => <svg />;

const enhancer = compose(
  withStateHandlers(() => () => null, {
    setCellStates: ({ cellStates }) => () => cellStates
  }),
  lifecycle({
    componentDidUpdate() {
      if (
        path(["state", "cellStates"], this) !==
        path(["props", "cellStates"], this)
      ) {
        const { setCellStates, cellStates, fieldViewSize } = this.props;
        const cellsDimension = cellStates.length;
        setCellStates(cellStates);
        const svg = select("svg")
          .attr("class", "Field")
          .attr("width", fieldViewSize)
          .attr("height", fieldViewSize)
          .selectAll("rect")
          .exit()
          .remove()
          .data(flatten(cellStates));

        svg
          .enter()
          .append("rect")
          .attr(
            "x",
            (d, i) => ((i % cellsDimension) * fieldViewSize) / cellsDimension
          )
          .attr("y", (d, i) =>
            (
              (Math.floor(i / cellsDimension) * fieldViewSize) /
              cellsDimension
            ).toString()
          )
          .attr("width", fieldViewSize / cellsDimension - 2)
          .attr("height", fieldViewSize / cellsDimension - 2)
          .attr("class", d => (d ? "Field__rect_alive" : "Field__rect_dead"));
      }
    }
  })
);

export default enhancer(Field);
