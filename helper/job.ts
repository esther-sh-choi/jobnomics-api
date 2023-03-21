import { prisma } from "../server";
import {
  CategoryType,
  DeleteItemType,
  updateDataType,
  UpdateInformationType,
  UpdateItemType,
  UserJobsType,
  SelectedItemType,
  selectedCheckboxType,
  Checklist,
  UserJobs,
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
      interviewDate: true,
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
    orderBy: {
      position: "asc"
    }
  });
};

const processUserJobs = (userJobs: UserJobsType) => {
  const result: CategoryType = {
    Bookmarked: {
      category: "Bookmarked",
      id: 1,
      jobs: [],
    },
    Applied: {
      category: "Applied",
      id: 2,
      jobs: [],
    },
    Interviewing: {
      category: "Interviewing",
      id: 3,
      jobs: [],
    },
    Interviewed: {
      category: "Interviewed",
      id: 4,
      jobs: [],
    },
    "Job Offer": {
      category: "Job Offer",
      id: 5,
      jobs: [],
    },
    "Position Filled": {
      category: "Position Filled",
      id: 6,
      jobs: [],
    },
  };

  for (const eachJob of userJobs) {
    const categoryName: string = eachJob.category.name;
    const categoryId: number = eachJob.category.id;
    if (eachJob.category.name in result) {
      result[categoryName].jobs.push({
        ...eachJob.job,
        position: eachJob.position,
        isFavorite: eachJob.isFavorite,
        interviewDate: eachJob.interviewDate,
        updatedAt: eachJob.updatedAt,
        description: eachJob.job?.description,
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
            interviewDate: eachJob.interviewDate,
            updatedAt: eachJob.updatedAt,
            description: eachJob.job?.description,
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
      note: true,
      interviewDate: true,
      rejectReason: true,
      isDeleted: false,
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
      note: true,
      position: true,
      isFavorite: true,
      interviewDate: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
          description: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc'
    }
  });
};

const updateAllRearrangedJobs = async (
  updateInformation: UpdateInformationType,
  userId: number
) => {
  try {
    for (let update of updateInformation) {
      await prisma.usersOnJobs.update({
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
              id: update.isDeleted ? 1 : update.newCategoryId,
            },
          },
          position: update.position,
          isDeleted: update.isDeleted
        },
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteUserJob = async (deleteItem: DeleteItemType, userId: number) => {
  try {
    return await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: userId,
          jobId: deleteItem.jobId,
          categoryId: deleteItem.categoryId,
        },
      },
      data: {
        isDeleted: true,
        category: {
          connect: {
            id: 1
          }
        }
      },
    });
  } catch (e) {
    return e;
  }
};

const updateInterviewDateAndFavorite = async (
  updateItem: UpdateItemType,
  userId: number
) => {
  const updateData: updateDataType = {};
  updateData["isFavorite"] = updateItem.favorite;

  if (updateItem.interviewDate) {
    updateData["interviewDate"] = updateItem.interviewDate;
  }

  try {
    return await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: userId,
          jobId: updateItem.jobId,
          categoryId: updateItem.categoryId,
        },
      },
      data: updateData,
    });
  } catch (e) {
    return e;
  }
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
  if (userJobChecklists.length === 0) {
    for (let checklist of checklists) {
      await prisma.usersOnChecklists.create({
        data: {
          userId: userId,
          jobId: jobId,
          checklistId: checklist.id,
          isComplete: false,
        },
      });
    }
  }
};

const updateChecklistUserJob = async (
  selectedCheckbox: selectedCheckboxType,
  userId: number
) => {
  const { checklistId, jobId, isComplete } = selectedCheckbox;

  try {
    return await prisma.usersOnChecklists.update({
      where: {
        userId_checklistId_jobId: {
          userId,
          checklistId,
          jobId,
        },
      },
      data: {
        isComplete,
      },
    });
  } catch (e) {
    return e;
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
    orderBy: {
      checklistId: 'asc'
    }
  });
};

const combineChecklistInfo = (job: UserJobs, checklists: Checklist[]) => {
  const formattedChecklist = checklists.map((checklist: Checklist) => ({
    ...checklist.checklist,
    isComplete: checklist.isComplete,
  }));

  const formattedJob = { ...job, checklists: formattedChecklist };
  return formattedJob;
};

const checkJobQuestions = async (jobId: number) => {
  const job = await prisma.job.findUnique({
    where: {
      id: jobId,
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
      id: jobId,
    },
    data: {
      interviewExamples: description,
    },
  });
};

const updateNoteInUserJob = async (
  noteObj: {
    note: string;
    jobId: number;
    categoryId: number;
  },
  userId: number
) => {
  const { note, jobId, categoryId } = noteObj;
  try {
    return await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId,
          jobId,
          categoryId,
        },
      },
      data: {
        note,
      },
    });
  } catch (e) {
    return e;
  }
};

const updateRejectedReason = (
  userId: number,
  jobId: string,
  categoryId: string,
  reason: string
) => {
  return prisma.usersOnJobs.update({
    where: {
      userId_jobId_categoryId: {
        userId,
        jobId: Number(jobId),
        categoryId: Number(categoryId),
      },
    },
    data: {
      rejectReason: reason,
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
  updateInterviewDateAndFavorite,
  getUserIdByEmail,
  queryChecklist,
  combineChecklistInfo,
  createChecklistsUserJob,
  checkJobQuestions,
  questionsFromOpenAi,
  saveQuestionsToDatabase,
  updateNoteInUserJob,
  updateRejectedReason,
  updateChecklistUserJob,
};
