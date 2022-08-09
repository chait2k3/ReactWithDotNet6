import { FC } from "react";
import {
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio,
} from "@mui/material";

interface RadioButtonGroupProps {
    options: any[],
    onChange: (event: any) => void,
    selectedValue: string
}

const RadioButtonGroup: FC<RadioButtonGroupProps> = (props) => {
  return (
    <FormControl>
      <RadioGroup onChange={props.onChange} value={props.selectedValue}>
        {props.options.map(({ label, value }) => (
          <FormControlLabel
            key={label}
            value={value}
            control={<Radio />}
            label={label}
          />
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default RadioButtonGroup;
