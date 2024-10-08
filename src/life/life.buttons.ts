import { Markup } from 'telegraf';

export function mainEditButtons() {
  Markup.button.callback('editButtons', 'menu-2');
  return Markup.keyboard(
    [
      Markup.button.callback('Изменить фото', 'editPhotosButton'),
      Markup.button.callback('Изменить описание', 'editCaptionButton'),
      Markup.button.callback('Назад', 'backButton'),
    ],
    {
      columns: 2,
    },
  ).resize(true);
}

export function doneMenuButtons() {
  Markup.button.callback('done-buttons', 'menu-3');
  return Markup.keyboard(
    [
      Markup.button.callback('Редактировать', 'editButton'),
      Markup.button.callback('Готово (отправить админу)', 'doneButton'), //отправить админу
    ],
    {
      columns: 2,
    },
  ).resize(true);
}

export function mainMenuButtons(isUserInDraft: boolean) {
  Markup.button.callback('main-buttons', 'menu-1');
  if (isUserInDraft) {
    return doneMenuButtons();
  }
  return Markup.keyboard(
    [Markup.button.callback('Показать свою жизнь', 'showLifeButton')],
    {
      columns: 1,
    },
  ).resize(true);
}

export function backButtons() {
  Markup.button.callback('back-buttons', 'menu-4');
  return Markup.keyboard([Markup.button.callback('Назад', 'backButton')], {
    columns: 1,
  }).resize(true);
}

export function continueWithoutCaptionButtons() {
  Markup.button.callback('continue-without-caption-buttons', 'menu-6');
  return Markup.keyboard(
    [
      Markup.button.callback(
        'Продолжить без описания',
        'continueWithoutCaptionButton',
      ),
    ],
    {
      columns: 1,
    },
  ).resize(true);
}

export function photosHasSended() {
  Markup.button.callback('photosHasSended', 'menu-5');
  return Markup.keyboard(
    [Markup.button.callback('Перейти к описанию', 'goToCaptionButton')],
    {
      columns: 1,
    },
  ).resize(true);
}
