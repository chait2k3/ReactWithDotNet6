import { InputBaseComponentProps } from "@mui/material";
import { forwardRef, Ref, useImperativeHandle, useRef } from "react";

interface Props extends InputBaseComponentProps { }

const StripeInput = forwardRef(
    ({component: Component, ...props}: Props,ref: Ref<unknown>) => {
        const elementRef = useRef<any>();

        useImperativeHandle(ref, () => {
            return {
                focus: () => elementRef.current.focus
            };
          });
        return (
            <Component 
                onReady={(element: any) => elementRef.current = element}
                {...props}
            />
        );
    }
);

export default StripeInput;