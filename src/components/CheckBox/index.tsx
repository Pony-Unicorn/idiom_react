import React from 'react';

import styles from './styles.module.css';

import check_box from '../../resource/assets/game/check_box.png';

interface IProps { posX: string, posY: string };

export default function CheckBox({ posX, posY }: IProps) {
  return (
    <div className={styles.container} style={{ left: posX, top: posY }}>
      <img src={check_box} alt="" />
    </div>
  );
}
