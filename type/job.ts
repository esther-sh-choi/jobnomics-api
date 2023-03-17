import { Request } from "express";
interface Job {
  id: number;
  title: string;
  company: string;
  logo: string | null;
  isFavorite: boolean;
  position: number | null;
  updatedAt: Date;
}

interface Category {
  id: number;
  category: string;
  jobs: Job[];
}

export type CategoryType = {
  [key: string]: Category;
};

export type updateDataType = {
  isFavorite?: boolean;
  interviewDate?: Date;
};

export type DeleteItemType = {
  userId: number;
  jobId: number;
  categoryId: number;
  type: string;
};

export type UpdateItemType = {
  favorite?: boolean;
  type: string;
  userId: number;
  jobId: number;
  categoryId: number;
  interviewDate?: Date;
};

interface CategoryEntity {
  id: number;
  name: string;
}

export interface SelectedItemType {
  userId: number;
  jobId: number;
  categoryId: number;
}

interface UserJobs {
  userId: number;
  category: CategoryEntity;
  position: number | null;
  isFavorite: boolean;
  updatedAt: Date;
  job: Job;
}

export type UserJobsType = UserJobs[];

interface JobUpdateEntity {
  userId: number;
  jobId: number;
  categoryId: number;
  newCategoryId: number;
  position: number;
}

export type UpdateInformationType = JobUpdateEntity[];

export interface CustomRequest extends Request {
  user: {
    given_name: string;
    family_name: string;
    nickname: string;
    name: string;
    picture: string;
    email: string;
  };
}
