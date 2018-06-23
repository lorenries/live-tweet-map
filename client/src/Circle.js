import React from 'react';
import {BaseControl} from 'react-map-gl';

class CircleOverlay extends BaseControl {

  render() {
      const {viewport, isDragging} = this.context;
      const { tweets, style } = this.props;
      const project = viewport.project;

      return (
      	<svg width={viewport.width} height={viewport.height} style={`pointerEvents: 'all', position: 'absolute', left: 0, top: 0, cursor: ${isDragging ? '-webkit-grabbing' : '-webkit-grab'}`}>
      	</svg>
      );
}