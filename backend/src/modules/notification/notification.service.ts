import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThan, Between, FindOptionsWhere } from 'typeorm';
import { Notification, NotificationType } from '../entities/notification.entity';
import { CreateNotificationDto, MarkAsReadDto, ListNotificationsDto } from '../dto/notification.dto';

@Injectable()
export class NotificationService {
  constructor(
    @InjectRepository(Notification)
    private notificationRepository: Repository<Notification>,
  ) {}

  async create(dto: CreateNotificationDto): Promise<Notification> {
    const notification = this.notificationRepository.create(dto);
    return this.notificationRepository.save(notification);
  }

  async findByUser(
    userId: number,
    filters?: ListNotificationsDto,
  ): Promise<{ notifications: Notification[]; total: number; unreadCount: number }> {
    const where: FindOptionsWhere<Notification> = { userId };

    if (filters?.type) {
      where.type = filters.type;
    }

    if (filters?.unreadOnly) {
      where.isRead = 0;
    }

    const [notifications, total] = await this.notificationRepository.findAndCount({
      where,
      order: { createdAt: 'DESC' },
      skip: ((filters?.page || 1) - 1) * (filters?.limit || 20),
      take: filters?.limit || 20,
    });

    const unreadCount = await this.notificationRepository.count({
      where: { userId, isRead: 0 },
    });

    return { notifications, total, unreadCount };
  }

  async markAsRead(ids: number[], userId: number): Promise<number> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ isRead: 1 })
      .where('id IN (:...ids)', { ids })
      .andWhere('user_id = :userId', { userId })
      .execute();

    return result.affected || 0;
  }

  async markAllAsRead(userId: number): Promise<number> {
    const result = await this.notificationRepository
      .createQueryBuilder()
      .update()
      .set({ isRead: 1 })
      .where('user_id = :userId', { userId })
      .andWhere('is_read = 0')
      .execute();

    return result.affected || 0;
  }

  async getCount(userId: number): Promise<{ unread: number; total: number }> {
    const [unread, total] = await Promise.all([
      this.notificationRepository.count({ where: { userId, isRead: 0 } }),
      this.notificationRepository.count({ where: { userId } }),
    ]);

    return { unread, total };
  }

  async findById(id: number): Promise<Notification> {
    const notification = await this.notificationRepository.findOne({
      where: { id },
    });

    if (!notification) {
      throw new Error('通知不存在');
    }

    return notification;
  }

  async delete(id: number, userId: number): Promise<void> {
    await this.notificationRepository.delete({ id, userId });
  }

  // 快捷方法：创建各类通知
  async sendBookingNotification(
    userId: number,
    title: string,
    content: string,
    bookingId: number,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.BOOKING,
      title,
      content,
      relatedId: bookingId,
    });
  }

  async sendCircleNotification(
    userId: number,
    title: string,
    content: string,
    circleId: number,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.CIRCLE,
      title,
      content,
      relatedId: circleId,
    });
  }

  async sendEventNotification(
    userId: number,
    title: string,
    content: string,
    eventId: number,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.EVENT,
      title,
      content,
      relatedId: eventId,
    });
  }

  async sendTripNotification(
    userId: number,
    title: string,
    content: string,
    tripId: number,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.TRIP,
      title,
      content,
      relatedId: tripId,
    });
  }

  async sendSystemNotification(
    userId: number,
    title: string,
    content: string,
  ): Promise<Notification> {
    return this.create({
      userId,
      type: NotificationType.SYSTEM,
      title,
      content,
    });
  }
}
