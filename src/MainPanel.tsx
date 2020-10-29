import React, { PureComponent } from 'react';
import { PanelProps } from '@grafana/data';
import { PanelOptions, Buffer } from 'types';
import { ResponsiveChord } from '@nivo/chord';
import { TableTooltip, Chip } from '@nivo/tooltip';
import { processData } from './utils/helpFunc';

interface Props extends PanelProps<PanelOptions> {}
interface State {
  matrix: Array<Array<number>> | null;
  keys: Array<string> | null;
  is_empty: boolean;
  threshold: string;
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
        ribbon.source.value,
      ],
      [
        <Chip key="chip" color={ribbon.target.color} />,
        'From ',
        <strong key="id">{ribbon.target.id}</strong>,
        ribbon.target.value,
      ],
    ]}
  />
);

export class MainPanel extends PureComponent<Props> {
  state: State = {
    matrix: null,
    keys: null,
    is_empty: false,
    threshold: this.props.options.threshold.toString() || '',
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

  onChangeTheshold = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      this.setState({ threshold: '' });
    } else if (parseInt(e.target.value) >= 0) {
      this.setState({ threshold: e.target.value });
    }
  };

  onSubmitThreshold = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const { threshold } = this.state;
    if (threshold == '' || isNaN(parseInt(threshold))) {
      this.setState({ threshold: '0' });
    } else {
      this.props.onOptionsChange({ threshold: parseInt(threshold) });
    }
  };

  render() {
    const { width, height } = this.props;
    const { matrix, keys, is_empty, threshold } = this.state;

    if (!matrix || !keys) {
      return <div> No Data</div>;
    }

    if (matrix && is_empty) {
      return (
        <div>
          No Transitions
          <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
            <span>Threshold</span>
            <form onSubmit={this.onSubmitThreshold}>
              <input
                style={{ marginLeft: 10, padding: 5, border: '1px solid #777', borderRadius: 3, width: 50 }}
                onChange={this.onChangeTheshold}
                value={threshold}
              />
            </form>
          </div>
        </div>
      );
    }

    return (
      <div
        style={{
          width,
          height,
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
          <span>Threshold</span>
          <form onSubmit={this.onSubmitThreshold}>
            <input
              style={{ marginLeft: 10, padding: 5, border: '1px solid #777', borderRadius: 3, width: 50 }}
              onChange={this.onChangeTheshold}
              value={threshold}
            />
          </form>
        </div>
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
          // legends={[
          //   {
          //     anchor: 'bottom-right',
          //     direction: 'column',
          //     justify: false,
          //     translateX: 30,
          //     translateY: 70,
          //     itemWidth: 80,
          //     itemHeight: 14,
          //     itemsSpacing: 0,
          //     itemTextColor: '#999',
          //     itemDirection: 'left-to-right',
          //     symbolSize: 12,
          //     symbolShape: 'circle',
          //     effects: [
          //       {
          //         on: 'hover',
          //         style: {
          //           itemTextColor: '#000',
          //         },
          //       },
          //     ],
          //   },
          // ]}
        />
      </div>
    );
  }
}
