import { ConfigEntity } from '@entities/postgres-entities';
import { EntityRepository, getRepository } from 'typeorm';
import { ApiError } from '@models/api-error';
import { ResponseCodeEnum } from '@models/enums/response-code.enum';
import { StatusCodes } from 'http-status-codes';
import { ConfigBodyRequest, ConfigRequest } from '@models/map/map.request';
import ConfigEventModel from '@entities/mongo-model/configEvent.entity';
import { getWorldConfig } from '@core/utils/genRandom';

@EntityRepository()
export class ConfigRepository {
  async getConfig(dataQuery: ConfigRequest): Promise<any> {
    try {
      const checkConfig = await getRepository(ConfigEntity)
        .createQueryBuilder('c')
        .select('c."key_config",c."value_config"')
        .where('c."key_config" = :keyConfig', {
          keyConfig: dataQuery.key,
        })
        .getRawOne();

      return checkConfig || null;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async updateConfig(dataBody: ConfigBodyRequest): Promise<any> {
    try {
      const checkConfig = await getRepository(ConfigEntity)
        .createQueryBuilder('c')
        .select('c."key_config",c."value_config"')
        .where('c."key_config" = :keyConfig', {
          keyConfig: dataBody.key,
        })
        .getRawOne();

      if (checkConfig) {
        await getRepository(ConfigEntity)
          .createQueryBuilder()
          .update()
          .set({ valueConfig: JSON.stringify(dataBody.value) })
          .where({ keyConfig: dataBody.key })
          .execute();
      } else {
        await getRepository(ConfigEntity).save({
          keyConfig: dataBody.key,
          valueConfig: JSON.stringify(dataBody.value),
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

  async eventInit(): Promise<any> {
    try {
      const dataConfig = [
        {
          day: 1,
          timeStart: 1717977600000,
          timeEnd: 1718063999000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Follow Dragark Twitter',
              link: 'https://twitter.com/intent/follow?screen_name=',
              value: 'playDRAGARK',
              rest_id: '1777175223751897088',
              key: 'follow_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1798652912408944849',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Retweet',
              link: 'https://twitter.com/intent/retweet?tweet_id=',
              value: '1798652912408944849',
              key: 'retweet',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 2,
          timeStart: 1718064000000,
          timeEnd: 1718150399000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Follow Ventory Twitter',
              link: 'https://twitter.com/intent/follow?screen_name=',
              value: 'Ventory_gg',
              rest_id: '1659508706042847234',
              key: 'follow_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Join Ventory Discord',
              link: 'https://discord.com/invite/W6aCg9sU3e',
              key: 'join_discord',
              guild_id: '1111150831371309127',
              type: 'discord',
              egg: 1,
            },
            {
              title: 'Like Ventory Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1788155154027684077',
              key: 'like_twitter',
              type: 'twitter',
              egg: 2,
            },
          ],
        },
        {
          day: 3,
          timeStart: 1718150400000,
          timeEnd: 1718236799000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Join Dragark Discord',
              link: 'https://discord.gg/tSZ8WE85ta',
              guild_id: '1227463524532617216',
              key: 'join_discord',
              type: 'discord',
              egg: 1,
            },
            {
              title: 'Get Role Dragee On Discord',
              link: 'https://discord.gg/tSZ8WE85ta',
              key: 'role_discord',
              guild_id: '1227463524532617216',
              role_id: '1227475470715588608',
              type: 'discord',
              egg: 1,
            },
          ],
        },
        {
          day: 4,
          timeStart: 1718236800000,
          timeEnd: 1718323199000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Add #DragarkBetaTest 🐉 To Discord Username',
              link: 'https://discord.gg/tSZ8WE85ta',
              value: '#DragarkBetaTest 🐉',
              key: 'name_discord',
              type: 'discord',
              egg: 2,
            },
            {
              title: 'Meme Content',
              link: 'https://discord.gg/AaUFEKeHem',
              key: 'media',
              type: 'twitter',
              egg: 3,
            },
          ],
        },
        {
          day: 5,
          timeStart: 1718323200000,
          timeEnd: 1718409599000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1798652912408944849',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Comment with the phrase "Gimme Dragark #DragarkBetaTest"',
              link: 'https://twitter.com/intent/tweet?text=Gimme%20Dragark%20%23DragarkBetaTest&in_reply_to=',
              value: '1798652912408944849',
              key: 'reply_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Subscribe to Dragark Youtube channel',
              link: 'https://www.youtube.com/watch?v=qe9nyaFtjxU',
              value: '',
              key: 'media',
              type: 'social',
              egg: 2,
            },
          ],
        },
        {
          day: 6,
          timeStart: 1718409600000,
          timeEnd: 1718495999000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1798297459170656350',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Comment with the phrase "Gimme Dragark #DragarkBetaTest"',
              link: 'https://twitter.com/intent/tweet?text=Gimme%20Dragark%20%23DragarkBetaTest&in_reply_to=',
              value: '1798297459170656350',
              key: 'reply_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Retweet',
              link: 'https://twitter.com/intent/retweet?tweet_id=',
              value: '1797927290229420393',
              key: 'retweet',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 7,
          timeStart: 1718496000000,
          timeEnd: 1718582399000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title:
                'Tweet a favorite Dragark art piece and describe why you like it, tagging @playDRAGARK',
              link: 'https://twitter.com/intent/tweet?text=Hello%20%40playDRAGARK',
              key: 'tweet',
              type: 'twitter',
              egg: 3,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1795047062226038873',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Comment with the phrase "Gimme Dragark #DragarkBetaTest"',
              link: 'https://twitter.com/intent/tweet?text=Gimme%20Dragark%20%23DragarkBetaTest&in_reply_to=',
              value: '1795047062226038873',
              key: 'reply_twitter',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 8,
          timeStart: 1718582400000,
          timeEnd: 1718668799000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title:
                'Tweet about Dragark, including the phrase "Gimme Dragark #DragarkBetaTest" & tagging @playDRAGARK',
              link: 'https://twitter.com/intent/tweet?text=Gimme%20Dragark%20%23DragarkBetaTest%20%40playDRAGARK',
              key: 'tweet',
              type: 'twitter',
              egg: 2,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1787410536449065011',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Retweet',
              link: 'https://twitter.com/intent/retweet?tweet_id=',
              value: '1787410536449065011',
              key: 'retweet',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 9,
          timeStart: 1718668800000,
          timeEnd: 1718755199000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title:
                'Tweet a video review or tutorial about Dragark, tagging @playDRAGARK',
              link: 'https://twitter.com/intent/tweet?text=%40playDRAGARK',
              key: 'tweet',
              type: 'twitter',
              egg: 3,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1785979149632540693',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Retweet',
              link: 'https://twitter.com/intent/retweet?tweet_id=',
              value: '1785979149632540693',
              key: 'retweet',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 10,
          timeStart: 1718755200000,
          timeEnd: 1718841599000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Send a message to #island-chat channel on Discord',
              link: 'https://discord.gg/vf4P4Ab6',
              key: 'media',
              type: 'discord',
              egg: 1,
            },
            {
              title:
                'Share a screenshot of your favorite Dragark moment in Beta Open Game channel on Discord',
              link: 'https://discord.gg/wdT2jgZe',
              key: 'media',
              type: 'discord',
              egg: 3,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1782970617438109923',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
          ],
        },
        {
          day: 11,
          timeStart: 1718841600000,
          timeEnd: 1718927999000,
          tasks: [
            {
              title: 'Daily Checkin',
              link: '',
              key: 'checkin',
              type: 'checkin',
              egg: 1,
            },
            {
              title: 'Like Tweet',
              link: 'https://twitter.com/intent/like?tweet_id=',
              value: '1782970617438109923',
              key: 'like_twitter',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Retweet',
              link: 'https://twitter.com/intent/retweet?tweet_id=',
              value: '1782970617438109923',
              key: 'retweet',
              type: 'twitter',
              egg: 1,
            },
            {
              title: 'Join Dragark Discord',
              link: 'https://discord.gg/tSZ8WE85ta',
              guild_id: '1227463524532617216',
              key: 'join_discord',
              type: 'discord',
              egg: 2,
            },
          ],
        },
      ];
      const check = await ConfigEventModel.findOne({
        key: 'DailyMission',
      });
      if (check) {
        const update = await ConfigEventModel.updateOne(
          {
            key: 'DailyMission',
          },
          {
            $set: {
              dataConfig: dataConfig,
            },
          },
          {
            returnDocument: 'after',
          },
        );
        return update;
      } else {
        const dataCreate = await ConfigEventModel.create({
          key: 'DailyMission',
          dataConfig: dataConfig,
        });
        return dataCreate;
      }
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async getEventDailyConfig(): Promise<any> {
    try {
      let dataCreate = await ConfigEventModel.findOne({
        key: 'DailyMission',
      });
      dataCreate = dataCreate.toJSON();
      delete dataCreate._id;
      delete dataCreate.__v;
      return dataCreate;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async getEventReferralConfig(): Promise<any> {
    try {
      let dataCreate = await ConfigEventModel.findOne({
        key: 'ReferralReward',
      });
      dataCreate = dataCreate.toJSON();
      delete dataCreate._id;
      delete dataCreate.__v;
      return dataCreate;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async getDojoConfig(dataQuery): Promise<any> {
    try {
      const dataCreate = await ConfigEventModel.findOne({
        key: 'DojoConfig',
      });
      const dataConfig = dataCreate['dataConfig'];

      if (dataQuery.map_id && dataQuery.map_id != '') {
        const res = dataConfig.find((it) => it.mapId == dataQuery.map_id);
        return res;
      }
      const config = getWorldConfig(dataConfig);
      return config;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }

  async updateConfigAdmin(dataBody): Promise<any> {
    try {
      await ConfigEventModel.updateOne(
        {
          key: dataBody.key,
        },
        {
          dataConfig: dataBody.dataConfig,
        },
      );
      return true;
    } catch (error) {
      console.log(error);
      throw new ApiError(
        StatusCodes.BAD_REQUEST,
        error._errorCode || ResponseCodeEnum.CM0017,
      );
    }
  }
}
