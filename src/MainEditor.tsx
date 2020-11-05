import React, { useState } from 'react';
//@ts-ignore
import { FormField, PanelOptionsGroup } from '@grafana/ui';
import { PanelEditorProps } from '@grafana/data';

import { PanelOptions } from './types';

export const MainEditor: React.FC<PanelEditorProps<PanelOptions>> = ({ options, onOptionsChange }) => {
  const [input, setInput] = useState({
    under: options.domain[0],
    upper: options.domain[1],
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value == '') {
      setInput({ ...input, [e.target.name]: '' });
    } else if (parseInt(e.target.value) >= 0) {
      setInput({ ...input, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = () => {
    if (
      input.under.toString() == '' ||
      isNaN(parseInt(input.under.toString())) ||
      input.upper.toString() == '' ||
      isNaN(parseInt(input.upper.toString()))
    ) {
      setInput({
        under: options.domain[0],
        upper: options.domain[1],
      });
    } else {
      onOptionsChange({ ...options, domain: [parseInt(input.under.toString()), parseInt(input.upper.toString())] });
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
            name="under"
            value={input.under}
            onChange={handleChange}
          />
          <FormField
            label="Upper Threshold"
            labelWidth={10}
            inputWidth={40}
            type="number"
            name="upper"
            value={input.upper}
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
