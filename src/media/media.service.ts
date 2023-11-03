import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Media } from 'src/typeorm/media.entity';
import { Repository } from 'typeorm';
import { CreateMediaVO } from './valueobjects/media.vo';
import { MediaDTO } from './dto/media.dto';
import { User } from '../typeorm/user.entity';

@Injectable()
export class MediaService {
  constructor(
    @InjectRepository(Media)
    private readonly mediaRepository: Repository<Media>,
  ) {}

  getMedia() {
    throw new Error('Method not implemented.');
  }

  createMedia(createMedia: CreateMediaVO, owner: User) {
    const newMedia = this.mediaRepository.create({ ...createMedia, owner });
    return this.mediaRepository.save(newMedia);
  }

  async deleteMedia(id: number) {
    await this.mediaRepository.delete(id);
  }

  async findMediaById(idM: number): Promise<MediaDTO> {
    const media = await this.mediaRepository.findOneBy({ idM });
    return new MediaDTO(media);
  }
}
