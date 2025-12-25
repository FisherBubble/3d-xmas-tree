
import { BlessingContent } from '../types';

export const FESTIVE_BLESSINGS: BlessingContent[] = [
  {
    en: "Merry Christmas! Hope your gifts are more reliable than your work performance.",
    cn: "🎄“祝你圣诞快乐，希望你的礼物比你的工作能力更靠谱。”"
  },
  {
    en: "May your Christmas tree this year be more lush than your social life.",
    cn: "🎁“愿你今年的圣诞树比你的人际关系还要茂盛。”"
  },
  {
    en: "Merry Christmas! Eat well, drink well, and stop using lame excuses to procrastinate next year.",
    cn: "❄️“祝你圣诞节快乐，吃好喝好，明年别再拿烂借口拖延了。”"
  },
  {
    en: "Hope your holiday lasts longer than your usual productivity peaks.",
    cn: "🎅“希望你的假期比你平时的效率更长一些。”"
  },
  {
    en: "Wishing you a beautiful mood and a beautiful bank balance; let fate handle the rest.",
    cn: "✨“祝你圣诞心情美丽，存款也美丽，剩下的就随缘吧。”"
  },
  {
    en: "May your festive spirit be more accurate than your intellectual judgments.",
    cn: "🎉“愿你的节日比你的智商判断更精准。”"
  },
  {
    en: "Merry Christmas! Please stop pretending you actually understand wine.",
    cn: "🍷“祝你圣诞快乐，别再假装自己很懂酒了。”"
  },
  {
    en: "Hope your Christmas gifts are a bit more honest than your carefully crafted online persona.",
    cn: "🕯️“希望你的圣诞礼物比你的人设还要诚实一点。”"
  },
  {
    en: "May all your holiday wishes come true—except for your procrastination, that's here to stay.",
    cn: "🌟“愿你圣诞心想事成，除了拖延症，其他都好。”"
  },
  {
    en: "Merry Christmas! Keep your socks warm and may the level of people annoying you drop to a record low.",
    cn: "🧦“祝你圣诞节快乐，袜子暖暖，别人烦你的程度降到最低。”"
  }
];

export const getRandomBlessing = (): BlessingContent => {
  return FESTIVE_BLESSINGS[Math.floor(Math.random() * FESTIVE_BLESSINGS.length)];
};
