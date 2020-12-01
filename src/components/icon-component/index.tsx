import React from "react";

import styles from "./index.less";

interface IconComponentProps {
  icon: string
  name: string
}

const IconComponent:React.FC<IconComponentProps> = (props) => {
  const {icon = "", name = ""} = props;
  return (
    <div className={styles.cyIconComponent}>
      <div className={styles.cyIconContent}>
        <svg className={styles.icon} aria-hidden="true">
          <use href={`#icon-${icon}`} />
        </svg>
      </div>
      <div className={styles.cyIconComponentWord}>
        {name}
      </div>
    </div>
  )
}

export default IconComponent
