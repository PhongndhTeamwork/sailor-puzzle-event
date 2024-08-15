import { EntityRepository, getRepository } from 'typeorm';
import { ApiError } from '@models/api-error';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { StatusCodes } from 'http-status-codes';
import {
  ClaimTaskRequest,
  VerifyTaskRequest,
} from '@models/event/event.request';
import { UserInfo } from '@models/authorzization/user.info';
import ConfigEventModel from '@entities/mongo-model/configEvent.entity';
import AccountEventModel from '@entities/mongo-model/accountEvent.entity';
import HistoryEventModel from '@entities/mongo-model/historyEvent.entity';
import ProcessEventModel from '@entities/mongo-model/processTask.entity';
import axios from 'axios';
import {
  AccountEntity,
  UserDiscordEntity,
  // WalletEntity,
} from '@entities/postgres-entities';
import RedisClient from '../../config/redis';
import genKeyRedis from '@core/utils/redis';
// import { genCode, getCurrentEvent, getRandomInt } from '@core/utils/genRandom';
// import Paging from '@core/utils/paging';
// import { formatStarknetWallet } from '@core/utils/convertString';

@EntityRepository()
export class EventRepository {
  async getProcessTask(
    dataQuery: ClaimTaskRequest,
    user: UserInfo,
  ): Promise<any> {
    try {
      if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
      }

      const dataProcess = await ProcessEventModel.find({
        address: user.walletAddress,
        day: Number(dataQuery.day),
      });

      return dataProcess ? dataProcess : [];
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async claimTask(dataBody: ClaimTaskRequest, user: UserInfo): Promise<any> {
    try {
      if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
      }
      const key = genKeyRedis('claimTask', {
        ...dataBody,
        user_id: user.id,
      });
      const checkKey = await RedisClient.get(key);
      if (checkKey) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0027);
      } else {
        await RedisClient.setEx(key, 4, JSON.stringify(true));
      }
      const { day } = dataBody;
      const checkConfig = await ConfigEventModel.findOne({
        key: 'DailyMission',
      });
      const dataConfig = checkConfig['dataConfig'];
      const dayData = dataConfig.find((it) => it.day == day);
      if (dayData.timeEnd < Date.now() || dayData.timeStart > Date.now()) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0042);
      }
      const checkData = await HistoryEventModel.findOne({
        address: user.walletAddress,
        typeAction: 'claim_task',
        day: day,
      });
      if (checkData) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0044);
      }
      const userProcess = await ProcessEventModel.find({
        address: user.walletAddress,
        day: day,
        taskIndex: { $ne: 0 },
      });
      const taskLen = dayData.tasks.length;
      if (Number(userProcess.length) < Number(taskLen) - 1) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0043);
      }
      let totalEgg = 0;
      for (let i = 1; i < taskLen; i++) {
        const element = dayData.tasks[i];
        totalEgg += Number(element.egg);
      }
      await AccountEventModel.updateOne(
        { address: user.walletAddress },
        {
          $push: {
            dailyData: {
              day: day,
              claimed: true,
            },
          },
          $inc: {
            'eggPoint.total': Number(totalEgg),
            'eggPoint.holding': Number(totalEgg),
          },
        },
        { returnDocument: 'after' },
      );
      await HistoryEventModel.create({
        address: user.walletAddress,
        typeAction: 'claim_task',
        day: day,
        mark: '+',
        eggPoint: Number(totalEgg),
        reward: [],
        time: Date.now(),
      });
      return true;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async checkRoleDiscord(
    guildID: string,
    memberID: string,
    roleID: string,
  ): Promise<any> {
    try {
      const getAccess = await getRepository(UserDiscordEntity)
        .createQueryBuilder('vud')
        .select(`vud.access_token, vud.refresh_token`)
        .where('vud.discord_id = :discordId', { discordId: memberID })
        .getRawOne();
      try {
        const guild = await axios.get(
          `https://discord.com/api/users/@me/guilds/${guildID}/member`,
          {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${getAccess.access_token}`,
            },
          },
        );
        return guild && guild.data ? guild.data.roles.includes(roleID) : false;
      } catch (error) {
        if (error.message.includes('401')) {
          const tokenResponseData = await axios({
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Authorization: `Basic ${BasicAuthToken}`,
            },
            url: 'https://discord.com/api/oauth2/token',
            data: {
              client_id: process.env.DISCORD_CLIENT_ID,
              client_secret: process.env.DISCORD_CLIENT_SECRET,
              refresh_token: getAccess.refresh_token,
              grant_type: 'refresh_token',
            },
            method: 'POST',
          });

          const oauthData = await tokenResponseData.data;
          await getRepository(UserDiscordEntity)
            .createQueryBuilder()
            .update(UserDiscordEntity)
            .set({
              accessToken: oauthData?.access_token,
              refreshToken: oauthData?.refresh_token,
              expireTime: oauthData?.expires_in,
            })
            .where('discord_id = :id', { id: memberID })
            .execute();

          const guild = await axios.get(
            `https://discord.com/api/users/@me/guilds/${guildID}/member`,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${oauthData?.access_token}`,
              },
            },
          );

          return guild && guild.data
            ? guild.data.roles.includes(roleID)
            : false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkJoinDiscord(guildID: string, memberID: string): Promise<any> {
    try {
      const getAccess = await getRepository(UserDiscordEntity)
        .createQueryBuilder('vud')
        .select(`vud.access_token, vud.refresh_token`)
        .where('vud.discord_id = :discordId', { discordId: memberID })
        .getRawOne();
      try {
        const guild = await axios.get(
          `https://discord.com/api/users/@me/guilds`,
          {
            headers: {
              'Content-type': 'application/json',
              Authorization: `Bearer ${getAccess.access_token}`,
            },
          },
        );
        const checkGuild = guild.data.find((it) => it.id == guildID);
        return checkGuild ? true : false;
      } catch (error) {
        if (error.message.includes('401')) {
          const tokenResponseData = await axios({
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Authorization: `Basic ${BasicAuthToken}`,
            },
            url: 'https://discord.com/api/oauth2/token',
            data: {
              client_id: process.env.DISCORD_CLIENT_ID,
              client_secret: process.env.DISCORD_CLIENT_SECRET,
              refresh_token: getAccess.refresh_token,
              grant_type: 'refresh_token',
            },
            method: 'POST',
          });

          const oauthData = await tokenResponseData.data;
          await getRepository(UserDiscordEntity)
            .createQueryBuilder()
            .update(UserDiscordEntity)
            .set({
              accessToken: oauthData?.access_token,
              refreshToken: oauthData?.refresh_token,
              expireTime: oauthData?.expires_in,
            })
            .where('discord_id = :id', { id: memberID })
            .execute();

          const guild = await axios.get(
            `https://discord.com/api/users/@me/guilds`,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${oauthData?.access_token}`,
              },
            },
          );
          const checkGuild = guild.data.find((it) => it.id == guildID);
          return checkGuild ? true : false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async checkUserNameDiscord(
    memberID: string,
    validateChar: string,
  ): Promise<any> {
    try {
      const getAccess = await getRepository(UserDiscordEntity)
        .createQueryBuilder('vud')
        .select(`vud.access_token, vud.refresh_token`)
        .where('vud.discord_id = :discordId', { discordId: memberID })
        .getRawOne();
      try {
        const userData = await axios.get(`https://discord.com/api/users/@me`, {
          headers: {
            'Content-type': 'application/json',
            Authorization: `Bearer ${getAccess.access_token}`,
          },
        });
        return userData && userData.data
          ? userData.data.global_name.includes(validateChar)
          : false;
      } catch (error) {
        if (error.message.includes('401')) {
          const tokenResponseData = await axios({
            headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
              // Authorization: `Basic ${BasicAuthToken}`,
            },
            url: 'https://discord.com/api/oauth2/token',
            data: {
              client_id: process.env.DISCORD_CLIENT_ID,
              client_secret: process.env.DISCORD_CLIENT_SECRET,
              refresh_token: getAccess.refresh_token,
              grant_type: 'refresh_token',
            },
            method: 'POST',
          });

          const oauthData = await tokenResponseData.data;
          await getRepository(UserDiscordEntity)
            .createQueryBuilder()
            .update(UserDiscordEntity)
            .set({
              accessToken: oauthData?.access_token,
              refreshToken: oauthData?.refresh_token,
              expireTime: oauthData?.expires_in,
            })
            .where('discord_id = :id', { id: memberID })
            .execute();

          const userData = await axios.get(
            `https://discord.com/api/users/@me`,
            {
              headers: {
                'Content-type': 'application/json',
                Authorization: `Bearer ${oauthData?.access_token}`,
              },
            },
          );

          return userData && userData.data
            ? userData.data.global_name.includes(validateChar)
            : false;
        }
      }
    } catch (error) {
      console.log(error);
      return false;
    }
  }

  async handleTaskProcess(
    dataBody: VerifyTaskRequest,
    user: UserInfo,
    dataTask: any,
  ): Promise<any> {
    try {
      const { day, taskIndex } = dataBody;
      const timeNow = Date.now();

      // Add Egg for user
      if (dataTask.key == 'checkin') {
        const checkData = await HistoryEventModel.findOne({
          address: user.walletAddress,
          typeAction: dataTask.key,
          day: day,
        });
        if (!checkData) {
          await AccountEventModel.updateOne(
            { address: user.walletAddress },
            {
              $inc: {
                'eggPoint.total': Number(dataTask.egg),
                'eggPoint.holding': Number(dataTask.egg),
              },
            },
            { returnDocument: 'after' },
          );
          await HistoryEventModel.create({
            address: user.walletAddress,
            typeAction: dataTask.key,
            day: day,
            mark: '+',
            eggPoint: Number(dataTask.egg),
            reward: [],
            time: timeNow,
          });
        }
      }

      // Create Process Event
      const checkExist = await ProcessEventModel.findOne({
        address: user.walletAddress,
        day: day,
        taskIndex: taskIndex,
      });
      if (!checkExist) {
        await ProcessEventModel.create({
          address: user.walletAddress,
          day: day,
          taskIndex: taskIndex,
          eggPoint: Number(dataTask.egg),
          checked: true,
          time: timeNow,
        });
      }

      return true;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async verifyTask(dataBody: VerifyTaskRequest, user: UserInfo): Promise<any> {
    try {
      if (!user) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0008);
      }
      // Checking Redis Request
      const key = genKeyRedis('verifyTask', {
        ...dataBody,
        user_id: user.id,
      });
      const checkKey = await RedisClient.get(key);
      if (checkKey) {
        throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0027);
      } else {
        await RedisClient.setEx(key, 4, JSON.stringify(true));
      }

      const { day, taskIndex } = dataBody;
      if (day == 1 && taskIndex == 1) {
        const checkExist = await ProcessEventModel.findOne({
          address: user.walletAddress,
          day: day,
          taskIndex: taskIndex,
        });
        if (!checkExist) {
          await AccountEventModel.updateOne(
            { address: user.walletAddress },
            {
              $set: {
                socialQuest: true,
              },
            },
            { returnDocument: 'after' },
          );

          await ProcessEventModel.create({
            address: user.walletAddress,
            day: day,
            taskIndex: taskIndex,
            eggPoint: 1,
            checked: true,
            time: Date.now(),
          });
        }
        return true;
      } else {
        const checkConfig = await ConfigEventModel.findOne({
          key: 'DailyMission',
        });
        const dataConfig = checkConfig['dataConfig'];
        const dayData = dataConfig.find((it) => it.day == day);
        const timeNow = Date.now();
        if (dayData.timeEnd < timeNow || dayData.timeStart > timeNow) {
          throw new ApiError(StatusCodes.BAD_REQUEST, ResponseCodeEnum.CM0042);
        }
        const taskData = dayData.tasks[taskIndex];

        // Get User Info
        const checkUser = await getRepository(AccountEntity)
          .createQueryBuilder('acc')
          .select('*')
          .where('acc.id = :userId', { userId: user.id })
          .getRawOne();

        // Check task
        let statusTask = false;
        switch (taskData.key) {
          case 'checkin': {
            statusTask = true;
            break;
          }
          case 'follow_twitter': {
            statusTask = true;
            break;
          }
          case 'media': {
            statusTask = true;
            break;
          }
          case 'retweet': {
            statusTask = true;
            break;
          }
          case 'join_discord': {
            const { guild_id } = taskData;
            const memberId = checkUser.discord_uid;
            const checkJoin = await this.checkJoinDiscord(guild_id, memberId);
            statusTask = checkJoin;
            break;
          }
          case 'role_discord': {
            const { guild_id, role_id } = taskData;
            const memberId = checkUser.discord_uid;
            const checkRole = await this.checkRoleDiscord(
              guild_id,
              memberId,
              role_id,
            );
            statusTask = checkRole;
            break;
          }
          case 'name_discord': {
            const { value } = taskData;
            const memberId = checkUser.discord_uid;
            const checkRole = await this.checkUserNameDiscord(memberId, value);
            statusTask = checkRole;
            break;
          }
          case 'like_twitter': {
            statusTask = true;
            break;
          }
          case 'reply_twitter': {
            statusTask = true;
            break;
          }
          case 'quote_twitter': {
            statusTask = true;
            break;
          }
          default: {
            statusTask = true;
            break;
          }
        }
        if (statusTask === true) {
          await this.handleTaskProcess(dataBody, user, taskData);
        }

        return statusTask;
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }
}
