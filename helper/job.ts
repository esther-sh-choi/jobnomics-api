import { prisma } from "../server";
import {
  CategoryType,
  DeleteItemType,
  updateDataType,
  UpdateInformationType,
  UpdateItemType,
  UserJobsType,
  SelectedItemType,
} from "../type/job";


const { requestToOpenAI } = require("./auto");

const queryUserAndJobsEntities = async (userId: number) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      isDeleted: false,
    },
    select: {
      userId: true,
      isFavorite: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      position: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
        },
      },
    },
  });
};

const processUserJobs = (userJobs: UserJobsType) => {
  const result: CategoryType = {};

  for (const eachJob of userJobs) {
    const categoryName: string = eachJob.category.name;
    const categoryId: number = eachJob.category.id;
    if (eachJob.category.name in result) {
      result[categoryName].jobs.push({
        ...eachJob.job,
        position: eachJob.position,
        isFavorite: eachJob.isFavorite,
        updatedAt: eachJob.updatedAt,
      });
    } else {
      result[categoryName] = {
        category: categoryName,
        id: categoryId,
        jobs: [
          {
            ...eachJob.job,
            position: eachJob.position,
            isFavorite: eachJob.isFavorite,
            updatedAt: eachJob.updatedAt,
          },
        ],
      };
    }
  }

  return result;
};

const queryJobById = (selectedItem: SelectedItemType, userId: number) => {
  const { jobId, categoryId } = selectedItem;

  return prisma.usersOnJobs.findFirst({
    where: {
      user: { id: Number(userId) },
      job: { id: Number(jobId) },
      category: { id: Number(categoryId) },
    },
    select: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      userId: true,
      updatedAt: true,
      isFavorite: true,
      position: true,
      interviewDate: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          location: true,
          description: true,
          logo: true,
          summary: true,
          skills: true,
          interviewExamples: true,
          platform: true,
        },
      },
    },
  });
};

const queryUserJobsWithFilter = async (
  userId: number,
  filteredCategory: string[],
  filteredLanguage: string[]
) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      OR: [
        {
          job: {
            skills: {
              some: {
                name: {
                  in: filteredLanguage,
                },
              },
            },
          },
        },
        {
          category: {
            name: {
              in: filteredCategory,
            },
          },
        },
      ],
      isDeleted: false,
    },
    select: {
      userId: true,
      updatedAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      position: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
        },
      },
    },
  });
};

const updateAllRearrangedJobs = async (
  updateInformation: UpdateInformationType,
  userId: number
) => {
  for (let update of updateInformation) {
    const job = await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: userId,
          jobId: update.jobId,
          categoryId: update.categoryId,
        },
      },
      data: {
        category: {
          connect: {
            id: update.newCategoryId,
          },
        },
        position: update.position,
      },
    });
  }
};

const deleteUserJob = async (deleteItem: DeleteItemType, userId: number) => {
  return prisma.usersOnJobs.update({
    where: {
      userId_jobId_categoryId: {
        userId: userId,
        jobId: deleteItem.jobId,
        categoryId: deleteItem.categoryId,
      },
    },
    data: {
      isDeleted: true,
    },
  });
};

const updateInterviewDateAndFavoriteAndChecklist = async (
  updateItem: UpdateItemType,
  userId: number
) => {
  const updateData: updateDataType = {};
  if (updateItem.favorite) {
    updateData["isFavorite"] = updateItem.favorite;
  }
  if (updateItem.interviewDate) {
    updateData["interviewDate"] = updateItem.interviewDate;
  }
  if (updateItem.checklists) {
    updateData["checklists"] = [...updateItem.checklists];
  }

  return prisma.usersOnJobs.update({
    where: {
      userId_jobId_categoryId: {
        userId: userId,
        jobId: updateItem.jobId,
        categoryId: updateItem.categoryId,
      },
    },
    data: updateData,
  });
};

const getUserIdByEmail = (email: string) => {
  return prisma.user.findUnique({
    where: {
      email,
    },
    select: {
      id: true,
    },
  });
};

const createChecklistsUserJob = async (userId: number, jobId: number) => {
  const checklists = await prisma.checklist.findMany();

  const userJobChecklists = await prisma.usersOnChecklists.findMany({
    where: { userId, jobId },
  });

  if (!userJobChecklists) {
    checklists.forEach(async (checklist) => {
      await prisma.usersOnChecklists.create({
        data: {
          userId: userId,
          jobId: jobId,
          checklistId: checklist.id,
          isComplete: false,
        },
      });
    });
  }
};

const queryChecklist = (selectedItem: SelectedItemType, userId: number) => {
  const { jobId } = selectedItem;

  return prisma.usersOnChecklists.findMany({
    where: {
      user: { id: Number(userId) },
      job: { id: Number(jobId) },
    },
    select: {
      isComplete: true,
      checklist: {
        select: {
          id: true,
          description: true,
        },
      },
    },
  });
};

const combineChecklistInfo = (job: any, checklists: any) => {
  const formattedChecklist = checklists.map((checklist: any) => ({
    ...checklist.checklist,
    isComplete: checklist.isComplete,
  }));
  const formattedJob = { ...job, checklists: formattedChecklist };
  return formattedJob;
};

const checkJobQuestions = async (jobId: number) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId
    },
    select: {
      description: true,
      interviewExamples: true,
    },
  });

  if (job?.interviewExamples) {
    return { check: true, description: null };
  }
  return { check: false, description: job?.description };
};

const questionsFromOpenAi = async (description: string) => {
  return requestToOpenAI(description, "interview");
};

const saveQuestionsToDatabase = async (jobId: number, description: string) => {
  return prisma.job.update({
    where: {
      id: jobId
    },
    data: {
      interviewExamples: description
    },
  });
};



module.exports = {
  queryUserAndJobsEntities,
  processUserJobs,
  queryJobById,
  queryUserJobsWithFilter,
  updateAllRearrangedJobs,
  deleteUserJob,
  updateInterviewDateAndFavoriteAndChecklist,
  getUserIdByEmail,
  queryChecklist,
  combineChecklistInfo,
  createChecklistsUserJob,
  checkJobQuestions,
  questionsFromOpenAi,
  saveQuestionsToDatabase
};
