export type CreateNewJobType = {
  jobLink: string;
  interviewDate: Date;
  type: "link" | "manual";
  manualForm: FormDataType;
};

export type FormDataType = {
  title: string;
  company: string;
  location: string;
  platform: string;
  link: string;
  description: string;
};

export type JobDataType = {
  title: string;
  link: string;
  company: string;
  location: string;
  description: string;
  logo?: string;
  platformJobId: string | undefined;
  platform: string;
  summary: string;
  skills: [];
};
