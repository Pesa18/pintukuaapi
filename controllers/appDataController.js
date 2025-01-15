const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const getArticles = async () => {
  const articles = await prisma.articles.findMany({
    take: 3,
    orderBy: {
      published_at: "desc",
    },
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
      message: "Berhasil",
      data: articles,
    });
  } catch (error) {
    res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// ...existing code...

exports.getAllArticles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const articles = await prisma.articles.findMany({
      skip: offset,
      take: limit,
      where: {
        status: "published",
      },
      orderBy: {
        published_at: "desc",
      },
      include: {
        categories: true,
        article_views: {
          select: {
            view_count: true,
          },
        },
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
    const articlesTrending = await prisma.articles.findMany({
      where: {
        status: "published",
      },
      orderBy: {
        published_at: "asc",
      },
      include: {
        categories: true,
        article_views: {
          select: {
            view_count: true,
          },
        },
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

    const getarticlesTrending = articlesTrending.map((article) => {
      const totalViews = article.article_views.reduce(
        (sum, view) => sum + view.view_count,
        0
      );

      return {
        ...article,
        total_views: totalViews, // Menambahkan total_views ke setiap artikel
      };
    });

    getarticlesTrending.sort((a, b) => b.total_views - a.total_views);
    const limitedTrendingArticles = getarticlesTrending.slice(0, 3);

    return res.status(200).json({
      message: "Berhasil",
      data: { articles, articlesTrending: limitedTrendingArticles },
    });
  } catch (error) {
    return res.status(500).json({ message: "Terjadi kesalahan" });
  }
};

// ...existing code...

exports.articleViews = async (req, res) => {
  const { slug } = req.params;
  const ipAddress = req.headers["x-forwarded-for"];
  const userAgent = req.headers["user-agent"];

  try {
    // Cari artikel berdasarkan UUID
    const article = await prisma.articles.findUnique({
      where: { slug },
      include: {
        categories: true,
        article_views: {
          select: {
            view_count: true,
          },
        },
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

    if (!article) {
      return res.status(404).json({ message: "Article not found." });
    }

    const existingView = await prisma.article_views.findFirst({
      where: {
        article_id: article.id,
        ip_address: ipAddress,
      },
    });

    if (existingView) {
      // Jika sudah ada, tidak menambahkan view baru
      const totalViews = await prisma.article_views.count({
        where: {
          article_id: article.id,
        },
      });
      return res
        .status(200)
        .json({ message: "success", article, total_views: totalViews });
    }

    // Jika belum ada, tambahkan tampilan baru
    const newView = await prisma.article_views.create({
      data: {
        article_id: article.id,
        ip_address: ipAddress,
        user_agent: userAgent,
        team_id: article.team_id || 1,
        view_count: 1,
      },
    });

    const totalViews = await prisma.article_views.count({
      where: {
        article_id: article.id,
      },
    });

    return res.status(201).json({
      message: "success",
      article,
      total_views: totalViews,
    });
  } catch (error) {
    console.log("error", error);

    return res.status(500).json({ message: "Internal server error." });
  }
};
