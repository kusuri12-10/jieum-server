import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../domain/entity/user.entity.js';
import type { UserRepository } from '../../domain/repository/user.repository.js';
import { UserOrmEntity } from '../orm/user.orm-entity.js';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @InjectRepository(UserOrmEntity)
    private readonly repo: Repository<UserOrmEntity>,
  ) {}

  async findById(id: number): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? orm.toDomain() : null;
  }

  async findByEmail(email: string): Promise<User | null> {
    const orm = await this.repo.findOne({ where: { email } });
    return orm ? orm.toDomain() : null;
  }

  async save(user: User): Promise<User> {
    const orm = UserOrmEntity.fromDomain(user);
    const saved = await this.repo.save(orm);
    return saved.toDomain();
  }

  async update(user: User): Promise<User> {
    const orm = UserOrmEntity.fromDomain(user);
    await this.repo.save(orm);
    return user;
  }
}
