import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Buffer } from 'types';
import { ResponsiveChord } from '@nivo/chord';
import { TableTooltip, Chip } from '@nivo/tooltip';
import { processData } from './utils/helpFunc';
import { CustomSlider } from './components/CustomSlider';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  matrix: Array<Array<number>> | null;
  keys: Array<string> | null;
  is_empty: boolean;
  threshold: number[];
}

interface Ribbon {
  source: {
    color: string;
    id: string;
    value: number;
  };
  target: {
    color: string;
    id: string;
    value: number;
  };
}

const RibbonTooltip = ({ ribbon }: { ribbon: Ribbon }) => (
  <TableTooltip
    rows={[
      [
        <Chip key="chip" color={ribbon.source.color} />,
        'From ',
        <strong key="id">{ribbon.source.id}</strong>,
        `${ribbon.source.value} %`,
      ],
      [
        <Chip key="chip" color={ribbon.target.color} />,
        'From ',
        <strong key="id">{ribbon.target.id}</strong>,
        `${ribbon.target.value} %`,
      ],
    ]}
  />
);

export class MainPanel extends PureComponent<Props> {
  state: State = {
    matrix: null,
    keys: null,
    is_empty: false,
    threshold: this.props.options.threshold,
  };

  componentDidMount() {
    if (this.props.data.series.length > 0) {
      const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
      const { matrix, keys, is_empty } = processData(buffer, this.props.options.threshold);
      this.setState(prevState => ({ ...prevState, matrix, keys, is_empty }));
    }
  }

  componentDidUpdate(prevProps: Props) {
    if (prevProps.data.series !== this.props.data.series) {
      if (this.props.data.series.length == 0) {
        this.setState(prevState => ({ ...prevState, matrix: null, keys: null, is_empty: false }));
        return;
      }
      const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
      const { matrix, keys, is_empty } = processData(buffer, this.props.options.threshold);
      this.setState(prevState => ({ ...prevState, matrix, keys, is_empty }));
    }

    if (prevProps.options.threshold !== this.props.options.threshold) {
      if (this.props.data.series.length == 0) {
        return;
      }

      const { buffer } = this.props.data.series[0].fields[0].values as Buffer;
      const { matrix, keys, is_empty } = processData(buffer, this.props.options.threshold);
      this.setState(prevState => ({ ...prevState, matrix, keys, is_empty }));
    }
  }

  onSliding = (value: number[]) => {
    this.setState({ threshold: value });
  };

  onSlider = (value: number[]) => {
    this.props.onOptionsChange({ ...this.props.options, threshold: value });
  };

  render() {
    const {
      width,
      height,
      options: { domain },
    } = this.props;
    const { matrix, keys, is_empty, threshold } = this.state;

    if (!matrix || !keys) {
      return <div> No Data</div>;
    }

    if (matrix && is_empty) {
      return (
        <div style={{ textAlign: 'center' }}>
          <CustomSlider
            initialValue={this.props.options.threshold}
            onSliding={this.onSliding}
            onSlider={this.onSlider}
            domain={domain}
          />
          <span style={{ fontWeight: 'bold' }}>Threshold : [{threshold.join()}]</span>
          <div>No Transitions</div>
        </div>
      );
    }

    return (
      <div
        style={{
          width,
          height,
          textAlign: 'center',
        }}
      >
        <CustomSlider
          initialValue={this.props.options.threshold}
          onSliding={this.onSliding}
          onSlider={this.onSlider}
          domain={domain}
        />
        <span style={{ fontWeight: 'bold', marginBottom: 5 }}>Threshold : [{threshold.join()}]</span>
        <div style={{ width: '100%', height: height - 45 }}>
          <ResponsiveChord
            matrix={matrix}
            keys={keys}
            margin={{ top: 70, right: 60, bottom: 90, left: 60 }}
            valueFormat=".2f"
            padAngle={0.08}
            innerRadiusRatio={0.96}
            innerRadiusOffset={0.02}
            arcOpacity={1}
            arcBorderWidth={1}
            arcBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            ribbonOpacity={0.5}
            ribbonBorderWidth={1}
            // @ts-ignore
            ribbonBorderColor={{ from: 'color', modifiers: [['darker', 0.4]] }}
            enableLabel={true}
            label="id"
            labelOffset={12}
            labelRotation={-90}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
            colors={{ scheme: 'nivo' }}
            isInteractive={true}
            arcHoverOpacity={1}
            arcHoverOthersOpacity={0.25}
            ribbonHoverOpacity={0.6}
            ribbonHoverOthersOpacity={0}
            ribbonTooltip={RibbonTooltip}
            animate={true}
            motionStiffness={90}
            motionDamping={7}
          />
        </div>
      </div>
    );
  }
}
