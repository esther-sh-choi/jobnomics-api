import { Request } from "express";
interface CustomJob {
  id: number;
  title: string;
  company: string;
  logo: string | null;
  isFavorite: boolean;
  interviewDate: Date | null;
  position: number | null;
  updatedByUserAt: Date;
  description?: string;
  location?: string;
  summary?: string;
  isActive: boolean;
  skills: {
    id: number;
    createdAt: Date;
    updatedAt: Date;
    name: string;
  };
  interviewExamples?: string;
  platform?: string;
}

interface Category {
  id: number;
  category: string;
  jobs: CustomJob[];
}

export type CategoryType = {
  [key: string]: Category;
};

export type updateDataType = {
  isFavorite?: boolean;
  interviewDate?: Date;
  updatedByUserAt?: Date;
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
  updatedByUserAt?: Date;
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

export interface UserJobs {
  isActive: boolean;
  userId: number;
  category: CategoryEntity;
  position: number | null;
  isFavorite: boolean;
  interviewDate: Date | null;
  updatedByUserAt: Date;
  job: CustomJob;
  description: string;
  note?: string;
  generalNote?: string;
  rejectReason?: string;
  avatarColor: string;
}

export type UserJobsType = UserJobs[];

interface JobUpdateEntity {
  userId: number;
  jobId: number;
  categoryId: number;
  newCategoryId: number;
  position: number;
  isDeleted?: boolean;
  isActive?: boolean;
  isChanged?: boolean;
  avatarColor: string;
}

export type UpdateInformationType = JobUpdateEntity[];

export interface CustomRequest extends Request {
  user: {
    id: number;
    email: string;
  };
}

export type UpdateChecklistType = {
  checklists?: { id: number; description: string; isComplete: boolean }[];
};

export type Checklist = {
  isComplete: boolean;
  checklist: { id: number; description: string };
};

export type selectedCheckboxType = {
  checklistId: number;
  jobId: number;
  isComplete: boolean;
};

export type InterviewDatesType = {
  interviewDate: Date;
  job: { title: string; company: string };
}[];

export type ListIdentitiesType = {
  ResponseMetadata: { RequestId: string };
  Identities: string[];
};

export type GetIdentityVerificationType = {
  ResponseMetadata: { RequestId: string };
  VerificationAttributes: { [key: string]: { VerificationStatus: string } };
};

export type VerifyEmailAddressType = {
  ResponseMetadata: { RequestId: string };
};

export type NoteOrderByObjType =
  | {
      [key: string]: { [key: string]: string } | string;
    }
  | {};
