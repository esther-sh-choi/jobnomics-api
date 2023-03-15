interface Job {
  id: number;
  title: string;
  company: string;
  logo: string | null;
  pos: number | null;
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

interface UserJobs {
  userId: number;
  category: CategoryEntity;
  position: number | null;
  job: Job;
}

export type UserJobsType = UserJobs[];

interface JobUpdateEntity {
  userId: number;
  jobId: number;
  categoryId: number;
  newCategoryId: number;
  pos: number;
}

export type UpdateInformationType = JobUpdateEntity[];

