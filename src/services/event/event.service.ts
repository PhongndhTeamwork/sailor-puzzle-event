import 'reflect-metadata';
import { Service } from 'typedi';
import { InjectRepository } from 'typeorm-typedi-extensions';
import { EventRepository } from '@repositories/event/event.repository';
import {
  ClaimTaskRequest,
  VerifyTaskRequest,
} from '@models/event/event.request';
import { UserInfo } from '@models/authorzization/user.info';

@Service()
export class EventService {
  constructor(
    @InjectRepository()
    private readonly eventRepository: EventRepository,
  ) {}

  async getProcessTask(
    dataQuery: ClaimTaskRequest,
    user: UserInfo,
  ): Promise<any> {
    return await this.eventRepository.getProcessTask(dataQuery, user);
  }

  async claimTask(dataBody: ClaimTaskRequest, user: UserInfo): Promise<any> {
    return await this.eventRepository.claimTask(dataBody, user);
  }

  async verifyTask(dataBody: VerifyTaskRequest, user: UserInfo): Promise<any> {
    return await this.eventRepository.verifyTask(dataBody, user);
  }
}
