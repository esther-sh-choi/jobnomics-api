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
  InterviewDatesType,
  NoteOrderByObjType,
  StatusObj,
} from "../type/job";

const { requestToOpenAI } = require("./auto");

const queryUserAndJobsEntities = async (userId: number) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      isDeleted: false,
      isActive: true,
    },
    select: {
      userId: true,
      isFavorite: true,
      interviewDate: true,
      updatedByUserAt: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      position: true,
      isActive: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
          avatarColor: true,
          link: true,
        },
      },
    },
    orderBy: {
      position: "asc",
    },
  });
};

const queryStaleJobs = async (userId: number) => {
  const sixtyDaysAgo = new Date(Date.now() - 60 * 24 * 60 * 60 * 1000); // 60 days in milliseconds
  // const sixtyDaysAgo = new Date(Date.now() - 0.5 * 60 * 1000); // 60 days in milliseconds
  return await prisma.usersOnJobs.findMany({
    where: {
      userId,
      updatedByUserAt: {
        lte: sixtyDaysAgo,
      },
      isActive: true,
      isDeleted: false
    },
    select: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      userId: true,
      updatedByUserAt: true,
      createdAt: true,
      isFavorite: true,
      position: true,
      note: true,
      generalNote: true,
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
          avatarColor: true,
          link: true,
        },
      },
    },
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
    "Job Unavailable": {
      category: "Job Unavailable",
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
        updatedByUserAt: eachJob.updatedByUserAt,
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
            updatedByUserAt: eachJob.updatedByUserAt,
            description: eachJob.job?.description,
          },
        ],
      };
    }
  }

  return result;
};

const processFilterJobs = (userJobs: UserJobsType) => {
  let result = [];

  for (const eachJob of userJobs) {
    const job = {
      categoryId: eachJob?.category?.id,
      company: eachJob?.job?.company,
      id: eachJob?.job?.id,
      interviewDate: eachJob?.interviewDate,
      isFavorite: eachJob?.isFavorite,
      logo: eachJob?.job?.logo,
      position: eachJob?.position,
      title: eachJob?.job?.title,
      updatedByUserAt: eachJob?.updatedByUserAt,
      description: eachJob?.job?.description,
      isActive: eachJob?.isActive,
      avatarColor: eachJob?.job?.avatarColor,
    };
    result.push(job);
  }

  return result;
};

const queryJobById = async (selectedItem: SelectedItemType, userId: number) => {
  const { jobId, categoryId } = selectedItem;

  try {
    if (jobId && categoryId && jobId >= 0 && categoryId > 0) {
      const data = await prisma.usersOnJobs.findFirst({
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
          updatedByUserAt: true,
          isFavorite: true,
          position: true,
          generalNote: true,
          createdAt: true,
          note: true,
          interviewDate: true,
          rejectReason: true,
          isDeleted: false,
          isActive: true,
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
              avatarColor: true,
              link: true,
            },
          },
        },
      });
      return data;
    } else {
      return null;
    }
  } catch (e) {
    console.log(e);
  }
};

