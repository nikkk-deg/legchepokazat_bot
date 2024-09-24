import { Context as ContextTelegraf } from 'telegraf';

export interface Context extends ContextTelegraf {
  session: {
    type?:
      | 'sendingPhotos' //отправка фото
      | 'sendingText' // отправка текста
      | 'editingPhoto' //меню редактирование фото
      | 'editingCaption' //меню редактирование текста
      | 'sendToAdmin' // кнопка готово
      | 'main' // состояние /start
      | 'back' //кнопка назад
      | 'editMain' //меню редактирование
      | 'doneOrEdit'; // меню отправки или редактирования
  };
}
