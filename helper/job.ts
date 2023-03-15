
import { prisma } from "../server";
import { CategoryType, DeleteItemType, updateDataType, UpdateInformationType, UpdateItemType, UserJobsType } from "../type/job";



const queryUserAndJobsEntities = async (userId: number) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      isDeleted: false
    },
    select: {
      userId: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      position: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true
        }
      }
    },
  });
};

const processUserJobs = (userJobs: UserJobsType) => {
  const result: CategoryType = {};
  for (const eachJob of userJobs) {
    const categoryName: string = eachJob.category.name;
    const categoryId: number = eachJob.category.id;

    if (eachJob.category.name in result) {
      result[categoryName].jobs.push({ ...eachJob.job, pos: eachJob.position });
    } else {
      result[categoryName] = {
        category: categoryName,
        id: categoryId,
        jobs: [{ ...eachJob.job, pos: eachJob.position }]
      };
    }
  }
  return result;
};


const queryJobById = (id: string) => {
  return prisma.job.findUnique({
    where: {
      id: parseInt(id),
    },
  });
};



const queryUserJobsWithFilter = async (userId: number, filteredCategory: string[], filteredLanguage: string[]) => {
  return prisma.usersOnJobs.findMany({
    where: {
      userId,
      job: {
        skills: {
          some: {
            name: {
              in: filteredLanguage
            }
          }
        },
      },
      category: {
        name: {
          in: filteredCategory
        }
      },
      isDeleted: false
    },
    select: {
      userId: true,
      category: {
        select: {
          id: true,
          name: true
        }
      },
      position: true,
      job: {
        select: {
          id: true,
          title: true,
          company: true,
          logo: true
        }
      }
    },
  });
};

const updateAllRearrangedJobs = async (updateInformation: UpdateInformationType) => {
  for (let update of updateInformation) {
    const job = await prisma.usersOnJobs.update({
      where: {
        userId_jobId_categoryId: {
          userId: update.userId,
          jobId: update.jobId,
          categoryId: update.categoryId
        }
      },
      data: {
        category: {
          connect: {
            id: update.newCategoryId
          }
        },
        position: update.pos
      }
    });
  }
};

const deleteUserJob = async (deleteItem: DeleteItemType) => {
  return prisma.usersOnJobs.update({
    where: {
      userId_jobId_categoryId: {
        userId: deleteItem.userId,
        jobId: deleteItem.jobId,
        categoryId: deleteItem.categoryId
      }
    },
    data: {
      isDeleted: true
    }
  });
};

const updateInterviewDateAndFavorite = async (updateItem: UpdateItemType) => {
  const updateData: updateDataType = {};
  if (updateItem.favorite) updateData["isFavorite"] = updateItem.favorite;
  if (updateItem.interviewDate) updateData["interviewDate"] = updateItem.interviewDate;

  return prisma.usersOnJobs.update({
    where: {
      userId_jobId_categoryId: {
        userId: updateItem.userId,
        jobId: updateItem.jobId,
        categoryId: updateItem.categoryId
      }
    },
    data: updateData
  });
};

module.exports = { queryUserAndJobsEntities, processUserJobs, queryJobById, queryUserJobsWithFilter, updateAllRearrangedJobs, deleteUserJob, updateInterviewDateAndFavorite };
