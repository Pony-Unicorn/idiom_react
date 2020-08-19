import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';

import styles from './styles.module.css';

import btn_home_src from '../../resource/assets/game/btn_home.png';

import { answerPageConf } from '../../constant/answerPageConf';

import Word, { WORD_STATE } from '../../components/Word';
import CheckBox from '../../components/CheckBox';
import Keyword from '../../components/Keyword';

import CheckpointDataTool from './CheckpointDataTool';

import { pointPass } from '../../api';
import { userUpdate } from '../../actions';

import { IStateAll, IUserState } from '../../store/types';
import store from '../../store';

const changeBoxSrc_mp3 = require('../../resource/mp3/changeBox.mp3');
const getBoxSrc_mp3 = require('../../resource/mp3/getBox.mp3');
const selectWordSrc_mp3 = require('../../resource/mp3/selectWord.mp3');

const changeBox_mp3 = new Audio(changeBoxSrc_mp3);
const getBox_mp3 = new Audio(getBoxSrc_mp3);
const selectWord_mp3 = new Audio(selectWordSrc_mp3);

//地图的填入状态
enum FILL_STATE {
  not, // 不能填入状态
  auto, // 初始化自动填入文字
  yes, // 成功状态
  exist, // 需要填入文字，但没有填入文字
  manual // 手动填入文字
}

interface IWordInfo {
  answer: string; // 答案文字内容
  txt: string; // 要显示的文字内容
  isVis: boolean; // 是否显示
  gx: number; // 格子的 x 坐标
  gy: number; // 格子的 y 坐标
  agx: number;  // 记录答案格子的 x 坐标
  agy: number; // 记录答案格子的 y 坐标
  states: WORD_STATE;
}

interface IAnswerInfo {
  txt: string; // 要显示的文字内容
  isVis: boolean; // 是否显示
  gx: number; // 格子的 x 坐标
  gy: number; // 格子的 y 坐标
}

//标记格子占位
const _gridState: Array<Array<FILL_STATE>> = [];

function _formatGridState(state: FILL_STATE): void {
  _gridState.length = 0;
  for (let i = 0; i < answerPageConf.rows; i++) {
    const rowsArr = [];
    for (let ii = 0; ii < answerPageConf.cols; ii++) {
      rowsArr.push(state);
    }
    _gridState.push(rowsArr);
  }
}

function _initIdiom() {

  _formatGridState(FILL_STATE.not);

  const _tempIdioms: IWordInfo[][] = [];
  const _tempAnswers: IAnswerInfo[] = [];

  const curCheckpoint = store.getState().user.currentPoint;
  const checkpointDataTool = new CheckpointDataTool();
  const info = checkpointDataTool.getCheckPoint(curCheckpoint);

  for (let i = 0, l = info.length; i < l; i++) {

    const words = [] as IWordInfo[];

    for (let ii = 0, ll = info[i].length; ii < ll; ii++) {

      const d = info[i][ii];

      if (_gridState[d.gx][d.gy] === 0) {
        const word: IWordInfo = {
          answer: d.word,
          txt: d.isVis ? d.word : '',
          isVis: d.isVis,
          gx: d.gx,
          gy: d.gy,
          agx: d.isVis ? d.gx : -1,
          agy: d.isVis ? d.gy : -1,
          states: d.isVis ? WORD_STATE.auto : WORD_STATE.empty
        };
        words.push(word);
        _gridState[d.gx][d.gy] = FILL_STATE.auto;
      } else {
        const invWord = _wordByGrid(_tempIdioms, d.gx, d.gy) as IWordInfo;
        words.push(invWord);
      }

      if (!d.isVis) {
        if (!_answerByGrid(_tempAnswers, d.gx, d.gy)) {
          const answer = {
            txt: d.word, // 要显示的文字内容
            isVis: true, // 是否显示
            gx: d.gx, // 格子的 x 坐标
            gy: d.gy // 格子的 y 坐标
          };
          _tempAnswers.push(answer);
          _gridState[d.gx][d.gy] = FILL_STATE.exist;
        }
      }

    }

    _tempIdioms.push(words);
  }

  // 排序
  _tempIdioms.forEach(needIdiom => needIdiom.sort((a, b) => a.gx != b.gx ? a.gx - b.gx : a.gy - b.gy));
  _tempIdioms.sort((a, b) => a[0].gx != b[0].gx ? a[0].gx - b[0].gx : a[0].gy - b[0].gy);

  return { _idioms: _tempIdioms, _answers: _tempAnswers }
}

