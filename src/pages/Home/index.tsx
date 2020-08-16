import React from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector } from 'react-redux';

import { IStateAll } from '../../store/types';

import styles from './styles.module.css';

import icon_spirit from '../../resource/assets/home/icon_spirit.png';
import build001 from '../../resource/assets/build/build001.png';
import character from '../../resource/assets/chara/character.png';
import btn_start from '../../resource/assets/home/btn_start.png';

export default function HomePage() {

  const userState = useSelector((state: IStateAll) => state.user);

  const history = useHistory();

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <div className={styles.strength}>
          <img className={styles.strength_icon} src={icon_spirit} alt="" />
          <span className={styles.strength_text}>{`${userState.strength}/${userState.maxStrength}`}</span>
        </div>
      </div>

      <img className={styles.build_img} src={build001} alt="" />
      <img className={styles.character_img} src={character} alt="" />
      <div className={styles.foot}>
        <button className={styles.btn_play} onClick={
          () => {
            history.replace("/answer");
          }
        }>
          <img className={styles.btn_play_img} src={btn_start} alt="" />
        </button>
      </div>
    </div>
  );
}
