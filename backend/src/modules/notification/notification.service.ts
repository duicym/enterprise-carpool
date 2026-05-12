import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './notification.entity';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async getList(userId: number, page: number = 1, pageSize: number = 20): Promise<any> {
    const [items, total] = await this.notificationRepository.findAndCount({
      where: { user: { id: userId } },
      order: { created_at: 'DESC' },
      skip: (page - 1) * pageSize,
      take: pageSize,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { user: { id: userId }, is_read: 0 },
    });

    return {
      items,
      total,
      page,
      pageSize,
      unreadCount,
    };
  }

  async markAsRead(userId: number, notificationId: number): Promise<void> {
    await this.notificationRepository.update(
      { id: notificationId, user: { id: userId } },
      { is_read: 1 },
    );
  }

  async markAllAsRead(userId: number): Promise<void> {
    await this.notificationRepository.update(
      { user: { id: userId }, is_read: 0 },
      { is_read: 1 },
    );
  }

  async createNotification(
    userId: number,
    type: number,
    title: string,
    content: string,
    relatedId?: number,
  ): Promise<Notification> {
    const notification = this.notificationRepository.create({
      user: { id: userId },
      type,
      title,
      content,
      related_id: relatedId,
    });

    return await this.notificationRepository.save(notification);
  }
}
