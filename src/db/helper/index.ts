import { EntityManager } from "typeorm";

// common interface for databse operations

interface DatabseOperations<T> {
  create(entity: T): Promise<T>;
  update(id: number, entity: Partial<T>): Promise<T | null | boolean>;
  delete(id: number): Promise<boolean>;
  findById(id: number): Promise<T>;
  // findAll(query?: Record<string, any>): Promise<T[]>;
}

export class DatabaseHelper<T> implements DatabseOperations<T> {
  private manager: EntityManager;
  private entityClass: new () => T;

  constructor(manager: EntityManager, entityClass: new () => T) {
    this.manager = manager;
    this.entityClass = entityClass;
  }
  async create(entity: T): Promise<T> {
    try {
      const newEntity = this.manager.create(this.entityClass, entity);
      return await this.manager.save(newEntity);
    } catch (error) {
      throw error as Error;
    }
  }
  async update(id: number, entity: Partial<T>): Promise<T | null | boolean> {
    try {
      const existingEntity = await this.manager.findOne(this.entityClass, {
        where: { id },
      });
      if (!existingEntity) {
        return null;
      }
      this.manager.merge(this.entityClass, existingEntity, entity);
      await this.manager.save(existingEntity);
      return true;
    } catch (err) {
      throw err as Error;
    }
  }
  async delete(id: number): Promise<boolean> {
    try {
      const entity = await this.manager.findOne(this.entityClass, {
        where: { id },
      });
      if (!entity) {
        return false;
      }
      await this.manager.remove(entity);
      return true;
    } catch (err) {
      throw err as Error;
    }
  }
  async findById(id: number): Promise<T> {
    try {
      const entity = await this.manager.findOne(this.entityClass, {
        where: { id },
      });
      return entity as T;
    } catch (err) {
      throw err as Error;
    }
  }
  // async findAll(query: Record<string, any> = {}): Promise<T[]> {
  //   try {
  //     const queryBuilder = this.manager.createQueryBuilder(
  //       this.entityClass,
  //       "entity"
  //     );

  //     // Apply filters based on the query object
  //     if (query.filters) {
  //       for (const key in query.filters) {
  //         if (query.filters.hasOwnProperty(key)) {
  //           const value = query.filters[key];
  //           // Assuming that the key matches a column name in the entity
  //           queryBuilder.andWhere(`entity.${key} = :${key}`, { [key]: value });
  //         }
  //       }
  //     }

  //     // Apply sorting based on the query object
  //     if (query.sort) {
  //       for (const key in query.sort) {
  //         if (query.sort.hasOwnProperty(key)) {
  //           const direction = query.sort[key];
  //           // Assuming that the key matches a column name in the entity
  //           queryBuilder.addOrderBy(`entity.${key}`, direction);
  //         }
  //       }
  //     }

  //     // Execute the query
  //     return await queryBuilder.getMany();
  //   } catch (err) {
  //     throw err as Error;
  //   }
  // }
}
