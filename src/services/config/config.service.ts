import 'reflect-metadata';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { ConfigBodyRequest, ConfigRequest } from '@models/map/map.request';
import { ConfigRepository } from '@repositories/config/config.repository';

@Service()
export class ConfigService {
  constructor(
    @InjectRepository()
    private readonly configRepository: ConfigRepository,
  ) {}

  /**
   * Get list activity
   */
  async getConfig(dataQuery: ConfigRequest): Promise<any> {
    return await this.configRepository.getConfig(dataQuery);
  }

  async updateConfig(dataBody: ConfigBodyRequest): Promise<any> {
    return await this.configRepository.updateConfig(dataBody);
  }

  async updateConfigAdmin(dataBody): Promise<any> {
    return await this.configRepository.updateConfigAdmin(dataBody);
  }

  async eventInit(): Promise<any> {
    return await this.configRepository.eventInit();
  }

  async getEventDailyConfig(): Promise<any> {
    return await this.configRepository.getEventDailyConfig();
  }

  async getEventReferralConfig(): Promise<any> {
    return await this.configRepository.getEventReferralConfig();
  }

  async getDojoConfig(dataQuery): Promise<any> {
    return await this.configRepository.getDojoConfig(dataQuery);
  }
}
