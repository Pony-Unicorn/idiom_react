import React from 'react';

import styles from './styles.module.css';

import answer_item from '../../resource/assets/game/answer_item.png';

interface IProps {
  txt: string; // 要显示的文字内容
  isVis: boolean; // 是否显示
  gx: number; // 格子的 x 坐标
  gy: number; // 格子的 y 坐标
  tapHandle: (gx: number, gy: number) => void;
};

export default function Keyword({ gx, gy, txt, isVis, tapHandle }: IProps) {

  const _tapHandle = () => {
    tapHandle(gx, gy);
  }

  return (
    <div className={styles.container} onClick={_tapHandle}>
      <div className={isVis ? styles.indoor : styles.indoor_hide}>
        <img className={styles.item_bg} src={answer_item} alt="" />
        <span>{txt}</span>
      </div>
    </div>
  );
}
