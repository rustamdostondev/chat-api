export interface IRoom {
  id?: string;
  name?: string;
  isDeleted?: boolean;

  // Timestamps
  createdAt?: Date;
  updatedAt?: Date;
  deletedAt?: Date | null;

  // Foreign keys
  createdById?: string;
  updatedById?: string | null;
  deletedById?: string | null;
}
