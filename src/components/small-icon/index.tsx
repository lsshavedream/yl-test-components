import { Tooltip } from "antd";
import React from "react";

import styles from "./index.less";

interface SmallIconProps {
    icon: string
    className?: string
    title?: string
    onClick?: () => void
    disabled?: boolean
}

const SmallIcon: React.FC<SmallIconProps> = (props) => {
    const { icon = "", className = "", title = "",onClick,disabled = false} = props;

    const disabledClass = disabled ? "disabled" : ""

    const clickEvent = () => {
        if(disabled) {
            return
        }
        onClick?.();
    }

    return (
        <div className={`${className} ${styles.cyIconSvgContent} ${disabledClass}`} onClick={clickEvent}>
            <Tooltip title={title}>
                {
                    !disabled ?
                    <svg className={styles.cyIconSvg} aria-hidden="true">
                        <use href={`#cy-${icon}`} />
                    </svg> :
                    <span className={`cyIcon cy-${icon}`} /> 
                }
            </Tooltip>
        </div>
    )
}

export default SmallIcon