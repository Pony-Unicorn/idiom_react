import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './styles.module.css';

import Word from '../../components/Word';
import CheckBox from '../../components/CheckBox';

export default function AnswerPage() {

  const history = useHistory();

  // 选择框定位信息
  const [checkBoxPos, setCheckBoxPos] = useState({ posX: '0px', posY: '0px' });

  function handleClick() {
    history.replace("/end");
  }

  const tapProblem = (evt: React.MouseEvent) => {
    const pX = evt.pageX;
    const pY = evt.pageY - 60;
    setCheckBoxPos({ posX: pX + 'px', posY: pY + 'px' })
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>

      </div>

      <div className={styles.problem_container} onClick={tapProblem}>
        <Word txt='我' isVis={true} gx={8} gy={8} />
        <Word txt='我' isVis={true} gx={0} gy={8} />
        <Word txt='我' isVis={true} gx={0} gy={0} />
        <Word txt='我' isVis={true} gx={8} gy={0} />
        <CheckBox posX={checkBoxPos.posX} posY={checkBoxPos.posY} />
      </div>

      <div className={styles.tool_container}>

      </div>

      <div className={styles.answer_container}>

      </div>
    </div>
  );
}
