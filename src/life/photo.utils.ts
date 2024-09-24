import { photosHasSended } from './life.buttons';

export const photoUploadAndSendToChat = (uuid, msg, url) => {
  const http = require('https');
  const fs = require('fs');
  const file = fs.createWriteStream(`photos/${uuid}.jpg`);
  const request = http.get(url.href, function (response) {
    response.pipe(file);
    file.on('finish', async () => {
      file.close();
      console.log('Download Completed');
    });
  });
};

export const sendPhoto = (ctx, link, msg, uuid) => {
  fetch(link)
    .then((res) => res.json())
    .then(async (res) => {
      ctx.telegram.getFileLink(msg[3].file_id).then(async (url) => {
        if (ctx.session.type === 'sendingPhotos') {
          photoUploadAndSendToChat(uuid, msg, url);
          await ctx.reply(`Фото загружено`, photosHasSended());
        } else if (ctx.session.type === 'editingPhoto') {
          photoUploadAndSendToChat(uuid, msg, url);
          await ctx.reply(`Фото загружено`);
        }
      });
    })
    .catch((err) => console.log(err));
};

export const sendLifeToUser = async (
  ctx,
  lifePhotosArray,
  toAdmin: boolean,
) => {
  if (toAdmin) {
    await ctx.telegram.sendMessage(
      1831394748,
      'Новый пост - проверьте на ненормативный контент и отправьте в группу. PS пошел нахуй',
    );
    await ctx.telegram.sendMessage(410826310, 'Новый пост');
    await ctx.telegram.sendMediaGroup(1831394748, lifePhotosArray);
    await ctx.telegram.sendMediaGroup(410826310, lifePhotosArray);
  } else {
    await ctx.sendMediaGroup(lifePhotosArray);
  }
};
