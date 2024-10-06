import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import { TEXTS } from './text';
import { Context } from './life.context';
import { sendLifeToUser } from './photo.utils';

@Injectable()
export class LifeService {
  constructor(private prisma: PrismaService) {}
  sendHello() {
    return { msg: 'hello world!' };
  }

  async createUser(data: Prisma.UserLifeCreateInput) {
    const isUserAlreadyInDB = await this.prisma.userLife.findUnique({
      where: { tg_id: data.tg_id },
    });
    if (!isUserAlreadyInDB) {
      console.log('User not in DB');

      const newUser = await this.prisma.userLife.create({ data: data });
      if (!newUser)
        throw new HttpException(
          'Bad request - user did not create',
          HttpStatus.BAD_REQUEST,
        );
      return newUser;
    } else {
      console.log('User already in DB');
    }
  }

  async savePhotos(
    tg_id: number,
    ctx: Context,
    uuid: string,
    editing: boolean,
  ) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    console.log(ctx.session.type);
    if (userData.photos.length >= 10 && ctx.session.type === 'sendingPhotos') {
      ctx.session.type = 'sendingText';
      await ctx.reply('Максимум фото - 10');
      return;
    }
    if (
      userData.photosEditing.length >= 9 &&
      ctx.session.type === 'editingPhoto'
    ) {
      await ctx.reply('Максимум фото - 10');

      return;
    }
    if (editing) {
      const updatedUsersData = await this.prisma.userLife.update({
        where: { tg_id },
        data: { photosEditing: { push: uuid } },
      });
      if (!updatedUsersData) {
        throw new HttpException(
          'there is an ad with this id but it has not been updated',
          HttpStatus.BAD_REQUEST,
        );
      }
      return updatedUsersData;
    } else {
      const updatedUsersData = await this.prisma.userLife.update({
        where: { tg_id },
        data: { photos: { push: uuid } },
      });
      if (!updatedUsersData) {
        throw new HttpException(
          'there is an ad with this id but it has not been updated',
          HttpStatus.BAD_REQUEST,
        );
      }
      return updatedUsersData;
    }
  }

  async deletePhotos(tg_id: number) {
    const updatedUsersData = await this.prisma.userLife.update({
      where: { tg_id },
      data: { photos: [] },
    });
    if (!updatedUsersData) {
      throw new HttpException(
        'there is an ad with this id but it has not been updated',
        HttpStatus.BAD_REQUEST,
      );
    }
    return updatedUsersData;
  }

  async getUsersPhotos(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    return userData.photos;
  }

  async setCaption(tg_id: number, ctx: Context, caption: string) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    const data = {
      tg_id,
      photos: userData.photos,
      caption,
    };

    const updatedUsersData = await this.prisma.userLife.update({
      where: { tg_id },
      data,
    });

    if (!updatedUsersData) {
      throw new HttpException(
        'there is an ad with this id but it has not been updated',
        HttpStatus.BAD_REQUEST,
      );
    }
    console.log(updatedUsersData);
    return updatedUsersData;
  }
  async sendLifeToUser(tg_id: number, ctx: Context, toAdmin: boolean) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });

    const lifePhotosArray = [];

    userData.photos.map((photo) => {
      if (lifePhotosArray.length < 10) {
        lifePhotosArray.push({
          type: 'photo',
          media: { source: `photos/${photo}.jpg` },
        });
      }
    });

    if (userData.caption !== null) {
      lifePhotosArray[0].caption = userData.caption;
    }

    sendLifeToUser(ctx, lifePhotosArray, toAdmin);
    return;
  }

  async checkIfPhotos(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    return userData.photos.length;
  }

  async checkIsCaption(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    return userData.caption;
  }

  async checkIsPhotosOrCaption(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });

    if (
      userData?.photos?.length === 0 ||
      userData?.photos === null ||
      userData?.photos === undefined ||
      userData === undefined
    )
      return false;
    return true;
  }

  async saveEditingPhotos(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    if (userData.photosEditing.length > 0) {
      const updatedUsersData = await this.prisma.userLife.update({
        where: { tg_id },
        data: { photos: userData.photosEditing },
      });

      if (!updatedUsersData) {
        throw new HttpException(
          'there is an ad with this id but it has not been updated',
          HttpStatus.BAD_REQUEST,
        );
      } else {
        await this.prisma.userLife.update({
          where: { tg_id },
          data: { photosEditing: [] },
        });

        return updatedUsersData;
      }
    }
  }

  async deletePhotosAndCaption(tg_id: number) {
    const userData = await this.prisma.userLife.findUnique({
      where: { tg_id: tg_id },
    });
    const updatedUsersData = await this.prisma.userLife.update({
      where: { tg_id },
      data: { photos: [], caption: null },
    });
    if (!updatedUsersData) {
      throw new HttpException(
        'there is an ad with this id but it has not been updated',
        HttpStatus.BAD_REQUEST,
      );
    }

    return updatedUsersData;
  }
}