const queryUserJobsWithFilter = async (
  userId: number,
  filteredCategory: string[],
  filteredLanguage: string[],
  columnFilter: string[],
  status: string[]
) => {
  let orderParams = {};
  if (columnFilter[0] === "isFavorite") {
    orderParams = [
      {
        isFavorite: columnFilter[1],
      },
      {
        createdAt: "desc",
      },
    ];
  } else if (columnFilter[0] === "company" || columnFilter[0] === "title") {
    orderParams = {
      job: {
        [columnFilter[0]]: columnFilter[1],
      },
    };
  } else {
    orderParams = {
      [columnFilter[0]]: columnFilter[1],
    };
  }

  const statusObj: StatusObj = {};
  if (status.length === 1 && status[0] === "active") {
    Object.assign(statusObj, { isActive: true });
  } else if (status.length === 1 && status[0] === "inactive") {
    Object.assign(statusObj, { isActive: false });
  }

  const filterByCategory: any = {};
  if (
    (filteredCategory.length === 1 && filteredCategory[0] !== "") ||
    filteredCategory.length > 1
  ) {
    filterByCategory["category"] = {
      name: {
        in: filteredCategory,
      },
    };
  }

  const filterByLanguages: any = {};
  if (
    (filteredLanguage.length === 1 && filteredLanguage[0] !== "") ||
    filteredLanguage.length > 1
  ) {
    let computedCategory: string[] = [];

    for (const cate of filteredLanguage) {
      if (cate === "express") {
        computedCategory = computedCategory.concat([
          "express.js",
          "expressjs",
          "express js",
        ]);
      } else if (cate === "node") {
        computedCategory = computedCategory.concat([
          "node.js",
          "nodejs",
          "node js",
        ]);
      } else if (cate === "react") {
        computedCategory = computedCategory.concat([
          "react.js",
          "reactjs",
          "react js",
        ]);
      } else if (cate === "rails" || cate === "ruby") {
        computedCategory = computedCategory.concat(["ruby on rails"]);
      } else if (cate === "javascript") {
        computedCategory = computedCategory.concat(["js"]);
      } else if (cate === "java") {
        computedCategory = computedCategory.concat([
          "springboot",
          "spring boot",
          "spring",
        ]);
      } else if (cate === "C#") {
        computedCategory = computedCategory.concat([
          ".NET",
          ".NET Web APIs",
          "ASP.NET",
        ]);
      }
      computedCategory.push(cate);
    }

    filterByLanguages["job"] = {
      skills: {
        some: {
          name: {
            in: computedCategory,
            mode: "insensitive",
          },
        },
      },
    };
  }

  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      ...filterByLanguages,
      ...filterByCategory,
      isDeleted: false,
      ...statusObj,
    },
    select: {
      isActive: true,
      userId: true,
      updatedByUserAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      generalNote: true,
      note: true,
      position: true,
      isFavorite: true,
      interviewDate: true,
      createdAt: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
          description: true,
          avatarColor: true,
          link: true,
        },
      },
    },
    orderBy: orderParams,
  });
};

const updateAllRearrangedJobs = async (
  updateInformation: UpdateInformationType,
  userId: number
) => {
  try {
    for (let update of updateInformation) {
      const updatedData = {
        category: {
          connect: {
            id: update.isDeleted ? 1 : update.newCategoryId,
          },
        },
        position: update.position,
        isDeleted: update.isDeleted,
        isActive: update.isActive,
      };

      if (update.isChanged) {
        // updatedData.updatedByUserAt = new Date();
        Object.assign(updatedData, { updatedByUserAt: new Date() });
      }

      await prisma.usersOnJobs.update({
        where: {
          userId_jobId_categoryId: {
            userId: userId,
            jobId: update.jobId,
            categoryId: update.categoryId,
          },
        },
        data: updatedData,
      });
    }
  } catch (e) {
    console.log(e);
  }
};

const deleteUserJob = async (deleteItem: DeleteItemType, userId: number) => {
  try {
    // Save initial deleted position
    const deletedJobPosition = await prisma.usersOnJobs.findFirst({
      where: {
        userId: userId,
        jobId: deleteItem.jobId,
        categoryId: deleteItem.categoryId,
      },
      select: {
        position: true
      }
    });

    // update the record that is being deleted
    await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: userId,
          jobId: deleteItem.jobId,
          categoryId: deleteItem.categoryId,
        },
      },
      data: {
        isDeleted: true,
        position: -1,
        category: {
          connect: {
            id: 1,
          },
        },
      },
    });

    // Query the active records
    const jobsInTheCategory = await prisma.usersOnJobs.findMany({
      where: {
        userId,
        categoryId: deleteItem.categoryId,
        isDeleted: false,
        isActive: true,
        position: {
          gt: deletedJobPosition?.position as number
        }
      },
      orderBy: {
        position: "asc",
      },
    });

    // Update necessary records
    for (let i = 0; i < jobsInTheCategory.length; i++) {
      const userOnJob = jobsInTheCategory[i];
      const currentPosition = userOnJob.position as number;
      const newPosition = currentPosition - 1;

      await prisma.usersOnJobs.update({
        where: {
          userId_jobId_categoryId: {
            userId: userId,
            jobId: jobsInTheCategory[i].jobId,
            categoryId: deleteItem.categoryId,
          },
        },
        data: {
          position: newPosition,
        },
      });
    }
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

  if (updateItem.updatedByUserAt) {
    updateData["updatedByUserAt"] = updateItem.updatedByUserAt;
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
      data: { ...updateData, updatedByUserAt: new Date() },
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
    const updatedChecklist = await prisma.usersOnChecklists.update({
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

    await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId,
          jobId,
          categoryId: 4,
        },
      },
      data: {
        updatedByUserAt: new Date(),
      },
    });

    return updatedChecklist;
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
      checklistId: "asc",
    },
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
    type: string;
  },
  userId: number
) => {
  const { note, jobId, categoryId, type } = noteObj;

  const updateData: {
    note?: string;
    generalNote?: string;
    updatedByUserAt: Date;
  } = { updatedByUserAt: new Date() };

  if (type === "interview") {
    updateData.note = note;
  } else if (type === "general") {
    updateData.generalNote = note;
  }
  try {
    return await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId,
          jobId,
          categoryId,
        },
      },
      data: updateData,
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
      updatedByUserAt: new Date(),
    },
  });
};

