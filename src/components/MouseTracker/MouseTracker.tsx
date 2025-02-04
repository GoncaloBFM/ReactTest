import {ReactNode, useEffect, useRef} from "react";
import {createPortal} from "react-dom";
import styles from "@/components/MouseTracker/MouseTracker.module.scss";
import {Typography} from "@mui/material";

const X_OFFSET = 20
const Y_OFFSET = -20

export function MouseTracker({children}: {children: ReactNode}) {
    const element = useRef(null);

    useEffect(() => {
        function handler(e:any) {
            if (element.current) {
                const x = e.clientX, y = e.clientY;
                (element.current as any).style.transform = `translate(${x + X_OFFSET}px, ${y + Y_OFFSET}px)`;
                (element.current as any).style.visibility = 'visible';
            }
        }
        document.addEventListener('mousemove', handler);
        return () => document.removeEventListener('mousemove', handler);
    }, []);

    return createPortal(
        <div className={styles.MouseTracker} ref={element}>
            {children}
        </div>
    , document.body);
}