// 文字由格子坐标获取
function _wordByGrid(wordInfo: IWordInfo[][], gx: number, gy: number): IWordInfo | void {
  for (let i = 0, l = wordInfo.length; i < l; i++) {
    for (let ii = 0, ll = wordInfo[i].length; ii < ll; ii++) {
      if (wordInfo[i][ii].gx === gx && wordInfo[i][ii].gy === gy) {
        return wordInfo[i][ii];
      }
    }
  }
}

// 答案由格子坐标获取
function _answerByGrid(answerInfo: IAnswerInfo[], gx: number, gy: number): IAnswerInfo | undefined {
  return answerInfo.find(v => gx === v.gx && gy === v.gy);
}

export default function AnswerPage() {

  const history = useHistory();

  const userState = useSelector((state: IStateAll) => state.user);
  const dispatch = useDispatch();

  const [_checkBoxCellPos, setCheckBoxCellPos] = useState([0, 0]); // 选择框的当前坐标，以格子为准
  const [checkBoxPos, setCheckBoxPos] = useState({ posX: '0vw', posY: '0vw' }); // 选择框定位信息
  const [article, setArticle] = useState<{ _idioms: IWordInfo[][], _answers: IAnswerInfo[] }>(_initIdiom);
  const [isAllComplete, setAllComplete] = useState(false);

  useEffect(() => {
    _defaultCheckBoxPos();
  }, []);

  // 依赖于 _checkBoxCellPos 更新
  useEffect(() => {
    updateCheckBoxPos();
  }, _checkBoxCellPos);

  // 跳转到首页处理
  function jumpHome() {
    history.replace("/");
  }

  async function _allComplete() {
    getBox_mp3.play();
    setAllComplete(true);
    const res = await pointPass({ uid: userState.uid, type: '1' }) as IUserState;
    dispatch(userUpdate(res));
  }

  function _gridToPoint(gx: number, gy: number): number[] {
    const x = gx * (9 + 2);
    const y = gy * (9 + 2);
    return [x, y];
  }

  // 选择框 默认定位
  function _defaultCheckBoxPos(): void {
    for (let i = 0, l = article._idioms.length; i < l; i++) {
      for (let ii = 0, ll = article._idioms[i].length; ii < ll; ii++) {
        if (!article._idioms[i][ii].isVis) {
          const word = article._idioms[i][ii];
          setCheckBoxCellPos([word.gx, word.gy]);
          return; // 忘记 return 悲哀。。。
        }
      }
    }
  }

  // 点击成语字的处理
  function tapWordHandle(gx: number, gy: number) {
    if (_gridState[gx][gy] > 2) {
      changeBox_mp3.play();
      setCheckBoxCellPos([gx, gy]);

      if (_gridState[gx][gy] === FILL_STATE.manual) {
        const curWord = _wordByGrid(article._idioms, gx, gy);
        if (curWord && curWord.isVis) {

          // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
          const tempAnswers = [...article._answers];
          const lastAnswer = _answerByGrid(article._answers, curWord.agx, curWord.agy);
          if (lastAnswer) {
            for (let i = 0, l = tempAnswers.length; i < l; i++) {
              if (tempAnswers[i].gx === curWord.agx && tempAnswers[i].gy === curWord.agy) {
                tempAnswers[i].isVis = true;
              }
            }
          }

          // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
          const tempIdioms = [...article._idioms];
          for (let i = 0, l = tempIdioms.length; i < l; i++) {
            for (let ii = 0, ll = tempIdioms[i].length; ii < ll; ii++) {
              if (tempIdioms[i][ii].gx === gx && tempIdioms[i][ii].gy === gy) {
                tempIdioms[i][ii].txt = '';
                tempIdioms[i][ii].isVis = false;
                tempIdioms[i][ii].states = WORD_STATE.empty;
              }
            }
          }

          // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
          setArticle({ _idioms: tempIdioms, _answers: tempAnswers });
          _gridState[gx][gy] = FILL_STATE.exist;
        }
      }
    }
  }

  // 更新选择框坐标
  function updateCheckBoxPos() {
    const pos = _gridToPoint(_checkBoxCellPos[0], _checkBoxCellPos[1]);
    const posX = pos[0] + 'vw';
    const posY = pos[1] + 'vw';
    setCheckBoxPos({ posX, posY });
  }

  // 点击下方答案处理
  function tapKeyWordHandle(gx: number, gy: number) {
    selectWord_mp3.play();
    // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
    const tempAnswers = [...article._answers];
    // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
    const tempIdioms = [...article._idioms];

    const curWord = _wordByGrid(tempIdioms, _checkBoxCellPos[0], _checkBoxCellPos[1]);

    if (curWord) {

      // 如何选择的有文字先答案恢复
      if (curWord.isVis) {
        const lastAnswer = _answerByGrid(tempAnswers, curWord.agx, curWord.agy);
        if (lastAnswer) {
          for (let i = 0, l = tempAnswers.length; i < l; i++) {
            if (tempAnswers[i].gx === curWord.agx && tempAnswers[i].gy === curWord.agy) {
              tempAnswers[i].isVis = true;
            }
          }
        }
      }

      const curAnswer = _answerByGrid(tempAnswers, gx, gy);
      if (curAnswer) {
        for (let i = 0, l = tempIdioms.length; i < l; i++) {
          for (let ii = 0, ll = tempIdioms[i].length; ii < ll; ii++) {
            if (tempIdioms[i][ii].gx === _checkBoxCellPos[0] && tempIdioms[i][ii].gy === _checkBoxCellPos[1]) {
              tempIdioms[i][ii].txt = curAnswer.txt;
              tempIdioms[i][ii].isVis = true;
              tempIdioms[i][ii].agx = curAnswer.gx;
              tempIdioms[i][ii].agy = curAnswer.gy;
              tempIdioms[i][ii].states = tempIdioms[i][ii].answer === curAnswer.txt ? WORD_STATE.yes : WORD_STATE.err;
            }
          }
        }

        // 该单字涉及的成语
        const involvedIdioms = [];
        for (let i = 0, l = tempIdioms.length; i < l; i++) {
          for (let ii = 0, ll = tempIdioms[i].length; ii < ll; ii++) {
            if (tempIdioms[i][ii].gx == _checkBoxCellPos[0] && tempIdioms[i][ii].gy == _checkBoxCellPos[1]) {
              involvedIdioms.push(tempIdioms[i]);
            }
          }
        }

        const newIdioms: IWordInfo[][] = [];
        let leastOneCheck = false; // 无错
        let leastOneCom = false; // 至少一个完成

        for (let i = 0, l = involvedIdioms.length; i < l; i++) {
          const isCheck = involvedIdioms[i].every(v => v.isVis); // 判断是否需要检查
          if (isCheck) {
            // leastOneCheck = true;
            let isIdiomCom = involvedIdioms[i].every(v => v.answer === v.txt);
            if (isIdiomCom) {
              leastOneCom = true; // 标记最少有一个完成，此时一定需要寻找位置

              // 标记完成、冻结成语
              for (let ii = 0, ll = involvedIdioms[i].length; ii < ll; ii++) {

                for (let ik = 0, lk = tempIdioms.length; ik < lk; ik++) {
                  for (let iik = 0, llk = tempIdioms[ik].length; iik < llk; iik++) {
                    if (tempIdioms[ik][iik].gx === involvedIdioms[i][ii].gx && tempIdioms[ik][iik].gy === involvedIdioms[i][ii].gy) {
                      tempIdioms[ik][iik].states = WORD_STATE.yes;
                    }
                  }
                }

                _gridState[involvedIdioms[i][ii].gx][involvedIdioms[i][ii].gy] = FILL_STATE.yes;
              }

              if (_textComplete()) { // 检查是否完成
                _allComplete();
                return;
              }
            } else { // 错误
            }
          } else {
            newIdioms.push(involvedIdioms[i]);
          }
        }

        for (let i = 0, l = newIdioms.length; i < l; i++) {
          for (let ii = 0, ll = newIdioms[i].length; ii < ll; ii++) {
            if (newIdioms[i][ii].gx === _checkBoxCellPos[0] && newIdioms[i][ii].gy === _checkBoxCellPos[1]) {
              if (newIdioms[i][ii].answer === newIdioms[i][ii].txt) {
                leastOneCheck = true;
              }
            }
          }
        }

        if (leastOneCom || leastOneCheck) {
          if (newIdioms.length > 0) {
            for (let i = 0, l = newIdioms[0].length; i < l; i++) { // 先简单写 ，第一个，以后更改。进行排序
              if (!newIdioms[0][i].isVis) {
                const word = newIdioms[0][i];
                setCheckBoxCellPos([word.gx, word.gy])
                break;
              }
            }
          } else {
            _defaultCheckBoxPos();
          }
        }

        for (let i = 0, l = tempAnswers.length; i < l; i++) {
          if (tempAnswers[i].gx === curAnswer.gx && tempAnswers[i].gy === curAnswer.gy) {
            tempAnswers[i].isVis = false;
          }
        }
      }

      let stateGrid: FILL_STATE = FILL_STATE.manual;
      for (let ik = 0, lk = tempIdioms.length; ik < lk; ik++) {
        for (let iik = 0, llk = tempIdioms[ik].length; iik < llk; iik++) {
          if (tempIdioms[ik][iik].gx === curWord.gx && tempIdioms[ik][iik].gy === curWord.gy) {
            if (tempIdioms[ik][iik].states === WORD_STATE.yes) {
              stateGrid = FILL_STATE.yes;
            }
          }
        }
      }
      _gridState[_checkBoxCellPos[0]][_checkBoxCellPos[1]] = stateGrid;
    }

    // 理论应该使用 immutable.js 不可变库的，由于时间原因后期更改吧
    setArticle({ _idioms: tempIdioms, _answers: tempAnswers });
  }

  // 检验是否完成
  function _textComplete(): boolean {
    for (let i = 0, l = article._idioms.length; i < l; i++) {
      for (let ii = 0, ll = article._idioms[i].length; ii < ll; ii++) {
        if (!(article._idioms[i][ii].states === WORD_STATE.yes)) {
          return false;
        }
      }
    }
    return true;
  }

  // 渲染成语
  function renderIdiom() {

    const com: JSX.Element[] = [];

    const tempIdioms = article._idioms.flat();

    const removalIdioms: IWordInfo[] = [];

    for (let i = 0, l = tempIdioms.length; i < l; i++) {

      const isCheck = removalIdioms.some(value => value.gx === tempIdioms[i].gx && value.gy === tempIdioms[i].gy);

      if (!isCheck) {
        removalIdioms.push(tempIdioms[i]);
      }
    }

    for (let i = 0, l = removalIdioms.length; i < l; i++) {
      com.push(
        <Word
          key={`${i}`}
          txt={removalIdioms[i].txt}
          isVis={removalIdioms[i].isVis}
          gx={removalIdioms[i].gx}
          gy={removalIdioms[i].gy}
          states={removalIdioms[i].states}
          tapHandle={tapWordHandle} />
      )
    }

    return com;
  }

  function renderKeyword() {
    const com: JSX.Element[] = [];
    for (let i = 0, l = article._answers.length; i < l; i++) {
      const item = article._answers[i];
      com.push(
        <Keyword
          key={i}
          txt={item.txt}
          isVis={item.isVis}
          gx={item.gx}
          gy={item.gy}
          tapHandle={tapKeyWordHandle} />
      );
    }
    return com;
  }

  return (
    <div className={styles.container}>
      <div className={styles.top}>
        <img className={styles.btn_home} src={btn_home_src} alt="" onClick={jumpHome} />
        <span className={styles.level_text}>第 {userState.currentPoint} 关卡</span>
      </div>

      <div className={styles.problem_container}>
        <div className={styles.idiom}>
          {renderIdiom()}
          <CheckBox posX={checkBoxPos.posX} posY={checkBoxPos.posY} />
        </div>
      </div>

      <div className={styles.tool_container}>

      </div>

      <div className={styles.answer_container}>
        {renderKeyword()}
      </div>

      <div className={isAllComplete ? styles.show_end : styles.hide_end}>
        <span className={styles.txt_gongxi}>恭喜完成</span>
        <span className={styles.txt_complete}>回到首页开始下一关卡</span>
        <img className={styles.btn_home} src={btn_home_src} alt="" onClick={jumpHome} />
      </div>
    </div >
  );
}
