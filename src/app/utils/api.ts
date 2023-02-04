import type { Message } from '../types/chatTypes';
import { addMessage } from '../stores/chatStore';
import { getFromStorage } from '../../shared/storage';
import { callAPI } from '../../shared/api';

export const askQuestion = async (question: string) => {
  const userMessage: Message = {
    text: question,
    type: 'text',
    speaker: 'user',
  };
  addMessage(userMessage);

  const message: Message = await askServer(question);

  addMessage(message);
};

export const askServer = async (question: string) => {
  const body = JSON.stringify({
    url: location.href,
    question: question.replace('\n', ''),
  });

  const response = await callAPI(
    '/ask',
    await getFromStorage('owlie-id'),
    body
  );

  let msg = (await response.json()) as Message;
  msg.speaker = 'backend';
  return msg;
};
