import React from 'react';

import styles from './styles.module.css';

import { answerPageConf } from '../../constant/answerPageConf';

import auto_item from '../../resource/assets/game/auto_item.png';

interface IProps {
  txt: string; // 要显示的文字内容
  isVis: boolean; // 是否显示
  gx: number; // 格子的 x 坐标
  gy: number; // 格子的 y 坐标
};

export default function Word({ txt, isVis, gx, gy }: IProps) {

  const posX = gx * (answerPageConf.tileWidth + answerPageConf.spacing) + answerPageConf.leftPadding;
  const posY = gy * (answerPageConf.tileHeight + answerPageConf.spacing) + answerPageConf.upPadding;

  return (
    <div className={styles.container} style={{ left: posX, top: posY }}>
      <img className={styles.item_bg} src={auto_item} alt="" />
      {isVis && <span>{txt}</span>}
    </div>
  );
}
