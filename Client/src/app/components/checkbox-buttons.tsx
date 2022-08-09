import { FC, useState } from 'react';
import { FormGroup, FormControlLabel, Checkbox } from "@mui/material";

interface CheckboxButtonsProps {
    items: string[],
    checked: string[],
    onChange: (items: string[]) => void
}

const CheckboxButtons: FC<CheckboxButtonsProps> = (props) => {
    const [checkedItems, setCheckedItems] = useState(props.checked || []);

    const handleChecked = (value: string) => {
        const currentIndex = checkedItems.findIndex(item => item === value);
        let newCheckedItems: string[] = [];
        
        if(currentIndex === -1) {
            newCheckedItems = [...checkedItems, value];
        }
        else {
            newCheckedItems = checkedItems.filter(item => item !== value);
        } 
        
        setCheckedItems(newCheckedItems);
        props.onChange(newCheckedItems);    
    };

    return (
    <FormGroup>
      {props.items.map((item) => (
        <FormControlLabel 
            key={item} 
            control={<Checkbox 
                checked={checkedItems.indexOf(item) !== -1 }
                onChange={ () => handleChecked(item)}
            />} 
            label={item} />
      ))}
    </FormGroup>
  );
};

export default CheckboxButtons;
