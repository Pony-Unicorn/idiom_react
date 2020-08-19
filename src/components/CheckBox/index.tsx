import React from 'react';

import styles from './styles.module.css';

interface IProps { posX: string, posY: string };

export default function CheckBox({ posX, posY }: IProps) {
  return (
    <span className={styles.container} style={{ left: posX, top: posY }}>
    </span>
  );
}
