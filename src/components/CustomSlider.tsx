import React, { Component } from 'react';
import { Slider, Rail, Handles, Tracks, Ticks } from 'react-compound-slider';
import { Handle, Track, Tick, SliderRail } from './SliderComponents';

const sliderStyle: React.CSSProperties = {
  position: 'relative',
  width: '100%',
  touchAction: 'none',
};
interface ISliderProps {
  onSlider: (value: number[]) => void;
  onSliding: (value: number[]) => void;
  initialValue: number[];
  domain: number[];
}

interface IState {
  values: readonly number[];
  update: readonly number[];
}

// const domain = [0, 300];

export class CustomSlider extends Component<ISliderProps, IState> {
  constructor(props: ISliderProps) {
    super(props);
    this.state = {
      values: props.initialValue.slice(),
      update: props.initialValue.slice(),
    };
  }

  onUpdate = (update: ReadonlyArray<number>) => {
    this.setState({ update }, () => {
      this.props.onSliding([...update]);
    });
  };

  onChange = (values: ReadonlyArray<number>) => {
    this.setState({ values }, () => {
      this.props.onSlider([...values]);
    });
  };
  render() {
    const { domain } = this.props;
    const { values } = this.state;

    return (
      <div style={{ margin: '5px auto', height: 30, width: '90%' }}>
        <Slider
          mode={2}
          step={1}
          domain={domain}
          rootStyle={sliderStyle}
          onUpdate={this.onUpdate}
          onChange={this.onChange}
          values={values}
        >
          <Rail>{({ getRailProps }) => <SliderRail getRailProps={getRailProps} />}</Rail>
          <Handles>
            {({ handles, getHandleProps }) => (
              <div className="slider-handles">
                {handles.map(handle => (
                  <Handle key={handle.id} handle={handle} domain={domain} getHandleProps={getHandleProps} />
                ))}
              </div>
            )}
          </Handles>
          <Tracks right={false} left={false}>
            {({ tracks, getTrackProps }) => (
              <div className="slider-tracks">
                {tracks.map(({ id, source, target }) => (
                  <Track key={id} source={source} target={target} getTrackProps={getTrackProps} />
                ))}
              </div>
            )}
          </Tracks>
          <Ticks count={5}>
            {({ ticks }) => (
              <div className="slider-ticks">
                {ticks.map(tick => (
                  <Tick key={tick.id} tick={tick} count={ticks.length} />
                ))}
              </div>
            )}
          </Ticks>
        </Slider>
      </div>
    );
  }
}

export default CustomSlider;
