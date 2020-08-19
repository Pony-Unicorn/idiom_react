import React from 'react';

import styles from './styles.module.css';

import auto_item from '../../resource/assets/game/auto_item.png';
import exist_item from '../../resource/assets/game/exist_item.png';
import err_item from '../../resource/assets/game/err_item.png';
import yes_item from '../../resource/assets/game/yes_item.png';

// 文字状态
export enum WORD_STATE {
  empty,// 空
  auto, // 初始化自动填入文字
  err,// 错误
  yes // 完成
}

interface IProps {
  txt: string; // 要显示的文字内容
  isVis: boolean; // 是否显示
  gx: number; // 格子的 x 坐标
  gy: number; // 格子的 y 坐标
  states: WORD_STATE;
  tapHandle: (gx: number, gy: number) => void;
};

const imgSrc = {
  [WORD_STATE.auto]: auto_item,
  [WORD_STATE.empty]: exist_item,
  [WORD_STATE.err]: err_item,
  [WORD_STATE.yes]: yes_item
};

export default function Word({ txt, isVis, gx, gy, tapHandle, states }: IProps) {

  const posX = gx * (9 + 2) + 'vw';
  const posY = gy * (9 + 2) + 'vw';

  return (
    <div className={styles.container} style={{ left: posX, top: posY }} onClick={() => tapHandle(gx, gy)}>
      <img className={styles.item_bg} src={imgSrc[states]} alt="" />
      {isVis && <span>{txt}</span>}
    </div>
  );
}
