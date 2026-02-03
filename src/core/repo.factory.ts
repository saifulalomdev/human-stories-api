import { eq, SQL, count } from "drizzle-orm";
import { PgTable, TableConfig } from "drizzle-orm/pg-core";
import { db } from "@/infrastructure/db/db";

type PaginationOptions = {
    page: number;
    pageSize: number;
};

type PaginatedResult<T> = {
    data: T[];
    pagination: {
        currentPage: number;
        pageSize: number;
        totalRecords: number;
        totalPages: number;
        hasNextPage: boolean;
        hasPreviousPage: boolean;
    };
};

export const createRepositoryForTable = <TTable extends PgTable<TableConfig>>(table: TTable) => {
    return {
        /**
         * Creates a new record in the database and returns it
         * @param values - The data to insert into the table
         * @returns The newly created record with all its fields
         */
        createAndReturn: async (values: TTable["$inferInsert"]) => {
            const [record] = await db
                .insert(table as PgTable<TableConfig>)
                .values(values)
                .returning();

            return record as TTable["$inferSelect"];
        },

        /**
         * Finds a single record by its ID
         * @param id - The unique identifier of the record
         * @returns The record if found, null otherwise
         */
        findById: async (id: string) => {
            const [record] = await db
                .select()
                .from(table as PgTable<TableConfig>)
                .where(eq((table as any).id, id))
                .limit(1);

            return record ?? null;
        },

        /**
         * Finds a single record using a custom SQL condition
         * @param condition - A Drizzle SQL condition to filter by
         * @returns The first matching record if found, null otherwise
         * 
         * @example
         * const user = await userRepo.findOneByCondition(
         *   eq(usersTable.email, "user@example.com")
         * );
         */
        findOneByCondition: async (condition: SQL) => {
            const [record] = await db
                .select()
                .from(table as PgTable<TableConfig>)
                .where(condition)
                .limit(1);

            return record ?? null;
        },

        /**
         * Retrieves all records from the table
         * @returns An array of all records in the table
         * 
         * @warning Use with caution on large tables - consider using findManyWithPagination instead
         */
        findAllRecords: async () => {
            return await db.select().from(table as PgTable<TableConfig>);
        },

        /**
         * Retrieves records with pagination support
         * @param options - Pagination options (page number and page size)
         * @returns Paginated result with data and metadata
         * 
         * @example
         * const result = await userRepo.findManyWithPagination({ page: 1, pageSize: 10 });
         * console.log(result.data); // Array of 10 users
         * console.log(result.pagination.totalPages); // Total number of pages
         */
        findManyWithPagination: async (options: PaginationOptions): Promise<PaginatedResult<TTable["$inferSelect"]>> => {
            const { page, pageSize } = options;
            const offset = (page - 1) * pageSize;

            // Get total count
            const [{ total }] = await db
                .select({ total: count() })
                .from(table as PgTable<TableConfig>);

            // Get paginated data
            const data = await db
                .select()
                .from(table as PgTable<TableConfig>)
                .limit(pageSize)
                .offset(offset);

            const totalPages = Math.ceil(total / pageSize);

            return {
                data: data as TTable["$inferSelect"][],
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalRecords: total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            };
        },

        /**
         * Retrieves records with pagination and custom filtering
         * @param condition - SQL condition to filter records
         * @param options - Pagination options (page number and page size)
         * @returns Paginated result with filtered data and metadata
         * 
         * @example
         * const activeUsers = await userRepo.findManyByConditionWithPagination(
         *   eq(usersTable.isActive, true),
         *   { page: 1, pageSize: 20 }
         * );
         */
        findManyByConditionWithPagination: async (
            condition: SQL,
            options: PaginationOptions
        ): Promise<PaginatedResult<TTable["$inferSelect"]>> => {
            const { page, pageSize } = options;
            const offset = (page - 1) * pageSize;

            // Get total count with condition
            const [{ total }] = await db
                .select({ total: count() })
                .from(table as PgTable<TableConfig>)
                .where(condition);

            // Get paginated data with condition
            const data = await db
                .select()
                .from(table as PgTable<TableConfig>)
                .where(condition)
                .limit(pageSize)
                .offset(offset);

            const totalPages = Math.ceil(total / pageSize);

            return {
                data: data as TTable["$inferSelect"][],
                pagination: {
                    currentPage: page,
                    pageSize,
                    totalRecords: total,
                    totalPages,
                    hasNextPage: page < totalPages,
                    hasPreviousPage: page > 1,
                },
            };
        },

        /**
         * Updates a record by ID and returns the updated version
         * @param id - The unique identifier of the record to update
         * @param values - The fields to update
         * @returns The updated record if found, null otherwise
         */
        updateByIdAndReturn: async (
            id: string,
            values: Partial<TTable["$inferInsert"]>
        ) => {
            const [record] = await db
                .update(table as PgTable<TableConfig>)
                .set(values)
                .where(eq((table as any).id, id))
                .returning();

            return record as TTable["$inferSelect"] | undefined ?? null;
        },

        /**
         * Deletes a record by ID and returns the deleted record
         * @param id - The unique identifier of the record to delete
         * @returns The deleted record if found, null otherwise
         */
        deleteByIdAndReturn: async (id: string) => {
            const [record] = await db
                .delete(table as PgTable<TableConfig>)
                .where(eq((table as any).id, id))
                .returning();

            return record as TTable["$inferSelect"] | undefined ?? null;
        },
    };
};