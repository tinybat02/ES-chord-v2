import React, { useState } from 'react';
//@ts-ignore
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from './types';

export const MainEditor: React.FC<PanelEditorProps<PanelOptions>> = ({ options, onOptionsChange }) => {
  const [input, setInput] = useState(options.threshold || '');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      setInput('');
    } else if (parseInt(e.target.value) >= 0) {
      setInput(e.target.value);
    }
  };

  const handleSubmit = () => {
    let value = input as string;
    if (value == '' || isNaN(parseInt(value))) {
      setInput(0);
    } else {
      onOptionsChange({ threshold: parseInt(value) });
    }
  };

  return (
    <PanelOptionsGroup>
      <div className="editor-row">
        <div className="section gf-form-group">
          <FormField
            label="Lower Threshold"
            labelWidth={10}
            inputWidth={40}
            type="number"
            value={input}
            onChange={handleChange}
          />
        </div>
      </div>
      <button className="btn btn-primary" onClick={handleSubmit}>
        Submit
      </button>
    </PanelOptionsGroup>
  );
};
