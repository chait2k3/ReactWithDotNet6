import { TextField } from "@mui/material";
import { useController, UseControllerProps } from "react-hook-form";

interface Props extends UseControllerProps {
    label: string;
    type?: string;
    multiline?: boolean;
    rows?: number;
} 

const AppTextInput = (props: Props) => {
    const { field, fieldState } = useController({...props, defaultValue: ''});

    return (
        <TextField 
            {...props}
            {...field}
            type={props.type}
            multiline={props.multiline}
            rows={props.rows}
            fullWidth
            variant="outlined"
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
        />
    );
};

export default AppTextInput;
