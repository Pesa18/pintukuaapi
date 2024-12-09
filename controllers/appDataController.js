const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getArticles = async () => {
  const articles = await prisma.articles.findMany({
    where: {
      status: "published",
    },
    include: {
      categories: true,
      users: {
        include: {
          kua_user: {
            include: {
              profile_companies: true,
              employees: true,
            },
          },
        },
      },
    },
  });
  const banner = await prisma.bannerApp.findMany();
  //   console.log(articles);

  return { articles, banner };
};

exports.mobileApp = async (req, res) => {
  try {
    const articles = await getArticles();

    return res.status(200).json({
      message: "ahsgdjkahgsdj",
      data: articles,
    });
  } catch (error) {
    throw error;
  }
};