const queryInterviewDate = (userId: number, jobId: number) => {
  return prisma.usersOnJobs.findFirst({
    where: {
      userId,
      jobId,
    },
    select: {
      interviewDate: true,
    },
  });
};

const queryInterviewDates = (userId: number) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      NOT: { interviewDate: null },
    },
    select: {
      interviewDate: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          link: true,
        },
      },
    },
  });
};

const processGetInterviews = (interviews: InterviewDatesType) => {
  const result = [];
  for (const interview of interviews) {
    const newFormatInterview = {
      interviewDate: interview.interviewDate,
      title: interview.job.title,
      company: interview.job.company,
    };
    result.push(newFormatInterview);
  }
  return result;
};

const queryAllNotes = (
  orderBy: { column: string; order: string; },
  userId: number
) => {
  const { column, order } = orderBy;
  const orderByObj: NoteOrderByObjType = {};

  if (column === "title" || column === "company") {
    Object.assign(orderByObj, { job: { [column]: order } });
  } else {
    Object.assign(orderByObj, { [column]: order });
  }

  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      isDeleted: false,
      OR: [
        { AND: [{ generalNote: { not: null } }, { generalNote: { not: "" } }] },
        {
          AND: [
            {
              note: {
                not: null,
              },
            },
            {
              note: {
                not: "",
              },
            },
          ],
        },
      ],
    },
    select: {
      userId: true,
      isFavorite: true,
      interviewDate: true,
      updatedByUserAt: true,
      createdAt: true,
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true,
          avatarColor: true,
          link: true,
        },
      },
      note: true,
      generalNote: true,
    },
    orderBy: orderByObj,
  });
};

const recoverJobById = async (userId: number, jobId: number) => {
  try {
    const cateId = await prisma.usersOnJobs.findFirst({
      where: {
        userId,
        jobId,
      },
      select: {
        categoryId: true,
      },
    });

    const jobCategory: number = cateId?.categoryId || 0;

    const numberInCategory = await prisma.usersOnJobs.count({
      where: {
        userId,
        categoryId: cateId?.categoryId,
      },
    });

    return prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId,
          jobId,
          categoryId: jobCategory,
        },
      },
      data: {
        isActive: true,
        position: numberInCategory,
      },
    });
  } catch (e) {
    console.log(e);
    return;
  }
};

const updateFavoriteOnly = async (updateItem: any, userId: number) => {
  try {
    return await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: userId,
          jobId: updateItem.jobId,
          categoryId: updateItem.categoryId,
        },
      },
      data: { isFavorite: updateItem?.favorite },
    });
  } catch (e) {
    return e;
  }
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
  processFilterJobs,
  queryInterviewDate,
  queryStaleJobs,
  queryInterviewDates,
  processGetInterviews,
  queryAllNotes,
  recoverJobById,
  updateFavoriteOnly,
};
