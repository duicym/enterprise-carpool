import { MigrationInterface, QueryRunner, Table, TableIndex } from 'typeorm';

export class InitialTables1717200000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // User table
    await queryRunner.createTable(
      new Table({
        name: 'user',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'openid',
            type: 'varchar',
            length: '64',
            isUnique: true,
          },
          {
            name: 'unionid',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'nickname',
            type: 'varchar',
            length: '64',
            isNullable: true,
          },
          {
            name: 'avatar_url',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'phone',
            type: 'varchar',
            length: '20',
            isNullable: true,
          },
          {
            name: 'gender',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'credit_score',
            type: 'int',
            default: 100,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'idx_openid',
        columnNames: ['openid'],
      }),
    );

    await queryRunner.createIndex(
      'user',
      new TableIndex({
        name: 'idx_credit',
        columnNames: ['credit_score'],
      }),
    );

    // Circle table
    await queryRunner.createTable(
      new Table({
        name: 'circle',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar',
            length: '128',
          },
          {
            name: 'type',
            type: 'tinyint',
          },
          {
            name: 'description',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'cover_image',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'owner_id',
            type: 'bigint',
          },
          {
            name: 'member_count',
            type: 'int',
            default: 1,
          },
          {
            name: 'max_members',
            type: 'int',
            default: 500,
          },
          {
            name: 'is_public',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'circle',
      new TableIndex({
        name: 'idx_owner',
        columnNames: ['owner_id'],
      }),
    );

    await queryRunner.createIndex(
      'circle',
      new TableIndex({
        name: 'idx_type',
        columnNames: ['type'],
      }),
    );

    await queryRunner.createIndex(
      'circle',
      new TableIndex({
        name: 'idx_status',
        columnNames: ['status'],
      }),
    );

    // Circle Member table
    await queryRunner.createTable(
      new Table({
        name: 'circle_member',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'circle_id',
            type: 'bigint',
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'role',
            type: 'tinyint',
            default: 3,
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'remark',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'joined_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'circle_member',
      new TableIndex({
        name: 'uk_circle_user',
        columnNames: ['circle_id', 'user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'circle_member',
      new TableIndex({
        name: 'idx_user',
        columnNames: ['user_id'],
      }),
    );

    // Trip table
    await queryRunner.createTable(
      new Table({
        name: 'trip',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'circle_id',
            type: 'bigint',
          },
          {
            name: 'driver_id',
            type: 'bigint',
          },
          {
            name: 'start_address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'start_latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'start_longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
          {
            name: 'end_address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'end_latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'end_longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
          {
            name: 'departure_time',
            type: 'datetime',
          },
          {
            name: 'seat_count',
            type: 'tinyint',
          },
          {
            name: 'available_seats',
            type: 'tinyint',
          },
          {
            name: 'fee_mode',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'fee_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'remark',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'trip',
      new TableIndex({
        name: 'idx_circle',
        columnNames: ['circle_id'],
      }),
    );

    await queryRunner.createIndex(
      'trip',
      new TableIndex({
        name: 'idx_driver',
        columnNames: ['driver_id'],
      }),
    );

    await queryRunner.createIndex(
      'trip',
      new TableIndex({
        name: 'idx_status',
        columnNames: ['status'],
      }),
    );

    await queryRunner.createIndex(
      'trip',
      new TableIndex({
        name: 'idx_departure',
        columnNames: ['departure_time'],
      }),
    );

    // Booking table
    await queryRunner.createTable(
      new Table({
        name: 'booking',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'trip_id',
            type: 'bigint',
          },
          {
            name: 'driver_id',
            type: 'bigint',
          },
          {
            name: 'passenger_id',
            type: 'bigint',
          },
          {
            name: 'seats_booked',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'fee_amount',
            type: 'decimal',
            precision: 10,
            scale: 2,
            isNullable: true,
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'passenger_cancel_reason',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'driver_cancel_reason',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'booked_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'confirmed_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'completed_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'cancelled_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'booking',
      new TableIndex({
        name: 'idx_trip',
        columnNames: ['trip_id'],
      }),
    );

    await queryRunner.createIndex(
      'booking',
      new TableIndex({
        name: 'idx_driver',
        columnNames: ['driver_id'],
      }),
    );

    await queryRunner.createIndex(
      'booking',
      new TableIndex({
        name: 'idx_passenger',
        columnNames: ['passenger_id'],
      }),
    );

    await queryRunner.createIndex(
      'booking',
      new TableIndex({
        name: 'idx_status',
        columnNames: ['status'],
      }),
    );

    // Event table
    await queryRunner.createTable(
      new Table({
        name: 'event',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'circle_id',
            type: 'bigint',
          },
          {
            name: 'organizer_id',
            type: 'bigint',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '128',
          },
          {
            name: 'description',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'location_address',
            type: 'varchar',
            length: '256',
          },
          {
            name: 'location_latitude',
            type: 'decimal',
            precision: 10,
            scale: 8,
          },
          {
            name: 'location_longitude',
            type: 'decimal',
            precision: 11,
            scale: 8,
          },
          {
            name: 'start_time',
            type: 'datetime',
          },
          {
            name: 'end_time',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'registration_deadline',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'total_participants',
            type: 'int',
            default: 0,
          },
          {
            name: 'drivers_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'passengers_count',
            type: 'int',
            default: 0,
          },
          {
            name: 'allocation_status',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'event',
      new TableIndex({
        name: 'idx_circle',
        columnNames: ['circle_id'],
      }),
    );

    await queryRunner.createIndex(
      'event',
      new TableIndex({
        name: 'idx_organizer',
        columnNames: ['organizer_id'],
      }),
    );

    await queryRunner.createIndex(
      'event',
      new TableIndex({
        name: 'idx_start_time',
        columnNames: ['start_time'],
      }),
    );

    // Event Participant table
    await queryRunner.createTable(
      new Table({
        name: 'event_participant',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'event_id',
            type: 'bigint',
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'role',
            type: 'tinyint',
            default: 2,
          },
          {
            name: 'seats_offered',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'vehicle_info',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'pickup_preference',
            type: 'varchar',
            length: '256',
            isNullable: true,
          },
          {
            name: 'allocation_result',
            type: 'text',
            isNullable: true,
          },
          {
            name: 'joined_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'event_participant',
      new TableIndex({
        name: 'uk_event_user',
        columnNames: ['event_id', 'user_id'],
        isUnique: true,
      }),
    );

    await queryRunner.createIndex(
      'event_participant',
      new TableIndex({
        name: 'idx_user',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'event_participant',
      new TableIndex({
        name: 'idx_role',
        columnNames: ['role'],
      }),
    );

    // Review table
    await queryRunner.createTable(
      new Table({
        name: 'review',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'booking_id',
            type: 'bigint',
            isUnique: true,
          },
          {
            name: 'reviewer_id',
            type: 'bigint',
          },
          {
            name: 'reviewee_id',
            type: 'bigint',
          },
          {
            name: 'rating',
            type: 'tinyint',
          },
          {
            name: 'content',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'reply_content',
            type: 'varchar',
            length: '512',
            isNullable: true,
          },
          {
            name: 'reply_at',
            type: 'datetime',
            isNullable: true,
          },
          {
            name: 'is_anonymous',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'status',
            type: 'tinyint',
            default: 1,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'review',
      new TableIndex({
        name: 'idx_reviewer',
        columnNames: ['reviewer_id'],
      }),
    );

    await queryRunner.createIndex(
      'review',
      new TableIndex({
        name: 'idx_reviewee',
        columnNames: ['reviewee_id'],
      }),
    );

    await queryRunner.createIndex(
      'review',
      new TableIndex({
        name: 'idx_booking',
        columnNames: ['booking_id'],
      }),
    );

    // Notification table
    await queryRunner.createTable(
      new Table({
        name: 'notification',
        columns: [
          {
            name: 'id',
            type: 'bigint',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'user_id',
            type: 'bigint',
          },
          {
            name: 'type',
            type: 'tinyint',
          },
          {
            name: 'title',
            type: 'varchar',
            length: '128',
          },
          {
            name: 'content',
            type: 'varchar',
            length: '512',
          },
          {
            name: 'related_id',
            type: 'bigint',
            isNullable: true,
          },
          {
            name: 'is_read',
            type: 'tinyint',
            default: 0,
          },
          {
            name: 'created_at',
            type: 'datetime',
            default: 'CURRENT_TIMESTAMP',
          },
        ],
      }),
      true,
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'idx_user',
        columnNames: ['user_id'],
      }),
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'idx_read',
        columnNames: ['is_read'],
      }),
    );

    await queryRunner.createIndex(
      'notification',
      new TableIndex({
        name: 'idx_type',
        columnNames: ['type'],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('notification');
    await queryRunner.dropTable('review');
    await queryRunner.dropTable('event_participant');
    await queryRunner.dropTable('event');
    await queryRunner.dropTable('booking');
    await queryRunner.dropTable('trip');
    await queryRunner.dropTable('circle_member');
    await queryRunner.dropTable('circle');
    await queryRunner.dropTable('user');
  }
}
